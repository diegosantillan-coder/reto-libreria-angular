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
export * from './lib/models/validation-request.model';
export * from './lib/models/validation-response.model';

// Public services - Core validation
export * from './lib/services/validation.service';
export * from './lib/services/third-party-adapter.service';

// Public utilities
export * from './lib/utilities/idempotency-key-generator';
export * from './lib/utilities/error-handler';
export * from './lib/utilities/performance-monitor';

import type { ValidationRequest, ExtractDataType } from './lib/models/validation-request.model';
import type { ValidationResponse, ValidationStatus, ValidationError } from './lib/models/validation-response.model';

// Public core engine
export * from './lib/core/validation-engine';

// Re-export ValidationEngine as default for convenience
export { ValidationEngine } from './lib/core/validation-engine';
export { ValidationService } from './lib/services/validation.service';
export { ThirdPartyAdapterService } from './lib/services/third-party-adapter.service';

// Re-export utilities
export { IdempotencyKeyGenerator } from './lib/utilities/idempotency-key-generator';
export { ErrorHandlerService as ErrorHandler } from './lib/utilities/error-handler';
export { PerformanceMonitorService as PerformanceMonitor } from './lib/utilities/performance-monitor';

// Re-export models
export type { ValidationRequest, ExtractDataType } from './lib/models/validation-request.model';
export type { ValidationResponse, ValidationStatus, ValidationError } from './lib/models/validation-response.model';

// Version info for runtime inspection
export const LIBRARY_VERSION = '1.0.0';
export const LIBRARY_NAME = '@validator-lib/core';

// Configuration constants
export const DEFAULT_CONFIG = {
  cacheTTL: 300000,
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 5000,
  maxConcurrentRequests: 50,
  enableCaching: true,
  enablePerformanceMonitoring: true
} as const;

export type LibraryConfig = typeof DEFAULT_CONFIG;

// Type guards for runtime type checking
export function isValidationRequest(value: unknown): value is ValidationRequest {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'type' in value
  );
}

export function isValidationResponse<T = unknown>(value: unknown): value is ValidationResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'requestId' in value
  );
}

export function isValidationError(value: unknown): value is ValidationError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value
  );
}