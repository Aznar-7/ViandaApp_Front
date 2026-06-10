# Plan de Mejoras — Orden 66 Viandas

> Análisis técnico + hoja de ruta UI/UX para llevar el proyecto a nivel producción.
> Fecha: Junio 2026

---

## Índice

1. [Bugs críticos](#1-bugs-críticos)
2. [Seguridad](#2-seguridad)
3. [Performance](#3-performance)
4. [Calidad de código](#4-calidad-de-código)
5. [Consistencia UI](#5-consistencia-ui)
6. [Landing Page](#6-landing-page)
7. [Auth Pages](#7-auth-pages-login--register)
8. [User Profile](#8-user-profile)
9. [Menus Page](#9-menus-page)
10. [Pedidos](#10-pedidos)
11. [Admin Dashboard](#11-admin-dashboard)
12. [Componentes shared](#12-componentes-shared)
13. [Animaciones](#13-animaciones)
14. [Responsive & Accesibilidad](#14-responsive--accesibilidad)

---

## 1. Bugs Críticos

> Estas son las únicas cosas que rompen el flujo de usuario. Prioridad máxima.

### 1.1 `isLoading` hardcodeado en `false` — `AuthContext.jsx`

**Problema:** `const isLoading = false` hardcodeado. Las guards `ProtectedRoute` y `AdminRoute` siempre ven `false`, por lo que nunca muestran spinner durante la verificación inicial. Si el token está guardado en `localStorage` pero la app aún no inicializó el contexto, el usuario ve un flash de la página de login antes de ser redirigido.

**Fix:**
```js
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  // Restaurar sesión desde localStorage
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (token && user) setUser(user), setToken(token)
  setIsLoading(false)
}, [])
```

**Archivo:** `src/context/AuthContext.jsx`
**Impacto:** Alto — Flash of unauthenticated content (FOUC auth)

---

### 1.2 Redirect 401 con `window.location.replace` — `axios.js`

**Problema:** Al recibir un 401, el interceptor usa `window.location.replace('/login')`. Esto:
- Recarga la página completa (bypasea React Router)
- No limpia el estado de `AuthContext` antes del redirect
- No muestra ningún toast al usuario

**Fix:**
```js
// Exponer un callback de logout desde AuthContext hacia axios
// o emitir un CustomEvent que AuthContext escuche
window.dispatchEvent(new CustomEvent('auth:unauthorized'))
```

```jsx
// En AuthContext
useEffect(() => {
  const handler = () => logout() // logout ya hace navigate('/login')
  window.addEventListener('auth:unauthorized', handler)
  return () => window.removeEventListener('auth:unauthorized', handler)
}, [])
```

**Archivo:** `src/lib/axios.js` + `src/context/AuthContext.jsx`
**Impacto:** Alto — Experiencia rota en sessión expirada

---

### 1.3 Race condition en `PedidoForm` — `selectedMenu` sin null guard

**Problema:** `selectedMenu.precio` puede fallar si el array `menus` carga después de que `watchMenuId` ya tiene valor (preselección por query param `?menuId=X`).

**Fix:**
```js
const selectedMenu = useMemo(
  () => menus.find((m) => String(m.id) === String(watchMenuId)) ?? null,
  [menus, watchMenuId]
)
// Todo uso posterior: selectedMenu?.precio ?? 0
```

**Archivo:** `src/features/pedidos/components/PedidoForm.jsx`
**Impacto:** Medio — Crash en caso edge de preselección de menú

---

### 1.4 Date picker con `color-scheme: light` en contexto oscuro

**Problema:** El input de tipo `date` en `PedidoForm` tiene `[color-scheme:light]` hardcodeado, lo que hace que el selector nativo de fecha aparezca con tema claro sobre fondo oscuro.

**Fix:** Aplicar dinámicamente según el tema activo, o bien usar un componente de calendario propio (shadcn `<Calendar>` + `<Popover>`).

**Archivo:** `src/features/pedidos/components/PedidoForm.jsx`
**Impacto:** Bajo/Medio — Visual defecto en modo oscuro

---

### 1.5 Toast de éxito faltante en edición de pedidos

**Problema:** Al crear un pedido se muestra `toast.success('Pedido creado')` pero al editarlo el toast puede no dispararse en todos los paths.

**Fix:** Verificar y agregar `toast.success('Pedido actualizado correctamente')` en el handler de submit cuando `isEditing === true`.

**Archivo:** `src/features/pedidos/pages/PedidoFormPage.jsx`
**Impacto:** Bajo — UX feedback incompleto

---

## 2. Seguridad

### 2.1 XSS potencial en `HistorialTimeline`

**Problema:** `entry.valorNuevo` y `entry.valorAnterior` se renderizan directamente como `{String(v)}`. React escapa texto plano, pero si en algún punto se usa `dangerouslySetInnerHTML` o se refactoriza hacia eso, el riesgo aumenta.

**Mitigación actual:** React escapa por defecto — riesgo bajo.
**Mejora recomendada:** Validar que los valores del historial sean solo primitivos (string/number/boolean) antes de renderizar. Si se agregan campos objeto, usar `JSON.stringify`.

**Archivo:** `src/features/pedidos/components/HistorialTimeline.jsx`

---

### 2.2 Token en localStorage

**Estado actual:** JWT guardado en `localStorage` — estándar y aceptable para SPA universitaria.
**Riesgo:** Vulnerable a XSS si se inyecta script externo.
**Mejora futura:** Migrar a HTTP-only cookie (requiere cambio de backend).
**Acción inmediata:** Nada — es el approach correcto para este stack.

---

### 2.3 Sin error boundary global

**Problema:** Un crash en cualquier componente baja toda la app sin feedback al usuario.

**Fix:** Agregar `ErrorBoundary` con fallback en `App.jsx`:
```jsx
<ErrorBoundary fallback={<CrashPage />}>
  <RouterProvider router={router} />
</ErrorBoundary>
```

**Archivo:** `src/App.jsx` (nuevo componente `src/shared/components/ErrorBoundary.jsx`)

---

## 3. Performance

### 3.1 Sin code splitting por ruta

**Estado actual:** Todas las páginas se importan de forma estática en `router/index.jsx`.
**Problema:** El bundle inicial carga todo aunque el usuario nunca visite `/admin`.

**Fix:** Lazy loading con `React.lazy`:
```jsx
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'))
```

**Impacto:** Reducción del bundle inicial ~30-40%

---

### 3.2 Filtros de menús client-side vs server-side

**Estado actual:** `useMenus` carga todos los menús y filtra en el cliente.
**Problema:** Ineficiente si la base de datos crece. API soporta `?tipo=&fecha=` como query params.
**Fix:** Pasar filtros activos como query params al request en vez de filtrar localmente.

---

### 3.3 Sin deduplicación de requests

**Problema:** Si el usuario hace click rápido en "cargar", se disparan N requests simultáneos.
**Fix:** Deshabilitar controles durante `isLoading` (ya implementado en formularios, extender a botones de filtro y paginación).

---

## 4. Calidad de Código

### 4.1 Duplicación de configuraciones de estado

**Problema:** `ESTADO_CONFIG` está definido en `constants.js`, pero `StatusBadge.jsx` y `PedidoCard.jsx` redefinen sus propias versiones parciales.

**Fix:** Un único source of truth en `src/features/pedidos/constants.js`. Todos los componentes importan desde ahí.

---

### 4.2 Magic numbers en paginación

```js
// Actualmente dispersos por los hooks:
limit: 9   // useMenus
limit: 10  // usePedidos
limit: 15  // useAdminPedidos
```

**Fix:** Centralizar en `src/shared/constants.js`:
```js
export const PAGE_SIZES = { menus: 9, pedidos: 10, adminPedidos: 15 }
```

---

### 4.3 Inconsistencia en parseo de errores HTTP

**Problema:** Algunos hooks usan `.response?.data?.error`, otros usan `.response?.data?.message`. El backend devuelve `.error`.

**Fix:** Crear un helper compartido:
```js
// src/lib/parseApiError.js
export const parseApiError = (err, fallback = 'Error inesperado') =>
  err?.response?.data?.error ?? fallback
```

---

### 4.4 Archivos de página muy largos

**Páginas que superan 200 líneas y deben dividirse:**

| Archivo | Líneas aprox | Solución |
|---|---|---|
| `PedidoForm.jsx` | ~250 | Extraer `MenuSelector`, `DateShiftSelector`, `NotasField` |
| `AdminDashboard.jsx` | ~200 | Extraer `OrderFiltersBar`, `OrderTableSection` |
| `MenusPage.jsx` | ~180 | Extraer `MenusFiltersBar`, `MenusContent` |

---

## 5. Consistencia UI

### 5.1 Paleta actual (mantener y extender)

La paleta actual está muy bien definida:
- **Sidebar:** oscuro imperial (`hsl(222 47% 5%)`)
- **Contenido:** blanco / gris claro
- **Accent:** amarillo dorado imperial
- **Destructivo:** rojo sith

**Conservar 100%.** Las mejoras son aditivas, no reemplazos.

---

### 5.2 Tipografía

**Fuente actual:** Geist Variable — moderna, limpia, perfecta.
**Agregar:** Una fuente display para headings épicos (opcional):
- `Orbitron` (Google Fonts) — muy usada en UIs sci-fi/militares
- Aplicar solo a `h1` de landing y titles de sección, no a texto de cuerpo

---

### 5.3 Iconografía

**Estado actual:** `lucide-react` — correcto.
**Mejora:** Mapear iconos con semántica imperial:

| Concepto | Icono actual | Propuesta |
|---|---|---|
| Menú | `UtensilsCrossed` | `Swords` o icono custom SVG TIE Fighter |
| Pedido | `ShoppingCart` | `Package` o custom Imperial crate |
| Admin | `Settings` | `Command` / `Shield` |
| Estado pendiente | `Clock` | `Hourglass` |
| Estado confirmado | `CheckCircle` | `ShieldCheck` |
| Estado entregado | `Truck` | `Rocket` |
| Estado cancelado | `X` | `XCircle` / `Ban` |

---

## 6. Landing Page

> Nueva página pública. Ruta: `/` (cuando no hay sesión activa)

### Objetivo
Vender el producto. Primera impresión épica. Convencer al usuario universitario de registrarse.

### Secciones

#### Hero
```
┌─────────────────────────────────────────────────────────────┐
│  [Sello Imperial SVG — grande, centrado, animado]           │
│                                                             │
│  ORDEN 66 VIANDAS                                           │
│  El Imperio te alimenta. Tú, alimentas al Imperio.          │
│                                                             │
│  [Iniciar sesión]    [Registrarse]                          │
│                                                             │
│  Partículas flotantes sutiles (estrellas) en fondo oscuro   │
└─────────────────────────────────────────────────────────────┘
```

**Animación hero:** 
- Logo entra con fade + scale desde 0.8 → 1
- Texto con stagger de líneas (slide up + fade)
- Botones entran con delay
- Partículas de fondo: CSS animation, estrellas que "viajan"

---

#### Features — "Por qué el Imperio elige Orden 66"

3 cards en grid horizontal:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 🍽️ Raciones  │  │ ⚡ Eficiencia│  │ 🛡️ Control   │
│ imperiales   │  │ galáctica    │  │ total        │
│              │  │              │  │              │
│ Menús diarios│  │ Pedí en      │  │ Seguí tu     │
│ diseñados    │  │ segundos.    │  │ pedido en    │
│ para la élite│  │ Sin demoras. │  │ tiempo real. │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Estilo de las cards:**
- Borde sutil con gradiente dorado
- Icon grande con glow effect suave
- Animación de entrada stagger al hacer scroll (Intersection Observer + Motion)

---

#### Cómo funciona — "El protocolo imperial"

Timeline horizontal de 3 pasos:

```
[1] Explorá el menú  →  [2] Hacé tu pedido  →  [3] Retirá tu ración
```

Cada paso con icono, título y descripción breve.

---

#### CTA Final

```
┌─────────────────────────────────────────────────────────────┐
│  "El Imperio tiene hambre de eficiencia."                   │
│  Unite a la causa. Registrate ahora.                        │
│                                                             │
│              [ Unirme al Imperio ]                          │
└─────────────────────────────────────────────────────────────┘
```

---

### Archivos a crear

```
src/features/landing/
├── pages/LandingPage.jsx
└── components/
    ├── HeroSection.jsx
    ├── FeaturesSection.jsx
    ├── HowItWorksSection.jsx
    └── LandingCTA.jsx
```

---

## 7. Auth Pages — Login & Register

### 7.1 Diseño actual

Las páginas ya tienen buen esqueleto. Mejorar:
- Agregar más Star Wars flavor sin perder usabilidad
- Mejorar el contexto visual alrededor del formulario

### 7.2 Login Page

**Layout propuesto:**
```
┌─────────────────────────────────────────────────────────────┐
│ PANEL IZQUIERDO (oscuro, 40%)   │ PANEL DERECHO (form, 60%)│
│                                 │                           │
│  [Sello Imperial SVG grande]    │  "Identificación         │
│                                 │   Imperial"               │
│  "El Imperio no olvida a sus    │                           │
│   leales servidores."           │  [Email input]            │
│                                 │  [Password input]         │
│  Fondo: gradiente oscuro con    │  [Iniciar sesión]         │
│  partículas sutiles             │                           │
│                                 │  ¿No tenés cuenta?       │
│                                 │  Registrate               │
└─────────────────────────────────────────────────────────────┘
```

**Mejoras específicas:**
- Label "Email" → "ID Imperial"  
- Label "Contraseña" → "Código de acceso"
- Error de credenciales: "Identificación rechazada por el Imperio"
- Botón submit con loader: "Verificando..." / "Autenticando..."
- Animación: el formulario aparece con scan line effect (CSS)

---

### 7.3 Register Page

**Misma estructura de dos paneles** pero con:
- Icono diferente (nuevo recluta vs veterano)
- Copy: "Alistarse al Imperio" / "Crear identificación"
- Validación de contraseña con indicador visual de fuerza
- Paso a paso si el form es largo (stepper opcional)

---

### 7.4 NotFoundPage (404)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           [Imperial Crest SVG — tembloroso]                 │
│                                                             │
│              ERROR 404                                      │
│       "Esta no es la ruta que buscás."                      │
│                                                             │
│   El sector que intentaste alcanzar no existe               │
│   en los archivos del Imperio.                              │
│                                                             │
│              [ Volver a la base ]                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. User Profile

> Nueva sección. Ruta: `/perfil`

### 8.1 Layout

```
┌────────────────────────────────────────────────────────┐
│  [Avatar con iniciales — circular, borde dorado]       │
│  Nombre del usuario                                    │
│  "Soldado Raso" / "Oficial" / "Gran Moff" (por rol)   │
│  Member since: [fecha]                                 │
├────────────────────────────────────────────────────────┤
│  TABS:                                                 │
│  [ Datos personales ] [ Seguridad ] [ Mis pedidos ]   │
└────────────────────────────────────────────────────────┘
```

### 8.2 Tab: Datos personales

- Nombre completo (editable)
- Email (solo lectura o con verificación)
- Punto de retiro preferido (select)
- Turno preferido (almuerzo / cena)
- Botón guardar con toast de confirmación

### 8.3 Tab: Seguridad

- Cambiar contraseña (actual + nueva + confirmar)
- Validación de fuerza de contraseña
- Toast "Contraseña actualizada. El Imperio aprueba."

### 8.4 Tab: Mis pedidos (resumen)

- Mini listado de últimos 5 pedidos
- Link a `/pedidos` para ver todos

### 8.5 Rango Imperial (gamification)

Basado en cantidad de pedidos:

| Pedidos | Rango | Icono |
|---|---|---|
| 0–4 | Recruta | ⬛ |
| 5–14 | Soldado Imperial | ⬛⬜ |
| 15–29 | Sargento | ⬛⬜⬜ |
| 30+ | Oficial Imperial | ★ |

Mostrar rango en el perfil y en el sidebar como badge.

---

### 8.6 Archivos a crear

```
src/features/perfil/
├── pages/PerfilPage.jsx
├── hooks/usePerfil.js
├── services/perfilService.js
└── components/
    ├── ProfileHeader.jsx
    ├── PersonalDataForm.jsx
    ├── SecurityForm.jsx
    └── ImperialRankBadge.jsx
```

---

## 9. Menus Page

### 9.1 Mejoras de cards de menú

**Card actual:** Nombre, tipo, precio, cupo
**Card mejorada:**

```
┌──────────────────────────────────┐
│  [Icono del tipo — grande]       │
│  Menú Clásico Imperial           │
│  Lun 10 Jun                      │
├──────────────────────────────────┤
│  Pollo asado con legumbres       │  ← descripción si existe
│                                  │
│  [====██████░░] 62% disponible   │  ← barra de cupo con color
│                                  │
│  $ 1.200                [Pedir]  │
└──────────────────────────────────┘
```

**Detalles:**
- Icono según tipo: 🍖 clásico, 🥗 vegetariano, 🌱 vegano, 🌾 sin TACC
- Barra de cupo: verde → amarillo → rojo según disponibilidad
- Card con hover: leve elevación + glow dorado sutil
- Badge de "Últimas raciones" cuando < 20%
- Badge "Agotado" con overlay cuando cupo = 0

---

### 9.2 Filtros

Reemplazar dropdowns planos por **chips/toggles visuales**:

```
Tipo: [Todos] [Clásico] [Vegetariano] [Vegano] [Sin TACC]
```

Chips con color según tipo (amarillo clásico, verde vegetariano, etc.)

---

### 9.3 Terminología imperial

| Término actual | Propuesta |
|---|---|
| "Menús disponibles" | "Raciones del Imperio" |
| "Clásico" | "Ración Imperial Estándar" |
| "Vegetariano" | "Ración Verde" |
| "Vegano" | "Ración Botánica" |
| "Sin TACC" | "Ración Certificada" |
| "Cupo disponible" | "Raciones disponibles" |

---

## 10. Pedidos

### 10.1 Terminología

| Término actual | Propuesta |
|---|---|
| "Pedido" | "Provisión" o "Pedido" (mantener legible) |
| "Pendiente" | "En cola" |
| "Confirmado" | "Autorizado" |
| "Entregado" | "Entregado" ✓ |
| "Cancelado" | "Anulado" |
| "Turno almuerzo" | "Turno Mediodía" |
| "Turno cena" | "Turno Nocturno" |

> **Nota:** Mantener legibilidad primero. La jerga Star Wars va en subtítulos y microcopy, no en labels de formulario críticos.

---

### 10.2 PedidoCard

Rediseño de la card con más personalidad:

```
┌──────────────────────────────────────────────────────┐
│  [StatusBadge]          Lun 10 Jun — Mediodía        │
│                                                      │
│  Menú Clásico Imperial                               │
│  Cantina Norte — x1                                  │
│                                                      │
│  $ 1.200              [Ver detalle →]                │
└──────────────────────────────────────────────────────┘
```

---

### 10.3 StatusBadge mejorado

| Estado | Color | Icono | Label |
|---|---|---|---|
| pendiente | amber | `Hourglass` | En cola |
| confirmado | blue | `ShieldCheck` | Autorizado |
| entregado | green | `PackageCheck` | Entregado |
| cancelado | red | `Ban` | Anulado |

Animación: pulse suave en estado "pendiente" (indica espera activa).

---

### 10.4 Historial Timeline

Mejorar el timeline con línea vertical conectora y colores por estado:

```
  ●  Creado — Lun 10 Jun, 9:30
  │
  ●  Autorizado — Lun 10 Jun, 10:15   (por: Gran Moff Admin)
  │
  ●  Entregado — Lun 10 Jun, 13:00
```

---

## 11. Admin Dashboard

### 11.1 Renombrado y copy

| Término actual | Propuesta |
|---|---|
| "Panel de administración" | "Centro de Comando Imperial" |
| "Todos los pedidos" | "Provisiones activas" |
| "Resumen del día" | "Informe de operaciones" |
| "Confirmar" | "Autorizar" |
| "Entregar" | "Despachar" |

---

### 11.2 ResumenPanel

Cards de métricas más visuales:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ 💰 Ingresos │  │ ⏳ En cola  │  │ ✅ Autorized │  │ 📦 Despachd │
│             │  │             │  │             │  │             │
│  $ 42.000   │  │     12      │  │     8       │  │     5       │
│  hoy        │  │  pedidos    │  │  pedidos    │  │  pedidos    │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

**Mejora visual:**
- Número grande en fuente bold
- Trend arrow si aplica (% vs ayer)
- Hover: tooltip con detalle
- Color de borde según métrica (rojo = cancelados, verde = entregados)

---

### 11.3 Admin Table

Mejoras a la tabla:

- **Columnas ordenables:** click en header ordena asc/desc (icono `ChevronUp/Down`)
- **Row highlight:** hover con fondo sutil
- **Compact mode:** opción de tabla densa para ver más filas
- **Quick search:** input de búsqueda por nombre de usuario en el header de la tabla
- **Sticky header:** el header de la tabla se mantiene visible al hacer scroll

---

### 11.4 Admin Profile / Settings

Nueva sección de configuración admin:

```
src/features/admin/pages/AdminSettingsPage.jsx
```

- Ver métricas históricas (si API lo provee)
- Gestión básica de configuración visual

---

## 12. Componentes Shared

### 12.1 Sidebar — mejoras

**Estado actual:** Sidebar oscuro con links, ya funciona bien.
**Mejoras:**

```
┌────────────────────┐
│  [Logo Imperial]   │  ← SVG animado, pequeño
│  Orden 66 Viandas  │
├────────────────────┤
│                    │
│  🏠  Dashboard     │
│  🍽️  Raciones      │
│  📦  Pedidos       │
│  👤  Perfil        │
│                    │
├────────────────────┤
│  [Avatar]          │
│  Nombre            │
│  Soldado Raso  🏅  │  ← rango imperial
│                    │
│  [Cerrar sesión]   │
└────────────────────┘
```

**Detalles:**
- Active link con fondo dorado/amber sutil y borde izquierdo dorado (ya tiene esto — mejorar el borde)
- Tooltip en modo colapsado (mobile)
- Indicador de notificaciones (si se agrega)

---

### 12.2 Spinner Imperial

Reemplazar spinner genérico por algo temático:

**Opción A:** Sello Imperial rotando (SVG animado)
**Opción B:** Puntos en patrón circular con brillo
**Opción C:** "Cargando datos imperiales..." con barra de progreso lineal

Recomendado: **Opción A** para páginas completas, **Opción C** (skeleton) para secciones.

---

### 12.3 EmptyState mejorado

Props actuales: `title`, `description`, `icon`, `action`

**Mejora:** Variantes según contexto:

```
vacío de pedidos:
  Icono: caja vacía
  "Sin provisiones registradas"
  "El Imperio aún no tiene registro de tus pedidos."
  [Hacer primer pedido]

vacío de menús:
  Icono: plato vacío
  "Sin raciones disponibles"
  "Las cocinas imperiales aún no publicaron el menú para esta fecha."

error:
  Icono: alerta roja
  "Fallo en transmisión"
  "No se pudo contactar al servidor. Intentá de nuevo."
  [Reintentar]
```

---

### 12.4 Toast — variantes con copy imperial

Configurar `sonner` con:

```js
toast.success('Provisión creada', {
  description: 'El Imperio ha registrado tu pedido.'
})

toast.error('Acceso denegado', {
  description: 'Credenciales inválidas. El Imperio rechazó la solicitud.'
})

toast.info('Sesión cerrada', {
  description: 'Hasta la próxima, soldado.'
})
```

---

### 12.5 ConfirmDialog genérico

Crear `src/shared/components/ConfirmDialog.jsx` reutilizable:

```jsx
<ConfirmDialog
  title="¿Anular provisión?"
  description="Esta acción no se puede deshacer. El Imperio cancelará tu pedido permanentemente."
  confirmLabel="Anular"
  cancelLabel="Volver atrás"
  variant="destructive"
  onConfirm={handleCancel}
/>
```

---

### 12.6 ErrorBoundary

```
src/shared/components/ErrorBoundary.jsx
```

- Class component o usando `react-error-boundary` lib
- Fallback: página de error con copy imperial y botón "Recargar"
- Log del error a consola en desarrollo

---

## 13. Animaciones

### 13.1 Animaciones prioritarias

| Dónde | Animación | Herramienta |
|---|---|---|
| Landing hero | Fade + scale logo + stagger texto | Motion |
| Login/Register | Fade + slide up del panel de formulario | Motion |
| Menu cards | Stagger de grid (ya implementado, mejorar) | Motion |
| Status badge cambio | Crossfade suave | Motion `AnimatePresence` |
| Sidebar items | Hover con slide left sutil | CSS transition |
| Page transitions | Fade entre rutas | Motion `AnimatePresence` |
| Admin table rows | Fade in de filas nuevas | Motion |
| Toast | Slide in desde abajo | Sonner nativo |
| Spinner | Rotación suave del sello imperial | CSS/Motion |
| HistorialTimeline | Slide in secuencial de items | Motion stagger |
| EmptyState | Bounce sutil del icono | Motion |

---

### 13.2 Principios de animación

- **Duración:** 150-300ms para micro-interacciones, 400-600ms para page transitions
- **Easing:** `ease-out` para entradas, `ease-in-out` para transiciones de estado
- **No animar:** listas muy largas (degradan perf), textos inline, inputs
- **Respetar:** `prefers-reduced-motion` → desactivar todo excepto fade

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

## 14. Responsive & Accesibilidad

### 14.1 Breakpoints

| Breakpoint | Layout sidebar | Cards |
|---|---|---|
| `< 640px` (mobile) | Sidebar oculto, hamburger menu | 1 columna |
| `640–1024px` (tablet) | Sidebar colapsado (solo iconos) | 2 columnas |
| `> 1024px` (desktop) | Sidebar completo | 3 columnas |

**Acción:** Agregar hamburger/drawer para mobile. El sidebar actual no existe en mobile.

---

### 14.2 Mobile navigation drawer

```
src/shared/components/MobileDrawer.jsx
```

- Drawer desde la izquierda con los mismos links del sidebar
- Backdrop oscuro al abrir
- Cierra al navegar
- Botón hamburger en top-left del header mobile

---

### 14.3 Accesibilidad

- Todos los botones con `aria-label` descriptivo
- Form fields con `htmlFor` ↔ `id` correctos (ya bien implementado)
- Focus visible en todos los elementos interactivos (no usar `outline: none` sin reemplazo)
- Contraste mínimo 4.5:1 para texto (dorado sobre oscuro — verificar)
- Error messages con `role="alert"` para screen readers

---

## Orden de implementación sugerido

### Sprint 1 — Estabilización (técnico, 1-2 días)
1. Fix `isLoading` en AuthContext
2. Fix redirect 401 con CustomEvent
3. Error boundary global
4. Null guards en `PedidoForm`
5. Centralizar `ESTADO_CONFIG`
6. Fix inconsistencia `.error` vs `.message`
7. Lazy loading de rutas

### Sprint 2 — Landing + Auth (UI, 2-3 días)
1. `LandingPage` completa con las 3 secciones
2. Mejorar `LoginPage` (dos paneles)
3. Mejorar `RegisterPage`
4. `NotFoundPage` imperial

### Sprint 3 — Profile + Sidebar (2 días)
1. `PerfilPage` con 3 tabs
2. `ImperialRankBadge`
3. Mejorar sidebar (avatar, rango, mobile drawer)
4. `MobileDrawer` para mobile

### Sprint 4 — Componentes shared + Toasts (1-2 días)
1. `ConfirmDialog` genérico
2. `ErrorBoundary`
3. `EmptyState` variantes
4. Copy imperial en toasts
5. `Spinner` imperial

### Sprint 5 — Feature pages (2-3 días)
1. Mejorar `MenuCard` (barra de cupo, hover)
2. Filtros como chips
3. Mejorar `PedidoCard`
4. `StatusBadge` rediseñado
5. Mejorar `AdminDashboard` (ResumenPanel, table)

### Sprint 6 — Polish & animaciones (1-2 días)
1. Animaciones de landing
2. Page transitions
3. Stagger en grids
4. `prefers-reduced-motion`
5. Responsive final

---

## Stack de nuevas dependencias (mínimas)

| Paquete | Uso | Prioritario |
|---|---|---|
| `react-error-boundary` | Error boundary declarativo | ✅ Sí |
| Sin nuevas deps para iconos | Usar lucide-react existente | — |
| Sin nuevas deps para animaciones | Motion ya instalado | — |
| Sin nuevas deps para forms | RHF + Zod ya instalados | — |

> El stack actual es suficiente. No agregar dependencias sin necesidad concreta.

---

*Última actualización: Junio 2026*
