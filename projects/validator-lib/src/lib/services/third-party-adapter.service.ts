import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer, Subject, of } from 'rxjs';
import { catchError, retry, map, switchMap, takeUntil, finalize, share, timeout } from 'rxjs/operators';
import { ValidationRequest } from '../models/validation-request.model';
import { ValidationResponse, ValidationError } from '../models/validation-response.model';

export interface ThirdPartyConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  enableCircuitBreaker?: boolean;
  circuitBreakerThreshold?: number;
  circuitBreakerTimeout?: number;
}

export const THIRD_PARTY_CONFIG = 'THIRD_PARTY_CONFIG';

interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  isOpen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThirdPartyAdapterService {
  private config: ThirdPartyConfig;
  private circuitBreakerState: CircuitBreakerState = {
    failures: 0,
    lastFailureTime: 0,
    isOpen: false
  };
  private destroy$ = new Subject<void>();
  private pendingRequests = new Map<string, Observable<ValidationResponse>>();
  
  private readonly DEFAULT_TIMEOUT = 5000;
  private readonly DEFAULT_MAX_RETRIES = 3;
  private readonly DEFAULT_RETRY_DELAY = 1000;
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 30000;

  constructor(
    private http: HttpClient,
    @Optional() @Inject(THIRD_PARTY_CONFIG) config?: ThirdPartyConfig
  ) {
    this.config = this.buildConfig(config);
    this.initializeCircuitBreaker();
  }

  validate<T extends ValidationRequest>(request: ValidationRequest): Observable<ValidationResponse<T>> {
    const requestKey = this.generateRequestKey(request);
    
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey) as Observable<ValidationResponse<T>>;
    }
    
    if (this.isCircuitBreakerOpen()) {
      return throwError(() => new Error('Circuit breaker is open - service temporarily unavailable'));
    }
    
    const request$ = this.executeValidation<T>(request).pipe(
      share()
    );
    
    this.pendingRequests.set(requestKey, request$);
    
    return request$.pipe(
      finalize(() => {
        this.pendingRequests.delete(requestKey);
      })
    );
  }

  validateWithIdempotency<T extends ValidationRequest>(
    request: ValidationRequest,
    idempotencyKey: string
  ): Observable<ValidationResponse<T>> {
    const headers = new HttpHeaders({
      'Idempotency-Key': idempotencyKey,
      'Content-Type': 'application/json'
    });
    
    if (this.config.apiKey) {
      headers.set('X-API-Key', this.config.apiKey);
    }
    
    return this.executeWithRetry<T>(request, headers);
  }

  checkHealth(): Observable<{ status: string; latency: number }> {
    const startTime = performance.now();
    
    return this.http.get<{ status: string }>(`${this.config.baseUrl}/health`).pipe(
      map(response => ({
        status: response.status,
        latency: performance.now() - startTime
      })),
      catchError(error => of({
        status: 'unhealthy',
        latency: performance.now() - startTime
      }))
    );
  }

  getStats(): { pendingRequests: number; circuitBreakerOpen: boolean; failures: number } {
    return {
      pendingRequests: this.pendingRequests.size,
      circuitBreakerOpen: this.circuitBreakerState.isOpen,
      failures: this.circuitBreakerState.failures
    };
  }

  resetCircuitBreaker(): void {
    this.circuitBreakerState = {
      failures: 0,
      lastFailureTime: 0,
      isOpen: false
    };
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.pendingRequests.clear();
  }

  private buildConfig(config?: ThirdPartyConfig): ThirdPartyConfig {
    const defaultConfig: ThirdPartyConfig = {
      baseUrl: 'https://api.validation-service.example.com/v1',
      timeout: this.DEFAULT_TIMEOUT,
      maxRetries: this.DEFAULT_MAX_RETRIES,
      retryDelay: this.DEFAULT_RETRY_DELAY,
      enableCircuitBreaker: true,
      circuitBreakerThreshold: this.CIRCUIT_BREAKER_THRESHOLD,
      circuitBreakerTimeout: this.CIRCUIT_BREAKER_TIMEOUT
    };
    
    return { ...defaultConfig, ...config };
  }

  private initializeCircuitBreaker(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => this.checkCircuitBreakerTimeout(), 5000);
    }
  }

  private executeValidation<T extends ValidationRequest>(request: ValidationRequest): Observable<ValidationResponse<T>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (this.config.apiKey) {
      headers.set('X-API-Key', this.config.apiKey);
    }
    
    return this.executeWithRetry<T>(request, headers);
  }

  private executeWithRetry<T>(
    request: ValidationRequest,
    headers: HttpHeaders
  ): Observable<ValidationResponse<T>> {
    const timeoutMs = this.config.timeout || this.DEFAULT_TIMEOUT;
    const maxRetries = this.config.maxRetries || this.DEFAULT_MAX_RETRIES;
    const retryDelay = this.config.retryDelay || this.DEFAULT_RETRY_DELAY;
    
    return timer(0).pipe(
      switchMap(() =>
        this.http.post<ValidationResponse<T>>(
          `${this.config.baseUrl}/validate`,
          request,
          { headers }
        ).pipe(
          timeout(timeoutMs),
          catchError(error => this.handleError<T>(error, maxRetries, retryDelay, request, headers))
        )
      ),
      takeUntil(this.destroy$)
    ) as Observable<ValidationResponse<T>>;
  }

  private handleError<T>(
    error: HttpErrorResponse,
    remainingRetries: number,
    retryDelay: number,
    request: ValidationRequest,
    headers: HttpHeaders
  ): Observable<ValidationResponse<T>> {
    this.recordFailure();
    
    if (remainingRetries > 0 && this.isRetryableError(error)) {
      const delay = retryDelay * (this.DEFAULT_MAX_RETRIES - remainingRetries + 1);
      
      return timer(delay).pipe(
        switchMap(() => this.executeWithRetry<T>(request, headers))
      );
    }
    
    const validationError: ValidationError = {
      code: error.status?.toString() || 'UNKNOWN',
      message: error.message || 'An error occurred during validation',
      details: {
        status: error.status,
        url: error.url,
        timestamp: new Date().toISOString()
      },
      recoverable: this.isRetryableError(error)
    };
    
    return throwError(() => validationError);
  }

  private isRetryableError(error: HttpErrorResponse): boolean {
    const status = error.status;
    return status === 0 || status === 408 || status === 429 || status >= 500;
  }

  private generateRequestKey(request: ValidationRequest): string {
    return JSON.stringify({
      action: 'validate',
      data: request.data,
      type: request.type
    });
  }

  private recordFailure(): void {
    this.circuitBreakerState.failures++;
    this.circuitBreakerState.lastFailureTime = Date.now();
    
    if (this.config.enableCircuitBreaker && 
        this.circuitBreakerState.failures >= (this.config.circuitBreakerThreshold || this.CIRCUIT_BREAKER_THRESHOLD)) {
      this.circuitBreakerState.isOpen = true;
    }
  }

  private isCircuitBreakerOpen(): boolean {
    if (!this.config.enableCircuitBreaker) {
      return false;
    }
    
    if (this.circuitBreakerState.isOpen) {
      const timeSinceLastFailure = Date.now() - this.circuitBreakerState.lastFailureTime;
      
      if (timeSinceLastFailure > (this.config.circuitBreakerTimeout || this.CIRCUIT_BREAKER_TIMEOUT)) {
        this.resetCircuitBreaker();
        return false;
      }
      
      return true;
    }
    
    return false;
  }

  private checkCircuitBreakerTimeout(): void {
    if (this.circuitBreakerState.isOpen) {
      this.isCircuitBreakerOpen();
    }
  }
}