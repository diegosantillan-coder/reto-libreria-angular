# @validator-lib

Librería Angular para validación de datos en tiempo real con servicio de terceros.

## Instalación

```bash
npm install @validator-lib
```

## Uso Básico

```typescript
import { ValidationService } from '@validator-lib';
import { ValidationRequest } from '@validator-lib';

@Component({
  selector: 'app-validator',
  template: `<button (click)="validate()">Validar</button>`
})
export class ValidatorComponent {
  constructor(private validator: ValidationService) {}

  async validate() {
    const request: ValidationRequest = {
      data: {
        documentNumber: '12345678',
        documentType: 'DNI'
      },
      context: {
        source: 'web',
        timestamp: Date.now()
      }
    };

    const response = await this.validator.validate(request);
    console.log('Validation result:', response.data);
  }
}
```

## Configuración

### Proveedores Requeridos

```typescript
import { provideValidationService } from '@validator-lib';

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideValidationService({
      apiEndpoint: 'https://api.validation-service.com/v1',
      apiKey: 'your-api-key',
      timeout: 5000,
      retryAttempts: 3,
      cacheTTL: 60000
    })
  ]
};
```

### Opciones de Configuración

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `apiEndpoint` | string | - | URL del servicio de validación |
| `apiKey` | string | - | Clave de API para autenticación |
| `timeout` | number | 5000 | Timeout de request en ms |
| `retryAttempts` | number | 3 | Número de reintentos en caso de error |
| `cacheTTL` | number | 60000 | TTL del cache en ms |

## API

### ValidationService

#### `validate(request: ValidationRequest): Promise<ValidationResponse>`

Valida los datos proporcionados contra el servicio de terceros.

#### `validateWithIdempotency(request: ValidationRequest, key?: string): Promise<ValidationResponse>`

Valida con clave de idempotencia para evitar operaciones duplicadas.

#### `healthCheck(): Promise<boolean>`

Verifica la disponibilidad del servicio de terceros.

### Modelos

#### ValidationRequest

```typescript
interface ValidationRequest<T = unknown> {
  data: T;
  context: ValidationContext;
  idempotencyKey?: string;
}

interface ValidationContext {
  source: 'web' | 'mobile' | 'api' | 'batch';
  timestamp: number;
  correlationId?: string;
}
```

#### ValidationResponse

```typescript
interface ValidationResponse<T = unknown> {
  status: 'success' | 'error' | 'pending';
  data?: T;
  error?: ValidationError;
  requestId: string;
  timestamp: number;
}
```

## Casos de Prueba

### Validación Exitosa

```typescript
const request: ValidationRequest = {
  data: { email: 'user@example.com' },
  context: { source: 'web', timestamp: Date.now() }
};

const response = await validator.validate(request);
// response.status === 'success'
// response.data.isValid === true
```

### Manejo de Errores

```typescript
try {
  const response = await validator.validate(request);
} catch (error) {
  if (error.status === 503) {
    // Servicio no disponible - reintentar más tarde
  } else if (error.status === 400) {
    // Solicitud inválida - corregir datos
  }
}
```

### Idempotencia

```typescript
const key = generateIdempotencyKey(request);

// Primera llamada
const response1 = await validator.validateWithIdempotency(request, key);

// Segunda llamada con misma clave - retorna cache
const response2 = await validator.validateWithIdempotency(request, key);
// response1.requestId === response2.requestId
```

## Pruebas

### Ejecutar Pruebas Unitarias

```bash
npm test
```

### Cobertura

```bash
npm run test:coverage
```

### Validación de Integración

```bash
npm run test:integration
```

## Rendimiento

- **Latencia**: < 200ms por solicitud
- **Throughput**: > 100 solicitudes/segundo
- **Cache**: Respuestas idempotentes cacheadas por defecto
- **Resiliencia**: Circuit breaker con reintento exponencial

## Guía de Contribución

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Requisitos

- TypeScript 5.4+
- Angular 20+
- Vitest para pruebas
- ESLint configurado

### Normas de Código

- Usar strict mode en TypeScript
- Cobertura mínima del 80%
- Documentar funciones públicas con JSDoc
- Tests unitarios para cada función exportada