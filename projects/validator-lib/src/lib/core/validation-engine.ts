import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, map, switchMap, tap, retryWhen, take, mergeMap } from 'rxjs/operators';
import { ValidationRequest, DEFAULT_TTL_TOKEN, MAX_CACHE_SIZE_TOKEN } from '../models/validation-request.model';
import { ValidationResponse, ValidationError, toValidationError, createSuccessResponse, createFailedResponse } from '../models/validation-response.model';

/**
 * Motor central de validación con soporte para idempotencia y caché.
 * Procesa solicitudes de validación, maneja errores y optimiza recursos.
 */
@Injectable({
  providedIn: 'root'
})
export class ValidationEngine {
  private cache = new Map<string, { response: ValidationResponse; expiresAt: number }>();
  private inFlightRequests = new Map<string, Observable<ValidationResponse>>();

  constructor(
    private http: HttpClient,
    @Inject(DEFAULT_TTL_TOKEN) private defaultTtl: number,
    @Inject(MAX_CACHE_SIZE_TOKEN) private maxCacheSize: number,
    @Optional() @Inject('THIRD_PARTY_SERVICE_URL') private serviceUrl?: string
  ) {}

  /**
   * Procesa una solicitud de validación con manejo de idempotencia y caché.
   * @param request Solicitud de validación.
   * @returns Observable con la respuesta de validación.
   */
  validate<T = unknown>(request: ValidationRequest): Observable<ValidationResponse<T>> {
    const ttl = request.ttl ?? this.defaultTtl;
    request.ttl = ttl;

    const cachedResponse = this.getCachedResponse(request.idempotencyKey);
    if (cachedResponse) {
      return of(cachedResponse as ValidationResponse<T>);
    }

    // Verificar si hay una solicitud en vuelo con la misma clave de idempotencia
    const inFlightRequest = this.inFlightRequests.get(request.idempotencyKey);
    if (inFlightRequest) {
      return inFlightRequest as Observable<ValidationResponse<T>>;
    }

    // Procesar la solicitud
    const startTime = Date.now();
    const request$ = this.processRequest(request).pipe(
      tap(response => {
        const durationMs = Date.now() - startTime;
        this.cacheResponse(request.idempotencyKey, response, request.ttl ?? this.defaultTtl);
        this.inFlightRequests.delete(request.idempotencyKey);
      }),
      catchError(error => {
        this.inFlightRequests.delete(request.idempotencyKey);
        return throwError(() => error);
      })
    );

    this.inFlightRequests.set(request.idempotencyKey, request$);
    return request$ as Observable<ValidationResponse<T>>;
  }

  /**
   * Procesa la solicitud llamando al servicio de terceros o lógica interna.
   * @param request Solicitud de validación.
   * @returns Observable con la respuesta.
   */
  private processRequest<T>(request: ValidationRequest): Observable<ValidationResponse<T>> {
    // Si no hay URL de servicio configurada, usar lógica de validación local
    if (!this.serviceUrl) {
      return this.validateLocally(request);
    }

    // Llamar al servicio de terceros con manejo de errores y reintentos
    return this.http.post<{ result: T }>(`${this.serviceUrl}/validate`, {
      data: request.data,
      type: request.validationType
    }).pipe(
      map(response => createSuccessResponse<T>(
        request,
        response.result,
        Date.now() - Date.now() // Duración aproximada
      )),
      retryWhen(errors => errors.pipe(
        mergeMap((error, attempt) => {
          const validationError = toValidationError(error);
          if (validationError.recoverable && attempt < 3) {
            return timer(Math.pow(2, attempt) * 100);
          }
          return throwError(() => error);
        }),
        take(3)
      )),
      catchError(error => {
        const validationError = toValidationError(error);
        return throwError(() => createFailedResponse(request, validationError, Date.now() - Date.now()));
      })
    );
  }

  /**
   * Realiza validación local cuando no hay servicio de terceros configurado.
   * @param request Solicitud de validación.
   * @returns Observable con la respuesta.
   */
  private validateLocally<T>(request: ValidationRequest): Observable<ValidationResponse<T>> {
    const startTime = Date.now();

    // Simular diferentes tipos de validación
    switch (request.validationType) {
      case 'email':
        const email = request.data as string;
        const isValid = /^[^s@]+@[^s@]+.[^s@]+$/.test(email);
        return of(createSuccessResponse<T>(
          request,
          { valid: isValid, value: email } as unknown as T,
          Date.now() - startTime
        ));
      case 'phone':
        const phone = request.data as string;
        const phoneValid = /^\+?[0-9]{10,15}$/.test(phone);
        return of(createSuccessResponse<T>(
          request,
          { valid: phoneValid, value: phone } as unknown as T,
          Date.now() - startTime
        ));
      default:
        const error: ValidationError = {
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
  getCachedResponse(idempotencyKey: string): ValidationResponse | undefined {
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
  cacheResponse(idempotencyKey: string, response: ValidationResponse, ttl: number): void {
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
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Obtiene estadísticas de la caché.
   * @returns Objeto con estadísticas de la caché.
   */
  getCacheStats(): { size: number; hits: number; misses: number } {
    return {
      size: this.cache.size,
      hits: 0, // En una implementación real, llevaríamos la cuenta
      misses: 0
    };
  }
}