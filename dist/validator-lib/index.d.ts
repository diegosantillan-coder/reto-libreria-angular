import * as i0 from '@angular/core';
import { InjectionToken, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Modelo que representa una solicitud de validación.
 * Incluye los datos necesarios para realizar la validación y metadatos para idempotencia.
 */
interface ValidationRequest {
    /**
     * Identificador único de la solicitud generado por el cliente.
     */
    requestId: string;
    /**
     * Datos a validar. Puede ser cualquier estructura serializable.
     */
    data: unknown;
    /**
     * Tipo de validación a realizar. Usado para routing interno.
     */
    validationType: string;
    /**
     * Compatibilidad con código legado que usa un campo `type`.
     */
    type?: string;
    /**
     * Compatibilidad con código legado que usa `context`.
     */
    context?: Record<string, unknown>;
    /**
     * Clave de idempotencia generada a partir de los parámetros de entrada.
     * Garantiza que solicitudes idénticas produzcan el mismo resultado.
     */
    idempotencyKey: string;
    /**
     * Tiempo de vida máximo de la solicitud en caché (en milisegundos).
     * Valor por defecto definido en ValidationEngine.
     */
    ttl?: number;
    /**
     * Metadatos adicionales para la validación.
     */
    metadata?: Record<string, unknown>;
}
/**
 * Token de inyección para configurar el tiempo de vida por defecto de las solicitudes.
 */
declare const DEFAULT_TTL_TOKEN: InjectionToken<number>;
/**
 * Token de inyección para configurar el tamaño máximo de la caché de idempotencia.
 */
declare const MAX_CACHE_SIZE_TOKEN: InjectionToken<number>;
/**
 * Tipo utilitario para extraer el tipo de datos de una solicitud específica.
 */
type ExtractDataType<T extends ValidationRequest> = T['data'];

/**
 * Estado posible de una respuesta de validación.
 */
type ValidationStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'INVALID' | 'TIMEOUT' | 'pending' | 'success' | 'failed' | 'invalid' | 'timeout' | 'error';
/**
 * Modelo que representa una respuesta de validación.
 */
interface ValidationResponse<T = unknown> {
    /**
     * Identificador único de la solicitud original.
     */
    requestId: string;
    /**
     * Clave de idempotencia de la solicitud.
     */
    idempotencyKey: string;
    /**
     * Estado de la validación.
     */
    status: ValidationStatus;
    /**
     * Datos devueltos por la validación, si aplica.
     */
    data?: T;
    /**
     * Detalles del error, si la validación falló.
     */
    error?: ValidationError;
    /**
     * Marca de tiempo de cuando se generó la respuesta (en milisegundos desde epoch).
     */
    timestamp: number;
    /**
     * Duración de la validación en milisegundos.
     */
    durationMs: number;
    /**
     * Metadatos adicionales generados por las capas de servicio o engine.
     */
    metadata?: Record<string, unknown>;
}
/**
 * Detalles de un error de validación.
 */
interface ValidationError {
    /**
     * Código de error específico.
     */
    code: string;
    /**
     * Mensaje descriptivo del error.
     */
    message: string;
    /**
     * Detalles técnicos del error, si están disponibles.
     */
    details?: unknown;
    /**
     * Indica si el error es recuperable (puede reintentarse).
     */
    recoverable: boolean;
    /**
     * HTTP status code si el error proviene de una llamada HTTP.
     */
    httpStatus?: number;
}
/**
 * Convierte un error HTTP en un ValidationError.
 * @param error Error HTTP recibido.
 * @returns ValidationError correspondiente.
 */
declare function toValidationError(error: HttpErrorResponse): ValidationError;
/**
 * Crea una respuesta de validación exitosa.
 * @param request Solicitud original.
 * @param data Datos de la respuesta.
 * @param durationMs Duración de la validación.
 * @returns ValidationResponse con estado SUCCESS.
 */
declare function createSuccessResponse<T>(request: {
    requestId: string;
    idempotencyKey: string;
}, data: T, durationMs: number): ValidationResponse<T>;
/**
 * Crea una respuesta de validación fallida.
 * @param request Solicitud original.
 * @param error Detalles del error.
 * @param durationMs Duración de la validación.
 * @returns ValidationResponse con estado FAILED.
 */
declare function createFailedResponse(request: {
    requestId: string;
    idempotencyKey: string;
}, error: ValidationError, durationMs: number): ValidationResponse;

/**
 * Motor central de validación con soporte para idempotencia y caché.
 * Procesa solicitudes de validación, maneja errores y optimiza recursos.
 */
declare class ValidationEngine {
    private http;
    private defaultTtl;
    private maxCacheSize;
    private serviceUrl?;
    private cache;
    private inFlightRequests;
    constructor(http: HttpClient, defaultTtl: number, maxCacheSize: number, serviceUrl?: string | undefined);
    /**
     * Procesa una solicitud de validación con manejo de idempotencia y caché.
     * @param request Solicitud de validación.
     * @returns Observable con la respuesta de validación.
     */
    validate<T = unknown>(request: ValidationRequest): Observable<ValidationResponse<T>>;
    /**
     * Procesa la solicitud llamando al servicio de terceros o lógica interna.
     * @param request Solicitud de validación.
     * @returns Observable con la respuesta.
     */
    private processRequest;
    /**
     * Realiza validación local cuando no hay servicio de terceros configurado.
     * @param request Solicitud de validación.
     * @returns Observable con la respuesta.
     */
    private validateLocally;
    /**
     * Obtiene una respuesta de la caché si está disponible y no ha expirado.
     * @param idempotencyKey Clave de idempotencia.
     * @returns Respuesta en caché o undefined.
     */
    getCachedResponse(idempotencyKey: string): ValidationResponse | undefined;
    /**
     * Almacena una respuesta en caché.
     * @param idempotencyKey Clave de idempotencia.
     * @param response Respuesta a cachear.
     * @param ttl Tiempo de vida en milisegundos.
     */
    cacheResponse(idempotencyKey: string, response: ValidationResponse, ttl: number): void;
    /**
     * Limpia la caché de respuestas.
     */
    clearCache(): void;
    /**
     * Obtiene estadísticas de la caché.
     * @returns Objeto con estadísticas de la caché.
     */
    getCacheStats(): {
        size: number;
        hits: number;
        misses: number;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<ValidationEngine, [null, null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ValidationEngine>;
}

interface ThirdPartyConfig {
    baseUrl: string;
    apiKey?: string;
    timeout?: number;
    maxRetries?: number;
    retryDelay?: number;
    enableCircuitBreaker?: boolean;
    circuitBreakerThreshold?: number;
    circuitBreakerTimeout?: number;
}
declare const THIRD_PARTY_CONFIG = "THIRD_PARTY_CONFIG";
declare class ThirdPartyAdapterService {
    private http;
    private config;
    private circuitBreakerState;
    private destroy$;
    private pendingRequests;
    private readonly DEFAULT_TIMEOUT;
    private readonly DEFAULT_MAX_RETRIES;
    private readonly DEFAULT_RETRY_DELAY;
    private readonly CIRCUIT_BREAKER_THRESHOLD;
    private readonly CIRCUIT_BREAKER_TIMEOUT;
    constructor(http: HttpClient, config?: ThirdPartyConfig);
    validate<T extends ValidationRequest>(request: ValidationRequest): Observable<ValidationResponse<T>>;
    validateWithIdempotency<T extends ValidationRequest>(request: ValidationRequest, idempotencyKey: string): Observable<ValidationResponse<T>>;
    checkHealth(): Observable<{
        status: string;
        latency: number;
    }>;
    getStats(): {
        pendingRequests: number;
        circuitBreakerOpen: boolean;
        failures: number;
    };
    resetCircuitBreaker(): void;
    destroy(): void;
    private buildConfig;
    private initializeCircuitBreaker;
    private executeValidation;
    private executeWithRetry;
    private handleError;
    private isRetryableError;
    private generateRequestKey;
    private recordFailure;
    private isCircuitBreakerOpen;
    private checkCircuitBreakerTimeout;
    static ɵfac: i0.ɵɵFactoryDeclaration<ThirdPartyAdapterService, [null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ThirdPartyAdapterService>;
}

interface IdempotencyKeyOptions {
    includeTimestamp?: boolean;
    includeRandomSuffix?: boolean;
    algorithm?: 'sha256' | 'sha384' | 'sha512';
    maxKeyLength?: number;
}
declare class IdempotencyKeyGenerator {
    private defaultOptions;
    generateKey(requestData: unknown, customOptions?: IdempotencyKeyOptions): string;
    generateKeyFromMultipleRequests(requests: Array<{
        data: unknown;
        action: string;
    }>): string;
    validateKeyFormat(key: string): boolean;
    private serializeRequest;
    private computeHash;
    private sha256;
    private sha384;
    private sha512;
    private simpleHash;
    private pseudoRandom;
    private bufferToHex;
    private generateRandomSuffix;
    static ɵfac: i0.ɵɵFactoryDeclaration<IdempotencyKeyGenerator, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IdempotencyKeyGenerator>;
}

interface ValidationMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageLatency: number;
    cacheHitRate: number;
    requestsPerSecond: number;
}
interface ValidationOptions {
    useCache?: boolean;
    useIdempotency?: boolean;
    cacheTTL?: number;
    timeout?: number;
    skipValidation?: boolean;
}
declare class ValidationService implements OnDestroy {
    private validationEngine;
    private thirdPartyAdapter;
    private idempotencyGenerator;
    private destroy$;
    private metricsSubject;
    private requestTimestamps;
    private readonly MAX_METRICS_HISTORY;
    private readonly DEFAULT_CACHE_TTL;
    private readonly DEFAULT_TIMEOUT;
    metrics$: Observable<ValidationMetrics>;
    constructor(validationEngine: ValidationEngine, thirdPartyAdapter: ThirdPartyAdapterService, idempotencyGenerator: IdempotencyKeyGenerator);
    validate<T extends ValidationRequest>(request: T, options?: ValidationOptions): Observable<ValidationResponse>;
    validateBatch<T extends ValidationRequest>(requests: T[], options?: ValidationOptions): Observable<ValidationResponse[]>;
    getMetrics(): ValidationMetrics;
    clearCache(): void;
    getCacheStats(): {
        size: number;
        hitRate: number;
    };
    checkServiceHealth(): Observable<{
        status: string;
        latency: number;
    }>;
    ngOnDestroy(): void;
    private validateWithIdempotency;
    private validateWithoutIdempotency;
    private buildOptions;
    private createSuccessResponse;
    private createErrorResponse;
    private enrichResponse;
    private generateRequestId;
    private recordRequest;
    private updateMetrics;
    private startMetricsCleanup;
    static ɵfac: i0.ɵɵFactoryDeclaration<ValidationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ValidationService>;
}

interface RetryConfig {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    retryableStatuses?: number[];
}
interface FallbackStrategy<T> {
    name: string;
    execute: (error: Error, originalRequest: unknown) => Observable<T>;
}
interface CircuitBreakerState {
    failures: number;
    lastFailureTime: number | null;
    state: 'closed' | 'open' | 'half-open';
}
interface ErrorHandlerConfig {
    retry?: RetryConfig;
    circuitBreaker?: {
        failureThreshold: number;
        resetTimeout: number;
    };
    fallbackStrategies?: FallbackStrategy<unknown>[];
    enableLogging?: boolean;
}
interface ErrorEvent {
    timestamp: Date;
    error: Error;
    attemptNumber: number;
    strategy: string;
}
declare const ERROR_HANDLER_CONFIG: InjectionToken<ErrorHandlerConfig>;
declare class ErrorHandlerService {
    private defaultRetryConfig;
    private defaultCircuitBreakerConfig;
    private circuitBreakerState;
    private errorEvents;
    private config;
    constructor(config?: ErrorHandlerConfig);
    getCircuitBreakerState(): Observable<CircuitBreakerState>;
    getErrorEvents(): Observable<ErrorEvent>;
    handleError<T>(error: Error, originalRequest: unknown, fallbackStrategies?: FallbackStrategy<T>[]): Observable<T>;
    private createRetryableObservable;
    private executeFallbackStrategies;
    private recordFailure;
    resetCircuitBreaker(): void;
    updateConfig(newConfig: ErrorHandlerConfig): void;
    private log;
    static ɵfac: i0.ɵɵFactoryDeclaration<ErrorHandlerService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ErrorHandlerService>;
}

interface PerformanceMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageLatencyMs: number;
    minLatencyMs: number;
    maxLatencyMs: number;
    throughput: number;
    timestamp: Date;
}
interface LatencyDistribution {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
}
interface PerformanceThresholds {
    maxLatencyMs: number;
    minThroughput: number;
    maxErrorRate: number;
}
interface PerformanceAlert {
    type: 'latency' | 'throughput' | 'error-rate' | 'circuit-breaker';
    message: string;
    value: number;
    threshold: number;
    timestamp: Date;
}
declare const PERFORMANCE_THRESHOLDS: InjectionToken<PerformanceThresholds>;
declare const PERFORMANCE_WINDOW_SIZE: InjectionToken<number>;
declare const PERFORMANCE_MAX_LATENCY_RECORDS: InjectionToken<number>;
declare class PerformanceMonitorService implements OnDestroy {
    private windowSizeMsConfig;
    private maxLatencyRecordsConfig;
    private requestLatencies;
    private requestTimestamps;
    private successfulRequests;
    private failedRequests;
    private totalRequests;
    private metricsSubject;
    private alertsSubject;
    private monitoringSubscription;
    private defaultThresholds;
    private thresholds;
    private windowSizeMs;
    private maxLatencyRecords;
    constructor(thresholds?: PerformanceThresholds, windowSizeMsConfig?: number | null, maxLatencyRecordsConfig?: number | null);
    startMonitoring(intervalMs?: number): void;
    stopMonitoring(): void;
    recordRequest(latencyMs: number, success: boolean): void;
    getMetrics(): Observable<PerformanceMetrics>;
    getAlerts(): Observable<PerformanceAlert[]>;
    getLatencyDistribution(): LatencyDistribution;
    reset(): void;
    updateThresholds(newThresholds: Partial<PerformanceThresholds>): void;
    private calculateMetrics;
    private checkThresholds;
    private cleanupOldData;
    private percentile;
    private getInitialMetrics;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PerformanceMonitorService, [{ optional: true; }, { optional: true; }, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PerformanceMonitorService>;
}

/**
 * Validator Library - Public API
 *
 * This is the public entry point for the validator-lib library.
 * All public APIs must be exported from this file.
 *
 * @module validator-lib
 * @version 1.0.0
 */

declare const LIBRARY_VERSION = "1.0.0";
declare const LIBRARY_NAME = "@validator-lib/core";
declare const DEFAULT_CONFIG: {
    readonly cacheTTL: 300000;
    readonly maxRetries: 3;
    readonly retryDelay: 1000;
    readonly timeout: 5000;
    readonly maxConcurrentRequests: 50;
    readonly enableCaching: true;
    readonly enablePerformanceMonitoring: true;
};
type LibraryConfig = typeof DEFAULT_CONFIG;
declare function isValidationRequest(value: unknown): value is ValidationRequest;
declare function isValidationResponse<T = unknown>(value: unknown): value is ValidationResponse<T>;
declare function isValidationError(value: unknown): value is ValidationError;

export { DEFAULT_CONFIG, DEFAULT_TTL_TOKEN, ERROR_HANDLER_CONFIG, ErrorHandlerService as ErrorHandler, ErrorHandlerService, IdempotencyKeyGenerator, LIBRARY_NAME, LIBRARY_VERSION, MAX_CACHE_SIZE_TOKEN, PERFORMANCE_MAX_LATENCY_RECORDS, PERFORMANCE_THRESHOLDS, PERFORMANCE_WINDOW_SIZE, PerformanceMonitorService as PerformanceMonitor, PerformanceMonitorService, THIRD_PARTY_CONFIG, ThirdPartyAdapterService, ValidationEngine, ValidationService, createFailedResponse, createSuccessResponse, isValidationError, isValidationRequest, isValidationResponse, toValidationError };
export type { CircuitBreakerState, ErrorEvent, ErrorHandlerConfig, ExtractDataType, FallbackStrategy, IdempotencyKeyOptions, LatencyDistribution, LibraryConfig, PerformanceAlert, PerformanceMetrics, PerformanceThresholds, RetryConfig, ThirdPartyConfig, ValidationError, ValidationMetrics, ValidationOptions, ValidationRequest, ValidationResponse, ValidationStatus };
//# sourceMappingURL=index.d.ts.map
