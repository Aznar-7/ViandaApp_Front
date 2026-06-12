# Análisis Técnico Completo — Frontend Viandas "Orden 66"

> **Fecha:** 2026-06-11  
> **Auditor:** Claude Code (Sonnet 4.6)  
> **Stack:** React 19 + Vite 8 + Tailwind 4 + React Router 7 + Zod + Axios  
> **Ámbito:** SPA universitaria, gestión de viandas con panel admin

---

## Resumen Ejecutivo

| Dimensión | Puntuación | Tendencia |
|---|---|---|
| Arquitectura | **8.0 / 10** | ✅ Sólida |
| Calidad de Código | **7.5 / 10** | ✅ Buena |
| Seguridad | **5.5 / 10** | ⚠️ Mejorable |
| Performance | **6.5 / 10** | ⚠️ Mejorable |
| Mantenibilidad | **8.0 / 10** | ✅ Sólida |
| Escalabilidad | **6.0 / 10** | ⚠️ Limitaciones claras |
| Testing | **1.0 / 10** | 🔴 Crítico |
| DevEx (Developer Experience) | **7.0 / 10** | ✅ Buena |
| **TOTAL** | **6.2 / 10** | ⚠️ Competente con brechas |

El proyecto es una SPA bien estructurada, con arquitectura de features clara, sistema de diseño consistente y buenas intenciones de calidad. La brecha crítica está en la **ausencia total de tests** y en **decisiones de seguridad** que serían problemáticas en producción real. Para un proyecto universitario, el nivel es alto; para producción, requiere trabajo prioritario antes del despliegue.

---

## 1. Arquitectura — 8.0/10

### Lo que funciona bien

**Feature-based architecture** — La organización en `src/features/{nombre}/` con subcarpetas `components/`, `hooks/`, `pages/`, `services/` por cada dominio es una de las mejores decisiones del proyecto. Cada feature es cohesiva y fácil de localizar. Alta cohesión, bajo acoplamiento entre features.

```
src/features/pedidos/
├── components/    ← UI local al dominio
├── hooks/         ← lógica de estado/fetching
├── pages/         ← composición de pantallas
└── services/      ← contratos con la API
```

**Separación de responsabilidades** — Los hooks (`usePedidos`, `useAdminPedidos`) separan correctamente el fetching/estado de la UI. Los services encapsulan los endpoints. Las pages son composición pura.

**Route guards correctos** — `ProtectedRoute`, `AdminRoute`, `PublicRoute` están bien implementados como wrappers de `<Outlet />`. No hay lógica de autenticación duplicada en pages.

**Lazy loading universal** — Todas las páginas usan `React.lazy()` con `<Suspense>` a nivel de router. Correcto code-splitting automático por ruta.

**Error Boundary en la raíz** — `ErrorBoundary` envuelve toda la app; los errores de render no derrumban el árbol completo.

**Interceptores Axios centralizados** — El manejo de 401/403/404/500 está en un único lugar (`lib/axios.js`). El patrón `CustomEvent('auth:unauthorized')` para desacoplar el interceptor del contexto de React es correcto y elegante.

### Problemas detectados

**[P2] `isLoading` declarado pero nunca modificado en `AuthContext`**

```jsx
// src/context/AuthContext.jsx:20
const [isLoading] = useState(false)  // ← setter nunca se usa
```
El contexto expone `isLoading` siempre en `false`. Cualquier componente que espere un loading durante la inicialización del auth verá datos incorrectos. En producción, esto podría mostrar contenido protegido brevemente (flash of unauthenticated content).

**[P2] `register()` hace dos llamadas HTTP en secuencia sin manejo de fallo entre ellas**

```jsx
// src/context/AuthContext.jsx:33-41
await authService.register(data)
const { token, usuario } = await authService.login(...)  // si falla, el usuario ya existe pero no tiene sesión
```
Si el login falla tras el registro, el usuario queda en un estado inconsistente: registrado pero sin sesión, y el error mostrado es de login, no de registro. Necesita rollback semántico o un endpoint `/register-and-login` en el backend.

**[P3] `PublicRoute` asume que `user` en localStorage siempre es válido**

Si el token expiró pero `user` sigue en localStorage, el usuario no puede entrar a `/login` porque `PublicRoute` lo redirige. La primera llamada protegida dispara el `auth:unauthorized` y hace logout, pero el UX es confuso.

**[P3] No existe un `src/types/` o archivo de tipos compartidos**

Con `.jsx` (no `.tsx`), la ausencia de tipos formales es esperada, pero hay estructuras como `usuario` (con campos `rol`, `nombre`, etc.) y `pedido` que se asumen implícitamente en múltiples features sin documentación de forma centralizada. Los tipos están en el `FRONTEND_API.md` pero no en código.

---

## 2. Calidad de Código — 7.5/10

### Lo que funciona bien

**Zod + React Hook Form** — Validación declarativa con esquemas Zod bien definidos. Los errores se muestran inline. Los schemas diferenciados para create vs edit en `PedidoForm` son correctos.

**Constantes centralizadas por feature** — `ESTADO_CONFIG`, `TIPO_CONFIG`, `PAGE_SIZES` evitan magic strings dispersos. Facilita cambios de configuración.

**`parseApiError` utilitario** — Extractor consistente de mensajes de error de la API. Todos los servicios lo usan.

**`cn()` con tailwind-merge** — Correcto uso de `clsx` + `tailwind-merge` para composición de clases sin colisiones.

**CVA para variantes de UI** — Todos los componentes UI usan `class-variance-authority`. Las variantes están bien tipadas implícitamente.

**Barrel exports en `shared/utils/index.js`** — Importaciones limpias para utilidades compartidas.

### Problemas detectados

**[P1] JavaScript puro (`.jsx`) en lugar de TypeScript**

El proyecto usa JSX sin tipos. Con React 19, Zod 4, y una API bien documentada en `FRONTEND_API.md`, la migración a TypeScript sería directa. Los beneficios serían inmediatos: autocompletado en servicios, contratos de props validados en compilación, y errores de "property doesn't exist" en desarrollo en lugar de en producción.

**[P2] Axios lee el token de `localStorage` en cada request en lugar de desde el contexto**

```js
// src/lib/axios.js:9-12
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')  // lectura directa al DOM
  ...
})
```
El interceptor está fuera del árbol de React, por lo que no puede acceder al contexto. El problema es que si el token cambia en React state pero no en localStorage (o viceversa), hay inconsistencia. Actualmente no ocurre porque siempre se escribe en ambos, pero es un acoplamiento frágil.

**[P2] Hooks de datos no usan `useCallback` para `refetch` ni `useEffect` cleanup**

```js
// Patrón en usePedidos.js, useMenus.js, etc.
useEffect(() => {
  setIsLoading(true)
  fetchData().then(...)
}, [filters])
// ← Sin AbortController para cancelar requests anteriores
```
Si el usuario cambia filtros rápido, múltiples requests pueden responder fuera de orden (race condition). El último request en llegar no garantiza ser el último en lanzarse.

**[P2] Client-side pagination en `useMenus`**

Si el backend devuelve todos los menús y el frontend pagina localmente, escala mal. Con 9 menús por página y 100 menús en base de datos, se cargan 100 para mostrar 9. Confirmado que el parámetro de paginación existe en la API pero puede no aplicarse server-side para menús.

**[P3] Algunos componentes mezclan lógica de negocio con UI**

`PedidoForm.jsx` maneja: fetching de menús disponibles, cálculo de precio total, estado del formulario, submit, y toda la UI. Es el componente más complejo y podría dividirse en un hook `usePedidoForm` que extraiga la lógica de datos.

**[P3] `motion` importado en múltiples componentes sin un wrapper centralizado**

Si se necesita cambiar la librería de animaciones (e.g., de `motion` a CSS nativo), hay que modificar cada componente individualmente.

**[P3] Mezcla de `.js` y `.jsx` en features**

Los hooks y servicios usan `.js`; los componentes usan `.jsx`. Es una convención válida, pero inconsistente: `useAdminPedidos.js` vs `AdminTable.jsx`. Una convención uniforme (todo `.jsx` o todo basado en contenido) es más predecible.

---

## 3. Seguridad — 5.5/10

### Lo que funciona bien

- Route guards impiden acceso visual a rutas protegidas
- Validación de inputs con Zod en todos los formularios
- No hay interpolación directa de inputs de usuario en HTML (`dangerouslySetInnerHTML` no encontrado)
- Mensajes de error no filtran información de stack traces al usuario
- Separación de roles `usuario` / `admin` en rutas

### Problemas detectados

**[P0] Token JWT en `localStorage` — vulnerable a XSS**

```js
// src/context/AuthContext.jsx:25-26
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(usuario))
```

`localStorage` es accesible desde cualquier JavaScript en la página. Un script XSS (inyectado por una dependencia comprometida, un CDN, o una vulnerabilidad en la app) puede robar el token completo. El atacante obtendría acceso permanente hasta la expiración del token.

**Solución correcta:** El backend debe emitir el token como cookie `HttpOnly; SameSite=Strict; Secure`. El frontend nunca toca el token directamente — el navegador lo envía automáticamente en cada request. React solo necesita saber si el usuario está autenticado (un endpoint `/me` en el backend).

**[P0] `isAdmin` basado en datos del cliente**

```js
// src/context/AuthContext.jsx:58
const isAdmin = user?.rol === 'admin'
```

El campo `rol` viene de `localStorage`. Un usuario puede abrir DevTools y escribir `localStorage.setItem('user', JSON.stringify({...JSON.parse(localStorage.getItem('user')), rol: 'admin'}))` para convertirse en admin en el frontend. Las rutas de admin en el frontend mostrarían el panel admin. **El backend DEBE rechazar cualquier operación admin si el token no pertenece a un admin** — pero si el backend no valida rol, esto es una vulnerabilidad real de elevación de privilegios.

La protección real de rol debe estar 100% en el backend. El frontend solo la usa para UX (mostrar/ocultar botones).

**[P1] Sin Content Security Policy (CSP)**

`index.html` no define ningún header CSP. Cualquier script inline o de origen externo puede ejecutarse. Con una CSP `default-src 'self'` se bloquearía la mayoría de los vectores XSS.

**[P1] Dependencias con posibles vulnerabilidades**

El proyecto usa varias dependencias con versiones `^` (caret), lo que permite actualizaciones de minor/patch. No hay `npm audit` ejecutado ni lock-file auditing en CI. Con `motion@^12`, `axios@^1.17`, etc., una actualización automática podría introducir vulnerabilidades.

**[P2] Sin validación de `VITE_API_URL` en build**

```js
baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
```

Si se construye para producción sin definir `VITE_API_URL`, la app silenciosamente apunta a `localhost:3000`. Debería fallar el build (`throw new Error(...)`) si la variable no está definida en producción.

**[P2] Sin protección contra open redirect en rutas post-login**

`PublicRoute` redirige siempre a `/dashboard` o `/admin` hardcodeados. Si en el futuro se implementa un `?redirect=` query param para guardar la ruta original, debe validarse que sea relativa (no un URL externo) para evitar open redirect.

**[P3] `user` en localStorage se parsea pero no se valida schema**

```js
function readUser() {
  try {
    return stored ? JSON.parse(stored) : null
  } catch { ... }
}
```

`JSON.parse` tiene éxito con cualquier JSON válido. Si alguien escribe `{"rol":"admin","nombre":"Hacker"}`, el contexto lo acepta. Validar con un schema Zod mínimo descartaría datos malformados.

---

## 4. Performance — 6.5/10

### Lo que funciona bien

- **Code splitting por ruta** con `React.lazy()` — el bundle inicial no carga código de páginas no visitadas
- **`motion` en lugar de `framer-motion`** — librería más ligera para las animaciones
- **Tailwind CSS en build** — purga CSS no usado; output CSS mínimo
- **`@tailwindcss/vite`** — integración directa de Tailwind con Vite, sin PostCSS overhead
- **Babel React Compiler** (`babel-plugin-react-compiler`) — memoización automática experimental en devDependencies, aunque requiere verificar que esté activo y funcionando

### Problemas detectados

**[P1] Sin debounce en filtros de búsqueda**

Los filtros de estado y fecha en `PedidosPage`, `AdminDashboard` lanzan una petición HTTP en cada cambio de input. Si el usuario escribe en un filtro de texto, cada keystroke es una request. Necesita `useDebounce` con 300-400ms para inputs de texto.

**[P1] Sin estrategia de caché — refetch en cada montaje**

Todos los hooks fetchean en cada `useEffect` de montaje. Si el usuario navega `/pedidos` → `/dashboard` → `/pedidos`, se hacen 2 requests de pedidos. No hay caché de respuestas, no se usa `React Query` ni `SWR`. Para una app universitaria es tolerable; para producción, es ineficiente.

**[P2] Race conditions en hooks de fetching**

```js
// Patrón en todos los hooks data
useEffect(() => {
  let active = true
  fetchData().then(data => {
    if (active) setState(data)  // ← este patrón NO está implementado
  })
  // ← Sin AbortController ni cleanup
}, [filters])
```

Si `filters` cambia antes de que la request anterior responda, ambas respuestas intentan actualizar el estado. La que llega segunda "gana", aunque podría ser la que corresponde a un estado anterior de los filtros.

**[P2] Sin optimización de imágenes de menús**

Las imágenes de menús se cargan en su tamaño original. No hay `loading="lazy"` en `<img>`, no hay srcset para responsive images, no hay WebP/AVIF. En una grid de 9 menús con imágenes grandes, el LCP puede ser elevado.

**[P2] `PedidoForm` carga todos los menús disponibles para una fecha**

Al seleccionar fecha, `PedidoForm` fetcha todos los menús del día y renderiza las opciones con imágenes. Sin virtualización ni paginación de ese listado, si hay muchos menús en un día, el render puede ser costoso.

**[P3] Animaciones en cada card sin `will-change`**

Los componentes con `motion` no declaran `will-change: transform` explícitamente. En listas largas, el compositor no puede preparar las capas de antemano.

**[P3] No hay Service Worker ni caché offline**

Para una app universitaria con conexión inestable en campus, un SW básico con caché de assets estáticos mejoraría la resiliencia. No es crítico pero es una mejora de UX.

---

## 5. Mantenibilidad — 8.0/10

### Lo que funciona bien

**Documentación excepcional para un proyecto universitario:**
- `README.md` completo con stack, comandos y estructura
- `FRONTEND_API.md` (13.5 KB) — contrato de API documentado
- `ORDEN66_UI_GUIDELINES.md` (25 KB) — design system completo
- `PLAN_MEJORAS.md` (31 KB) — deuda técnica ya identificada
- `ROADMAP.md` (11 KB) — producto planificado

**Constantes en lugar de magic strings** — `ESTADO_CONFIG`, `TIPO_CONFIG`, `PAGE_SIZES` centralizan configuración cambiante.

**`parseApiError` centralizado** — Un único lugar para extraer mensajes de error de la API. Si el backend cambia el formato de errores, solo hay que modificar una función.

**`lib/utils.js` con `cn()`** — Consistente en toda la UI. No hay clases de Tailwind construidas con concatenación manual.

**Feature-based structure** — Añadir una nueva feature (`notificaciones`, `pagos`) tiene un camino claro: crear `src/features/notificaciones/` con la misma estructura.

**ESLint bien configurado** — Flat config de ESLint 10, `react-hooks/rules-of-hooks` activo, `exhaustive-deps` activo. Previene los errores de hooks más comunes.

### Problemas detectados

**[P2] Sin TypeScript — tipos implícitos en todo el codebase**

La estructura de `usuario`, `pedido`, `menu`, `historial` está documentada en Markdown pero no en código. Refactorizar el backend (renombrar un campo) requiere buscar en texto todas las referencias, en lugar de que TypeScript las marque automáticamente.

**[P2] Sin barrel exports en features**

Cada import desde otra feature requiere la ruta completa:
```js
import { useAuth } from '@/context/AuthContext'
import AdminTable from '@/features/admin/components/AdminTable'
```
Con barrel exports (`@/features/admin/index.js`), los imports serían `from '@/features/admin'` y los renombres internos no romperían consumidores externos.

**[P3] `AuthContext.jsx` en `src/context/` en lugar de `src/features/auth/`**

El contexto de auth es parte del dominio de auth. Vivir en una carpeta separada `context/` es una inconsistencia con la feature-based architecture. Debería estar en `src/features/auth/context/AuthContext.jsx` o `src/features/auth/AuthProvider.jsx`.

**[P3] Componentes compartidos sin documentación de props (JSDoc o PropTypes)**

`Pagination.jsx`, `EmptyState.jsx`, `CommandHeader.jsx` son usados en múltiples features pero no tienen documentación de sus props. Hay que leer el componente para saber qué acepta.

---

## 6. Escalabilidad — 6.0/10

### Limitaciones arquitecturales

**[P1] Estado global únicamente en `AuthContext`**

Toda la data de la app vive en hooks locales por página. Si dos páginas necesitan el mismo dato (e.g., el resumen de pedidos en dashboard Y en sidebar), no hay forma de compartirlo sin refetch o prop drilling. Agregar un carrito de viandas, notificaciones globales, o configuración de usuario requeriría múltiples contextos o un store global.

**Recomendación:** Para el scope actual, está bien. Si la app crece a 5+ features con estado compartido, considerar Zustand (ligero, sin boilerplate) o React Query (caché de server state).

**[P1] Paginación de menús en cliente**

Si el backend devuelve los N menús del día y el frontend pagina, escala linealmente: 100 menús = 100 transferidos para mostrar 9. La API de menús ya tiene parámetros `page`/`limit` — asegurar que el backend los respete y el frontend los use.

**[P2] Sin abstracción de data fetching**

Cada hook implementa el mismo patrón:
```js
const [data, setData]     = useState([])
const [isLoading, setLoading] = useState(true)
const [error, setError]   = useState(null)
useEffect(() => { fetch().then(setData).catch(setError).finally(() => setLoading(false)) }, [deps])
```

Este patrón está duplicado en 8+ hooks. Si se necesita agregar retry logic, cache, o loading states globales, hay que modificar todos. Una abstracción `useFetch(fn, deps)` o simplemente React Query elimina la duplicación.

**[P2] Crecimiento del `router/index.jsx`**

El router define todas las rutas en un solo archivo. Con 12 rutas actuales, es manejable. Con 20+, necesitará rutas anidadas o lazy-loaded route configs.

**[P3] CSS global en `index.css` sin scope**

El archivo `index.css` contiene tanto el design system como utilidades globales. Si crece, puede tener conflictos de especificidad. Tailwind 4 y CSS Modules como estrategia de complemento para estilos muy específicos.

---

## 7. Testing — 1.0/10

### Estado actual

**Cero tests.** No hay archivo de configuración de tests, no hay archivos `*.test.js` o `*.spec.js`, no hay `vitest` ni `jest` en dependencies.

ESLint es el único tooling de calidad de código automatizado.

### Impacto

- Refactorizar cualquier función utilitaria o hook requiere verificación manual
- Cambios en `AuthContext`, `axios.js`, o `parseApiError` — los tres más críticos — no tienen regresión automatizada
- Los formularios (login, registro, pedido) no tienen tests de validación
- No hay cobertura de los route guards (¿`AdminRoute` realmente bloquea non-admins?)

### Plan de implementación recomendado

**[P0] Añadir Vitest + Testing Library** — configuración mínima, 2 horas:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

```js
// vitest.config.js
export default { test: { environment: 'jsdom', globals: true } }
```

**Tests de mayor ROI a escribir primero:**

| Test | Tipo | Impacto |
|---|---|---|
| `parseApiError` | Unit | Función crítica, 10 líneas |
| `formatCurrency` / `formatDate` | Unit | Puras, triviales |
| `ProtectedRoute` redirect | Integration | Seguridad de acceso |
| `AdminRoute` redirect | Integration | Seguridad de acceso |
| `LoginForm` validación Zod | Integration | Formulario central |
| `useAuth` login/logout | Unit | Estado global central |

**Objetivo realista:** 15-20 tests cubriendo los paths críticos. No necesita 100% de cobertura para ser útil.

---

## 8. Developer Experience — 7.0/10

### Lo que funciona bien

- **Alias `@/`** para imports absolutos — no más `../../../lib/utils`
- **Vite 8 con HMR** — arranque y recarga instantáneos
- **ESLint bien configurado** — previene errores de hooks comunes
- **Documentación completa** — README, FRONTEND_API.md, UI Guidelines
- **Constantes tipadas** — `ESTADO_CONFIG` en lugar de strings libres
- **`package.json` scripts limpios** — `dev`, `build`, `lint`, `preview`

### Problemas detectados

**[P2] Sin `VITE_API_URL` de ejemplo en `.env.example`**

`.env.local` contiene la URL real de desarrollo. Si alguien clona el repo, no tiene `.env.local` (está en `.gitignore`) y la app apunta al default `localhost:3000` sin aviso claro. Un `.env.example` con `VITE_API_URL=http://localhost:3000/api` y documentación en README es estándar.

**[P2] Sin Prettier o formatter configurado**

ESLint analiza lógica pero no formato. Sin Prettier, el estilo de código depende del editor de cada desarrollador. En un equipo (o cuando Claude Code edita), puede haber diferencias de indentación, comillas, trailing commas.

**[P2] `@types/react` y `@types/react-dom` como devDependencies sin TypeScript**

Son dependencias de tipos para TypeScript. Con `.jsx` puro, no sirven de nada a menos que se esté usando `// @ts-check` en archivos individuales. O migrar a TypeScript (recomendado) o eliminarlas.

**[P3] Sin alias para features**

Los imports son `@/features/pedidos/components/PedidoCard`. Se podría agregar:
```js
// vite.config.js
'@features': path.resolve('./src/features'),
'@shared': path.resolve('./src/shared'),
```

**[P3] Babel React Compiler activo pero no verificado**

```js
// vite.config.js
babel({ presets: [reactCompilerPreset()] })
```

El React Compiler (antes React Forget) memoiza automáticamente. Si está activo, es una mejora de performance significativa. Si no funciona correctamente con algún patrón del código, puede introducir bugs sutiles de render. Verificar que funciona con `console.log` de renders.

---

## 9. Plan de Acción por Prioridad

### 🔴 P0 — Crítico (bloquea producción)

| # | Problema | Archivo(s) | Esfuerzo |
|---|---|---|---|
| P0-1 | Token en localStorage → mover a httpOnly cookie | `AuthContext.jsx`, `axios.js`, backend | Alto (requiere backend) |
| P0-2 | Agregar Vitest con tests básicos de seguridad | `vitest.config.js`, tests nuevos | Medio (4-6h) |
| P0-3 | Validar `VITE_API_URL` en build de producción | `vite.config.js` o `main.jsx` | Bajo (30min) |

### 🟠 P1 — Alta prioridad (calidad significativa)

| # | Problema | Archivo(s) | Esfuerzo |
|---|---|---|---|
| P1-1 | `isAdmin` no debe basarse en localStorage | `AuthContext.jsx` | Bajo (backend debe exponer endpoint `/me`) |
| P1-2 | AbortController en todos los hooks de fetching | `usePedidos.js`, `useMenus.js`, etc. | Medio |
| P1-3 | Debounce en filtros de texto | `PedidoFilters.jsx`, `MenuFilters.jsx` | Bajo (2h) |
| P1-4 | Migrar a TypeScript | Todo el proyecto | Alto (8-12h) |
| P1-5 | Server-side pagination para menús | `useMenus.js`, `menuService.js` | Bajo |

### 🟡 P2 — Media prioridad (deuda técnica)

| # | Problema | Archivo(s) | Esfuerzo |
|---|---|---|---|
| P2-1 | `isLoading` en AuthContext siempre false | `AuthContext.jsx` | Bajo |
| P2-2 | Race condition en register → login doble | `AuthContext.jsx` | Bajo |
| P2-3 | Añadir Prettier | raíz del proyecto | Bajo (1h) |
| P2-4 | `.env.example` con variables requeridas | raíz del proyecto | Trivial |
| P2-5 | Abstraer patrón de fetching en hook genérico | `lib/useFetch.js` nuevo | Medio |
| P2-6 | CSP headers en servidor/Vite | config del servidor | Bajo |
| P2-7 | Validar `user` de localStorage con Zod | `AuthContext.jsx` | Bajo |
| P2-8 | Eliminar `@types/react*` si no hay TypeScript | `package.json` | Trivial |
| P2-9 | Lazy loading en `<img>` de menús | `MenuCard.jsx` | Trivial |

### 🟢 P3 — Baja prioridad (mejoras de calidad)

| # | Problema | Archivo(s) | Esfuerzo |
|---|---|---|---|
| P3-1 | Mover `AuthContext` a `features/auth/` | `context/`, imports | Bajo |
| P3-2 | Barrel exports por feature | `index.js` por feature | Medio |
| P3-3 | JSDoc en componentes compartidos | `shared/components/*.jsx` | Medio |
| P3-4 | Alias `@features/`, `@shared/` en Vite | `vite.config.js` | Trivial |
| P3-5 | Extraer hook `usePedidoForm` de `PedidoForm` | `PedidoForm.jsx` | Medio |
| P3-6 | Service Worker para assets estáticos | `vite-plugin-pwa` | Medio |
| P3-7 | Monitoreo de errores (Sentry) | App-wide | Medio |

---

## 10. Hallazgos Positivos Destacados

Estos patrones son especialmente buenos y vale la pena mantenerlos:

1. **Patrón de evento `auth:unauthorized`** — Desacopla elegantemente el interceptor Axios (fuera de React) del contexto de auth (dentro de React) sin recurrir a un store global ni a importaciones circulares.

2. **`ESTADO_CONFIG` como config object** — En lugar de switch/case o if/else dispersos en la UI, un objeto de configuración por estado centraliza label, className y dot color. Añadir un nuevo estado requiere modificar solo ese objeto.

3. **`updateRow()` en `useAdminPedidos`** — Actualización optimista local tras una acción admin. Evita refetch de toda la lista cuando solo cambia una fila. Patrón correcto.

4. **Feature-based directory structure** — La estructura es la más escalable para SPAs medianas y grandes. Es consistente en todas las features y fácil de navegar.

5. **Error handling en tres capas** — `ErrorBoundary` (render crashes) + interceptor Axios (HTTP errors) + `ErrorMessage` por hook (data fetching errors). Cobertura completa del árbol de errores.

6. **Zod schemas diferenciados create/edit** — `PedidoForm` usa schemas distintos para creación y edición. No se reusa un schema con campos opcionales de más; cada schema es mínimo y correcto para su caso de uso.

---

## 11. Deuda Técnica Acumulada (Top 5)

En orden de impacto si no se resuelve:

1. **Sin tests** — Cada cambio es un riesgo. La deuda crece con cada feature nueva.
2. **localStorage token** — En producción real, esto es una vulnerabilidad de seguridad de clase A.
3. **Sin TypeScript** — Refactorings son ciegos. Los contratos API no están en código.
4. **Sin caché de datos** — UX degradada en conexiones lentas; carga duplicada en navegación.
5. **Race conditions en fetching** — Bugs intermitentes difíciles de reproducir, especialmente en conexiones lentas.

---

## 12. Conclusión

El proyecto demuestra una arquitectura deliberada y madura para su scope. Las decisiones de estructura (feature-based, route guards, interceptores centralizados, design system consistente) son las correctas. El nivel de documentación es excepcional.

Las brechas están concentradas en dos áreas:

1. **Seguridad de producción** — `localStorage` para tokens es la decisión más importante a cambiar antes de cualquier despliegue real.
2. **Testing** — La ausencia total de tests es el mayor riesgo de mantenibilidad a largo plazo.

Para el contexto universitario con deadline 13/06, el sistema es entregable. Para un despliegue con usuarios reales, P0 y P1 son no negociables.

---

*Análisis generado automáticamente. Verificar hallazgos antes de actuar sobre cualquier recomendación de seguridad.*
