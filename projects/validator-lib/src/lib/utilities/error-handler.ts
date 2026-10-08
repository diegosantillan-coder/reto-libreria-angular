import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';
import { Observable, throwError, timer, BehaviorSubject, Subject } from 'rxjs';
import { catchError, retry, retryWhen, delayWhen, take, tap, switchMap } from 'rxjs/operators';
import { ValidationResponse } from '../models/validation-response.model';

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableStatuses?: number[];
}

export interface FallbackStrategy<T> {
  name: string;
  execute: (error: Error, originalRequest: unknown) => Observable<T>;
}

export interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number | null;
  state: 'closed' | 'open' | 'half-open';
}

export interface ErrorHandlerConfig {
  retry?: RetryConfig;
  circuitBreaker?: {
    failureThreshold: number;
    resetTimeout: number;
  };
  fallbackStrategies?: FallbackStrategy<unknown>[];
  enableLogging?: boolean;
}

export interface ErrorEvent {
  timestamp: Date;
  error: Error;
  attemptNumber: number;
  strategy: string;
}

export const ERROR_HANDLER_CONFIG = new InjectionToken<ErrorHandlerConfig>('ERROR_HANDLER_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryableStatuses: [408, 429, 500, 502, 503, 504]
  };

  private defaultCircuitBreakerConfig = {
    failureThreshold: 5,
    resetTimeout: 30000
  };

  private circuitBreakerState = new BehaviorSubject<CircuitBreakerState>({
    failures: 0,
    lastFailureTime: null,
    state: 'closed'
  });

  private errorEvents = new Subject<ErrorEvent>();
  private config: ErrorHandlerConfig;

  constructor(@Optional() @Inject(ERROR_HANDLER_CONFIG) config?: ErrorHandlerConfig) {
    this.config = config || {};
  }

  getCircuitBreakerState(): Observable<CircuitBreakerState> {
    return this.circuitBreakerState.asObservable();
  }

  getErrorEvents(): Observable<ErrorEvent> {
    return this.errorEvents.asObservable();
  }

  handleError<T>(
    error: Error,
    originalRequest: unknown,
    fallbackStrategies?: FallbackStrategy<T>[]
  ): Observable<T> {
    const currentState = this.circuitBreakerState.getValue();
    
    if (currentState.state === 'open') {
      const timeSinceLastFailure = currentState.lastFailureTime
        ? Date.now() - currentState.lastFailureTime
        : Infinity;
      
      if (timeSinceLastFailure < (this.config.circuitBreaker?.resetTimeout || this.defaultCircuitBreakerConfig.resetTimeout)) {
        this.log('Circuit breaker OPEN - rejecting request');
        return this.executeFallbackStrategies(error, originalRequest, fallbackStrategies as FallbackStrategy<unknown>[]);
      } else {
        this.circuitBreakerState.next({
          ...currentState,
          state: 'half-open'
        });
        this.log('Circuit breaker transitioning to HALF-OPEN');
      }
    }

    this.recordFailure();
    
    const errorEvent: ErrorEvent = {
      timestamp: new Date(),
      error,
      attemptNumber: 1,
      strategy: 'initial'
    };
    this.errorEvents.next(errorEvent);

    if (this.config.retry?.maxAttempts && this.config.retry.maxAttempts > 0) {
      return this.createRetryableObservable(error, originalRequest, fallbackStrategies);
    }

    return this.executeFallbackStrategies(error, originalRequest, fallbackStrategies as FallbackStrategy<unknown>[]);
  }

  private createRetryableObservable<T>(
    error: Error,
    originalRequest: unknown,
    fallbackStrategies?: FallbackStrategy<T>[]
  ): Observable<T> {
    const retryConfig = { ...this.defaultRetryConfig, ...this.config.retry };
    let attemptCount = 0;

    return throwError(() => error).pipe(
      retryWhen(errors =>
        errors.pipe(
          delayWhen(() => {
            attemptCount++;
            const delay = Math.min(
              retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attemptCount - 1),
              retryConfig.maxDelay
            );
            
            const errorEvent: ErrorEvent = {
              timestamp: new Date(),
              error,
              attemptNumber: attemptCount,
              strategy: `retry (delay: ${delay}ms)`
            };
            this.errorEvents.next(errorEvent);
            this.log(`Retry attempt ${attemptCount}/${retryConfig.maxAttempts} after ${delay}ms delay`);
            
            if (attemptCount >= retryConfig.maxAttempts) {
              this.log('Max retry attempts reached');
            }
            
            return timer(delay);
          }),
          take(retryConfig.maxAttempts)
        )
      ),
      catchError(err => {
        this.log('All retry attempts exhausted');
        return this.executeFallbackStrategies(err, originalRequest, fallbackStrategies as FallbackStrategy<unknown>[]);
      })
    ) as Observable<T>;
  }

  private executeFallbackStrategies<T>(
    error: Error,
    originalRequest: unknown,
    strategies?: FallbackStrategy<unknown>[]
  ): Observable<T> {
    const availableStrategies = strategies || this.config.fallbackStrategies;
    
    if (!availableStrategies || availableStrategies.length === 0) {
      this.log('No fallback strategies available, throwing original error');
      return throwError(() => error);
    }

    for (const strategy of availableStrategies) {
      try {
        this.log(`Executing fallback strategy: ${strategy.name}`);
        return strategy.execute(error, originalRequest) as Observable<T>;
      } catch (fallbackError) {
        this.log(`Fallback strategy ${strategy.name} failed: ${fallbackError}`);
        continue;
      }
    }

    return throwError(() => error);
  }

  private recordFailure(): void {
    const currentState = this.circuitBreakerState.getValue();
    const newFailureCount = currentState.failures + 1;
    const threshold = this.config.circuitBreaker?.failureThreshold || this.defaultCircuitBreakerConfig.failureThreshold;
    
    let newState: CircuitBreakerState;
    
    if (newFailureCount >= threshold) {
      newState = {
        failures: newFailureCount,
        lastFailureTime: Date.now(),
        state: 'open'
      };
      this.log(`Circuit breaker OPENED after ${newFailureCount} failures`);
    } else {
      newState = {
        failures: newFailureCount,
        lastFailureTime: Date.now(),
        state: currentState.state
      };
    }
    
    this.circuitBreakerState.next(newState);
  }

  resetCircuitBreaker(): void {
    this.circuitBreakerState.next({
      failures: 0,
      lastFailureTime: null,
      state: 'closed'
    });
    this.log('Circuit breaker reset to CLOSED');
  }

  updateConfig(newConfig: ErrorHandlerConfig): void {
    this.config = { ...this.config, ...newConfig };
    this.log('Error handler configuration updated');
  }

  private log(message: string): void {
    if (this.config.enableLogging) {
      console.error(`[ErrorHandler] ${new Date().toISOString()} - ${message}`);
    }
  }
}