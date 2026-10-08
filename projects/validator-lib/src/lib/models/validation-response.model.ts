import { HttpErrorResponse } from '@angular/common/http';

/**
 * Estado posible de una respuesta de validación.
 */
export type ValidationStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'INVALID'
  | 'TIMEOUT'
  | 'pending'
  | 'success'
  | 'failed'
  | 'invalid'
  | 'timeout'
  | 'error';

/**
 * Modelo que representa una respuesta de validación.
 */
export interface ValidationResponse<T = unknown> {
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
export interface ValidationError {
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
export function toValidationError(error: HttpErrorResponse): ValidationError {
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
export function createSuccessResponse<T>(
  request: { requestId: string; idempotencyKey: string },
  data: T,
  durationMs: number
): ValidationResponse<T> {
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
export function createFailedResponse(
  request: { requestId: string; idempotencyKey: string },
  error: ValidationError,
  durationMs: number
): ValidationResponse {
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
export function isValidationResponse(response: unknown): response is ValidationResponse {
  return (
    response !== null &&
    typeof response === 'object' &&
    'requestId' in response && typeof response.requestId === 'string' &&
    'idempotencyKey' in response && typeof response.idempotencyKey === 'string' &&
    'status' in response && typeof response.status === 'string' &&
    'timestamp' in response && typeof response.timestamp === 'number' &&
    'durationMs' in response && typeof response.durationMs === 'number'
  );
}