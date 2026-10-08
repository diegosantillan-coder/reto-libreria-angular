import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Inject, Optional } from '@angular/core';
import { of, throwError, timer, Subject, BehaviorSubject, combineLatest, interval } from 'rxjs';
import { tap, catchError, map, retryWhen, mergeMap, take, share, finalize, switchMap, timeout, takeUntil, delayWhen } from 'rxjs/operators';
import * as i1 from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

/**
 * Token de inyección para configurar el tiempo de vida por defecto de las solicitudes.
 */
const DEFAULT_TTL_TOKEN = new InjectionToken('DEFAULT_TTL_TOKEN', {
    providedIn: 'root',
    factory: () => 300000 // 5 minutos por defecto
});
/**
 * Token de inyección para configurar el tamaño máximo de la caché de idempotencia.
 */
const MAX_CACHE_SIZE_TOKEN = new InjectionToken('MAX_CACHE_SIZE_TOKEN', {
    providedIn: 'root',
    factory: () => 1000 // Máximo 1000 entradas en caché
});
/**
 * Validador de estructura para solicitudes de validación.
 * @param request Solicitud a validar.
 * @returns true si la solicitud tiene la estructura esperada.
 */
function isValidationRequest$1(request) {
    return (request !== null &&
        typeof request === 'object' &&
        'requestId' in request && typeof request.requestId === 'string' &&
        'data' in request &&
        'validationType' in request && typeof request.validationType === 'string' &&
        'idempotencyKey' in request && typeof request.idempotencyKey === 'string');
}

/**
 * Convierte un error HTTP en un ValidationError.
 * @param error Error HTTP recibido.
 * @returns ValidationError correspondiente.
 */
function toValidationError(error) {
    return {
        code: `HTTP_${error.status}`,
        message: error.message,
        details: error.error,
        recoverable: error.status >= 500 || error.status === 429,
        httpStatus: error.status
    };
}
/**
 * Crea una respuesta de validación exitosa.
 * @param request Solicitud original.
 * @param data Datos de la respuesta.
 * @param durationMs Duración de la validación.
 * @returns ValidationResponse con estado SUCCESS.
 */
function createSuccessResponse(request, data, durationMs) {
    return {
        requestId: request.requestId,
        idempotencyKey: request.idempotencyKey,
        status: 'SUCCESS',
        data,
        timestamp: Date.now(),
        durationMs
    };
}
/**
 * Crea una respuesta de validación fallida.
 * @param request Solicitud original.
 * @param error Detalles del error.
 * @param durationMs Duración de la validación.
 * @returns ValidationResponse con estado FAILED.
 */
function createFailedResponse(request, error, durationMs) {
    return {
        requestId: request.requestId,
        idempotencyKey: request.idempotencyKey,
        status: 'FAILED',
        error,
        timestamp: Date.now(),
        durationMs
    };
}
/**
 * Validador de estructura para respuestas de validación.
 * @param response Respuesta a validar.
 * @returns true si la respuesta tiene la estructura esperada.
 */
function isValidationResponse$1(response) {
    return (response !== null &&
        typeof response === 'object' &&
        'requestId' in response && typeof response.requestId === 'string' &&
        'idempotencyKey' in response && typeof response.idempotencyKey === 'string' &&
        'status' in response && typeof response.status === 'string' &&
        'timestamp' in response && typeof response.timestamp === 'number' &&
        'durationMs' in response && typeof response.durationMs === 'number');
}

/**
 * Motor central de validación con soporte para idempotencia y caché.
 * Procesa solicitudes de validación, maneja errores y optimiza recursos.
 */
class ValidationEngine {
    http;
    defaultTtl;
    maxCacheSize;
    serviceUrl;
    cache = new Map();
    inFlightRequests = new Map();
    constructor(http, defaultTtl, maxCacheSize, serviceUrl) {
        this.http = http;
        this.defaultTtl = defaultTtl;
        this.maxCacheSize = maxCacheSize;
        this.serviceUrl = serviceUrl;
    }
    /**
     * Procesa una solicitud de validación con manejo de idempotencia y caché.
     * @param request Solicitud de validación.
     * @returns Observable con la respuesta de validación.
     */
    validate(request) {
        const ttl = request.ttl ?? this.defaultTtl;
        request.ttl = ttl;
        const cachedResponse = this.getCachedResponse(request.idempotencyKey);
        if (cachedResponse) {
            return of(cachedResponse);
        }
        // Verificar si hay una solicitud en vuelo con la misma clave de idempotencia
        const inFlightRequest = this.inFlightRequests.get(request.idempotencyKey);
        if (inFlightRequest) {
            return inFlightRequest;
        }
        // Procesar la solicitud
        const startTime = Date.now();
        const request$ = this.processRequest(request).pipe(tap(response => {
            const durationMs = Date.now() - startTime;
            this.cacheResponse(request.idempotencyKey, response, request.ttl ?? this.defaultTtl);
            this.inFlightRequests.delete(request.idempotencyKey);
        }), catchError(error => {
            this.inFlightRequests.delete(request.idempotencyKey);
            return throwError(() => error);
        }));
        this.inFlightRequests.set(request.idempotencyKey, request$);
        return request$;
    }
    /**
     * Procesa la solicitud llamando al servicio de terceros o lógica interna.
     * @param request Solicitud de validación.
     * @returns Observable con la respuesta.
     */
    processRequest(request) {
        // Si no hay URL de servicio configurada, usar lógica de validación local
        if (!this.serviceUrl) {
            return this.validateLocally(request);
        }
        // Llamar al servicio de terceros con manejo de errores y reintentos
        return this.http.post(`${this.serviceUrl}/validate`, {
            data: request.data,
            type: request.validationType
        }).pipe(map(response => createSuccessResponse(request, response.result, Date.now() - Date.now() // Duración aproximada
        )), retryWhen(errors => errors.pipe(mergeMap((error, attempt) => {
            const validationError = toValidationError(error);
            if (validationError.recoverable && attempt < 3) {
                return timer(Math.pow(2, attempt) * 100);
            }
            return throwError(() => error);
        }), take(3))), catchError(error => {
            const validationError = toValidationError(error);
            return throwError(() => createFailedResponse(request, validationError, Date.now() - Date.now()));
        }));
    }
    /**
     * Realiza validación local cuando no hay servicio de terceros configurado.
     * @param request Solicitud de validación.
     * @returns Observable con la respuesta.
     */
    validateLocally(request) {
        const startTime = Date.now();
        // Simular diferentes tipos de validación
        switch (request.validationType) {
            case 'email':
                const email = request.data;
                const isValid = /^[^s@]+@[^s@]+.[^s@]+$/.test(email);
                return of(createSuccessResponse(request, { valid: isValid, value: email }, Date.now() - startTime));
            case 'phone':
                const phone = request.data;
                const phoneValid = /^\+?[0-9]{10,15}$/.test(phone);
                return of(createSuccessResponse(request, { valid: phoneValid, value: phone }, Date.now() - startTime));
            default:
                const error = {
                    code: 'UNSUPPORTED_VALIDATION_TYPE',
                    message: `Tipo de validación '${request.validationType}' no soportado`,
                    recoverable: false
                };
                return throwError(() => createFailedResponse(request, error, Date.now() - startTime));
        }
    }
    /**
     * Obtiene una respuesta de la caché si está disponible y no ha expirado.
     * @param idempotencyKey Clave de idempotencia.
     * @returns Respuesta en caché o undefined.
     */
    getCachedResponse(idempotencyKey) {
        const cached = this.cache.get(idempotencyKey);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.response;
        }
        this.cache.delete(idempotencyKey);
        return undefined;
    }
    /**
     * Almacena una respuesta en caché.
     * @param idempotencyKey Clave de idempotencia.
     * @param response Respuesta a cachear.
     * @param ttl Tiempo de vida en milisegundos.
     */
    cacheResponse(idempotencyKey, response, ttl) {
        if (this.cache.size >= this.maxCacheSize) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey !== undefined) {
                this.cache.delete(oldestKey);
            }
        }
        this.cache.set(idempotencyKey, {
            response,
            expiresAt: Date.now() + ttl
        });
    }
    /**
     * Limpia la caché de respuestas.
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Obtiene estadísticas de la caché.
     * @returns Objeto con estadísticas de la caché.
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            hits: 0, // En una implementación real, llevaríamos la cuenta
            misses: 0
        };
    }
    static ɵfac = function ValidationEngine_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ValidationEngine)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(DEFAULT_TTL_TOKEN), i0.ɵɵinject(MAX_CACHE_SIZE_TOKEN), i0.ɵɵinject('THIRD_PARTY_SERVICE_URL', 8)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ValidationEngine, factory: ValidationEngine.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ValidationEngine, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.HttpClient }, { type: undefined, decorators: [{
                type: Inject,
                args: [DEFAULT_TTL_TOKEN]
            }] }, { type: undefined, decorators: [{
                type: Inject,
                args: [MAX_CACHE_SIZE_TOKEN]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: ['THIRD_PARTY_SERVICE_URL']
            }] }], null); })();

const THIRD_PARTY_CONFIG = 'THIRD_PARTY_CONFIG';
class ThirdPartyAdapterService {
    http;
    config;
    circuitBreakerState = {
        failures: 0,
        lastFailureTime: 0,
        isOpen: false
    };
    destroy$ = new Subject();
    pendingRequests = new Map();
    DEFAULT_TIMEOUT = 5000;
    DEFAULT_MAX_RETRIES = 3;
    DEFAULT_RETRY_DELAY = 1000;
    CIRCUIT_BREAKER_THRESHOLD = 5;
    CIRCUIT_BREAKER_TIMEOUT = 30000;
    constructor(http, config) {
        this.http = http;
        this.config = this.buildConfig(config);
        this.initializeCircuitBreaker();
    }
    validate(request) {
        const requestKey = this.generateRequestKey(request);
        if (this.pendingRequests.has(requestKey)) {
            return this.pendingRequests.get(requestKey);
        }
        if (this.isCircuitBreakerOpen()) {
            return throwError(() => new Error('Circuit breaker is open - service temporarily unavailable'));
        }
        const request$ = this.executeValidation(request).pipe(share());
        this.pendingRequests.set(requestKey, request$);
        return request$.pipe(finalize(() => {
            this.pendingRequests.delete(requestKey);
        }));
    }
    validateWithIdempotency(request, idempotencyKey) {
        const headers = new HttpHeaders({
            'Idempotency-Key': idempotencyKey,
            'Content-Type': 'application/json'
        });
        if (this.config.apiKey) {
            headers.set('X-API-Key', this.config.apiKey);
        }
        return this.executeWithRetry(request, headers);
    }
    checkHealth() {
        const startTime = performance.now();
        return this.http.get(`${this.config.baseUrl}/health`).pipe(map(response => ({
            status: response.status,
            latency: performance.now() - startTime
        })), catchError(error => of({
            status: 'unhealthy',
            latency: performance.now() - startTime
        })));
    }
    getStats() {
        return {
            pendingRequests: this.pendingRequests.size,
            circuitBreakerOpen: this.circuitBreakerState.isOpen,
            failures: this.circuitBreakerState.failures
        };
    }
    resetCircuitBreaker() {
        this.circuitBreakerState = {
            failures: 0,
            lastFailureTime: 0,
            isOpen: false
        };
    }
    destroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.pendingRequests.clear();
    }
    buildConfig(config) {
        const defaultConfig = {
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
    initializeCircuitBreaker() {
        if (typeof window !== 'undefined') {
            setInterval(() => this.checkCircuitBreakerTimeout(), 5000);
        }
    }
    executeValidation(request) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (this.config.apiKey) {
            headers.set('X-API-Key', this.config.apiKey);
        }
        return this.executeWithRetry(request, headers);
    }
    executeWithRetry(request, headers) {
        const timeoutMs = this.config.timeout || this.DEFAULT_TIMEOUT;
        const maxRetries = this.config.maxRetries || this.DEFAULT_MAX_RETRIES;
        const retryDelay = this.config.retryDelay || this.DEFAULT_RETRY_DELAY;
        return timer(0).pipe(switchMap(() => this.http.post(`${this.config.baseUrl}/validate`, request, { headers }).pipe(timeout(timeoutMs), catchError(error => this.handleError(error, maxRetries, retryDelay, request, headers)))), takeUntil(this.destroy$));
    }
    handleError(error, remainingRetries, retryDelay, request, headers) {
        this.recordFailure();
        if (remainingRetries > 0 && this.isRetryableError(error)) {
            const delay = retryDelay * (this.DEFAULT_MAX_RETRIES - remainingRetries + 1);
            return timer(delay).pipe(switchMap(() => this.executeWithRetry(request, headers)));
        }
        const validationError = {
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
    isRetryableError(error) {
        const status = error.status;
        return status === 0 || status === 408 || status === 429 || status >= 500;
    }
    generateRequestKey(request) {
        return JSON.stringify({
            action: 'validate',
            data: request.data,
            type: request.type
        });
    }
    recordFailure() {
        this.circuitBreakerState.failures++;
        this.circuitBreakerState.lastFailureTime = Date.now();
        if (this.config.enableCircuitBreaker &&
            this.circuitBreakerState.failures >= (this.config.circuitBreakerThreshold || this.CIRCUIT_BREAKER_THRESHOLD)) {
            this.circuitBreakerState.isOpen = true;
        }
    }
    isCircuitBreakerOpen() {
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
    checkCircuitBreakerTimeout() {
        if (this.circuitBreakerState.isOpen) {
            this.isCircuitBreakerOpen();
        }
    }
    static ɵfac = function ThirdPartyAdapterService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ThirdPartyAdapterService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(THIRD_PARTY_CONFIG, 8)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ThirdPartyAdapterService, factory: ThirdPartyAdapterService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ThirdPartyAdapterService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.HttpClient }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [THIRD_PARTY_CONFIG]
            }] }], null); })();

class IdempotencyKeyGenerator {
    defaultOptions = {
        includeTimestamp: false,
        includeRandomSuffix: true,
        algorithm: 'sha256',
        maxKeyLength: 64
    };
    generateKey(requestData, customOptions) {
        const options = { ...this.defaultOptions, ...customOptions };
        const serializedData = this.serializeRequest(requestData);
        const hash = this.computeHash(serializedData, options.algorithm);
        let key = hash;
        if (options.includeTimestamp) {
            const timestamp = Date.now().toString(36);
            key = `${timestamp}-${key}`;
        }
        if (options.includeRandomSuffix) {
            const randomSuffix = this.generateRandomSuffix(8);
            key = `${key}-${randomSuffix}`;
        }
        return key.substring(0, options.maxKeyLength);
    }
    generateKeyFromMultipleRequests(requests) {
        const combinedData = requests
            .sort((a, b) => a.action.localeCompare(b.action))
            .map(r => `${r.action}:${this.serializeRequest(r.data)}`)
            .join('|');
        return this.computeHash(combinedData, this.defaultOptions.algorithm);
    }
    validateKeyFormat(key) {
        if (!key || key.length === 0) {
            return false;
        }
        const base64Regex = /^[A-Za-z0-9+/]+=*$/;
        const hexRegex = /^[a-f0-9]+$/;
        return base64Regex.test(key) || hexRegex.test(key);
    }
    serializeRequest(data) {
        if (data === null || data === undefined) {
            return '';
        }
        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
            return String(data);
        }
        if (Array.isArray(data)) {
            return data.map(item => this.serializeRequest(item)).join(',');
        }
        if (typeof data === 'object') {
            const sortedKeys = Object.keys(data).sort();
            return sortedKeys
                .map(key => `${key}:${this.serializeRequest(data[key])}`)
                .join(';');
        }
        return String(data);
    }
    computeHash(data, algorithm) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        let hashBuffer;
        switch (algorithm) {
            case 'sha384':
                hashBuffer = this.sha384(dataBuffer);
                break;
            case 'sha512':
                hashBuffer = this.sha512(dataBuffer);
                break;
            case 'sha256':
            default:
                hashBuffer = this.sha256(dataBuffer);
                break;
        }
        return this.bufferToHex(hashBuffer);
    }
    sha256(buffer) {
        const hashBuffer = new ArrayBuffer(32);
        const hashArray = new Uint8Array(hashBuffer);
        const dataArray = new Uint8Array(buffer);
        this.simpleHash(dataArray, hashArray, 32);
        return hashBuffer;
    }
    sha384(buffer) {
        const hashBuffer = new ArrayBuffer(48);
        const hashArray = new Uint8Array(hashBuffer);
        const dataArray = new Uint8Array(buffer);
        this.simpleHash(dataArray, hashArray, 48);
        return hashBuffer;
    }
    sha512(buffer) {
        const hashBuffer = new ArrayBuffer(64);
        const hashArray = new Uint8Array(hashBuffer);
        const dataArray = new Uint8Array(buffer);
        this.simpleHash(dataArray, hashArray, 64);
        return hashBuffer;
    }
    simpleHash(input, output, outputLength) {
        let hash = 0;
        const prime = 31;
        for (let i = 0; i < input.length; i++) {
            hash = ((hash * prime) + input[i]) | 0;
        }
        for (let i = 0; i < outputLength; i++) {
            const shift = (i % 4) * 8;
            const chunk = (hash >> shift) & 0xff;
            const pseudoRandom = this.pseudoRandom(i, hash);
            output[i] = (chunk ^ pseudoRandom) % 256;
        }
    }
    pseudoRandom(seed, hash) {
        const x = Math.sin(seed + hash) * 10000;
        return ((x - Math.floor(x)) * 256) | 0;
    }
    bufferToHex(buffer) {
        const array = new Uint8Array(buffer);
        return Array.from(array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    generateRandomSuffix(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const randomValues = new Uint32Array(length);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(randomValues);
        }
        else {
            for (let i = 0; i < length; i++) {
                randomValues[i] = Math.floor(Math.random() * 0xffffffff);
            }
        }
        for (let i = 0; i < length; i++) {
            result += chars[randomValues[i] % chars.length];
        }
        return result;
    }
    static ɵfac = function IdempotencyKeyGenerator_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdempotencyKeyGenerator)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: IdempotencyKeyGenerator, factory: IdempotencyKeyGenerator.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdempotencyKeyGenerator, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();

class ValidationService {
    validationEngine;
    thirdPartyAdapter;
    idempotencyGenerator;
    destroy$ = new Subject();
    metricsSubject = new BehaviorSubject({
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageLatency: 0,
        cacheHitRate: 0,
        requestsPerSecond: 0
    });
    requestTimestamps = [];
    MAX_METRICS_HISTORY = 1000;
    DEFAULT_CACHE_TTL = 300000;
    DEFAULT_TIMEOUT = 5000;
    metrics$ = this.metricsSubject.asObservable();
    constructor(validationEngine, thirdPartyAdapter, idempotencyGenerator) {
        this.validationEngine = validationEngine;
        this.thirdPartyAdapter = thirdPartyAdapter;
        this.idempotencyGenerator = idempotencyGenerator;
        this.startMetricsCleanup();
    }
    validate(request, options) {
        const finalOptions = this.buildOptions(options);
        this.recordRequest();
        if (finalOptions.skipValidation) {
            return of(this.createSuccessResponse(request, { valid: true }));
        }
        if (finalOptions.useCache) {
            const cachedResponse = this.validationEngine.getCachedResponse(this.idempotencyGenerator.generateKey(request));
            if (cachedResponse) {
                this.updateMetrics(true);
                return of(cachedResponse);
            }
        }
        const validation$ = finalOptions.useIdempotency
            ? this.validateWithIdempotency(request, finalOptions)
            : this.validateWithoutIdempotency(request, finalOptions);
        return validation$.pipe(tap(response => {
            if (response.status === 'success') {
                const latency = typeof response.metadata?.['latency'] === 'number'
                    ? response.metadata['latency']
                    : undefined;
                this.updateMetrics(false, latency);
                if (finalOptions.useCache) {
                    const idempotencyKey = this.idempotencyGenerator.generateKey(request);
                    this.validationEngine.cacheResponse(idempotencyKey, response, finalOptions.cacheTTL || this.DEFAULT_CACHE_TTL);
                }
            }
            else {
                this.updateMetrics(false);
            }
        }), catchError(error => {
            this.updateMetrics(false);
            return of(this.createErrorResponse(error));
        }), takeUntil(this.destroy$));
    }
    validateBatch(requests, options) {
        if (!requests || requests.length === 0) {
            return of([]);
        }
        const batchId = this.idempotencyGenerator.generateKeyFromMultipleRequests(requests.map((r, i) => ({ data: r, action: `batch_${i}` })));
        const cachedBatch = this.validationEngine.getCachedResponse(batchId);
        if (cachedBatch && options?.useCache) {
            return of(requests.map(() => cachedBatch));
        }
        const validationResults = requests.map(request => this.validate(request, { ...options, useCache: false }).pipe(catchError(error => of(this.createErrorResponse(error)))));
        return combineLatest(validationResults).pipe(map(responses => {
            if (options?.useCache) {
                const firstResponse = responses[0];
                if (firstResponse) {
                    this.validationEngine.cacheResponse(batchId, firstResponse, options.cacheTTL || this.DEFAULT_CACHE_TTL);
                }
            }
            return responses;
        }), takeUntil(this.destroy$));
    }
    getMetrics() {
        return this.metricsSubject.getValue();
    }
    clearCache() {
        this.validationEngine.clearCache();
    }
    getCacheStats() {
        const stats = this.validationEngine.getCacheStats();
        return {
            size: stats.size,
            hitRate: this.metricsSubject.getValue().cacheHitRate
        };
    }
    checkServiceHealth() {
        return this.thirdPartyAdapter.checkHealth();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    validateWithIdempotency(request, options) {
        const idempotencyKey = this.idempotencyGenerator.generateKey(request, {
            includeTimestamp: true,
            includeRandomSuffix: true
        });
        return this.thirdPartyAdapter.validateWithIdempotency(request, idempotencyKey).pipe(map(response => this.enrichResponse(response, idempotencyKey)), catchError(error => {
            if (error.code === '409') {
                const cachedResponse = this.validationEngine.getCachedResponse(idempotencyKey);
                if (cachedResponse) {
                    return of(cachedResponse);
                }
            }
            throw error;
        }));
    }
    validateWithoutIdempotency(request, options) {
        return this.thirdPartyAdapter.validate(request).pipe(map(response => this.enrichResponse(response)));
    }
    buildOptions(options) {
        return {
            useCache: options?.useCache ?? true,
            useIdempotency: options?.useIdempotency ?? true,
            cacheTTL: options?.cacheTTL ?? this.DEFAULT_CACHE_TTL,
            timeout: options?.timeout ?? this.DEFAULT_TIMEOUT,
            skipValidation: options?.skipValidation ?? false
        };
    }
    createSuccessResponse(request, data) {
        return {
            requestId: request.requestId || this.generateRequestId(),
            idempotencyKey: request.idempotencyKey || this.idempotencyGenerator.generateKey(request),
            status: 'success',
            data: data,
            timestamp: Date.now(),
            durationMs: 0,
            metadata: {
                processingTime: 0,
                cached: false
            }
        };
    }
    createErrorResponse(error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorCode = error && typeof error === 'object' && 'code' in error
            ? String(error['code'])
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
    enrichResponse(response, idempotencyKey) {
        return {
            ...response,
            metadata: {
                ...response.metadata,
                idempotencyKey,
                processedAt: new Date().toISOString()
            }
        };
    }
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
    recordRequest() {
        const now = Date.now();
        this.requestTimestamps.push(now);
        if (this.requestTimestamps.length > this.MAX_METRICS_HISTORY) {
            this.requestTimestamps = this.requestTimestamps.slice(-this.MAX_METRICS_HISTORY);
        }
    }
    updateMetrics(fromCache, latency) {
        const current = this.metricsSubject.getValue();
        const newTotal = current.totalRequests + 1;
        const newSuccessful = fromCache ? current.successfulRequests : current.successfulRequests + 1;
        const isCacheHit = fromCache;
        const recentTimestamps = this.requestTimestamps.filter(ts => Date.now() - ts < 60000);
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
    startMetricsCleanup() {
        timer(0, 60000).pipe(takeUntil(this.destroy$)).subscribe(() => {
            const cutoff = Date.now() - 60000;
            this.requestTimestamps = this.requestTimestamps.filter(ts => ts > cutoff);
            this.metricsSubject.next({
                ...this.metricsSubject.getValue(),
                requestsPerSecond: this.requestTimestamps.length / 60
            });
        });
    }
    static ɵfac = function ValidationService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ValidationService)(i0.ɵɵinject(ValidationEngine), i0.ɵɵinject(ThirdPartyAdapterService), i0.ɵɵinject(IdempotencyKeyGenerator)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ValidationService, factory: ValidationService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ValidationService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: ValidationEngine }, { type: ThirdPartyAdapterService }, { type: IdempotencyKeyGenerator }], null); })();

const ERROR_HANDLER_CONFIG = new InjectionToken('ERROR_HANDLER_CONFIG');
class ErrorHandlerService {
    defaultRetryConfig = {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
        retryableStatuses: [408, 429, 500, 502, 503, 504]
    };
    defaultCircuitBreakerConfig = {
        failureThreshold: 5,
        resetTimeout: 30000
    };
    circuitBreakerState = new BehaviorSubject({
        failures: 0,
        lastFailureTime: null,
        state: 'closed'
    });
    errorEvents = new Subject();
    config;
    constructor(config) {
        this.config = config || {};
    }
    getCircuitBreakerState() {
        return this.circuitBreakerState.asObservable();
    }
    getErrorEvents() {
        return this.errorEvents.asObservable();
    }
    handleError(error, originalRequest, fallbackStrategies) {
        const currentState = this.circuitBreakerState.getValue();
        if (currentState.state === 'open') {
            const timeSinceLastFailure = currentState.lastFailureTime
                ? Date.now() - currentState.lastFailureTime
                : Infinity;
            if (timeSinceLastFailure < (this.config.circuitBreaker?.resetTimeout || this.defaultCircuitBreakerConfig.resetTimeout)) {
                this.log('Circuit breaker OPEN - rejecting request');
                return this.executeFallbackStrategies(error, originalRequest, fallbackStrategies);
            }
            else {
                this.circuitBreakerState.next({
                    ...currentState,
                    state: 'half-open'
                });
                this.log('Circuit breaker transitioning to HALF-OPEN');
            }
        }
        this.recordFailure();
        const errorEvent = {
            timestamp: new Date(),
            error,
            attemptNumber: 1,
            strategy: 'initial'
        };
        this.errorEvents.next(errorEvent);
        if (this.config.retry?.maxAttempts && this.config.retry.maxAttempts > 0) {
            return this.createRetryableObservable(error, originalRequest, fallbackStrategies);
        }
        return this.executeFallbackStrategies(error, originalRequest, fallbackStrategies);
    }
    createRetryableObservable(error, originalRequest, fallbackStrategies) {
        const retryConfig = { ...this.defaultRetryConfig, ...this.config.retry };
        let attemptCount = 0;
        return throwError(() => error).pipe(retryWhen(errors => errors.pipe(delayWhen(() => {
            attemptCount++;
            const delay = Math.min(retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attemptCount - 1), retryConfig.maxDelay);
            const errorEvent = {
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
        }), take(retryConfig.maxAttempts))), catchError(err => {
            this.log('All retry attempts exhausted');
            return this.executeFallbackStrategies(err, originalRequest, fallbackStrategies);
        }));
    }
    executeFallbackStrategies(error, originalRequest, strategies) {
        const availableStrategies = strategies || this.config.fallbackStrategies;
        if (!availableStrategies || availableStrategies.length === 0) {
            this.log('No fallback strategies available, throwing original error');
            return throwError(() => error);
        }
        for (const strategy of availableStrategies) {
            try {
                this.log(`Executing fallback strategy: ${strategy.name}`);
                return strategy.execute(error, originalRequest);
            }
            catch (fallbackError) {
                this.log(`Fallback strategy ${strategy.name} failed: ${fallbackError}`);
                continue;
            }
        }
        return throwError(() => error);
    }
    recordFailure() {
        const currentState = this.circuitBreakerState.getValue();
        const newFailureCount = currentState.failures + 1;
        const threshold = this.config.circuitBreaker?.failureThreshold || this.defaultCircuitBreakerConfig.failureThreshold;
        let newState;
        if (newFailureCount >= threshold) {
            newState = {
                failures: newFailureCount,
                lastFailureTime: Date.now(),
                state: 'open'
            };
            this.log(`Circuit breaker OPENED after ${newFailureCount} failures`);
        }
        else {
            newState = {
                failures: newFailureCount,
                lastFailureTime: Date.now(),
                state: currentState.state
            };
        }
        this.circuitBreakerState.next(newState);
    }
    resetCircuitBreaker() {
        this.circuitBreakerState.next({
            failures: 0,
            lastFailureTime: null,
            state: 'closed'
        });
        this.log('Circuit breaker reset to CLOSED');
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('Error handler configuration updated');
    }
    log(message) {
        if (this.config.enableLogging) {
            console.error(`[ErrorHandler] ${new Date().toISOString()} - ${message}`);
        }
    }
    static ɵfac = function ErrorHandlerService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ErrorHandlerService)(i0.ɵɵinject(ERROR_HANDLER_CONFIG, 8)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ErrorHandlerService, factory: ErrorHandlerService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ErrorHandlerService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [ERROR_HANDLER_CONFIG]
            }] }], null); })();

const PERFORMANCE_THRESHOLDS = new InjectionToken('PERFORMANCE_THRESHOLDS');
const PERFORMANCE_WINDOW_SIZE = new InjectionToken('PERFORMANCE_WINDOW_SIZE');
const PERFORMANCE_MAX_LATENCY_RECORDS = new InjectionToken('PERFORMANCE_MAX_LATENCY_RECORDS');
class PerformanceMonitorService {
    windowSizeMsConfig;
    maxLatencyRecordsConfig;
    requestLatencies = [];
    requestTimestamps = [];
    successfulRequests = 0;
    failedRequests = 0;
    totalRequests = 0;
    metricsSubject = new BehaviorSubject(this.getInitialMetrics());
    alertsSubject = new BehaviorSubject([]);
    monitoringSubscription = null;
    defaultThresholds = {
        maxLatencyMs: 200,
        minThroughput: 100,
        maxErrorRate: 0.05
    };
    thresholds;
    windowSizeMs;
    maxLatencyRecords;
    constructor(thresholds, windowSizeMsConfig = null, maxLatencyRecordsConfig = null) {
        this.windowSizeMsConfig = windowSizeMsConfig;
        this.maxLatencyRecordsConfig = maxLatencyRecordsConfig;
        this.thresholds = { ...this.defaultThresholds, ...thresholds };
        this.windowSizeMs = this.windowSizeMsConfig ?? 60000;
        this.maxLatencyRecords = this.maxLatencyRecordsConfig ?? 10000;
    }
    startMonitoring(intervalMs = 1000) {
        if (this.monitoringSubscription) {
            return;
        }
        this.monitoringSubscription = interval(intervalMs).subscribe(() => {
            this.calculateMetrics();
            this.checkThresholds();
        });
    }
    stopMonitoring() {
        if (this.monitoringSubscription) {
            this.monitoringSubscription.unsubscribe();
            this.monitoringSubscription = null;
        }
    }
    recordRequest(latencyMs, success) {
        const now = Date.now();
        this.requestLatencies.push(latencyMs);
        this.requestTimestamps.push(now);
        this.totalRequests++;
        if (success) {
            this.successfulRequests++;
        }
        else {
            this.failedRequests++;
        }
        if (this.requestLatencies.length > this.maxLatencyRecords) {
            this.requestLatencies = this.requestLatencies.slice(-this.maxLatencyRecords);
            this.requestTimestamps = this.requestTimestamps.slice(-this.maxLatencyRecords);
        }
        this.cleanupOldData();
    }
    getMetrics() {
        return this.metricsSubject.asObservable();
    }
    getAlerts() {
        return this.alertsSubject.asObservable();
    }
    getLatencyDistribution() {
        if (this.requestLatencies.length === 0) {
            return { p50: 0, p90: 0, p95: 0, p99: 0 };
        }
        const sorted = [...this.requestLatencies].sort((a, b) => a - b);
        const n = sorted.length;
        return {
            p50: this.percentile(sorted, n, 0.50),
            p90: this.percentile(sorted, n, 0.90),
            p95: this.percentile(sorted, n, 0.95),
            p99: this.percentile(sorted, n, 0.99)
        };
    }
    reset() {
        this.requestLatencies = [];
        this.requestTimestamps = [];
        this.successfulRequests = 0;
        this.failedRequests = 0;
        this.totalRequests = 0;
        this.metricsSubject.next(this.getInitialMetrics());
        this.alertsSubject.next([]);
    }
    updateThresholds(newThresholds) {
        this.thresholds = { ...this.thresholds, ...newThresholds };
    }
    calculateMetrics() {
        this.cleanupOldData();
        const now = Date.now();
        const windowStart = now - this.windowSizeMs;
        const requestsInWindow = this.requestTimestamps.filter(t => t >= windowStart).length;
        const latenciesInWindow = this.requestLatencies.filter((_, i) => this.requestTimestamps[i] >= windowStart);
        const avgLatency = latenciesInWindow.length > 0
            ? latenciesInWindow.reduce((a, b) => a + b, 0) / latenciesInWindow.length
            : 0;
        const minLatency = latenciesInWindow.length > 0 ? Math.min(...latenciesInWindow) : 0;
        const maxLatency = latenciesInWindow.length > 0 ? Math.max(...latenciesInWindow) : 0;
        const windowSeconds = this.windowSizeMs / 1000;
        const throughput = requestsInWindow / windowSeconds;
        const metrics = {
            totalRequests: this.totalRequests,
            successfulRequests: this.successfulRequests,
            failedRequests: this.failedRequests,
            averageLatencyMs: avgLatency,
            minLatencyMs: minLatency,
            maxLatencyMs: maxLatency,
            throughput,
            timestamp: new Date()
        };
        this.metricsSubject.next(metrics);
    }
    checkThresholds() {
        const metrics = this.metricsSubject.getValue();
        const alerts = [];
        if (metrics.averageLatencyMs > this.thresholds.maxLatencyMs) {
            alerts.push({
                type: 'latency',
                message: `Latencia promedio ${metrics.averageLatencyMs.toFixed(2)}ms excede el umbral de ${this.thresholds.maxLatencyMs}ms`,
                value: metrics.averageLatencyMs,
                threshold: this.thresholds.maxLatencyMs,
                timestamp: new Date()
            });
        }
        if (metrics.throughput < this.thresholds.minThroughput) {
            alerts.push({
                type: 'throughput',
                message: `Throughput ${metrics.throughput.toFixed(2)} req/s está por debajo del umbral de ${this.thresholds.minThroughput} req/s`,
                value: metrics.throughput,
                threshold: this.thresholds.minThroughput,
                timestamp: new Date()
            });
        }
        const errorRate = this.totalRequests > 0
            ? this.failedRequests / this.totalRequests
            : 0;
        if (errorRate > this.thresholds.maxErrorRate) {
            alerts.push({
                type: 'error-rate',
                message: `Tasa de error ${(errorRate * 100).toFixed(2)}% excede el umbral de ${(this.thresholds.maxErrorRate * 100).toFixed(2)}%`,
                value: errorRate,
                threshold: this.thresholds.maxErrorRate,
                timestamp: new Date()
            });
        }
        if (alerts.length > 0) {
            const currentAlerts = this.alertsSubject.getValue();
            this.alertsSubject.next([...currentAlerts.slice(-9), ...alerts]);
        }
    }
    cleanupOldData() {
        const cutoffTime = Date.now() - this.windowSizeMs;
        const validIndices = this.requestTimestamps
            .map((t, i) => t >= cutoffTime ? i : -1)
            .filter(i => i >= 0);
        if (validIndices.length < this.requestTimestamps.length) {
            this.requestLatencies = validIndices.map(i => this.requestLatencies[i]);
            this.requestTimestamps = validIndices.map(i => this.requestTimestamps[i]);
        }
    }
    percentile(sortedArray, n, p) {
        const index = Math.ceil(n * p) - 1;
        return sortedArray[Math.max(0, index)];
    }
    getInitialMetrics() {
        return {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageLatencyMs: 0,
            minLatencyMs: 0,
            maxLatencyMs: 0,
            throughput: 0,
            timestamp: new Date()
        };
    }
    ngOnDestroy() {
        this.stopMonitoring();
    }
    static ɵfac = function PerformanceMonitorService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PerformanceMonitorService)(i0.ɵɵinject(PERFORMANCE_THRESHOLDS, 8), i0.ɵɵinject(PERFORMANCE_WINDOW_SIZE, 8), i0.ɵɵinject(PERFORMANCE_MAX_LATENCY_RECORDS, 8)); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PerformanceMonitorService, factory: PerformanceMonitorService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PerformanceMonitorService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [PERFORMANCE_THRESHOLDS]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [PERFORMANCE_WINDOW_SIZE]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [PERFORMANCE_MAX_LATENCY_RECORDS]
            }] }], null); })();

/**
 * Validator Library - Public API
 *
 * This is the public entry point for the validator-lib library.
 * All public APIs must be exported from this file.
 *
 * @module validator-lib
 * @version 1.0.0
 */
// Public models
// Version info for runtime inspection
const LIBRARY_VERSION = '1.0.0';
const LIBRARY_NAME = '@validator-lib/core';
// Configuration constants
const DEFAULT_CONFIG = {
    cacheTTL: 300000,
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 5000,
    maxConcurrentRequests: 50,
    enableCaching: true,
    enablePerformanceMonitoring: true
};
// Type guards for runtime type checking
function isValidationRequest(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'data' in value &&
        'type' in value);
}
function isValidationResponse(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'status' in value &&
        'requestId' in value);
}
function isValidationError(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'code' in value &&
        'message' in value);
}

/**
 * Generated bundle index. Do not edit.
 */

export { DEFAULT_CONFIG, DEFAULT_TTL_TOKEN, ERROR_HANDLER_CONFIG, ErrorHandlerService as ErrorHandler, ErrorHandlerService, IdempotencyKeyGenerator, LIBRARY_NAME, LIBRARY_VERSION, MAX_CACHE_SIZE_TOKEN, PERFORMANCE_MAX_LATENCY_RECORDS, PERFORMANCE_THRESHOLDS, PERFORMANCE_WINDOW_SIZE, PerformanceMonitorService as PerformanceMonitor, PerformanceMonitorService, THIRD_PARTY_CONFIG, ThirdPartyAdapterService, ValidationEngine, ValidationService, createFailedResponse, createSuccessResponse, isValidationError, isValidationRequest, isValidationResponse, toValidationError };
//# sourceMappingURL=validator-lib-core.mjs.map
