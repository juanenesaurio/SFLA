# SFLA - Sistema Fululunqueador de La Aguarescencia

## Project Overview
Restaurant order management system for "La Aguarescencia". Single-page application (SPA) that manages orders through a multi-step workflow with Google Apps Script backend integration.

## Architecture

### Core Files
- **[index.html](../index.html)**: Complete UI structure with Tailwind CSS. All sections (welcome, user selection, menu, orders) are hidden/shown via JavaScript.
- **[app.js](../app.js)**: ~2000 lines containing all business logic, state management, and backend communication.

### Data Flow
1. **Local-first**: All orders stored in `localStorage` as `ordenesDelDia` array
2. **Backend sync**: Google Apps Script Web App persists data to Google Sheets ("VENTAS_HOY" tab)
3. **Dual-layer persistence**: Local storage serves as cache; backend is source of truth

### Backend Integration
- **Base URL**: `BACKEND_URL` constant points to Google Apps Script web app
- **Communication**: `fetchToGAS(data)` wrapper handles all API calls with error formatting
- **Actions**: `crearOrden`, `editarOrden`, `listarOrdenes`, `cambiarEstado`
- **Error handling**: Includes Spanish user-friendly messages for missing sheets, connection issues

## Key State Variables

```javascript
let ordenesDelDia = [];        // Array of all orders
let ordenEnEdicion = null;     // Index when editing existing order (null = new order)
let ordenEnModalActual = null; // Index of order shown in details modal
let historial = [];            // Current cart items
let productosEliminados = [];  // Recently removed items (rescuable)
let usuarioActual = null;      // Current logged-in user
let mesaNum = null;            // Selected table number
let chismeClientil = '';       // Order notes/observations
```

## Critical Patterns

### Long-press Button Activation
All destructive actions (finalizar, vaciar, cancelar, borrar) use long-press pattern:
- `onmousedown`/`ontouchstart`: Start timer + add visual ring (`ring-4 ring-color`)
- `onmouseup`/`ontouchend`: Cancel timer + remove ring
- Timer executes async action after 1.2s-5s depending on action

Example: [app.js#L1378-L1464](../app.js#L1378-L1464) - `activarFinalizar()`

### Order State Machine
- **abierta**: Newly created (default)
- **editada**: Modified after creation
- **cancelada**: Cancelled (read-only)
- **pagada**: Paid (read-only)

Read-only states hide edit buttons in modal: [app.js#L1631-L1648](../app.js#L1631-L1648)

### Section Toggle Pattern
Every product category uses:
1. `toggle{Category}()` - shows/hides form via `.classList.toggle("hidden")`
2. `seleccionar{Item}()` - updates selected state object
3. `confirmar{Item}()` - adds to `historial[]` with structured format

### Product Structure
```javascript
{
  nombre: "Combo Sencilla x2",
  precio: 120,
  extras: {
    hamburguesa: "Sin cebolla",
    bebida: "Jamaica personalizada: sin hielo",
    consideracion: "Cliente quiere extra salsa"
  }
}
```

## Development Workflow

### Local Testing
1. Open [index.html](../index.html) directly in browser (no build step required)
2. Use browser DevTools console to debug state: `console.log(ordenesDelDia)`
3. Clear localStorage: `localStorage.clear()` to reset test data

### Backend Setup Requirements
Google Sheets must have "VENTAS_HOY" tab with headers:
`orden_id | usuario | mesa | descripcion | hora_creacion | hora_ultima_edicion | productos | total | estado | observaciones | orden_activa`

### Common Edits
- **Add product**: Create toggle/form/confirm functions following pattern at [app.js#L319-L380](../app.js#L319-L380)
- **Modify prices**: Update in button text in [index.html](../index.html) AND in `confirmar*()` function in [app.js](../app.js)
- **Add user**: Update dropdown in [index.html#L54-L58](../index.html#L54-L58)
- **Change timer duration**: Modify `setTimeout` values in `activar*()` functions

## Navigation Flow
```
bienvenida → barraUsuarios → bienvenidaUsuario → menuPrincipal
                                                   ↓
                                       ┌───────────┴────────────┐
                                   nuevaOrden              menuOrdenes
                                       ↓                         ↓
                                finalizarOrden          modalDetalles
```

All navigation uses `ocultarTodo()` + show target section pattern.

## Naming Conventions
- **Spanish**: All variables, functions, and text are in Spanish
- **camelCase**: Function and variable names
- **Descriptive**: `activarPersonalizacionSencilla()` not `activatePS()`
- **Timer prefixes**: Long-press timers named `timer{Action}` (e.g., `timerFinalizar`)
- **Estado vs Status**: Use "estado" for order state, not "status"

## Testing Checklist
- [ ] Can create order with multiple products
- [ ] Long-press finalizar saves to localStorage
- [ ] Edit mode preserves existing products
- [ ] Modal shows correct order details
- [ ] Product elimination/rescue works
- [ ] Backend errors show Spanish messages
- [ ] User selection persists across navigation
