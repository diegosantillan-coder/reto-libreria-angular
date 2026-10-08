import { InjectionToken } from '@angular/core';

/**
 * Modelo que representa una solicitud de validación.
 * Incluye los datos necesarios para realizar la validación y metadatos para idempotencia.
 */
export interface ValidationRequest {
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
export const DEFAULT_TTL_TOKEN = new InjectionToken<number>(
  'DEFAULT_TTL_TOKEN',
  {
    providedIn: 'root',
    factory: () => 300000 // 5 minutos por defecto
  }
);

/**
 * Token de inyección para configurar el tamaño máximo de la caché de idempotencia.
 */
export const MAX_CACHE_SIZE_TOKEN = new InjectionToken<number>(
  'MAX_CACHE_SIZE_TOKEN',
  {
    providedIn: 'root',
    factory: () => 1000 // Máximo 1000 entradas en caché
  }
);

/**
 * Tipo utilitario para extraer el tipo de datos de una solicitud específica.
 */
export type ExtractDataType<T extends ValidationRequest> = T['data'];

/**
 * Validador de estructura para solicitudes de validación.
 * @param request Solicitud a validar.
 * @returns true si la solicitud tiene la estructura esperada.
 */
export function isValidationRequest(request: unknown): request is ValidationRequest {
  return (
    request !== null &&
    typeof request === 'object' &&
    'requestId' in request && typeof request.requestId === 'string' &&
    'data' in request &&
    'validationType' in request && typeof request.validationType === 'string' &&
    'idempotencyKey' in request && typeof request.idempotencyKey === 'string'
  );
}