# Orden 66 Viandas — Lineamientos para rehacer la UI completa

> Documento guía para reconstruir la interfaz de **Orden 66 Viandas** con una estética consistente, usable, visible y alineada al dominio real del proyecto.  
> Objetivo: dejar de tener una UI genérica y pasar a una aplicación clara, moderna, temática y defendible para portfolio.

---

## 1. Contexto del producto

**Orden 66 Viandas** es una aplicación full-stack para gestionar pedidos de viandas con cupos diarios.

La app debe resolver un flujo real:

- El usuario inicia sesión.
- Consulta menús disponibles por fecha.
- Ve cupos restantes.
- Crea un pedido.
- Puede editar o cancelar si el estado lo permite.
- Consulta detalle e historial.
- El administrador ve todos los pedidos.
- El administrador confirma, cancela o entrega pedidos.
- El administrador consulta un resumen operativo.

No es una landing page.  
No es una UI decorativa.  
No es una simulación genérica.

Es un sistema operativo de pedidos con reglas de negocio reales.

---

## 2. Identidad visual

La estética debe estar inspirada en una **interfaz imperial sci-fi / centro de comando**, pero sin copiar marcas, logos, personajes, símbolos oficiales ni elementos protegidos.

### Sensación buscada

La app debe sentirse como:

- Panel de control oscuro.
- Sistema de raciones institucional.
- Tecnología militar futurista.
- Órdenes, cupos y seguimiento.
- Precisión, control y claridad.

### Sensación a evitar

Evitar:

- UI demasiado genérica tipo Bootstrap sin identidad.
- Interfaces negras donde no se lee nada.
- Exceso de rojo que canse la vista.
- Iconos sin sentido.
- Decoración que tape la información.
- Falsos gráficos o datos inventados sin conexión con el backend.
- Copiar logos oficiales de franquicias.
- Hacer que todo parezca un meme.

La temática debe estar al servicio de la UX.

---

## 3. Principios de UX obligatorios

La interfaz debe priorizar:

1. **Claridad:** el usuario debe entender qué puede hacer en cada pantalla.
2. **Visibilidad:** texto, botones, filtros y estados deben tener buen contraste.
3. **Jerarquía:** lo importante va primero: estado del pedido, cupo disponible, fecha, acción principal.
4. **Consistencia:** mismos colores, mismos componentes, mismos espaciados.
5. **Feedback:** cada acción debe mostrar loading, éxito o error.
6. **Control:** el usuario debe poder cancelar, volver, limpiar filtros o corregir formularios.
7. **Prevención de errores:** avisar cupos, restricciones y estados antes de enviar.
8. **Backend como fuente de verdad:** el frontend muestra, pero no inventa reglas.
9. **Responsive:** debe verse bien en desktop y usable en mobile.
10. **Accesibilidad:** contraste, foco visible, labels, botones claros.

---

## 4. Paleta de colores

Usar una paleta híbrida: navegación oscura para conservar la identidad de centro de
comando y un área de trabajo cálida, clara y cómoda para operar durante varias horas.
La interfaz no debe depender de fondos oscuros para sentirse temática.

```css
:root {
  --workspace: #F4F1E9;
  --surface: #FFFDF8;
  --surface-soft: #EEE9DF;
  --border-soft: #DED8CC;

  --text-main: #211F1A;
  --text-secondary: #4F493F;
  --text-muted: #746D61;

  --navigation: #0B0D10;
  --navigation-panel: #151922;
  --navigation-border: #2F3645;

  --primary: #E11D48;
  --primary-hover: #BE123C;
  --primary-soft: rgba(225, 29, 72, 0.14);

  --success: #22C55E;
  --success-soft: rgba(34, 197, 94, 0.14);

  --warning: #FACC15;
  --warning-soft: rgba(250, 204, 21, 0.14);

  --info: #38BDF8;
  --info-soft: rgba(56, 189, 248, 0.14);

  --danger: #EF4444;
  --danger-soft: rgba(239, 68, 68, 0.14);
}
```

### Reglas de uso

- Fondo general del área operativa: `--workspace`.
- Cards principales: `--surface`.
- Cards secundarias y controles: `--surface-soft`.
- Borde de cards: `--border-soft`.
- Texto principal: `--text-main`.
- Texto descriptivo: `--text-secondary`.
- Texto auxiliar: `--text-muted`.
- Sidebar, login y superficies de marca: `--navigation`.
- Acciones principales: rojo imperial `--primary`.
- Rojo solo para acciones principales, alertas o marca. No abusar.
- No usar texto oscuro heredado y corregirlo después con overrides CSS.
- No usar sombras coloreadas por tipo de menú; el color comunica estado, no decoración.

---

## 5. Estados visuales

Los estados de pedido deben ser consistentes en toda la app.

```js
const ESTADO_STYLES = {
  pendiente: {
    label: "Pendiente",
    color: "warning",
    description: "Esperando confirmación"
  },
  confirmado: {
    label: "Confirmado",
    color: "info",
    description: "Pedido confirmado"
  },
  cancelado: {
    label: "Cancelado",
    color: "danger",
    description: "Pedido cancelado"
  },
  entregado: {
    label: "Entregado",
    color: "success",
    description: "Pedido entregado"
  }
};
```

### Badges

Los badges deben tener:

- Fondo suave translúcido.
- Borde del color correspondiente.
- Texto claro.
- No usar colores sólidos chillones que rompan el diseño.

Ejemplo:

```css
.badge-pendiente {
  color: #FACC15;
  background: rgba(250, 204, 21, 0.12);
  border: 1px solid rgba(250, 204, 21, 0.32);
}
```

---

## 6. Tipografía

Recomendación:

- Títulos / marca: `Orbitron`, `Rajdhani` o `Exo 2`.
- Texto de interfaz: `Inter`.

Uso recomendado:

```css
body {
  font-family: "Inter", system-ui, sans-serif;
}

.brand-title,
.page-title {
  font-family: "Orbitron", "Inter", sans-serif;
  letter-spacing: 0.04em;
}
```

No usar fuentes futuristas para todo, porque baja la legibilidad.

---

## 7. Layout general

La app debe tener una estructura consistente:

```txt
AppShell
├── Sidebar
├── Topbar
└── MainContent
    └── PageContent
```

### Desktop

- Sidebar fija izquierda.
- Topbar superior.
- Contenido con `max-width` razonable.
- Cards y tablas con buen espaciado.

### Mobile

- Sidebar colapsable.
- Topbar con botón menú.
- Tablas convertidas a cards.
- Filtros apilados.
- Botones grandes y tocables.

---

## 8. Componentes obligatorios

La UI debe construirse con componentes reutilizables. No repetir markup en cada pantalla.

### Componentes de layout

- `AppShell`
- `Sidebar`
- `Topbar`
- `PageHeader`
- `PageContainer`
- `Section`
- `Card`
- `StatCard`

### Componentes de feedback

- `LoadingState`
- `ErrorState`
- `EmptyState`
- `SuccessToast`
- `ConfirmDialog`

### Componentes de dominio

- `StatusBadge`
- `RoleBadge`
- `MenuCard`
- `OrderCard`
- `OrderTable`
- `OrderFilters`
- `OrderActions`
- `OrderTimeline`
- `QuotaIndicator`
- `AdminSummaryCards`
- `MenuQuotaList`

### Componentes de formularios

- `Input`
- `Select`
- `Textarea`
- `Button`
- `QuantityStepper`
- `FormField`
- `FieldError`

---

## 9. Animaciones con Motion

Usar `motion` o `framer-motion` para animaciones sutiles.  
No hacer animaciones exageradas.

### Instalar

```bash
npm install motion
```

o si el proyecto ya usa framer-motion:

```bash
npm install framer-motion
```

### Reglas de animación

Usar animaciones para:

- Entrada de páginas.
- Aparición de cards.
- Hover de botones.
- Cambio de estado.
- Expansión de filtros.
- Apertura de modales.
- Loading skeleton.

Evitar:

- Animaciones lentas.
- Rebotes innecesarios.
- Glows exagerados.
- Efectos que dificulten leer.

### Duraciones

```js
const motionConfig = {
  fast: 0.15,
  normal: 0.22,
  slow: 0.35
};
```

### Ejemplo de page transition

```jsx
import { motion } from "motion/react";

export function PageContainer({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="page-container"
    >
      {children}
    </motion.main>
  );
}
```

---

## 10. Datos reales y no alucinados

La UI debe usar únicamente datos reales provenientes del backend o datos de seed conocidos.

### Entidades reales

Usuario:

```js
{
  id,
  nombre,
  email,
  rol,
  activo
}
```

Menú:

```js
{
  id,
  nombre,
  descripcion,
  fecha,
  tipo,
  precio,
  cupoDiario,
  activo,
  cupoDisponible
}
```

Pedido:

```js
{
  id,
  menuId,
  usuarioId,
  fecha,
  cantidad,
  turnoEntrega,
  puntoRetiro,
  total,
  estado,
  observaciones
}
```

Historial:

```js
{
  id,
  pedidoId,
  usuarioId,
  accion,
  fechaHora,
  valorAnterior,
  valorNuevo
}
```

### Prohibido

No inventar:

- Usuarios ficticios si el backend no los devuelve.
- Fechas no existentes.
- Métricas no calculadas.
- Gráficos sin datos.
- Campos que no existen en la API.
- Estados que no existen.
- Roles extra no implementados.
- Imágenes falsas obligatorias si no hay soporte en backend.

Si no hay imagen del menú, usar un placeholder abstracto consistente, no fotos aleatorias.

---

## 11. Textos y microcopy

El tono debe ser temático, pero claro.

### Branding

- `Orden 66 Viandas`
- `Sistema de gestión de raciones`
- `Control de raciones con precisión imperial`

### Navegación

Usar nombres entendibles:

- `Panel Central`
- `Mis Pedidos`
- `Nueva Orden`
- `Menús Disponibles`
- `Resumen Administrativo`
- `Cerrar Sesión`

### Acciones

- `Crear pedido`
- `Editar pedido`
- `Cancelar pedido`
- `Confirmar pedido`
- `Marcar como entregado`
- `Ver detalle`
- `Limpiar filtros`

Evitar microcopy demasiado meme como:

- `Ejecutar orden`
- `Eliminar rebelde`
- `Activar protocolo`
- `Alto mando supremo`

Puede ser gracioso, pero baja la claridad y profesionalismo.

---

## 12. Pantallas a rehacer

### 12.1 Login

Debe tener:

- Marca clara.
- Formulario simple.
- Email.
- Password.
- Botón principal.
- Error visible.
- Loading al enviar.
- Link a registro si está implementado.

#### Prompt específico

```txt
Rehacer la pantalla de Login de Orden 66 Viandas con estética dark sci-fi imperial sobria, sin logos oficiales ni personajes. Debe tener una card central legible con título "Orden 66 Viandas", subtítulo "Sistema de gestión de raciones", campos email y contraseña, botón principal rojo "Ingresar", manejo visual de error, estado loading y link a registro. Mantener alto contraste, bordes sutiles, fondo oscuro con glow rojo moderado. No usar textos inventados raros ni decoración que afecte legibilidad.
```

---

### 12.2 Registro

Debe tener:

- Nombre.
- Email.
- Password.
- Confirmación de password si existe en frontend.
- Botón.
- Errores por campo.
- Link a login.

#### Prompt específico

```txt
Crear pantalla de Registro para Orden 66 Viandas, consistente con el Login. Debe permitir alta de usuario común con nombre, email y contraseña. Mostrar errores por campo, loading y feedback de éxito. Usar cards oscuras, bordes metálicos, rojo imperial solo para acción principal y mensajes de foco. Mantener la UI profesional y clara.
```

---

### 12.3 Dashboard usuario

Debe responder a la pregunta: **¿Qué necesita saber el usuario apenas entra?**

Debe mostrar:

- Próximo pedido.
- Estado del pedido de hoy.
- Acceso rápido a crear pedido.
- Últimos pedidos.
- Menús disponibles del día.

#### Prompt específico

```txt
Rehacer el Dashboard Usuario de Orden 66 Viandas con foco total en la experiencia del usuario. Mostrar un saludo con el nombre real del usuario, una card principal con el próximo pedido o un empty state si no tiene pedido, estado actual con badge, fecha y turno de entrega, botón "Ver detalle" y botón "Nueva orden". Agregar cards secundarias para pedidos activos, pedidos pendientes y gasto estimado si el backend lo provee. Mostrar una sección de menús disponibles del día usando datos reales de la API. Usar layout limpio, responsive, dark sci-fi sobrio, buena jerarquía visual y animaciones suaves con motion.
```

---

### 12.4 Menús disponibles

Debe mostrar:

- Filtro por fecha.
- Filtro por tipo.
- Menús disponibles.
- Cupo disponible.
- Precio.
- Botón pedir.
- Estado activo/inactivo si corresponde.

#### Prompt específico

```txt
Rehacer la pantalla Menús Disponibles de Orden 66 Viandas como una grilla de cards claras y usables. Cada card debe mostrar nombre del menú, descripción, fecha, tipo, precio, cupo diario y cupo disponible calculado por backend. Incluir badges por tipo: clásico, vegetariano, vegano, sin TACC. Si no hay imagen real, usar un placeholder visual abstracto consistente, no fotos inventadas. Agregar filtros por fecha y tipo. El botón principal debe ser "Pedir" y debe deshabilitarse si no hay cupo o el menú está inactivo. Mantener contraste alto y estados visibles.
```

---

### 12.5 Listado de pedidos

Debe mostrar:

- Filtros combinables.
- Fecha.
- Estado.
- Menú.
- Tipo de menú.
- Paginación.
- Ordenamiento.
- Acciones por rol.

#### Prompt específico

```txt
Rehacer el Listado de Pedidos de Orden 66 Viandas con una tabla desktop y cards en mobile. Debe incluir filtros por fecha, estado, menú y tipo, botón limpiar filtros, paginación y ordenamiento si está disponible en la API. Mostrar columnas: código, fecha, menú, cantidad, turno, estado, total y acciones. Las acciones deben depender del rol y estado: ver detalle, editar, cancelar, confirmar o entregar según permisos. Usar StatusBadge consistente, empty state cuando no haya resultados, loading skeleton y error visible si falla la API.
```

---

### 12.6 Crear / editar pedido

Debe mostrar:

- Menú.
- Cantidad.
- Turno.
- Punto de retiro.
- Observaciones.
- Cupo disponible.
- Total estimado.
- Validaciones.
- Error real de backend.

#### Prompt específico

```txt
Rehacer el formulario Crear/Editar Pedido de Orden 66 Viandas con un flujo claro y simple. El usuario debe elegir menú, cantidad, turno de entrega, punto de retiro y observaciones. Mostrar una card lateral o inferior con resumen: menú seleccionado, precio unitario, cantidad, cupo disponible y total estimado. Aclarar que el total final se valida en backend. Validar cantidad mayor a cero en frontend, pero mostrar errores reales de backend para cupo insuficiente, menú inactivo, fecha no disponible o permisos. Usar QuantityStepper, Selects claros, botón principal "Guardar pedido" o "Crear pedido", y animaciones suaves al cambiar menú o cantidad.
```

---

### 12.7 Detalle de pedido

Debe mostrar:

- Datos del pedido.
- Datos del menú.
- Estado.
- Total.
- Acciones.
- Historial.

#### Prompt específico

```txt
Rehacer Detalle de Pedido de Orden 66 Viandas como una pantalla de seguimiento clara. Mostrar título "Pedido #ID", estado con badge visible, fecha, menú, cantidad, turno, punto de retiro, total y observaciones. Agregar una sección de acciones según rol y estado. Mostrar historial como timeline vertical con fecha, usuario, acción, valor anterior y valor nuevo si existen. Si el pedido está entregado, deshabilitar edición y mostrar explicación. Usar componentes reutilizables y animaciones sutiles.
```

---

### 12.8 Panel administrativo

Debe ser operativo, no decorativo.

Debe mostrar:

- Pedidos por estado.
- Cupos restantes por menú.
- Importe estimado.
- Pedidos pendientes de entrega.
- Alertas de bajo cupo.

#### Prompt específico

```txt
Rehacer el Panel Administrativo de Orden 66 Viandas como un dashboard operativo para admin. Mostrar cards de resumen con pedidos pendientes, confirmados, entregados, cancelados e importe estimado según datos reales del endpoint resumen. Agregar sección de cupos restantes por menú con barras de progreso y alerta si el cupo disponible es bajo. Mostrar pedidos pendientes de confirmación o entrega con acciones rápidas. No inventar gráficos si la API no devuelve datos suficientes. Si se muestra un gráfico, debe derivarse de datos reales. Mantener estética dark imperial sobria, pero priorizando lectura y toma de decisiones.
```

---

### 12.9 Página 404

#### Prompt específico

```txt
Crear página 404 para Orden 66 Viandas con estética consistente. Mostrar título "Ruta no encontrada", texto breve indicando que la sección no existe, y botón para volver al Panel Central. Evitar chistes excesivos o referencias que confundan.
```

---

## 13. Arquitectura frontend recomendada

Usar esta estructura:

```txt
src/
├── app/
│   ├── App.jsx
│   └── router.jsx
├── components/
│   ├── layout/
│   ├── ui/
│   ├── feedback/
│   ├── pedidos/
│   ├── menus/
│   └── admin/
├── context/
│   └── AuthContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── usePedidos.js
│   └── useMenus.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── menusService.js
│   └── pedidosService.js
├── styles/
│   ├── globals.css
│   ├── tokens.css
│   └── components.css
├── utils/
│   ├── formatters.js
│   ├── status.js
│   └── permissions.js
└── pages/
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── DashboardPage.jsx
    ├── MenusPage.jsx
    ├── PedidosPage.jsx
    ├── PedidoFormPage.jsx
    ├── PedidoDetailPage.jsx
    ├── AdminResumenPage.jsx
    └── NotFoundPage.jsx
```

---

## 14. Servicios Axios

No hacer llamadas HTTP dentro de todos los componentes.

### `api.js`

```js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

### Reglas

- `authService` maneja login/register.
- `menusService` maneja menús.
- `pedidosService` maneja pedidos.
- Componentes solo llaman hooks o services, no mezclan Axios en todos lados.

---

## 15. Permisos en frontend

La UI debe ocultar o mostrar acciones, pero el backend sigue siendo la fuente de verdad.

### Reglas esperadas

Usuario común:

- Puede crear pedidos.
- Puede ver sus pedidos.
- Puede editar pedidos no entregados si son propios.
- Puede cancelar pedidos propios pendientes o confirmados.

Admin:

- Puede ver todos.
- Puede confirmar.
- Puede cancelar.
- Puede entregar.
- Puede ver resumen.

Crear helper:

```js
export const canEditPedido = (pedido, user) => {
  if (!pedido || !user) return false;
  if (pedido.estado === "entregado") return false;
  if (user.rol === "admin") return true;
  return pedido.usuarioId === user.id;
};

export const canCancelPedido = (pedido, user) => {
  if (!pedido || !user) return false;
  if (!["pendiente", "confirmado"].includes(pedido.estado)) return false;
  if (user.rol === "admin") return true;
  return pedido.usuarioId === user.id;
};

export const canConfirmPedido = (user) => user?.rol === "admin";

export const canDeliverPedido = (pedido, user) => {
  return user?.rol === "admin" && pedido?.estado === "confirmado";
};
```

---

## 16. Estados de carga y error

Toda pantalla que consuma API debe manejar:

- `loading`
- `error`
- `empty`
- `success`

### No permitido

- Pantalla vacía mientras carga.
- Romper si `data` es `undefined`.
- Mostrar errores solo en consola.
- Alert feo del navegador.
- Mensajes técnicos crudos como `Request failed with status code 400`.

### Mensajes recomendados

```txt
No se pudieron cargar los pedidos.
No hay pedidos para los filtros seleccionados.
No hay menús disponibles para esta fecha.
El pedido fue creado correctamente.
No hay cupo disponible para el menú seleccionado.
No tenés permisos para realizar esta acción.
```

---

## 17. Componentes UI base

### Button

Variantes:

- `primary`
- `secondary`
- `danger`
- `ghost`
- `outline`

Estados:

- `default`
- `hover`
- `focus`
- `disabled`
- `loading`

### Card

Variantes:

- `default`
- `interactive`
- `danger`
- `success`
- `warning`

### Input / Select

Debe tener:

- label visible.
- error visible.
- disabled state.
- focus visible.
- helper text opcional.

---

## 18. Responsive

### Desktop

- Tablas completas.
- Sidebar visible.
- Filtros horizontales.
- Cards en grilla.

### Tablet

- Sidebar compacta.
- Filtros en dos columnas.
- Tablas con scroll horizontal si hace falta.

### Mobile

- Sidebar tipo drawer.
- Tablas como cards.
- Botones full width.
- Formularios una sola columna.
- Acciones principales abajo.

---

## 19. Checklist visual

Antes de aceptar la UI, revisar:

```txt
[ ] ¿Se lee bien todo sobre fondo oscuro?
[ ] ¿Los botones principales son obvios?
[ ] ¿Los estados se distinguen sin depender solo del color?
[ ] ¿Los filtros son claros?
[ ] ¿La pantalla de nuevo pedido explica cupo y total?
[ ] ¿El admin ve información útil y no decorativa?
[ ] ¿Los errores de API se muestran en pantalla?
[ ] ¿Hay loading states?
[ ] ¿Hay empty states?
[ ] ¿La UI es consistente entre pantallas?
[ ] ¿No se inventaron datos que no existen?
[ ] ¿No se usaron logos/personajes protegidos?
[ ] ¿Funciona en mobile?
```

---

## 20. Prompt maestro para rehacer toda la UI

```txt
Necesito rehacer por completo la UI de mi app React/Vite llamada "Orden 66 Viandas". Es una aplicación full-stack real para gestionar pedidos de viandas con cupos diarios, roles y estados. No quiero una UI genérica ni decorativa: quiero una interfaz consistente, usable, profesional, oscura y con estética sci-fi imperial sobria, sin copiar logos/personajes/símbolos oficiales de ninguna franquicia.

Objetivo:
Reconstruir la interfaz completa priorizando UX, legibilidad, consistencia visual y conexión real con el backend. El usuario debe poder iniciar sesión, ver menús disponibles, crear pedidos, ver sus pedidos, editar/cancelar cuando corresponde, ver detalle e historial. El administrador debe poder ver resumen, cupos, pedidos por estado y acciones administrativas.

Stack:
React + Vite.
React Router.
Axios en capa de services.
Context para auth.
Motion/framer-motion para animaciones sutiles.
CSS modular o CSS organizado con tokens globales.

Lineamientos visuales:
Usar fondo #0B0D10, paneles #151922 / #1F2430, bordes #334155, texto principal #F8FAFC, texto secundario #CBD5E1, rojo principal #E11D48. Usar verde, amarillo, azul y rojo para estados. Mantener alto contraste. No usar rojo en exceso. La estética debe sentirse como un centro de control imperial, pero la información debe ser clara.

Componentización obligatoria:
Crear componentes reutilizables: AppShell, Sidebar, Topbar, PageHeader, Card, StatCard, Button, Input, Select, Textarea, StatusBadge, MenuCard, OrderTable, OrderCard, OrderFilters, OrderActions, OrderTimeline, QuotaIndicator, LoadingState, EmptyState, ErrorState y ConfirmDialog.

Pantallas obligatorias:
Login, Registro, Dashboard Usuario, Menús Disponibles, Listado de Pedidos, Crear/Editar Pedido, Detalle de Pedido con historial, Panel Administrativo y NotFound.

Reglas de datos:
No inventar campos ni métricas. Usar solo datos reales de la API. Entidades reales:
Usuario: id, nombre, email, rol, activo.
Menú: id, nombre, descripcion, fecha, tipo, precio, cupoDiario, activo, cupoDisponible si viene de backend.
Pedido: id, menuId, usuarioId, fecha, cantidad, turnoEntrega, puntoRetiro, total, estado, observaciones.
Historial: id, pedidoId, usuarioId, accion, fechaHora, valorAnterior, valorNuevo.

Estados:
pendiente, confirmado, cancelado, entregado.
Usar badges consistentes. Acciones según rol y estado. No confiar solo en ocultar botones: backend valida, frontend solo mejora UX.

UX:
Toda pantalla con API debe manejar loading, error, empty y success. Mostrar errores visibles y humanos. Nada de alerts del navegador. Formularios con labels, errores por campo y botones disabled/loading. Responsive real: desktop con tabla, mobile con cards. Animaciones suaves con motion para entrada de páginas, cards, modales y cambios de estado.

Quiero que primero reorganices la estructura frontend si hace falta, luego rehagas tokens CSS, componentes base y finalmente cada pantalla. Entregar código limpio, mantenible y modular.
```

---

## 21. Prompt para auditar una pantalla ya hecha

```txt
Audita esta pantalla de Orden 66 Viandas. Evaluá si cumple con: legibilidad, contraste, jerarquía visual, consistencia con el sistema dark sci-fi imperial, conexión con datos reales del backend, manejo de loading/error/empty, responsive y permisos por rol. No cambies lógica de negocio sin justificar. Proponé mejoras concretas y luego aplicalas en código limpio y modular.
```

---

## 22. Prompt para evitar alucinaciones

```txt
Antes de modificar código, revisá qué datos devuelve actualmente cada service/API. No inventes propiedades ni métricas. Si una pantalla necesita un dato que la API no devuelve, dejá un fallback claro o indicá qué endpoint debería ampliarse. No uses gráficos, imágenes o estadísticas si no están respaldados por datos reales. Priorizá UI honesta y funcional.
```

---

## 23. Prompt para componentes

```txt
Refactorizá esta UI creando componentes reutilizables. Evitá duplicación. Separá componentes de layout, ui base, feedback y dominio. Cada componente debe recibir props claras, no depender de datos globales salvo que sea necesario. Mantener estilos consistentes usando tokens CSS. Agregar animaciones sutiles con motion solo donde mejore la experiencia.
```

---

## 24. Definición de terminado

La UI se considera aceptable cuando:

- Se entiende el flujo sin explicación.
- Las pantallas comparten identidad visual.
- Los textos son legibles.
- Hay loading, error y empty states.
- Las acciones respetan rol y estado.
- No se alucinan datos.
- La app puede usarse en desktop y mobile.
- Los formularios muestran errores claros.
- La estética temática suma, no molesta.
- El código queda modular y mantenible.
