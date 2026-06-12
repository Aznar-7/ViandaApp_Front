# Roadmap — Viandas Front

## Stack

| Herramienta | Rol |
|---|---|
| React 19 + Vite | Core |
| Tailwind CSS v4 | Estilos |
| shadcn/ui | Componentes UI |
| Motion | Animaciones |
| React Router v7 | Navegación |
| Axios | HTTP + interceptores |
| Context API | Estado global auth |

---

## Arquitectura de carpetas

```
src/
├── features/
│   ├── auth/
│   │   ├── components/     # LoginForm, RegisterForm
│   │   ├── pages/          # LoginPage, RegisterPage
│   │   ├── hooks/          # useAuth
│   │   └── services/       # authService.js
│   ├── menus/
│   │   ├── components/     # MenuCard, MenuFilters, MenuGrid
│   │   ├── pages/          # MenusPage
│   │   ├── hooks/          # useMenus
│   │   └── services/       # menuService.js
│   ├── pedidos/
│   │   ├── components/     # PedidoCard, PedidoForm, PedidoFilters, StatusBadge, CancelButton
│   │   ├── pages/          # PedidosPage, PedidoDetailPage, PedidoFormPage
│   │   ├── hooks/          # usePedidos, usePedido
│   │   └── services/       # pedidoService.js
│   └── admin/
│       ├── components/     # AdminTable, StatusActions, ResumenCard, ResumenPanel, HistorialTimeline
│       ├── pages/          # AdminDashboard, HistorialPage
│       ├── hooks/          # useAdminPedidos, useResumen
│       └── services/       # adminService.js
├── shared/
│   ├── components/         # Navbar, PageLayout, Spinner, EmptyState, ErrorMessage, Pagination, ConfirmDialog
│   ├── hooks/              # useToast, usePagination
│   └── utils/              # formatDate.js, formatCurrency.js, cn.js
├── context/
│   └── AuthContext.jsx
├── lib/
│   └── axios.js
└── router/
    ├── index.jsx
    ├── ProtectedRoute.jsx
    └── AdminRoute.jsx
```

---

## Rutas

```
/                             → redirect según rol
/login                        → LoginPage (pública)
/register                     → RegisterPage (pública)
/menus                        → MenusPage (autenticado)
/pedidos                      → PedidosPage (autenticado)
/pedidos/nuevo                → PedidoFormPage — crear (usuario)
/pedidos/:id                  → PedidoDetailPage (autenticado)
/pedidos/:id/editar           → PedidoFormPage — editar (usuario)
/admin                        → AdminDashboard (admin)
/admin/pedidos/:id/historial  → HistorialPage (admin)
*                             → NotFoundPage
```

---

## Fase 1 — Infraestructura base

**Objetivo:** Proyecto listo para desarrollar sin deuda técnica.

### Checklist

- [ ] Instalar `react-router-dom`, `axios`
- [ ] Inicializar shadcn/ui (`npx shadcn@latest init`)
- [ ] Agregar componentes shadcn: `button`, `input`, `label`, `card`, `badge`, `form`, `select`, `textarea`, `dialog`, `toast`, `table`, `skeleton`, `separator`
- [ ] Crear estructura de carpetas completa
- [ ] Configurar `.env.local` con `VITE_API_URL`
- [ ] Crear `lib/axios.js` — instancia global + interceptores
- [ ] Crear `context/AuthContext.jsx` — estado auth + persistencia
- [ ] Crear `router/ProtectedRoute.jsx`
- [ ] Crear `router/AdminRoute.jsx`
- [ ] Crear `router/index.jsx` con todas las rutas

### `lib/axios.js`
- Instancia con `baseURL` desde `VITE_API_URL`
- Interceptor request: adjunta `Authorization: Bearer <token>`
- Interceptor response: captura 401 → logout + redirect `/login`

### `context/AuthContext.jsx`
- Estado: `{ user, token, isLoading }`
- Métodos: `login()`, `logout()`, `register()`
- Persistencia en `localStorage`
- Restauración de sesión al montar

---

## Fase 2 — Feature: Auth

**Páginas:** `LoginPage`, `RegisterPage`

### Componentes

| Componente | Descripción |
|---|---|
| `LoginForm` | Email + password, validación, manejo error 401 |
| `RegisterForm` | Nombre + email + password + confirmación |

### Checklist

- [ ] `features/auth/services/authService.js` — `login()`, `register()`
- [ ] `features/auth/hooks/useAuth.js` — consume `AuthContext`
- [ ] `features/auth/components/LoginForm.jsx`
- [ ] `features/auth/components/RegisterForm.jsx`
- [ ] `features/auth/pages/LoginPage.jsx`
- [ ] `features/auth/pages/RegisterPage.jsx`

### Detalles
- Formularios con shadcn `Form` + `Input` + `Button`
- Animación de entrada con `motion.div` (fade + slide up)
- Mensajes de error inline por campo
- Loading state en botón durante submit
- Redirección post-login según rol: `/pedidos` (usuario) / `/admin` (admin)
- Rutas públicas redirigen a `/pedidos` si ya hay sesión activa

---

## Fase 3 — Feature: Menús

**Página:** `MenusPage`

### Componentes

| Componente | Descripción |
|---|---|
| `MenuCard` | Nombre, tipo, precio, cupo disponible, badge de tipo |
| `MenuFilters` | Filtro por tipo (clasico / vegetariano / vegano / sin_tacc) y fecha |
| `MenuGrid` | Grid responsivo de MenuCards |

### Checklist

- [ ] `features/menus/services/menuService.js` — `getMenus()`
- [ ] `features/menus/hooks/useMenus.js`
- [ ] `features/menus/components/MenuCard.jsx`
- [ ] `features/menus/components/MenuFilters.jsx`
- [ ] `features/menus/components/MenuGrid.jsx`
- [ ] `features/menus/pages/MenusPage.jsx`

### Detalles
- Datos desde `GET /api/menus`
- Filtros aplicados client-side
- Badge con color según tipo de menú
- Indicador visual de cupo bajo (< 20% del cupoDiario)
- Animación stagger en la grilla con Motion

---

## Fase 4 — Feature: Pedidos (usuario)

**Páginas:** `PedidosPage`, `PedidoDetailPage`, `PedidoFormPage`

### Componentes

| Componente | Descripción |
|---|---|
| `PedidoCard` | Resumen de pedido con estado visual |
| `StatusBadge` | Badge con color según estado (pendiente / confirmado / cancelado / entregado) |
| `PedidoFilters` | Filtro por estado, fecha, turno |
| `PedidoForm` | Formulario crear/editar con selector de menú |
| `PedidoDetail` | Vista completa del pedido |
| `CancelButton` | Botón con `ConfirmDialog` antes de ejecutar |

### Checklist

- [ ] `features/pedidos/services/pedidoService.js` — `getPedidos()`, `getPedido()`, `createPedido()`, `updatePedido()`, `cancelarPedido()`
- [ ] `features/pedidos/hooks/usePedidos.js`
- [ ] `features/pedidos/hooks/usePedido.js`
- [ ] `features/pedidos/components/StatusBadge.jsx`
- [ ] `features/pedidos/components/PedidoCard.jsx`
- [ ] `features/pedidos/components/PedidoFilters.jsx`
- [ ] `features/pedidos/components/PedidoForm.jsx`
- [ ] `features/pedidos/components/PedidoDetail.jsx`
- [ ] `features/pedidos/components/CancelButton.jsx`
- [ ] `features/pedidos/pages/PedidosPage.jsx`
- [ ] `features/pedidos/pages/PedidoDetailPage.jsx`
- [ ] `features/pedidos/pages/PedidoFormPage.jsx`

### Detalles
- `PedidosPage`: listado propio filtrado + paginación server-side
- `PedidoForm`: selección de menú, cantidad con validación de cupo en tiempo real, turno (almuerzo/cena), punto de retiro
- `PedidoForm` reutilizado para crear y editar (detecta si hay `:id`)
- Cancelación con `ConfirmDialog` antes de llamar al endpoint
- Flujo de estados visible mediante `StatusBadge` animado

---

## Fase 5 — Feature: Admin

**Páginas:** `AdminDashboard`, `HistorialPage`

### Componentes

| Componente | Descripción |
|---|---|
| `AdminTable` | Tabla de todos los pedidos con acciones inline |
| `StatusActions` | Botones confirmar / entregar / cancelar según estado actual |
| `ResumenCard` | Tarjeta con una métrica del día |
| `ResumenPanel` | Grid de `ResumenCard` |
| `HistorialTimeline` | Timeline de cambios de estado de un pedido |

### Checklist

- [ ] `features/admin/services/adminService.js` — `getAllPedidos()`, `getResumen()`, `confirmarPedido()`, `entregarPedido()`, `cancelarPedidoAdmin()`, `getHistorial()`
- [ ] `features/admin/hooks/useAdminPedidos.js`
- [ ] `features/admin/hooks/useResumen.js`
- [ ] `features/admin/components/AdminTable.jsx`
- [ ] `features/admin/components/StatusActions.jsx`
- [ ] `features/admin/components/ResumenCard.jsx`
- [ ] `features/admin/components/ResumenPanel.jsx`
- [ ] `features/admin/components/HistorialTimeline.jsx`
- [ ] `features/admin/pages/AdminDashboard.jsx`
- [ ] `features/admin/pages/HistorialPage.jsx`

### Detalles
- `AdminDashboard`: tabla con todos los pedidos, filtros avanzados por estado/fecha/usuario, paginación
- `StatusActions`: renderiza solo las transiciones válidas según el estado actual del pedido
  - `pendiente` → confirmar | cancelar
  - `confirmado` → entregar | cancelar
- `ResumenPanel`: total pedidos hoy, pendientes, confirmados, entregados, ingresos del día
- `HistorialTimeline`: timeline animado con Motion mostrando cada entrada del historial
- Columnas ordenables en la tabla (fecha, estado, total)

---

## Fase 6 — Shared components y UX

### Componentes compartidos

| Componente | Descripción |
|---|---|
| `Navbar` | Nav principal con nombre de usuario, rol, botón logout |
| `PageLayout` | Wrapper con `Navbar` + padding consistente |
| `Spinner` | Loading indicator centrado |
| `EmptyState` | Placeholder cuando no hay datos con ícono y mensaje |
| `ErrorMessage` | Bloque de error con ícono y descripción |
| `Pagination` | Paginación reutilizable (recibe `page`, `total`, `onPageChange`) |
| `ConfirmDialog` | Dialog genérico de confirmación (título, mensaje, onConfirm) |

### Checklist

- [ ] `shared/components/Navbar.jsx`
- [ ] `shared/components/PageLayout.jsx`
- [ ] `shared/components/Spinner.jsx`
- [ ] `shared/components/EmptyState.jsx`
- [ ] `shared/components/ErrorMessage.jsx`
- [ ] `shared/components/Pagination.jsx`
- [ ] `shared/components/ConfirmDialog.jsx`
- [ ] `shared/hooks/useToast.js`
- [ ] `shared/hooks/usePagination.js`
- [ ] `shared/utils/formatDate.js`
- [ ] `shared/utils/formatCurrency.js`
- [ ] `shared/utils/cn.js` (wrapper de `clsx` + `tailwind-merge`)
- [ ] `router/NotFoundPage.jsx` con animación

### Animaciones con Motion

| Donde | Animación |
|---|---|
| Login / Register page | Fade + slide up al montar |
| Grillas de cards | Stagger de children |
| StatusBadge | Transición de color suave |
| Page transitions | Fade entre rutas |
| Error de formulario | Shake horizontal |
| HistorialTimeline | Slide in secuencial |

### Responsive

| Breakpoint | Layout |
|---|---|
| Mobile (`< sm`) | Stack vertical, una columna |
| Tablet (`sm–lg`) | Grid 2 columnas |
| Desktop (`> lg`) | Grid 3 columnas, tabla completa visible |

---

## Fase 7 — Calidad y cierre

### Checklist

- [ ] `.env.local` documentado con variables necesarias
- [ ] Manejo centralizado de errores HTTP vía interceptor + toast
- [ ] Sin `console.log` en código de producción
- [ ] ESLint sin warnings
- [ ] Todas las rutas protegidas correctamente testeadas manualmente
- [ ] Flujo completo usuario: register → login → ver menús → crear pedido → cancelar pedido
- [ ] Flujo completo admin: login → ver todos los pedidos → confirmar → entregar → ver historial

---

## Variables de entorno

```env
# .env.local
VITE_API_URL=http://localhost:3000/api
```

---

## Flujo de estados (referencia)

```
pendiente ──→ confirmado ──→ entregado
    │               │
    └───────────────┴──→ cancelado
```

## Códigos HTTP manejados en frontend

| Código | Acción en UI |
|---|---|
| 400 | Mostrar errores de validación inline |
| 401 | Logout automático + redirect a /login |
| 403 | Toast "Sin permisos" |
| 404 | Toast "No encontrado" |
| 500 | Toast "Error del servidor" |
