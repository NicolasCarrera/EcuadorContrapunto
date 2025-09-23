# Ecuador Contrapunto

Una aplicación web para la generación automática de guiones de noticias con diálogos y videos, utilizando inteligencia artificial para crear contenido multimedia interactivo.

## Función Principal

Ecuador Contrapunto permite a los usuarios generar guiones de noticias basados en consultas de búsqueda. La aplicación integra servicios de IA para crear diálogos entre personajes, subir videos y generar videos personalizados para cada diálogo. Incluye autenticación de usuarios y una interfaz intuitiva para gestionar el contenido.

Características clave:
- Generación automática de guiones de noticias
- Creación de diálogos con personajes asignados
- Subida y procesamiento de videos MP4
- Generación de videos con IA para personajes específicos
- Autenticación segura de usuarios

## Arquitectura

La aplicación está construida con una arquitectura frontend moderna, utilizando React y TypeScript para una experiencia de desarrollo robusta.

### Estructura del Proyecto

- **Componentes Reutilizables** (`src/components/`): Biblioteca de UI con componentes como `Button`, `Input`, `Dialog`, `Alert`, etc.
- **Páginas** (`src/pages/`): `Login` para autenticación y `Dashboard` para la gestión principal.
- **Rutas** (`src/routes/`): Configuración de navegación con React Router DOM.
- **Servicios** (`src/services/`):
  - `n8n/workflow.ts`: Integración con flujos de trabajo de IA para generación de guiones y videos.
  - `pocketbase/auth.ts`: Autenticación y gestión de usuarios.
- **Hooks** (`src/hooks/`): `useAuth` para manejo de estado de autenticación.
- **Estado y Utilidades** (`src/state/`, `src/utils/`): Gestión de estado global y funciones auxiliares.

### Tecnologías

- **Frontend**: React 19, TypeScript, Vite
- **Estilos**: TailwindCSS
- **Enrutamiento**: React Router DOM
- **Integraciones**: N8N (flujos de IA), PocketBase (autenticación)

## Instalación

Asegúrate de tener Node.js (versión 18 o superior) y pnpm instalados.

```bash
# Clona el repositorio
git clone <url-del-repositorio>
cd ecuador-contrapunto

# Instala las dependencias
pnpm install
```

## Uso

### Desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Construcción para Producción

```bash
pnpm run build
```

Los archivos de producción se generan en el directorio `dist/`.

### Vista Previa

Para previsualizar la build de producción:

```bash
pnpm run preview
```

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `pnpm run dev` | Inicia el servidor de desarrollo con hot reload |
| `pnpm run build` | Construye la aplicación para producción |
| `pnpm run lint` | Ejecuta ESLint para verificar el código |
| `pnpm run preview` | Previsualiza la build de producción localmente |

### Configuración de ESLint

Para aplicaciones de producción, se recomienda actualizar la configuración de ESLint para incluir reglas de tipo-aware:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

## Despliegue

La aplicación puede desplegarse utilizando Docker para un entorno de producción consistente.

### Construcción de la Imagen Docker

```bash
docker build -t ecuador-contrapunto .
```

### Ejecución del Contenedor

```bash
docker run -p 3000:3000 ecuador-contrapunto
```

La aplicación estará disponible en `http://localhost:3000`.

### Variables de Entorno

Asegúrate de configurar las variables de entorno necesarias para las integraciones con N8N y PocketBase antes del despliegue.
