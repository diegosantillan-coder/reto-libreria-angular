import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subject, combineLatest, of, timer } from 'rxjs';
import { map, switchMap, takeUntil, tap, catchError, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { ValidationEngine } from '../core/validation-engine';
import { ThirdPartyAdapterService } from './third-party-adapter.service';
import { IdempotencyKeyGenerator } from '../utilities/idempotency-key-generator';
import { ValidationRequest } from '../models/validation-request.model';
import { ValidationResponse, ValidationStatus } from '../models/validation-response.model';

export interface ValidationMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  cacheHitRate: number;
  requestsPerSecond: number;
}

export interface ValidationOptions {
  useCache?: boolean;
  useIdempotency?: boolean;
  cacheTTL?: number;
  timeout?: number;
  skipValidation?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private metricsSubject = new BehaviorSubject<ValidationMetrics>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageLatency: 0,
    cacheHitRate: 0,
    requestsPerSecond: 0
  });
  
  private requestTimestamps: number[] = [];
  private readonly MAX_METRICS_HISTORY = 1000;
  private readonly DEFAULT_CACHE_TTL = 300000;
  private readonly DEFAULT_TIMEOUT = 5000;

  metrics$ = this.metricsSubject.asObservable();

  constructor(
    private validationEngine: ValidationEngine,
    private thirdPartyAdapter: ThirdPartyAdapterService,
    private idempotencyGenerator: IdempotencyKeyGenerator
  ) {
    this.startMetricsCleanup();
  }

  validate<T extends ValidationRequest>(request: T, options?: ValidationOptions): Observable<ValidationResponse> {
    const finalOptions = this.buildOptions(options);
    
    this.recordRequest();
    
    if (finalOptions.skipValidation) {
      return of(this.createSuccessResponse(request, { valid: true }));
    }
    
    if (finalOptions.useCache) {
      const cachedResponse = this.validationEngine.getCachedResponse(
        this.idempotencyGenerator.generateKey(request)
      );
      
      if (cachedResponse) {
        this.updateMetrics(true);
        return of(cachedResponse);
      }
    }
    
    const validation$ = finalOptions.useIdempotency
      ? this.validateWithIdempotency<T>(request, finalOptions)
      : this.validateWithoutIdempotency<T>(request, finalOptions);
    
    return validation$.pipe(
      tap(response => {
        if (response.status === 'success') {
          const latency = typeof response.metadata?.['latency'] === 'number'
            ? response.metadata['latency'] as number
            : undefined;
          this.updateMetrics(false, latency);

          if (finalOptions.useCache) {
            const idempotencyKey = this.idempotencyGenerator.generateKey(request);
            this.validationEngine.cacheResponse(
              idempotencyKey,
              response,
              finalOptions.cacheTTL || this.DEFAULT_CACHE_TTL
            );
          }
        } else {
          this.updateMetrics(false);
        }
      }),
      catchError(error => {
        this.updateMetrics(false);
        return of(this.createErrorResponse(error));
      }),
      takeUntil(this.destroy$)
    );
  }

  validateBatch<T extends ValidationRequest>(
    requests: T[],
    options?: ValidationOptions
  ): Observable<ValidationResponse[]> {
    if (!requests || requests.length === 0) {
      return of([]);
    }
    
    const batchId = this.idempotencyGenerator.generateKeyFromMultipleRequests(
      requests.map((r, i) => ({ data: r, action: `batch_${i}` }))
    );
    
    const cachedBatch = this.validationEngine.getCachedResponse(batchId);
    
    if (cachedBatch && options?.useCache) {
      return of(requests.map(() => cachedBatch));
    }
    
    const validationResults = requests.map(request => 
      this.validate(request, { ...options, useCache: false }).pipe(
        catchError(error => of(this.createErrorResponse(error)))
      )
    );
    
    return combineLatest(validationResults).pipe(
      map(responses => {
        if (options?.useCache) {
          const firstResponse = responses[0];
          if (firstResponse) {
            this.validationEngine.cacheResponse(
              batchId,
              firstResponse,
              options.cacheTTL || this.DEFAULT_CACHE_TTL
            );
          }
        }
        return responses;
      }),
      takeUntil(this.destroy$)
    );
  }

  getMetrics(): ValidationMetrics {
    return this.metricsSubject.getValue();
  }

  clearCache(): void {
    this.validationEngine.clearCache();
  }

  getCacheStats(): { size: number; hitRate: number } {
    const stats = this.validationEngine.getCacheStats();
    return {
      size: stats.size,
      hitRate: this.metricsSubject.getValue().cacheHitRate
    };
  }

  checkServiceHealth(): Observable<{ status: string; latency: number }> {
    return this.thirdPartyAdapter.checkHealth();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private validateWithIdempotency<T extends ValidationRequest>(
    request: T,
    options: ValidationOptions
  ): Observable<ValidationResponse> {
    const idempotencyKey = this.idempotencyGenerator.generateKey(request, {
      includeTimestamp: true,
      includeRandomSuffix: true
    });
    
    return this.thirdPartyAdapter.validateWithIdempotency(request, idempotencyKey).pipe(
      map(response => this.enrichResponse(response, idempotencyKey)),
      catchError(error => {
        if (error.code === '409') {
          const cachedResponse = this.validationEngine.getCachedResponse(idempotencyKey);
          if (cachedResponse) {
            return of(cachedResponse);
          }
        }
        throw error;
      })
    );
  }

  private validateWithoutIdempotency<T extends ValidationRequest>(
    request: T,
    options: ValidationOptions
  ): Observable<ValidationResponse> {
    return this.thirdPartyAdapter.validate(request).pipe(
      map(response => this.enrichResponse(response))
    );
  }

  private buildOptions(options?: ValidationOptions): Required<ValidationOptions> {
    return {
      useCache: options?.useCache ?? true,
      useIdempotency: options?.useIdempotency ?? true,
      cacheTTL: options?.cacheTTL ?? this.DEFAULT_CACHE_TTL,
      timeout: options?.timeout ?? this.DEFAULT_TIMEOUT,
      skipValidation: options?.skipValidation ?? false
    };
  }

  private createSuccessResponse<T extends ValidationRequest>(
    request: T,
    data: Record<string, unknown>
  ): ValidationResponse {
    return {
      requestId: request.requestId || this.generateRequestId(),
      idempotencyKey: request.idempotencyKey || this.idempotencyGenerator.generateKey(request),
      status: 'success',
      data: data as unknown,
      timestamp: Date.now(),
      durationMs: 0,
      metadata: {
        processingTime: 0,
        cached: false
      }
    };
  }

  private createErrorResponse(error: unknown): ValidationResponse {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorCode = error && typeof error === 'object' && 'code' in error 
      ? String((error as Record<string, unknown>)['code']) 
      : 'VALIDATION_ERROR';
    
    return {
      requestId: this.generateRequestId(),
      idempotencyKey: `error-${Date.now()}`,
      status: 'error',
      error: {
        code: errorCode,
        message: errorMessage,
        details: { timestamp: new Date().toISOString() },
        recoverable: false
      },
      timestamp: Date.now(),
      durationMs: 0
    };
  }

  private enrichResponse(response: ValidationResponse, idempotencyKey?: string): ValidationResponse {
    return {
      ...response,
      metadata: {
        ...response.metadata,
        idempotencyKey,
        processedAt: new Date().toISOString()
      }
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private recordRequest(): void {
    const now = Date.now();
    this.requestTimestamps.push(now);
    
    if (this.requestTimestamps.length > this.MAX_METRICS_HISTORY) {
      this.requestTimestamps = this.requestTimestamps.slice(-this.MAX_METRICS_HISTORY);
    }
  }

  private updateMetrics(fromCache: boolean, latency?: number): void {
    const current = this.metricsSubject.getValue();
    const newTotal = current.totalRequests + 1;
    const newSuccessful = fromCache ? current.successfulRequests : current.successfulRequests + 1;
    const isCacheHit = fromCache;
    
    const recentTimestamps = this.requestTimestamps.filter(
      ts => Date.now() - ts < 60000
    );
    const rps = recentTimestamps.length / 60;
    
    const newAverageLatency = latency 
      ? (current.averageLatency * (newTotal - 1) + latency) / newTotal
      : current.averageLatency;
    
    const newCacheHitRate = ((current.cacheHitRate * (newTotal - 1)) + (isCacheHit ? 1 : 0)) / newTotal;
    
    this.metricsSubject.next({
      totalRequests: newTotal,
      successfulRequests: newSuccessful,
      failedRequests: current.failedRequests,
      averageLatency: newAverageLatency,
      cacheHitRate: newCacheHitRate,
      requestsPerSecond: rps
    });
  }

  private startMetricsCleanup(): void {
    timer(0, 60000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const cutoff = Date.now() - 60000;
      this.requestTimestamps = this.requestTimestamps.filter(ts => ts > cutoff);
      
      this.metricsSubject.next({
        ...this.metricsSubject.getValue(),
        requestsPerSecond: this.requestTimestamps.length / 60
      });
    });
  }
}