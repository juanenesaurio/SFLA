# Instrucciones para Agentes de IA - Sistema Fululunqueador

## Arquitectura General

**SPA (Single Page Application) pura** para un sistema de órdenes de restaurante:
- **Frontend**: `index.html` (1041 líneas) + `app.js` (2508 líneas) con Tailwind CDN
- **Backend**: Google Apps Script (externo) como API REST que persiste en Google Sheets
- **Servidor local**: `server.py` solo sirve archivos estáticos con UTF-8 en puerto 8000

### Flujo de Datos
```
Usuario → app.js → fetchToGAS() → Google Apps Script → Google Sheets
                     ↓ BACKEND_URL (constante global)
           Hoja: VENTAS_HOY con columnas específicas
```

## Convenciones Críticas del Proyecto

### Gestión de Estado Global (app.js)
El estado se mantiene en **variables globales de nivel superior** (NO módulos ES6):
```javascript
let total = 0;
let mesaNum = null;
let ordenesDelDia = [];
let ordenEnEdicion = null;
let usuarioActual = null;
let selectedCombo = null;
let selectedExtras = {};
// ... ~30 variables globales más
```

### Sistema de Navegación por Secciones
Usa visibilidad de secciones con clase `.hidden` de Tailwind:
```javascript
function ocultarTodo() {
  ["bienvenida","menuPrincipal","nuevaOrden","menuOrdenes","barraUsuarios","menuCocina"]
    .forEach(id => document.getElementById(id).classList.add("hidden"));
}
```
Cada sección tiene su propia pantalla completa (`min-h-screen`) en `index.html`.

### Comunicación con Backend

**Toda interacción** con el backend usa `fetchToGAS(data)` con POST JSON:
```javascript
const BACKEND_URL = 'https://script.google.com/macros/s/...exec';

await fetchToGAS({ 
  action: 'crearOrden', // o 'listarOrdenes', 'cambiarEstado', etc.
  orden: {...}
});
```

**IMPORTANTE**: La función incluye manejo de errores robusto con mensajes en español para:
- Hojas faltantes en Google Sheets
- Errores de código en Apps Script  
- Problemas de conectividad

### Patrones de UI Específicos

#### Dropdowns Personalizados
No usa `<select>` nativo. Usa divs con clase `.dropdown` y animación CSS:
```css
.dropdown { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.dropdown.open { max-height: 500px; }
```
Toggle via `classList.toggle("open")`.

#### Gestión de Productos por Categoría
Cada categoría tiene su propio submenú oculto/visible con su conjunto de variables globales:
- Hamburguesas: `selectedCombo`, `selectedExtras`
- Burritos: `selectedComboBurrito`, `selectedExtrasBurrito`
- Perritos: `selectedComboPerritos`, `selectedExtrasPerritos`

#### Sistema de Timer para Long-Press
Patrón repetido para personalización de productos:
```javascript
let timerPersonalSencilla = null;
let longPressTriggeredSencilla = false;

// En touchstart/mousedown:
timerPersonalSencilla = setTimeout(() => {
  longPressTriggeredSencilla = true;
  mostrarPersonalizacion();
}, 500);

// En touchend/mouseup: clearTimeout si no se activó
```

#### Estados de Órdenes en Cocina
Sistema de semáforo con estados y colores específicos:
- `nueva` → 🐣 bg-white
- `cocinando` → 🔥 bg-yellow-400
- `lista` → 🛎️ bg-blue-400
- `entregada` → 🎉 bg-green-400
- `cancelada` → No se muestra en la vista

## Flujos de Trabajo

### Desarrollo Local
```bash
python3 server.py
# Abre http://localhost:8000
```

### Modificar Categorías de Productos
1. Agregar botón emoji en `index.html` dentro de sección `nuevaOrden`
2. Crear div oculto con clase `dropdown` para el menú
3. En `app.js`: agregar función `toggle[Categoria]()`
4. Declarar variables globales: `selected[Categoria]`, `selectedExtras[Categoria]`
5. Implementar `agregar[Producto]ToCart()`

### Depuración de Errores de Backend
Los errores de Google Apps Script aparecen como:
1. Respuestas vacías → Check deployment
2. `Cannot read properties of null` → Hoja VENTAS_HOY no existe
3. `data is not defined` → Error en función del script

**Ver consola del navegador**: todos los fetch tienen `console.log` extensivo.

## Estructura de Datos

### Formato de Orden (JSON)
```javascript
{
  orden_id: 'ORDEN_123',
  usuario: 'Juanene polloloko', // Usuario actual seleccionado
  mesa: 4,
  descripcion: 'Mesa del fondo',
  productos: [...], // Array de objetos producto
  total: 15000,
  estado: 'nueva', // o 'cocinando', 'lista', 'entregada', 'cancelada'
  cocina_estado: 'nueva',
  hora_creacion: '2026-01-29 14:30',
  hora_ultima_edicion: '2026-01-29 14:35',
  observaciones: '',
  orden_activa: true
}
```

## Dependencias Externas

- **Tailwind CSS**: CDN `https://cdn.tailwindcss.com`
- **Google Apps Script**: Backend completo fuera del repo
- **Google Sheets**: Base de datos (columnas fijas en VENTAS_HOY)

## Particularidades del Código

- **Sin módulos ES6**: Todo el JS está en un archivo monolítico
- **Sin framework**: Manipulación directa del DOM con `getElementById`
- **Idioma**: Comentarios, variables y UI en español
- **Emojis**: Usados extensivamente como iconografía (🍔🍟🌯🌭🍜🎉)
- **Mobile-first**: Tailwind responsive (`md:`, `lg:`) con botones táctiles grandes
