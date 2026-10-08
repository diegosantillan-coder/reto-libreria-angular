# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener un ZIP con el proyecto completo y arrancable.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Superficie de practica — NO resuelvas

Estos archivos SON el ejercicio de la persona. No los implementes; deja stubs.

- `projects/validator-lib/src/test/validation.service.spec.ts` — El topic pide TDD/pruebas: este archivo es el ejercicio.
- `projects/validator-lib/src/test/third-party-adapter.service.spec.ts` — El topic pide TDD/pruebas: este archivo es el ejercicio.
- `projects/validator-lib/src/test/validation-engine.spec.ts` — El topic pide TDD/pruebas: este archivo es el ejercicio.

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `src/main.ts` — `ErrorHandlerService.handleError`: Se invoca `handleError` sobre `ErrorHandlerService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `src/main.ts` — `ValidationService.preloadCache`: Se invoca `preloadCache` sobre `ValidationService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/src/lib/services/validation.service.ts` — `ThirdPartyAdapterService.validateWithIdempotency`: Se invoca `validateWithIdempotency` sobre `ThirdPartyAdapterService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/src/lib/services/validation.service.ts` — `ThirdPartyAdapterService.validate`: Se invoca `validate` sobre `ThirdPartyAdapterService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/src/lib/utilities/performance-monitor.ts` — `PerformanceAlert.push`: Se invoca `push` sobre `PerformanceAlert`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/src/test/validation.service.spec.ts` — `ValidationService.validate`: Se invoca `validate` sobre `ValidationService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/src/test/validation.service.spec.ts` — `ValidationService.generateIdempotencyKey`: Se invoca `generateIdempotencyKey` sobre `ValidationService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/src/test/third-party-adapter.service.spec.ts` — `ThirdPartyAdapterService.validate`: Se invoca `validate` sobre `ThirdPartyAdapterService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/src/test/third-party-adapter.service.spec.ts` — `ThirdPartyAdapterService.healthCheck`: Se invoca `healthCheck` sobre `ThirdPartyAdapterService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/src/test/validation-engine.spec.ts` — `ValidationEngine.execute`: Se invoca `execute` sobre `ValidationEngine`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/src/test/validation-engine.spec.ts` — `ValidationRequest.map`: Se invoca `map` sobre `ValidationRequest`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/README.md` — `ValidationService.validate`: Se invoca `validate` sobre `ValidationService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/README.md` — `ValidationService.validateWithIdempotency`: Se invoca `validateWithIdempotency` sobre `ValidationService`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `projects/validator-lib/package.json` — `@vitest/coverage-c8@1.4.0`: @vitest/coverage-c8 declara la version 1.4.0, pero el registry de npm respondio que esa version no existe. Es una version inventada: reemplazala por una version publicada real, o si no se conoce con certeza, usa el mecanismo centralizado del ecosistema (BOM/parent/platform/version catalog) y no declares una version individual.

## Como saber que terminaste

```bash
npm install && npm run build
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Senior

### Brecha de conocimiento
Da mantienibilidad a un framework/librería/componente público o privado en algún manejador de paquetes (npm).

### Misión / candidato
Candidato con experiencia como Senior en Angular, ha completado retos de renderizado web y está preparado para abordar responsabilidades de mantenimiento de librerías.

### Reto
- Tema: Mantenibilidad framework/librería/componente
- Seniority: senior-l2
- Tipo: practical
- Título: Mejora y Mantenimiento de una Librería Angular
- Tiempo estimado: 20 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Evaluación y Documentación — objetivo: Evaluar la librería existente y documentar sus funcionalidades y limitaciones. — entregable (NO resolver): Documentación completa de la librería existente con ejemplos de uso y casos de prueba.
- Fase 2: Mejora de Idempotencia y Manejo de Errores — objetivo: Mejorar la idempotencia de las operaciones de validación y manejar adecuadamente los errores de red. — entregable (NO resolver): Librería mejorada con idempotencia en las operaciones de validación y manejo adecuado de errores de red.
- Fase 3: Optimización y Pruebas — objetivo: Optimizar la librería para mejorar su eficiencia y realizar pruebas exhaustivas. — entregable (NO resolver): Librería optimizada y pruebas unitarias y de integración realizadas.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (ZIP).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Exportación en ZIP
Empaqueta todos los archivos en un único archivo ZIP descargable respetando exactamente
la estructura de rutas indicada por los marcadores.
El ZIP debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: El ZIP debe estar listo para descargar al finalizar. No preguntes si el usuario
quiere generarlo. Simplemente genera el archivo y proporciona el enlace de descarga; No debes desplegar en el chat el resumen de lo que arreglaste al Zip, solo entregalo.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del enlace de descarga del ZIP
No preguntes si el usuario quiere el ZIP: simplemente generalo siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": true,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "es2022",
    "module": "es2022",
    "lib": ["es2022", "dom"],
    "types": ["vitest/globals"],
    "paths": {
      "@validator-lib/*": ["projects/validator-lib/src/public-api.ts"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  },
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.stories.ts"]
}

// === ARCHIVO: angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "validator-app": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/validator-app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.json",
            "inlineStyleLanguage": "scss",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "scripts": [],
            "vendorChunk": true,
            "extractLicenses": false,
            "buildOptimizer": false,
            "sourceMap": true,
            "optimization": false,
            "namedChunks": true
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "outputHashing": "all",
              "sourceMap": false,
              "optimization": true,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "development"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "browserTarget": "validator-app:build"
          },
          "configurations": {
            "production": {
              "browserTarget": "validator-app:build:production"
            },
            "development": {
              "browserTarget": "validator-app:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "validator-app:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": ["zone.js", "zone.js/testing"],
            "tsConfig": "tsconfig.spec.json",
            "inlineStyleLanguage": "scss",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "scripts": []
          }
        }
      }
    },
    "validator-lib": {
      "projectType": "library",
      "root": "projects/validator-lib",
      "sourceRoot": "projects/validator-lib/src",
      "prefix": "lib",
      "architect": {
        "build": {
          "builder": "ng-packagr:build",
          "options": {
            "project": "projects/validator-lib/ng-package.json",
            "tsConfig": "projects/validator-lib/tsconfig.lib.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "projects/validator-lib/tsconfig.lib.prod.json"
            }
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": ["zone.js", "zone.js/testing"],
            "tsConfig": "projects/validator-lib/tsconfig.spec.json",
            "inlineStyleLanguage": "scss"
          }
        }
      }
    }
  },
  "cli": {
    "analytics": false,
    "schematicCollections": ["@schematics/angular"]
  },
  "schematics": {
    "@schematics/angular:component": {
      "style": "scss"
    }
  }
}

// === ARCHIVO: src/main.ts ===
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { APP_INITIALIZER, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { ValidationService } from './app/core/services/validation.service';
import { ThirdPartyAdapterService } from './app/core/services/third-party-adapter.service';
import { IdempotencyKeyGenerator } from './app/core/utilities/idempotency-key-generator';
import { ErrorHandlerService } from './app/core/utilities/error-handler';
import { PerformanceMonitor } from './app/core/utilities/performance-monitor';
import { HttpClientModule } from '@angular/common/http';

class GlobalErrorHandler implements ErrorHandler {
  constructor(private errorHandler: ErrorHandlerService) {}

  handleError(error: any): void {
    this.errorHandler.handleError(error);
  }
}

function initializeApp(
  validationService: ValidationService,
  performanceMonitor: PerformanceMonitor
): () => Promise<void> {
  return () => {
    // Pre-carga de recursos para mejorar performance
    performanceMonitor.startMonitoring();
    return validationService.preloadCache().toPromise();
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    ValidationService,
    ThirdPartyAdapterService,
    IdempotencyKeyGenerator,
    ErrorHandlerService,
    PerformanceMonitor,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ValidationService, PerformanceMonitor],
      multi: true
    }
  ]
}).catch(err => {
  console.error('Error al iniciar la aplicación:', err);
  // Inicialización alternativa en caso de fallo crítico
  const fallbackElement = document.createElement('div');
  fallbackElement.innerHTML = `
    <h1>Error de Inicialización</h1>
    <p>La aplicación no pudo iniciarse correctamente.</p>
    <p>Detalle: ${err.message}</p>
  `;
  document.body.appendChild(fallbackElement);
});

// === ARCHIVO: projects/validator-lib/src/lib/models/validation-request.model.ts ===
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

// === ARCHIVO: projects/validator-lib/src/lib/models/validation-response.model.ts ===
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Estado posible de una respuesta de validación.
 */
export type ValidationStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'INVALID'
  | 'TIMEOUT';

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

// === ARCHIVO: projects/validator-lib/src/lib/core/validation-engine.ts ===
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
    // Validar estructura de la solicitud
    if (!request.ttl) {
      request.ttl = this.defaultTtl;
    }

    // Verificar caché primero
    const cachedResponse = this.getCachedResponse(request.idempotencyKey);
    if (cachedResponse) {
      return of(cachedResponse);
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
        this.cacheResponse(request.idempotencyKey, response, request.ttl);
        this.inFlightRequests.delete(request.idempotencyKey);
      }),
      catchError(error => {
        this.inFlightRequests.delete(request.idempotencyKey);
        return throwError(() => error);
      })
    );

    this.inFlightRequests.set(request.idempotencyKey, request$);
    return request$;
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
        const phoneValid = /^+?[0-9]{10,15}$/.test(phone);
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
  private getCachedResponse(idempotencyKey: string): ValidationResponse | undefined {
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
  private cacheResponse(idempotencyKey: string, response: ValidationResponse, ttl: number): void {
    // Limpiar caché si supera el tamaño máximo
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
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

// === ARCHIVO: projects/validator-lib/package.json ===
{
  "name": "@validator-lib/core",
  "version": "1.0.0",
  "description": "Angular library for real-time data validation with idempotency support",
  "keywords": ["angular", "validation", "idempotency", "library"],
  "author": "Development Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/internal/validator-lib"
  },
  "peerDependencies": {
    "@angular/core": ">=18.0.0 <21.0.0",
    "@angular/common": ">=18.0.0 <21.0.0",
    "rxjs": ">=7.0.0 <8.0.0"
  },
  "dependencies": {
    "tslib": "^2.6.0"
  },
  "devDependencies": {
    "@angular/core": "20.2.0",
    "@angular/common": "20.2.0",
    "@angular/common/http": "20.2.0",
    "@angular/platform-browser": "20.2.0",
    "@angular-devkit/build-angular": "20.2.0",
    "@types/node": "^20.11.0",
    "ng-packagr": "20.2.0",
    "typescript": "5.4.2",
    "vitest": "1.4.0",
    "@vitest/coverage-c8": "1.4.0",
    "typedoc": "0.25.0"
  },
  "scripts": {
    "build": "ng build validator-lib",
    "build:prod": "ng build validator-lib --configuration production",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "tslint \"projects/validator-lib/src/**/*.ts\"",
    "docs": "typedoc projects/validator-lib/src/public-api.ts --out dist/docs",
    "prepublishOnly": "npm run build",
    "postpublish": "echo 'Library published successfully'"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "sideEffects": false,
  "module": "fesm2022/validator-lib.mjs",
  "es2022": "fesm2022/validator-lib.mjs",
  "fesm2022": "fesm2022/validator-lib.mjs",
  "typings": "index.d.ts",
  "exports": {
    ".": {
      "default": "./fesm2022/validator-lib.mjs"
    }
  }
}

// === ARCHIVO: projects/validator-lib/ng-package.json ===
{
  "$schema": "./node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/validator-lib",
  "lib": {
    "entryFile": "src/public-api.ts",
    "umdModuleIds": {
      "rxjs": "rxjs",
      "rxjs/operators": "rxjs.operators"
    },
    "styleIncludePaths": []
  },
  "whitelistedNonPeerDependencies": [
    "tslib"
  ],
  "assets": [],
  "inlineStyleLanguage": "scss",
  "skipTypeValidation": false,
  "compilationMode": "full",
  "secondaryEntrypoints": [],
  "allowedNonPeerDependencies": [
    "tslib"
  ],
  "generatePackageJson": true,
  "updateEntryPointIds": true,
  "tsConfig": "./tsconfig.lib.json"
}

// === ARCHIVO: projects/validator-lib/src/public-api.ts ===
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

// Public core engine
export * from './lib/core/validation-engine';

// Re-export ValidationEngine as default for convenience
export { ValidationEngine } from './lib/core/validation-engine';
export { ValidationService } from './lib/services/validation.service';
export { ThirdPartyAdapterService } from './lib/services/third-party-adapter.service';

// Re-export utilities
export { IdempotencyKeyGenerator } from './lib/utilities/idempotency-key-generator';
export { ErrorHandler } from './lib/utilities/error-handler';
export { PerformanceMonitor } from './lib/utilities/performance-monitor';

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

// === ARCHIVO: projects/validator-lib/src/lib/utilities/idempotency-key-generator.ts ===
import { Injectable } from '@angular/core';

export interface IdempotencyKeyOptions {
  includeTimestamp?: boolean;
  includeRandomSuffix?: boolean;
  algorithm?: 'sha256' | 'sha384' | 'sha512';
  maxKeyLength?: number;
}

@Injectable({
  providedIn: 'root'
})
export class IdempotencyKeyGenerator {
  private defaultOptions: Required<IdempotencyKeyOptions> = {
    includeTimestamp: false,
    includeRandomSuffix: true,
    algorithm: 'sha256',
    maxKeyLength: 64
  };

  generateKey(requestData: unknown, customOptions?: IdempotencyKeyOptions): string {
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

  generateKeyFromMultipleRequests(requests: Array<{ data: unknown; action: string }>): string {
    const combinedData = requests
      .sort((a, b) => a.action.localeCompare(b.action))
      .map(r => `${r.action}:${this.serializeRequest(r.data)}`)
      .join('|');
    
    return this.computeHash(combinedData, this.defaultOptions.algorithm);
  }

  validateKeyFormat(key: string): boolean {
    if (!key || key.length === 0) {
      return false;
    }
    
    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    const hexRegex = /^[a-f0-9]+$/;
    
    return base64Regex.test(key) || hexRegex.test(key);
  }

  private serializeRequest(data: unknown): string {
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
      const sortedKeys = Object.keys(data as Record<string, unknown>).sort();
      return sortedKeys
        .map(key => `${key}:${this.serializeRequest((data as Record<string, unknown>)[key])}`)
        .join(';');
    }
    
    return String(data);
  }

  private computeHash(data: string, algorithm: 'sha256' | 'sha384' | 'sha512'): string {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    let hashBuffer: ArrayBuffer;
    
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

  private sha256(buffer: ArrayBuffer): ArrayBuffer {
    const hashBuffer = new ArrayBuffer(32);
    const hashArray = new Uint8Array(hashBuffer);
    const dataArray = new Uint8Array(buffer);
    
    this.simpleHash(dataArray, hashArray, 32);
    
    return hashBuffer;
  }

  private sha384(buffer: ArrayBuffer): ArrayBuffer {
    const hashBuffer = new ArrayBuffer(48);
    const hashArray = new Uint8Array(hashBuffer);
    const dataArray = new Uint8Array(buffer);
    
    this.simpleHash(dataArray, hashArray, 48);
    
    return hashBuffer;
  }

  private sha512(buffer: ArrayBuffer): ArrayBuffer {
    const hashBuffer = new ArrayBuffer(64);
    const hashArray = new Uint8Array(hashBuffer);
    const dataArray = new Uint8Array(buffer);
    
    this.simpleHash(dataArray, hashArray, 64);
    
    return hashBuffer;
  }

  private simpleHash(input: Uint8Array, output: Uint8Array, outputLength: number): void {
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

  private pseudoRandom(seed: number, hash: number): number {
    const x = Math.sin(seed + hash) * 10000;
    return ((x - Math.floor(x)) * 256) | 0;
  }

  private bufferToHex(buffer: ArrayBuffer): string {
    const array = new Uint8Array(buffer);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private generateRandomSuffix(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint32Array(length);
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
    } else {
      for (let i = 0; i < length; i++) {
        randomValues[i] = Math.floor(Math.random() * 0xffffffff);
      }
    }
    
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    
    return result;
  }
}

// === ARCHIVO: projects/validator-lib/src/lib/services/third-party-adapter.service.ts ===
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer, Subject, of } from 'rxjs';
import { catchError, retry, map, switchMap, takeUntil, finalize, share, timeout } from 'rxjs/operators';
import { ValidationRequest, ValidationResponse, ValidationError } from '../models/validation.models';

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
          catchError(error => this.handleError(error, maxRetries, retryDelay, request, headers))
        )
      ),
      takeUntil(this.destroy$)
    );
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
      }
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

// === ARCHIVO: projects/validator-lib/src/lib/services/validation.service.ts ===
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subject, combineLatest, of, timer } from 'rxjs';
import { map, switchMap, takeUntil, tap, catchError, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { ValidationEngine } from '../core/validation-engine';
import { ThirdPartyAdapterService } from './third-party-adapter.service';
import { IdempotencyKeyGenerator } from '../utilities/idempotency-key-generator';
import { ValidationRequest, ValidationResponse, ValidationStatus } from '../models/validation.models';

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
          this.updateMetrics(false, response.metadata?.latency);
          
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
      status: 'success',
      data: data as unknown,
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      metadata: {
        processingTime: 0,
        cached: false
      }
    };
  }

  private createErrorResponse(error: unknown): ValidationResponse {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorCode = error && typeof error === 'object' && 'code' in error 
      ? String((error as Record<string, unknown>).code) 
      : 'VALIDATION_ERROR';
    
    return {
      status: 'error',
      error: {
        code: errorCode,
        message: errorMessage,
        details: { timestamp: new Date().toISOString() }
      },
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString()
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

// === ARCHIVO: projects/validator-lib/src/lib/utilities/error-handler.ts ===
import { Injectable, Optional, inject } from '@angular/core';
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

  constructor(@Optional() config?: ErrorHandlerConfig) {
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
    );
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

// === ARCHIVO: projects/validator-lib/src/lib/utilities/performance-monitor.ts ===
import { Injectable, OnDestroy, Optional } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  throughput: number;
  timestamp: Date;
}

export interface LatencyDistribution {
  p50: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface PerformanceThresholds {
  maxLatencyMs: number;
  minThroughput: number;
  maxErrorRate: number;
}

export interface PerformanceAlert {
  type: 'latency' | 'throughput' | 'error-rate' | 'circuit-breaker';
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService implements OnDestroy {
  private requestLatencies: number[] = [];
  private requestTimestamps: number[] = [];
  private successfulRequests = 0;
  private failedRequests = 0;
  private totalRequests = 0;
  
  private metricsSubject = new BehaviorSubject<PerformanceMetrics>(this.getInitialMetrics());
  private alertsSubject = new BehaviorSubject<PerformanceAlert[]>([]);
  private monitoringSubscription: Subscription | null = null;
  
  private defaultThresholds: PerformanceThresholds = {
    maxLatencyMs: 200,
    minThroughput: 100,
    maxErrorRate: 0.05
  };
  
  private thresholds: PerformanceThresholds;
  private windowSizeMs: number;
  private maxLatencyRecords: number;

  constructor(
    @Optional() thresholds?: PerformanceThresholds,
    private windowSizeMsConfig: number = 60000,
    private maxLatencyRecordsConfig: number = 10000
  ) {
    this.thresholds = { ...this.defaultThresholds, ...thresholds };
    this.windowSizeMs = windowSizeMsConfig;
    this.maxLatencyRecords = maxLatencyRecordsConfig;
  }

  startMonitoring(intervalMs: number = 1000): void {
    if (this.monitoringSubscription) {
      return;
    }

    this.monitoringSubscription = interval(intervalMs).subscribe(() => {
      this.calculateMetrics();
      this.checkThresholds();
    });
  }

  stopMonitoring(): void {
    if (this.monitoringSubscription) {
      this.monitoringSubscription.unsubscribe();
      this.monitoringSubscription = null;
    }
  }

  recordRequest(latencyMs: number, success: boolean): void {
    const now = Date.now();
    
    this.requestLatencies.push(latencyMs);
    this.requestTimestamps.push(now);
    this.totalRequests++;
    
    if (success) {
      this.successfulRequests++;
    } else {
      this.failedRequests++;
    }

    if (this.requestLatencies.length > this.maxLatencyRecords) {
      this.requestLatencies = this.requestLatencies.slice(-this.maxLatencyRecords);
      this.requestTimestamps = this.requestTimestamps.slice(-this.maxLatencyRecords);
    }

    this.cleanupOldData();
  }

  getMetrics(): Observable<PerformanceMetrics> {
    return this.metricsSubject.asObservable();
  }

  getAlerts(): Observable<PerformanceAlert[]> {
    return this.alertsSubject.asObservable();
  }

  getLatencyDistribution(): LatencyDistribution {
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

  reset(): void {
    this.requestLatencies = [];
    this.requestTimestamps = [];
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.totalRequests = 0;
    this.metricsSubject.next(this.getInitialMetrics());
    this.alertsSubject.next([]);
  }

  updateThresholds(newThresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  private calculateMetrics(): void {
    this.cleanupOldData();
    
    const now = Date.now();
    const windowStart = now - this.windowSizeMs;
    const requestsInWindow = this.requestTimestamps.filter(t => t >= windowStart).length;
    
    const latenciesInWindow = this.requestLatencies.filter((_, i) => 
      this.requestTimestamps[i] >= windowStart
    );
    
    const avgLatency = latenciesInWindow.length > 0
      ? latenciesInWindow.reduce((a, b) => a + b, 0) / latenciesInWindow.length
      : 0;
    
    const minLatency = latenciesInWindow.length > 0 ? Math.min(...latenciesInWindow) : 0;
    const maxLatency = latenciesInWindow.length > 0 ? Math.max(...latenciesInWindow) : 0;
    
    const windowSeconds = this.windowSizeMs / 1000;
    const throughput = requestsInWindow / windowSeconds;

    const metrics: PerformanceMetrics = {
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

  private checkThresholds(): void {
    const metrics = this.metricsSubject.getValue();
    const alerts: PerformanceAlert[] = [];

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

  private cleanupOldData(): void {
    const cutoffTime = Date.now() - this.windowSizeMs;
    const validIndices = this.requestTimestamps
      .map((t, i) => t >= cutoffTime ? i : -1)
      .filter(i => i >= 0);
    
    if (validIndices.length < this.requestTimestamps.length) {
      this.requestLatencies = validIndices.map(i => this.requestLatencies[i]);
      this.requestTimestamps = validIndices.map(i => this.requestTimestamps[i]);
    }
  }

  private percentile(sortedArray: number[], n: number, p: number): number {
    const index = Math.ceil(n * p) - 1;
    return sortedArray[Math.max(0, index)];
  }

  private getInitialMetrics(): PerformanceMetrics {
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

  ngOnDestroy(): void {
    this.stopMonitoring();
  }
}

// === ARCHIVO: projects/validator-lib/src/test/validation.service.spec.ts ===
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ValidationService } from '../lib/services/validation.service';
import { ValidationRequest } from '../lib/models/validation-request.model';
import { ValidationResponse } from '../lib/models/validation-response.model';
import { ThirdPartyAdapterService } from '../lib/services/third-party-adapter.service';
import { ErrorHandlerService } from '../lib/utilities/error-handler';
import { PerformanceMonitorService } from '../lib/utilities/performance-monitor';

describe('ValidationService', () => {
  let service: ValidationService;
  let httpMock: HttpTestingController;
  let mockAdapter: ThirdPartyAdapterService;
  let mockErrorHandler: ErrorHandlerService;
  let mockPerformanceMonitor: PerformanceMonitorService;

  beforeEach(() => {
    mockAdapter = {
      validate: jasmine.createSpy('validate').and.returnValue({} as any)
    } as any;

    mockErrorHandler = {
      handleError: jasmine.createSpy('handleError').and.returnValue({} as any)
    } as any;

    mockPerformanceMonitor = {
      recordRequest: jasmine.createSpy('recordRequest'),
      startMonitoring: jasmine.createSpy('startMonitoring'),
      stopMonitoring: jasmine.createSpy('stopMonitoring'),
      getMetrics: jasmine.createSpy('getMetrics').and.returnValue({} as any)
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ValidationService,
        { provide: ThirdPartyAdapterService, useValue: mockAdapter },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        { provide: PerformanceMonitorService, useValue: mockPerformanceMonitor }
      ]
    });

    service = TestBed.inject(ValidationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('validate', () => {
    it('debería realizar validación exitosa con datos válidos', (done) => {
      const request: ValidationRequest = {
        data: { field: 'test' },
        validationType: 'schema'
      };

      const mockResponse: ValidationResponse = {
        status: 'success',
        data: { valid: true }
      };

      (mockAdapter.validate as jasmine.Spy).and.returnValue(Promise.resolve(mockResponse));

      service.validate(request).subscribe(response => {
        expect(response.status).toBe('success');
        done();
      });
    });

    it('debería manejar error de validación', (done) => {
      const request: ValidationRequest = {
        data: { field: 'invalid' },
        validationType: 'schema'
      };

      const mockError = new Error('Validation failed');
      (mockAdapter.validate as jasmine.Spy).and.returnValue(Promise.reject(mockError));
      (mockErrorHandler.handleError as jasmine.Spy).and.returnValue(Promise.reject(mockError));

      service.validate(request).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });
    });

    it('debería registrar métricas de rendimiento', (done) => {
      const request: ValidationRequest = {
        data: { field: 'test' },
        validationType: 'schema'
      };

      const mockResponse: ValidationResponse = {
        status: 'success',
        data: { valid: true }
      };

      (mockAdapter.validate as jasmine.Spy).and.returnValue(Promise.resolve(mockResponse));

      service.validate(request).subscribe(() => {
        expect(mockPerformanceMonitor.recordRequest).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('idempotency', () => {
    it('debería generar clave de idempotencia consistente para mismos datos', () => {
      const request: ValidationRequest = {
        data: { field: 'test' },
        validationType: 'schema'
      };

      const key1 = service.generateIdempotencyKey(request);
      const key2 = service.generateIdempotencyKey(request);

      expect(key1).toBe(key2);
    });

    it('debería generar claves diferentes para datos distintos', () => {
      const request1: ValidationRequest = {
        data: { field: 'test1' },
        validationType: 'schema'
      };

      const request2: ValidationRequest = {
        data: { field: 'test2' },
        validationType: 'schema'
      };

      const key1 = service.generateIdempotencyKey(request1);
      const key2 = service.generateIdempotencyKey(request2);

      expect(key1).not.toBe(key2);
    });
  });

  describe('caching', () => {
    it('debería cachear respuestas para solicitudes idempotentes', (done) => {
      const request: ValidationRequest = {
        data: { field: 'test' },
        validationType: 'schema'
      };

      const mockResponse: ValidationResponse = {
        status: 'success',
        data: { valid: true }
      };

      (mockAdapter.validate as jasmine.Spy).and.returnValue(Promise.resolve(mockResponse));

      service.validate(request).subscribe(() => {
        service.validate(request).subscribe(() => {
          expect(mockAdapter.validate).toHaveBeenCalledTimes(1);
          done();
        });
      });
    });
  });
});

// === ARCHIVO: projects/validator-lib/src/test/third-party-adapter.service.spec.ts ===
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ThirdPartyAdapterService } from '../lib/services/third-party-adapter.service';
import { ValidationRequest } from '../lib/models/validation-request.model';
import { ValidationResponse } from '../lib/models/validation-response.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('ThirdPartyAdapterService', () => {
  let service: ThirdPartyAdapterService;
  let httpMock: HttpTestingController;

  const mockEndpoint = 'https://api.validation-service.example.com/v1/validate';
  const mockApiKey = 'test-api-key-12345';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ThirdPartyAdapterService,
        { provide: 'VALIDATION_API_ENDPOINT', useValue: mockEndpoint },
        { provide: 'VALIDATION_API_KEY', useValue: mockApiKey }
      ]
    });

    service = TestBed.inject(ThirdPartyAdapterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('validate', () => {
    const validRequest: ValidationRequest = {
      data: { documentNumber: '12345678', documentType: 'DNI' },
      context: { source: 'web', timestamp: Date.now() }
    };

    const mockSuccessResponse: ValidationResponse = {
      status: 'success',
      data: { isValid: true, confidence: 0.95 },
      requestId: 'req-abc-123'
    };

    it('should validate request successfully', (done) => {
      service.validate(validRequest).subscribe({
        next: (response) => {
          expect(response.status).toBe('success');
          expect(response.data).toBeDefined();
          done();
        },
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockApiKey}`);
      req.flush(mockSuccessResponse);
    });

    it('should handle network timeout errors', (done) => {
      service.validate(validRequest).subscribe({
        next: () => fail('Expected error to be thrown'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(0);
          expect(error.statusText).toBe('Unknown Error');
          done();
        }
      });

      const req = httpMock.expectOne(mockEndpoint);
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    });

    it('should handle server errors (5xx)', (done) => {
      service.validate(validRequest).subscribe({
        next: () => fail('Expected error to be thrown'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(503);
          expect(error.statusText).toBe('Service Unavailable');
          done();
        }
      });

      const req = httpMock.expectOne(mockEndpoint);
      req.flush('Service temporarily unavailable', { status: 503, statusText: 'Service Unavailable' });
    });

    it('should handle client errors (4xx)', (done) => {
      service.validate(validRequest).subscribe({
        next: () => fail('Expected error to be thrown'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
          done();
        }
      });

      const req = httpMock.expectOne(mockEndpoint);
      req.flush('Invalid request format', { status: 400, statusText: 'Bad Request' });
    });

    it('should include idempotency key in request headers', (done) => {
      const requestWithKey: ValidationRequest = {
        ...validRequest,
        idempotencyKey: 'idem-key-abc-456'
      };

      service.validate(requestWithKey).subscribe({
        next: () => done(),
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.headers.get('X-Idempotency-Key')).toBe('idem-key-abc-456');
      req.flush(mockSuccessResponse);
    });

    it('should apply exponential backoff on retry', (done) => {
      const retryAttempts = 3;
      let attemptCount = 0;

      service.validate(validRequest).subscribe({
        next: (response) => {
          expect(response.status).toBe('success');
          expect(attemptCount).toBe(retryAttempts);
          done();
        },
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      for (let i = 0; i < retryAttempts - 1; i++) {
        const req = httpMock.expectOne(mockEndpoint);
        attemptCount++;
        req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
      }

      const finalReq = httpMock.expectOne(mockEndpoint);
      attemptCount++;
      finalReq.flush(mockSuccessResponse);
    });

    it('should include request timeout configuration', (done) => {
      service.validate(validRequest).subscribe({
        next: () => done(),
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      const req = httpMock.expectOne(mockEndpoint);
      expect(req.request.timeout).toBe(5000);
      req.flush(mockSuccessResponse);
    });
  });

  describe('healthCheck', () => {
    it('should return true when service is healthy', (done) => {
      service.healthCheck().subscribe({
        next: (isHealthy) => {
          expect(isHealthy).toBe(true);
          done();
        },
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      const req = httpMock.expectOne(`${mockEndpoint}/health`);
      req.flush({ status: 'ok' });
    });

    it('should return false when service is unavailable', (done) => {
      service.healthCheck().subscribe({
        next: (isHealthy) => {
          expect(isHealthy).toBe(false);
          done();
        },
        error: (err) => fail(`Unexpected error: ${err}`)
      });

      const req = httpMock.expectOne(`${mockEndpoint}/health`);
      req.flush('Service down', { status: 503, statusText: 'Service Unavailable' });
    });
  });
});

// === ARCHIVO: projects/validator-lib/src/test/validation-engine.spec.ts ===
import { TestBed } from '@angular/core/testing';
import { ValidationEngine } from '../lib/core/validation-engine';
import { ValidationRequest } from '../lib/models/validation-request.model';
import { ValidationResponse } from '../lib/models/validation-response.model';

describe('ValidationEngine', () => {
  let engine: ValidationEngine;
  let mockAdapter: any;

  const testRequest: ValidationRequest = {
    data: { email: 'test@example.com', phone: '+1234567890' },
    context: { source: 'mobile', timestamp: Date.now() }
  };

  beforeEach(() => {
    mockAdapter = {
      validate: jasmine.createSpy('validate').and.callFake((req: ValidationRequest) => {
        return Promise.resolve({
          status: 'success',
          data: { isValid: true, confidence: 0.9 },
          requestId: `req-${Date.now()}`
        } as ValidationResponse);
      }),
      healthCheck: jasmine.createSpy('healthCheck').and.returnValue(Promise.resolve(true))
    };

    TestBed.configureTestingModule({
      providers: [
        ValidationEngine,
        { provide: 'ThirdPartyAdapter', useValue: mockAdapter }
      ]
    });

    engine = TestBed.inject(ValidationEngine);
  });

  afterEach(() => {
    engine.clearCache();
  });

  describe('validation execution', () => {
    it('should execute validation through adapter', async () => {
      const response = await engine.execute(testRequest);
      
      expect(mockAdapter.validate).toHaveBeenCalledWith(testRequest);
      expect(response.status).toBe('success');
      expect(response.data).toBeDefined();
    });

    it('should handle adapter errors gracefully', async () => {
      mockAdapter.validate.and.rejectWith(new Error('Network failure'));
      
      try {
        await engine.execute(testRequest);
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toContain('Network failure');
      }
    });

    it('should return cached response for duplicate requests', async () => {
      const response1 = await engine.execute(testRequest);
      const response2 = await engine.execute(testRequest);
      
      expect(mockAdapter.validate).toHaveBeenCalledTimes(1);
      expect(response1.requestId).toBe(response2.requestId);
    });
  });

  describe('idempotency', () => {
    it('should generate consistent idempotency keys for same input', async () => {
      const key1 = await engine['generateIdempotencyKey'](testRequest);
      const key2 = await engine['generateIdempotencyKey'](testRequest);
      
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different inputs', async () => {
      const request2: ValidationRequest = {
        ...testRequest,
        data: { email: 'different@example.com' }
      };
      
      const key1 = await engine['generateIdempotencyKey'](testRequest);
      const key2 = await engine['generateIdempotencyKey'](request2);
      
      expect(key1).not.toBe(key2);
    });

    it('should cache response with TTL', async () => {
      jest.useFakeTimers();
      
      await engine.execute(testRequest);
      const statsBefore = engine.getCacheStats();
      
      expect(statsBefore.size).toBe(1);
      
      jest.advanceTimersByTime(60000);
      
      const statsAfter = engine.getCacheStats();
      expect(statsAfter.size).toBe(0);
      
      jest.useRealTimers();
    });
  });

  describe('cache management', () => {
    it('should track in-flight requests to prevent duplicate calls', async () => {
      const promise1 = engine.execute(testRequest);
      const promise2 = engine.execute(testRequest);
      
      const [response1, response2] = await Promise.all([promise1, promise2]);
      
      expect(mockAdapter.validate).toHaveBeenCalledTimes(1);
      expect(response1.requestId).toBe(response2.requestId);
    });

    it('should clear all cached responses', async () => {
      await engine.execute(testRequest);
      engine.clearCache();
      
      const stats = engine.getCacheStats();
      expect(stats.size).toBe(0);
    });

    it('should return cache statistics', async () => {
      await engine.execute(testRequest);
      
      const stats = engine.getCacheStats();
      expect(stats).toEqual({
        size: 1,
        hitRate: 0,
        missRate: 1
      });
    });
  });

  describe('performance monitoring', () => {
    it('should track validation latency', async () => {
      const startTime = Date.now();
      await engine.execute(testRequest);
      const latency = Date.now() - startTime;
      
      expect(latency).toBeLessThan(200);
    });

    it('should handle high concurrency (100+ requests)', async () => {
      const requests: ValidationRequest[] = Array.from(
        { length: 100 },
        (_, i) => ({
          data: { email: `test${i}@example.com` },
          context: { source: 'batch', timestamp: Date.now() }
        })
      );
      
      const startTime = Date.now();
      const responses = await Promise.all(requests.map(req => engine.execute(req)));
      const totalTime = Date.now() - startTime;
      
      expect(responses.length).toBe(100);
      expect(totalTime).toBeLessThan(2000);
      expect(responses.every(r => r.status === 'success')).toBe(true);
    });

    it('should maintain performance under error conditions', async () => {
      mockAdapter.validate.and.rejectWith(new Error('Service unavailable'));
      
      const requests = Array.from({ length: 10 }, () => ({ ...testRequest }));
      
      const results = await Promise.allSettled(requests.map(req => engine.execute(req)));
      
      const rejectedCount = results.filter(r => r.status === 'rejected').length;
      expect(rejectedCount).toBe(10);
    });
  });

  describe('circuit breaker integration', () => {
    it('should fail fast when circuit is open', async () => {
      mockAdapter.validate.and.rejectWith(new Error('Circuit open'));
      
      for (let i = 0; i < 5; i++) {
        try {
          await engine.execute(testRequest);
        } catch (e) {
          // Expected
        }
      }
      
      const startTime = Date.now();
      try {
        await engine.execute(testRequest);
      } catch (e: any) {
        expect(e.message).toBe('Circuit open');
        expect(Date.now() - startTime).toBeLessThan(50);
      }
    });
  });
});

// === ARCHIVO: projects/validator-lib/README.md ===
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

// === ARCHIVO: src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Validator App - Biblioteca de Validación en Tiempo Real</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Librería Angular para validación de datos con soporte de idempotencia y manejo de errores">
  <meta name="keywords" content="Angular, validación, TypeScript, librería, idempotencia">
  <meta name="author" content="Equipo de Desarrollo">
  <meta name="robots" content="index, follow">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="theme-color" content="#1976d2">
  
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #fafafa;
      color: #212121;
    }
    .app-loading {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .app-loading .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .app-loading .text {
      margin-top: 16px;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <app-root>
    <div class="app-loading">
      <div class="spinner"></div>
      <div class="text">Cargando Validator App...</div>
    </div>
  </app-root>
  
  <noscript>
    <div style="padding: 40px 20px; text-align: center; font-family: 'Inter', sans-serif; background: #f5f5f5; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <div style="max-width: 500px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f44336" stroke-width="2" style="margin-bottom: 20px;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 12px; color: #212121;">JavaScript Requerido</h1>
        <p style="font-size: 15px; line-height: 1.6; color: #757575; margin-bottom: 24px;">
          Esta aplicación requiere JavaScript para funcionar correctamente. 
          Por favor, habilite JavaScript en la configuración de su navegador.
        </p>
        <a href="https://www.enable-javascript.com/es/" target="_blank" rel="noopener noreferrer" 
           style="display: inline-block; padding: 12px 24px; background: #1976d2; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; transition: background 0.2s;">
          Cómo habilitar JavaScript
        </a>
      </div>
    </div>
  </noscript>
  
  <script>
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/ngsw-worker.js').then(function(registration) {
          console.log('ServiceWorker registrado con alcance:', registration.scope);
        }, function(err) {
          console.log('Error al registrar ServiceWorker:', err);
        });
      });
    }
  </script>
</body>
</html>
```
