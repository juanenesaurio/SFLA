// URL del backend de Google Apps Script
const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbz6WQGvj3UHsNUwixY-jaLbpgkVx7p2hkuFjwWmOWrF63SXp0O9H7fI3rFANj2gaYxN/exec';

// Función auxiliar para hacer fetch a Google Apps Script
async function fetchToGAS(data) {
  try {
    console.log('Enviando a backend:', data);
    
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow',
      body: JSON.stringify(data)
    });
    
    console.log('Response status:', response.status);
    
    // Leer la respuesta como texto primero
    const text = await response.text();
    console.log('Response text:', text);
    
    // Verificar si la respuesta está vacía
    if (!text || text.trim() === '') {
      console.error('Respuesta vacía del servidor');
      return { 
        ok: false, 
        error: '❌ El servidor devolvió una respuesta vacía.\n\nPosibles causas:\n1. El backend no está respondiendo correctamente\n2. Hay un error en el Apps Script\n3. El deployment no está actualizado'
      };
    }
    
    // Intentar parsear como JSON
    try {
      const result = JSON.parse(text);
      
      // Verificar si hay error de hoja no encontrada
      if (result.error && result.error.includes('appendRow')) {
        return {
          ok: false,
          error: '❌ ERROR EN GOOGLE SHEETS:\n\nNo existe la hoja "VENTAS_HOY".\n\n✅ SOLUCIÓN:\n1. Abre tu Google Sheets\n2. Crea una pestaña llamada: VENTAS_HOY\n3. Agrega estos encabezados en la fila 1:\n   orden_id | usuario | mesa | descripcion | hora_creacion | hora_ultima_edicion | productos | total | estado | observaciones | orden_activa'
        };
      }
      
      // Verificar otros errores comunes
      if (result.error && result.error.includes('getSheetByName')) {
        return {
          ok: false,
          error: '❌ ERROR: No se encuentra la hoja de cálculo.\nVerifica que tu Apps Script esté vinculado al Google Sheets correcto.'
        };
      }
      
      return result;
    } catch (e) {
      console.error('Respuesta no es JSON:', text);
      
      // Si la respuesta contiene error de null
      if (text.includes('Cannot read properties of null')) {
        return {
          ok: false,
          error: '❌ ERROR EN GOOGLE SHEETS:\n\nLa hoja "VENTAS_HOY" no existe.\n\n✅ SOLUCIÓN:\n1. Abre tu Google Sheets\n2. Crea una pestaña llamada: VENTAS_HOY\n3. Intenta de nuevo'
        };
      }
      
      // Si hay error de 'data is not defined'
      if (text.includes('data is not defined') || text.includes('ReferenceError')) {
        return {
          ok: false,
          error: '❌ ERROR EN BACKEND:\n\nHay un error de código en tu Apps Script.\nLa variable "data" no está definida correctamente.\n\n✅ Revisa la función cambiarEstado() en tu backend.'
        };
      }
      
      // Mostrar más detalles del error
      console.error('Texto completo de la respuesta:', text);
      alert('DEBUG - Respuesta del servidor:\n' + text.substring(0, 500));
      
      return { ok: false, error: 'Respuesta inválida del servidor: ' + text.substring(0, 200) };
    }
  } catch (error) {
    console.error('Error en fetch:', error);
    
    // Mensaje más descriptivo según el tipo de error
    if (error.message === 'Failed to fetch') {
      return { 
        ok: false, 
        error: '❌ No se puede conectar al servidor.\n\n✅ VERIFICA:\n1. Tu conexión a internet\n2. Que la Web App esté publicada como "Cualquier persona"\n3. Que hayas actualizado la implementación'
      };
    }
    
    throw error;
  }
}

let total = 0;
let timerFinalizar = null;
let historial = [];
let selectedCombo = null;
let selectedExtras = {};
let selectedComboBurrito = null;
let selectedExtrasBurrito = {};
let selectedComboPerritos = null;
let selectedExtrasPerritos = {};
let selectedBurritoSencillo = null;
let selectedExtrasBurritoSencillo = {};
let selectedPerritoIndividual = null;
let selectedExtrasPerritoIndividual = {};
let mesaDescripcion = '';
let mesaNum = null;
let ordenesDelDia = [];
let ordenEnEdicion = null; // Índice de la orden que se está editando
let productosEliminados = []; // Historial de productos eliminados (para rescate)
let ordenEnModalActual = null; // Índice de la orden mostrada actualmente en el modal
let chismeClientil = ''; // Notas/chisme clientil
let timerPersonalSencilla = null;
let longPressTriggeredSencilla = false;
let timerPersonalHawaiiana = null;
let longPressTriggeredHawaiiana = false;
let timerPersonalEspecial = null;
let longPressTriggeredEspecial = false;
let timerVaciarCarrito = null;
let timerBurritoPastor = null;
let longPressTriggeredBurritoPastor = false;
let timerBurritoChorizo = null;
let longPressTriggeredBurritoChorizo = false;
let timerBurritoArrachera = null;
let longPressTriggeredBurritoArrachera = false;
let timerPerritoSencillo = null;
let longPressTriggeredPerritoSencillo = false;
let timerPerritoEspecial = null;
let longPressTriggeredPerritoEspecial = false;
let timerRamen = null;
let longPressTriggeredRamen = false;
let timerBirriamen = null;
let longPressTriggeredBirriamen = false;

// Todas las órdenes ahora se manejan desde el backend (Google Sheets)



// Modificar función de finalizar orden para guardar usuario
function finalizarOrden() {
  if (!usuarioActual) {
    alert('Selecciona un usuario antes de crear una orden.');
    return;
  }
  // ...existing code...
  const nuevaOrden = {
    // ...otros campos de la orden...
    usuario: usuarioActual,
    // ...existing code...
  };
  // ...agregar a ordenesDelDia y guardar...
}

// Mostrar usuario en la visualización de órdenes
function renderOrden(orden) {
  // ...existing code...
  const usuario = orden.usuario ? `<div class="text-xs text-gray-400">${orden.usuario}</div>` : '';
  // ...insertar usuario en el HTML de la orden...
}

// Las órdenes se cargan desde el backend

/* navegación */
function ocultarTodo() {
  ["bienvenida","menuPrincipal","nuevaOrden","menuOrdenes","barraUsuarios","menuCocina"].forEach(id =>
    document.getElementById(id).classList.add("hidden")
  );
}


let usuarioActual = null;

function irAMenu() {
  // Si no hay usuario seleccionado, mostrar barra de usuarios
  if (!usuarioActual) {
    ocultarTodo();
    document.getElementById("barraUsuarios").classList.remove("hidden");
  } else {
    ocultarTodo();
    document.getElementById("menuPrincipal").classList.remove("hidden");
  }
}

function toggleUsuarios() {
  document.getElementById("listaUsuarios").classList.toggle("open");
}


function seleccionarUsuario(nombre) {
  usuarioActual = nombre;
  document.getElementById("usuarioSeleccionado").innerText = nombre;
  document.getElementById("listaUsuarios").classList.remove("open");
  document.getElementById("barraUsuarios").classList.add("hidden");
  // Mostrar bienvenida personalizada
  document.getElementById("mensajeBienvenidaUsuario").innerText = `Hora de chambear (${nombre}) suerte 🧙🏻‍♂️`;
  document.getElementById("bienvenidaUsuario").classList.remove("hidden");
}

function continuarMenuPrincipal() {
  document.getElementById("bienvenidaUsuario").classList.add("hidden");
  document.getElementById("menuPrincipal").classList.remove("hidden");
}

function irANuevaOrden() {
  ocultarTodo();
  document.getElementById("nuevaOrden").classList.remove("hidden");
  ordenEnEdicion = null;
  limpiarFormulario();
  // Actualizar texto del botón finalizar
  document.getElementById("finalizarBtn").innerText = obtenerTextoBotonFinalizar();
}

function volverAMenu() {
  ocultarTodo();
  document.getElementById("menuPrincipal").classList.remove("hidden");
}

async function irACocina() {
  ocultarTodo();
  document.getElementById("menuCocina").classList.remove("hidden");
  await cargarOrdenesCocina();
  iniciarActualizacionCocina();
}

/* ==================== COCINA ==================== */
let ordenesCocina = [];
let intervalActualizacionCocina = null;
let ordenCocinaSeleccionada = null;
let intervalContadorTiempo = null;

// Cargar órdenes desde el backend para cocina
async function cargarOrdenesCocina() {
  try {
    const result = await fetchToGAS({
      action: 'listarOrdenes'
    });
    
    if (result.ok && result.ordenes) {
      ordenesCocina = result.ordenes;
      renderCocina();
    } else {
      console.error('Error al cargar órdenes de cocina:', result.error);
      ordenesCocina = [];
      renderCocina();
    }
  } catch (error) {
    console.error('Error al cargar órdenes de cocina:', error);
    ordenesCocina = [];
    renderCocina();
  }
}

// Renderizar tarjetas compactas de cocina (vista general)
function renderCocina() {
  const grid = document.getElementById('gridCocina');
  
  // Filtrar órdenes canceladas
  const ordenesActivas = ordenesCocina.filter(orden => orden.estado !== 'cancelada');
  
  if (ordenesActivas.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center text-gray-400 text-xl py-20">No hay órdenes</div>';
    return;
  }

  grid.innerHTML = '';
  
  ordenesCocina.forEach((orden, index) => {
    // Solo mostrar si no está cancelada
    if (orden.estado !== 'cancelada') {
      const tarjeta = crearTarjetaCocinaCompacta(orden, index);
      grid.appendChild(tarjeta);
    }
  });
}

// Crear tarjeta compacta (para el grid principal)
function crearTarjetaCocinaCompacta(orden, index) {
  const div = document.createElement('div');
  
  // Color de fondo según estado de cocina
  const estadoCocina = orden.cocina_estado || 'nueva';
  let bgColor = 'bg-white';
  if (estadoCocina === 'cocinando') bgColor = 'bg-yellow-400';
  else if (estadoCocina === 'lista') bgColor = 'bg-blue-400';
  else if (estadoCocina === 'entregada') bgColor = 'bg-green-400';
  
  // Emoji según estado
  let emoji = '🐣';
  if (estadoCocina === 'cocinando') emoji = '🔥';
  else if (estadoCocina === 'lista') emoji = '🛎️';
  else if (estadoCocina === 'entregada') emoji = '🎉';
  
  // Calcular semáforo de tiempo
  const semaforoInfo = calcularSemaforo(orden.hora_ultima_edicion || orden.hora, estadoCocina, orden.hora_creacion || orden.hora);
  
  div.className = `${bgColor} rounded-xl p-4 shadow-lg relative text-gray-900 cursor-pointer active:scale-95 transition`;
  div.onclick = () => abrirDetalleOrdenCocina(index);
  
  div.innerHTML = `
    <!-- Emoji de estado -->
    <div class="text-4xl text-center mb-2">${emoji}</div>
    
    <!-- Descripción y Mesa -->
    <div class="text-center">
      <div class="text-lg font-bold">${orden.descripcion || 'Sin descripción'}</div>
      <div class="text-xl font-bold">Mesa ${orden.mesa || 'N/A'}</div>
    </div>
    
    <!-- Semáforo de tiempo -->
    <div class="flex items-center justify-center gap-2 mt-3">
      <div class="${semaforoInfo.circuloClass} w-3 h-3 rounded-full"></div>
    </div>
  `;
  
  return div;
}

// Abrir detalle de orden en modal
function abrirDetalleOrdenCocina(index) {
  ordenCocinaSeleccionada = index;
  const orden = ordenesCocina[index];
  const modal = document.getElementById('modalDetalleOrdenCocina');
  const contenido = document.getElementById('contenidoDetalleOrdenCocina');
  
  // Color de fondo según estado
  const estadoCocina = orden.cocina_estado || 'nueva';
  let bgColor = 'bg-white';
  let textColor = 'text-gray-900';
  if (estadoCocina === 'cocinando') {
    bgColor = 'bg-yellow-400';
    textColor = 'text-gray-900';
  } else if (estadoCocina === 'lista') {
    bgColor = 'bg-blue-400';
    textColor = 'text-white';
  } else if (estadoCocina === 'entregada') {
    bgColor = 'bg-green-400';
    textColor = 'text-white';
  }
  
  // Emoji según estado
  let emoji = '🐣';
  if (estadoCocina === 'cocinando') emoji = '🔥';
  else if (estadoCocina === 'lista') emoji = '🛎️';
  else if (estadoCocina === 'entregada') emoji = '🎉';
  
  // Calcular semáforo
  const semaforoInfo = calcularSemaforo(orden.hora_ultima_edicion || orden.hora, estadoCocina, orden.hora_creacion || orden.hora);
  
  // Formatear productos CON EXTRAS
  let productosHTML = '';
  if (orden.productos && Array.isArray(orden.productos)) {
    productosHTML = orden.productos.map(p => {
      let extrasText = '';
      if (p.extras) {
        const parts = [];
        if (p.extras.hamburguesa) parts.push(`🍔 ${p.extras.hamburguesa}`);
        if (p.extras.burrito) parts.push(`🌯 ${p.extras.burrito}`);
        if (p.extras.perrito) parts.push(`🌭 ${p.extras.perrito}`);
        if (p.extras.papas) parts.push(`🍟 ${p.extras.papas}`);
        if (p.extras.bebida) parts.push(`🍹 ${p.extras.bebida}`);
        if (p.extras.ramen) parts.push(`🍜 ${p.extras.ramen}`);
        if (p.extras.birriamen) parts.push(`🍜 ${p.extras.birriamen}`);
        if (p.extras.consideracion) parts.push(`📝 ${p.extras.consideracion}`);
        if (parts.length) {
          extrasText = '<div class="ml-4 mt-1 text-sm opacity-90">' + parts.join('<br>') + '</div>';
        }
      }
      return `<div class="mb-2 bg-black bg-opacity-10 p-2 rounded">
        <div class="font-semibold">• ${p.nombre}${p.cantidad > 1 ? ` x${p.cantidad}` : ''}</div>
        ${extrasText}
      </div>`;
    }).join('');
  }
  
  contenido.innerHTML = `
    <div class="${bgColor} ${textColor} p-6 rounded-xl">
      <!-- Header con botón cerrar -->
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-3">
          <div class="text-5xl">${emoji}</div>
          <div>
            <div class="text-2xl font-bold">${orden.descripcion || 'Sin descripción'}</div>
            <div class="text-sm uppercase font-semibold opacity-75">Estado: ${estadoCocina}</div>
          </div>
        </div>
        <button onclick="cerrarDetalleOrdenCocina()" 
          class="text-3xl leading-none hover:opacity-70 transition">
          ×
        </button>
      </div>
      
      <!-- Mesa y Hora -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-black bg-opacity-10 p-3 rounded">
          <div class="text-sm opacity-75">Mesa</div>
          <div class="text-2xl font-bold">${orden.mesa || 'N/A'}</div>
        </div>
        <div class="bg-black bg-opacity-10 p-3 rounded">
          <div class="text-sm opacity-75">⏰</div>
          ${estadoCocina === 'cocinando' || estadoCocina === 'lista' || estadoCocina === 'entregada' ? `
            <div class="space-y-1">
              <div class="text-xs opacity-75">Hora creación:</div>
              <div class="text-sm font-bold">
                ${(orden.hora_creacion || orden.hora) ? new Date(orden.hora_creacion || orden.hora).toLocaleTimeString('es-MX', { hour12: false }) : 'N/A'}
              </div>
              ${estadoCocina === 'cocinando' || estadoCocina === 'lista' ? `
                <div class="text-xs opacity-75 mt-2">🍳 Inicio cocción:</div>
                <div class="text-sm font-bold">
                  ${orden.hora_ultima_edicion ? new Date(orden.hora_ultima_edicion).toLocaleTimeString('es-MX', { hour12: false }) : 'N/A'}
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="text-lg font-semibold">
              ${(orden.hora_ultima_edicion || orden.hora) ? new Date(orden.hora_ultima_edicion || orden.hora).toLocaleTimeString('es-MX', { hour12: false }) : 'N/A'}
            </div>
          `}
        </div>
      </div>
      
      <!-- Semáforo de tiempo -->
      <div class="flex items-center justify-between gap-2 mb-4 p-3 bg-black bg-opacity-10 rounded">
        <div class="flex items-center gap-2">
          <div class="${semaforoInfo.circuloClass} w-4 h-4 rounded-full"></div>
          <div class="font-bold">${semaforoInfo.texto}</div>
        </div>
        ${(estadoCocina === 'cocinando' || estadoCocina === 'lista') ? '<div id="contadorTiempo" class="text-xl font-mono font-bold">00:00</div>' : ''}
      </div>
      
      <!-- Productos -->
      <div class="mb-4">
        <div class="text-lg font-bold mb-2">🍽️ Productos:</div>
        <div class="space-y-2">
          ${productosHTML || '<div class="text-sm opacity-75">Sin productos</div>'}
        </div>
      </div>
      
      <!-- Observaciones -->
      ${orden.observaciones ? `
        <div class="mb-4 bg-black bg-opacity-10 p-3 rounded">
          <div class="font-bold mb-1">📝 Observaciones:</div>
          <div>${orden.observaciones}</div>
        </div>
      ` : ''}
      
      <!-- Botones de cambio de estado -->
      <div class="grid grid-cols-1 gap-3 mt-6 pt-6 border-t border-black border-opacity-20">
        <button 
          onclick="cambiarEstadoCocinaOrden('cocinando')"
          class="bg-orange-500 text-white py-4 px-4 rounded-xl font-bold text-lg active:scale-95 transition shadow-lg">
          🔥 COCINANDO
        </button>
        
        <button 
          onmousedown="activarCambioEstadoCocinaOrden('lista', this)"
          onmouseup="cancelarCambioEstadoCocina()"
          onmouseleave="cancelarCambioEstadoCocina()"
          ontouchstart="activarCambioEstadoCocinaOrden('lista', this)"
          ontouchend="cancelarCambioEstadoCocina()"
          class="bg-blue-600 text-white py-4 px-4 rounded-xl font-bold text-lg active:scale-95 transition relative overflow-hidden shadow-lg">
          <span class="relative z-10">🛎️ LISTA (1.2s)</span>
          <div class="progress-bar-cocina absolute bottom-0 left-0 h-1 bg-white opacity-50 transition-all" style="width: 0%"></div>
        </button>
        
        <button 
          onmousedown="activarCambioEstadoCocinaOrden('entregada', this)"
          onmouseup="cancelarCambioEstadoCocina()"
          onmouseleave="cancelarCambioEstadoCocina()"
          ontouchstart="activarCambioEstadoCocinaOrden('entregada', this)"
          ontouchend="cancelarCambioEstadoCocina()"
          class="bg-green-600 text-white py-4 px-4 rounded-xl font-bold text-lg active:scale-95 transition relative overflow-hidden shadow-lg">
          <span class="relative z-10">🎉 ENTREGADA (1.2s)</span>
          <div class="progress-bar-cocina absolute bottom-0 left-0 h-1 bg-white opacity-50 transition-all" style="width: 0%"></div>
        </button>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
  
  // Iniciar contador de tiempo en vivo según el estado
  const horaCreacion = orden.hora_creacion || orden.hora;
  if (horaCreacion) {
    if (estadoCocina === 'lista' && orden.tiempo_pausado) {
      // Si está en LISTA y tiene tiempo pausado, mostrar ese tiempo sin actualizar
      const elemento = document.getElementById('contadorTiempo');
      if (elemento) {
        const minutos = Math.floor(orden.tiempo_pausado / 60);
        const segundos = orden.tiempo_pausado % 60;
        elemento.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
      }
    } else if (estadoCocina === 'cocinando') {
      // Si está en COCINANDO, iniciar timer desde 0
      actualizarContadorTiempo(horaCreacion);
      intervalContadorTiempo = setInterval(() => {
        actualizarContadorTiempo(horaCreacion);
      }, 1000);
    }
    // Si está entregada, no mostrar timer (ya se filtra en el HTML)
  }
}

// Cerrar modal de detalle
function cerrarDetalleOrdenCocina() {
  document.getElementById('modalDetalleOrdenCocina').classList.add('hidden');
  ordenCocinaSeleccionada = null;
  cancelarCambioEstadoCocina();
  
  // Detener contador de tiempo
  if (intervalContadorTiempo) {
    clearInterval(intervalContadorTiempo);
    intervalContadorTiempo = null;
  }
}

// Actualizar contador de tiempo en vivo
function actualizarContadorTiempo(horaCreacion) {
  const elemento = document.getElementById('contadorTiempo');
  if (!elemento) return;
  
  const ahora = new Date();
  const inicio = new Date(horaCreacion);
  const diferenciaSegundos = Math.floor((ahora - inicio) / 1000);
  
  const minutos = Math.floor(diferenciaSegundos / 60);
  const segundos = diferenciaSegundos % 60;
  
  elemento.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

// Calcular el semáforo de tiempo
function calcularSemaforo(horaOrden, estadoCocina, horaCreacion) {
  if (!horaOrden) {
    return {
      circuloClass: 'bg-gray-400',
      texto: 'Sin hora registrada'
    };
  }
  
  // Si está entregada, mostrar tiempo de entrega solo si es razonable
  if (estadoCocina === 'entregada' && horaCreacion) {
    const horaCreacionDate = new Date(horaCreacion);
    const horaEntregaDate = new Date(horaOrden);
    const tiempoEntregaMinutos = Math.floor((horaEntregaDate - horaCreacionDate) / 1000 / 60);
    
    // Si el tiempo es razonable (menos de 2 horas), mostrarlo
    if (tiempoEntregaMinutos < 120) {
      return {
        circuloClass: 'bg-green-500',
        texto: `⏱️ Tiempo de entrega: ${tiempoEntregaMinutos} min`
      };
    } else {
      // Si pasó mucho tiempo (orden vieja), solo mostrar que está entregada
      return {
        circuloClass: 'bg-green-500',
        texto: '✅ Entregada'
      };
    }
  }
  
  // Para el resto de estados, calcular tiempo transcurrido
  const ahora = new Date();
  const horaOrdenDate = new Date(horaOrden);
  const diferenciaMinutos = (ahora - horaOrdenDate) / 1000 / 60;
  
  if (diferenciaMinutos < 5) {
    return {
      circuloClass: 'bg-green-500 animate-pulse',
      texto: 'recién nacida 😌'
    };
  } else if (diferenciaMinutos < 15) {
    return {
      circuloClass: 'bg-yellow-500 animate-pulse',
      texto: 'ojito ehh 👀'
    };
  } else {
    return {
      circuloClass: 'bg-red-500 animate-pulse',
      texto: '¡El diablo, que se va el cliente! 😈'
    };
  }
}

// Variables para press & hold
let timerCambioEstadoCocina = null;
let progressIntervalCocina = null;

// Cambio de estado desde el modal (usa ordenCocinaSeleccionada)
async function cambiarEstadoCocinaOrden(nuevoEstado) {
  if (ordenCocinaSeleccionada === null) return;
  
  const orden = ordenesCocina[ordenCocinaSeleccionada];
  const estadoActual = orden.cocina_estado || 'nueva';
  
  let tiempoPausado = null;
  let resetearHoraCreacion = false;
  
  if (nuevoEstado === 'lista') {
    // Al pasar a LISTA, calcular y guardar el tiempo transcurrido
    const horaCreacion = new Date(orden.hora_creacion || orden.hora);
    const ahora = new Date();
    tiempoPausado = Math.floor((ahora - horaCreacion) / 1000);
  } else if (nuevoEstado === 'cocinando') {
    // Al pasar a COCINANDO (desde cualquier estado), resetear hora_creacion para empezar desde 0
    resetearHoraCreacion = true;
    tiempoPausado = null;
  }
  
  try {
    const result = await fetchToGAS({
      action: 'cambiarEstadoCocina',
      orden_id: orden.orden_id,
      cocina_estado: nuevoEstado,
      tiempo_pausado: tiempoPausado,
      resetear_hora_creacion: resetearHoraCreacion
    });
    
    if (result.ok) {
      await cargarOrdenesCocina();
      cerrarDetalleOrdenCocina();
    } else {
      alert('Error al cambiar estado: ' + result.error);
    }
  } catch (error) {
    console.error('Error al cambiar estado de cocina:', error);
    alert('Error al cambiar estado');
  }
}

// Activar cambio de estado con press & hold desde modal
function activarCambioEstadoCocinaOrden(nuevoEstado, btn) {
  const progressBar = btn.querySelector('.progress-bar-cocina');
  let progress = 0;
  
  // Animación de progreso
  progressIntervalCocina = setInterval(() => {
    progress += 100 / 12; // 1200ms / 100ms intervals
    if (progress > 100) progress = 100;
    progressBar.style.width = progress + '%';
  }, 100);
  
  // Timer de 1.2 segundos
  timerCambioEstadoCocina = setTimeout(async () => {
    clearInterval(progressIntervalCocina);
    progressBar.style.width = '0%';
    await cambiarEstadoCocinaOrden(nuevoEstado);
  }, 1200);
}

// Cancelar cambio de estado
function cancelarCambioEstadoCocina() {
  if (timerCambioEstadoCocina) {
    clearTimeout(timerCambioEstadoCocina);
    timerCambioEstadoCocina = null;
  }
  if (progressIntervalCocina) {
    clearInterval(progressIntervalCocina);
    progressIntervalCocina = null;
  }
  
  // Resetear todas las barras de progreso
  document.querySelectorAll('.progress-bar-cocina').forEach(bar => {
    bar.style.width = '0%';
  });
}

// Iniciar actualización automática cada 30 segundos
function iniciarActualizacionCocina() {
  // Limpiar intervalo anterior si existe
  if (intervalActualizacionCocina) {
    clearInterval(intervalActualizacionCocina);
  }
  
  // Actualizar cada 30 segundos
  intervalActualizacionCocina = setInterval(() => {
    if (!document.getElementById('menuCocina').classList.contains('hidden')) {
      cargarOrdenesCocina();
    }
  }, 30000);
}

// Detener actualización cuando se sale de cocina
function detenerActualizacionCocina() {
  if (intervalActualizacionCocina) {
    clearInterval(intervalActualizacionCocina);
    intervalActualizacionCocina = null;
  }
}

/* ==================== FIN COCINA ==================== */

/* limpiar formulario de nueva orden */
function limpiarFormulario() {
  total = 0;
  historial = [];
  mesaNum = null;
  mesaDescripcion = '';
  selectedCombo = null;
  selectedExtras = {};
  chismeClientil = '';
  
  document.getElementById("mesaSeleccionada").innerText = "Seleccionar";
  document.getElementById("carrito").innerHTML = "";
  document.getElementById("total").innerText = "0";
  document.getElementById("chismeClientil").value = '';

  // Reiniciar selects de cantidad de combos a x1
  const comboSencilla = document.getElementById('cantidadComboSencilla');
  if (comboSencilla) comboSencilla.value = '1';
  const comboHawaiiana = document.getElementById('cantidadComboHawaiiana');
  if (comboHawaiiana) comboHawaiiana.value = '1';
  const comboEspecial = document.getElementById('cantidadComboEspecial');
  if (comboEspecial) comboEspecial.value = '1';
  const comboPastor = document.getElementById('cantidadComboPastor');
  if (comboPastor) comboPastor.value = '1';
  const comboChorizo = document.getElementById('cantidadComboChorizo');
  if (comboChorizo) comboChorizo.value = '1';
  const comboArrachera = document.getElementById('cantidadComboArrachera');
  if (comboArrachera) comboArrachera.value = '1';
  const ordenSencilla = document.getElementById('cantidadOrdenSencilla');
  if (ordenSencilla) ordenSencilla.value = '1';
  const comboPerritos = document.getElementById('cantidadComboPerritos');
  if (comboPerritos) comboPerritos.value = '1';
  const comboEspeciales = document.getElementById('cantidadComboEspeciales');
  if (comboEspeciales) comboEspeciales.value = '1';

  const disp = document.getElementById('descripcionGuardada');
  if (disp) { 
    disp.innerText = ''; 
    disp.classList.add('hidden'); 
  }

  const ta = document.getElementById('descripcionText');
  if (ta) ta.value = '';

  document.getElementById('descripcionBox').classList.add('hidden');
  // NO ocultamos los menús aquí - deben empezar ocultos en el HTML
  // y solo mostrarse cuando el usuario hace clic en los botones de categorías
  document.getElementById('bebidaJ').classList.remove('ring-2');
  document.getElementById('bebidaH').classList.remove('ring-2');
  const psBox = document.getElementById('personalSencillaBox');
  if (psBox) psBox.classList.add('hidden');
  const phBox = document.getElementById('personalHawaiianaBox');
  if (phBox) phBox.classList.add('hidden');
  const peBox = document.getElementById('personalEspecialBox');
  if (peBox) peBox.classList.add('hidden');
  const pjBox = document.getElementById('personalizacionJamaica');
  if (pjBox) pjBox.classList.add('hidden');
  const phBebBox = document.getElementById('personalizacionHorchata');
  if (phBebBox) phBebBox.classList.add('hidden');
  productosEliminados = [];
  ordenEnModalActual = null;
}

/* mesas */
function toggleMesas() {
  document.getElementById("listaMesas").classList.toggle("open");
}

function seleccionarMesa(num) {
  mesaNum = num;
  document.getElementById("mesaSeleccionada").innerText = num;
  document.getElementById("listaMesas").classList.remove("open");
}

/* descripcion de mesa */
function toggleDescripcion() {
  const box = document.getElementById('descripcionBox');
  box.classList.toggle('hidden');
  if (!box.classList.contains('hidden')) {
    const ta = document.getElementById('descripcionText');
    ta.focus();
  }
}

function confirmarDescripcion() {
  const val = document.getElementById('descripcionText').value.trim();
  mesaDescripcion = val;
  const disp = document.getElementById('descripcionGuardada');
  if (val) {
    disp.innerText = 'Descripción guardada: ' + val;
    disp.classList.remove('hidden');
  } else {
    disp.innerText = '';
    disp.classList.add('hidden');
  }
}

/* hamburguesas */
function toggleHamburguesas() {
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("menuCombosPerritos").classList.add("hidden");
  document.getElementById("comboPerritosForm").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  document.getElementById("menuBurritoSencillo").classList.add("hidden");
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("menuPerritosIndividuales").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  
  // Toggle menu principal
  document.getElementById("menuHamburguesas").classList.toggle("hidden");
}

function toggleBurritoSencillo() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("menuCombosPerritos").classList.add("hidden");
  document.getElementById("comboPerritosForm").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  document.getElementById("menuPerritosIndividuales").classList.add("hidden");
  document.getElementById("menuRamen").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  
  // Ocultar TODOS los formularios de personalización de todos los menús
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  
  // Toggle menu principal
  document.getElementById("menuBurritoSencillo").classList.toggle("hidden");
}

function toggleCombos() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("menuCombosPerritos").classList.add("hidden");
  document.getElementById("comboPerritosForm").classList.add("hidden");
  document.getElementById("menuBurritoSencillo").classList.add("hidden");
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("menuPerritosIndividuales").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("menuRamen").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  document.getElementById("menuCombos").classList.toggle("hidden");
}

function toggleCombosBurrito() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("menuCombosPerritos").classList.add("hidden");
  document.getElementById("comboPerritosForm").classList.add("hidden");
  document.getElementById("menuBurritoSencillo").classList.add("hidden");
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("menuPerritosIndividuales").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("menuRamen").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.toggle("hidden");
}

function toggleCombosPerritos() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  document.getElementById("menuBurritoSencillo").classList.add("hidden");
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("menuPerritosIndividuales").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("menuRamen").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  document.getElementById("menuCombosPerritos").classList.toggle("hidden");
}

function togglePapasForm() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("menuCombosPerritos").classList.add("hidden");
  document.getElementById("comboPerritosForm").classList.add("hidden");
  document.getElementById("menuBurritoSencillo").classList.add("hidden");
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("menuPerritosIndividuales").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("menuRamen").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  document.getElementById("papasForm").classList.toggle("hidden");
}

function toggleBebidas() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("menuCombosPerritos").classList.add("hidden");
  document.getElementById("comboPerritosForm").classList.add("hidden");
  document.getElementById("menuBurritoSencillo").classList.add("hidden");
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("menuPerritosIndividuales").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("menuRamen").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  const pj = document.getElementById('personalizacionJamaica');
  if (pj) pj.classList.add('hidden');
  const phBeb = document.getElementById('personalizacionHorchata');
  if (phBeb) phBeb.classList.add('hidden');
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.toggle("hidden");
}

function togglePerritosIndividuales() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("menuCombosPerritos").classList.add("hidden");
  document.getElementById("comboPerritosForm").classList.add("hidden");
  document.getElementById("menuBurritoSencillo").classList.add("hidden");
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  document.getElementById("menuRamen").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  
  // Ocultar TODOS los formularios de personalización de todos los menús
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  
  // Toggle menu principal
  document.getElementById("menuPerritosIndividuales").classList.toggle("hidden");
}

function toggleRamen() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("menuCombosPerritos").classList.add("hidden");
  document.getElementById("comboPerritosForm").classList.add("hidden");
  document.getElementById("menuBurritoSencillo").classList.add("hidden");
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("menuPerritosIndividuales").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  
  // Ocultar TODOS los formularios de personalización de todos los menús
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("perritoSencilloForm").classList.add("hidden");
  document.getElementById("perritoEspecialForm").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
  
  // Toggle menu principal
  document.getElementById("menuRamen").classList.toggle("hidden");
}

function abrirCombo(nombre, precio) {
  // Obtener la cantidad según el combo que se abrió
  let cantidadSeleccionada = 1;
  let targetContainerId = '';
  
  if (nombre === 'Combo hamburguesas sencillas') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboSencilla').value);
    targetContainerId = 'formComboSencilla';
  } else if (nombre === 'Combo hamburguesas hawaiianas') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboHawaiiana').value);
    targetContainerId = 'formComboHawaiiana';
  } else if (nombre === 'Combo hamburguesas especiales') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboEspecial').value);
    targetContainerId = 'formComboEspecial';
  }
  
  selectedCombo = { nombre, precio, cantidad: cantidadSeleccionada };
  selectedExtras = {};
  
  // Obtener el formulario
  const comboForm = document.getElementById('comboForm');
  
  // Limpiar todos los contenedores
  document.getElementById('formComboSencilla').innerHTML = '';
  document.getElementById('formComboHawaiiana').innerHTML = '';
  document.getElementById('formComboEspecial').innerHTML = '';
  
  // Mover el formulario al contenedor correcto
  const targetContainer = document.getElementById(targetContainerId);
  if (comboForm && targetContainer) {
    targetContainer.appendChild(comboForm);
    comboForm.classList.remove('hidden');
  }
  
  // Limpiar y resetear campos
  document.getElementById('hamburguesiInput').value = '';
  document.getElementById('hamburguesiInput').disabled = false;
  document.getElementById('papasInput').value = '';
  document.getElementById('papasInput').disabled = false;
  document.getElementById('bebidaInput').value = '';
  document.getElementById('bebidaInput').disabled = false;
  document.getElementById('bebidaJ').classList.remove('ring-2');
  document.getElementById('bebidaH').classList.remove('ring-2');
}

function confirmarHamburguesa() {
  const hamburguesa = document.getElementById('hamburguesiInput').value.trim();
  if (hamburguesa) {
    selectedExtras.hamburguesa = hamburguesa;
    document.getElementById('hamburguesiInput').value = '✓ ' + hamburguesa;
    document.getElementById('hamburguesiInput').disabled = true;
  }
}

function confirmarPapas() {
  const papas = document.getElementById('papasInput').value.trim();
  if (papas) {
    selectedExtras.papas = papas;
    document.getElementById('papasInput').value = '✓ ' + papas;
    document.getElementById('papasInput').disabled = true;
  }
}

function togglePapasInput() {
  const el = document.getElementById('papasInput');
  el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
  if (el.style.display === 'block') el.focus();
}

function handlePapasInput(input) {
  if (input.value.trim() !== '') {
    selectedExtras.papas = input.value.trim();
    input.style.display = 'none';
  }
}

function seleccionarBebida(nombre) {
  selectedExtras.bebida = nombre;
  document.getElementById('bebidaJ').classList.toggle('ring-2', nombre === 'Jamaica');
  document.getElementById('bebidaH').classList.toggle('ring-2', nombre === 'Horchata');
}

function confirmarBebida() {
  const bebida = document.getElementById('bebidaInput').value.trim();
  if (bebida) {
    selectedExtras.consideracion = bebida;
    document.getElementById('bebidaInput').value = '✓ ' + bebida;
    document.getElementById('bebidaInput').disabled = true;
  }
}

function confirmarPapasSolas() {
  const papasPersonalizacion = document.getElementById('papasPersonalizacionInput').value.trim();
  if (!papasPersonalizacion) {
    alert('Por favor describe qué llevan las papas');
    return;
  }
  
  agregarProducto('Papas', 50, {
    category: 'papas',
    extras: { papas: papasPersonalizacion }
  });
  
  // Limpiar formulario
  document.getElementById('papasPersonalizacionInput').value = '';
  document.getElementById('papasForm').classList.add('hidden');
}

/* agregar bebida sola con tamaño seleccionado */
function mostrarPersonalizacionBebida(nombre) {
  const boxId = 'personalizacion' + nombre;
  const box = document.getElementById(boxId);
  box.classList.remove('hidden');
  const inputId = nombre.toLowerCase() + 'PersonalInput';
  const input = document.getElementById(inputId);
  if (input) input.focus();
}

function confirmarBebidaPersonalizada(nombre) {
  const selectId = 'tamaño' + nombre;
  const select = document.getElementById(selectId);
  const precio = parseInt(select.value);
  const tamañoTexto = select.options[select.selectedIndex].text;
  
  // Obtener personalización
  const inputId = nombre.toLowerCase() + 'PersonalInput';
  const input = document.getElementById(inputId);
  const personalizacion = input.value.trim();
  
  // Agregar con el nombre completo incluyendo el tamaño
  const nombreCompleto = `${nombre} (${tamañoTexto.split(' — ')[0]})`;
  agregarProducto(nombreCompleto, precio, {
    category: 'bebida',
    extras: personalizacion ? { consideracion: personalizacion } : null
  });
  
  // Limpiar y ocultar
  input.value = '';
  const boxId = 'personalizacion' + nombre;
  document.getElementById(boxId).classList.add('hidden');
}

/* Personalización larga para Sencilla */
function activarPersonalizacionSencilla() {
  timerPersonalSencilla = setTimeout(() => {
    const box = document.getElementById('personalSencillaBox');
    if (box) {
      box.classList.remove('hidden');
      const inp = document.getElementById('sencillaPersonalInput');
      if (inp) inp.focus();
    }
    longPressTriggeredSencilla = true;
  }, 1200);
}

function cancelarPersonalizacionSencilla() {
  clearTimeout(timerPersonalSencilla);
  timerPersonalSencilla = null;
}

function handleClickSencilla(event) {
  if (longPressTriggeredSencilla) {
    // fue una pulsación larga: no agregar producto por click
    longPressTriggeredSencilla = false;
    event.preventDefault();
    return;
  }
  agregarProducto('Hamburguesa sencilla', 60);
}

function confirmarPersonalizacionSencilla() {
  const val = document.getElementById('sencillaPersonalInput').value.trim();
  const extras = val ? { hamburguesa: val } : null;
  agregarProducto('Hamburguesa sencilla', 60, { extras });
  document.getElementById('sencillaPersonalInput').value = '';
  const box = document.getElementById('personalSencillaBox');
  if (box) box.classList.add('hidden');
  longPressTriggeredSencilla = false;
}

/* Personalización larga para Hawaiiana */
function activarPersonalizacionHawaiiana() {
  timerPersonalHawaiiana = setTimeout(() => {
    const box = document.getElementById('personalHawaiianaBox');
    if (box) {
      box.classList.remove('hidden');
      const inp = document.getElementById('hawaiianaPersonalInput');
      if (inp) inp.focus();
    }
    longPressTriggeredHawaiiana = true;
  }, 1200);
}

function cancelarPersonalizacionHawaiiana() {
  clearTimeout(timerPersonalHawaiiana);
  timerPersonalHawaiiana = null;
}

function handleClickHawaiiana(event) {
  if (longPressTriggeredHawaiiana) {
    longPressTriggeredHawaiiana = false;
    event.preventDefault();
    return;
  }
  agregarProducto('Hamburguesa hawaiiana', 75);
}

function confirmarPersonalizacionHawaiiana() {
  const val = document.getElementById('hawaiianaPersonalInput').value.trim();
  const extras = val ? { hamburguesa: val } : null;
  agregarProducto('Hamburguesa hawaiiana', 75, { extras });
  document.getElementById('hawaiianaPersonalInput').value = '';
  const box = document.getElementById('personalHawaiianaBox');
  if (box) box.classList.add('hidden');
  longPressTriggeredHawaiiana = false;
}

/* Personalización larga para Especial */
function activarPersonalizacionEspecial() {
  timerPersonalEspecial = setTimeout(() => {
    const box = document.getElementById('personalEspecialBox');
    if (box) {
      box.classList.remove('hidden');
      const inp = document.getElementById('especialPersonalInput');
      if (inp) inp.focus();
    }
    longPressTriggeredEspecial = true;
  }, 1200);
}

function cancelarPersonalizacionEspecial() {
  clearTimeout(timerPersonalEspecial);
  timerPersonalEspecial = null;
}

function handleClickEspecial(event) {
  if (longPressTriggeredEspecial) {
    longPressTriggeredEspecial = false;
    event.preventDefault();
    return;
  }
  agregarProducto('Hamburguesa especial', 90);
}

function confirmarPersonalizacionEspecial() {
  const val = document.getElementById('especialPersonalInput').value.trim();
  const extras = val ? { hamburguesa: val } : null;
  agregarProducto('Hamburguesa especial', 90, { extras });
  document.getElementById('especialPersonalInput').value = '';
  const box = document.getElementById('personalEspecialBox');
  if (box) box.classList.add('hidden');
  longPressTriggeredEspecial = false;
}

function confirmarCombo() {
  if (!selectedCombo) return;
  
  const cantidad = selectedCombo.cantidad || 1;
  
  // Agregar el combo multiplicado por la cantidad
  for (let i = 0; i < cantidad; i++) {
    agregarProducto(selectedCombo.nombre, selectedCombo.precio, {
      category: 'combo',
      extras: Object.keys(selectedExtras).length > 0 ? selectedExtras : null
    });
  }
  
  document.getElementById('comboForm').classList.add('hidden');
  selectedCombo = null;
  selectedExtras = {};
}

/* Combos Burrito */
function abrirComboBurrito(nombre, precio) {
  // Obtener la cantidad según el combo que se abrió
  let cantidadSeleccionada = 1;
  let targetContainerId = '';
  
  if (nombre === 'Combo burritos chorizo') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboChorizo').value);
    targetContainerId = 'formComboChorizo';
  } else if (nombre === 'Combo burritos pastor') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboPastor').value);
    targetContainerId = 'formComboPastor';
  } else if (nombre === 'Combo burritos arrachera') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboArrachera').value);
    targetContainerId = 'formComboArrachera';
  }
  
  selectedComboBurrito = { nombre, precio, cantidad: cantidadSeleccionada };
  selectedExtrasBurrito = {};
  
  // Obtener el formulario
  const comboBurritoForm = document.getElementById('comboBurritoForm');
  
  // Limpiar todos los contenedores
  document.getElementById('formComboChorizo').innerHTML = '';
  document.getElementById('formComboPastor').innerHTML = '';
  document.getElementById('formComboArrachera').innerHTML = '';
  
  // Mover el formulario al contenedor correcto
  const targetContainer = document.getElementById(targetContainerId);
  if (comboBurritoForm && targetContainer) {
    targetContainer.appendChild(comboBurritoForm);
    comboBurritoForm.classList.remove('hidden');
  }
  
  // Limpiar y resetear campos
  document.getElementById('burritoInput').value = '';
  document.getElementById('burritoInput').disabled = false;
  document.getElementById('papasBurritoInput').value = '';
  document.getElementById('papasBurritoInput').disabled = false;
  document.getElementById('bebidaBurritoInput').value = '';
  document.getElementById('bebidaBurritoInput').disabled = false;
  document.getElementById('bebidaBurritoJ').classList.remove('ring-2');
  document.getElementById('bebidaBurritoH').classList.remove('ring-2');
}

function confirmarBurrito() {
  const burrito = document.getElementById('burritoInput').value.trim();
  if (burrito) {
    selectedExtrasBurrito.burrito = burrito;
    document.getElementById('burritoInput').value = '✓ ' + burrito;
    document.getElementById('burritoInput').disabled = true;
  }
}

function confirmarPapasBurrito() {
  const papas = document.getElementById('papasBurritoInput').value.trim();
  if (papas) {
    selectedExtrasBurrito.papas = papas;
    document.getElementById('papasBurritoInput').value = '✓ ' + papas;
    document.getElementById('papasBurritoInput').disabled = true;
  }
}

function seleccionarBebidaBurrito(nombre) {
  selectedExtrasBurrito.bebida = nombre;
  document.getElementById('bebidaBurritoJ').classList.toggle('ring-2', nombre === 'Jamaica');
  document.getElementById('bebidaBurritoH').classList.toggle('ring-2', nombre === 'Horchata');
}

function confirmarBebidaBurrito() {
  const bebida = document.getElementById('bebidaBurritoInput').value.trim();
  if (bebida) {
    selectedExtrasBurrito.consideracion = bebida;
    document.getElementById('bebidaBurritoInput').value = '✓ ' + bebida;
    document.getElementById('bebidaBurritoInput').disabled = true;
  }
}

function confirmarComboBurrito() {
  if (!selectedComboBurrito) return;
  
  const cantidad = selectedComboBurrito.cantidad || 1;
  
  // Agregar el combo multiplicado por la cantidad
  for (let i = 0; i < cantidad; i++) {
    agregarProducto(selectedComboBurrito.nombre, selectedComboBurrito.precio, {
      category: 'combo',
      extras: Object.keys(selectedExtrasBurrito).length > 0 ? selectedExtrasBurrito : null
    });
  }
  
  document.getElementById('comboBurritoForm').classList.add('hidden');
  selectedComboBurrito = null;
  selectedExtrasBurrito = {};
}

/* Combos Peatos (Perritos Calientes) */
function abrirComboPerritos(nombre, precio) {
  // Obtener la cantidad según el combo que se abrió
  let cantidadSeleccionada = 1;
  let targetContainer = '';
  
  if (nombre === 'Orden perritos sencilla') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadOrdenSencilla').value);
    targetContainer = 'formOrdenSencilla';
  } else if (nombre === 'Orden perritos especiales') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadOrdenEspeciales').value);
    targetContainer = 'formOrdenEspecial';
  } else if (nombre === 'Combo perritos sencillos') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboPerritos').value);
    targetContainer = 'formComboSencillos';
  } else if (nombre === 'Combo perritos especiales') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboEspeciales').value);
    targetContainer = 'formComboEspeciales';
  }
  
  selectedComboPerritos = { nombre, precio, cantidad: cantidadSeleccionada };
  selectedExtrasPerritos = {};
  
  // Ocultar todos los contenedores de formularios
  document.getElementById('formOrdenSencilla').classList.add('hidden');
  document.getElementById('formOrdenEspecial').classList.add('hidden');
  document.getElementById('formComboSencillos').classList.add('hidden');
  document.getElementById('formComboEspeciales').classList.add('hidden');
  
  // Mover el formulario al contenedor correcto
  const formulario = document.getElementById('comboPerritosForm');
  const container = document.getElementById(targetContainer);
  container.appendChild(formulario);
  container.classList.remove('hidden');
  formulario.classList.remove('hidden');
  
  // Mostrar/ocultar secciones según el tipo de combo
  const seccionPapas = document.getElementById('seccionPapasPerritos');
  const seccionBebida = document.getElementById('seccionBebidaPerritos');
  
  if (nombre === 'Orden perritos sencilla' || nombre === 'Orden perritos especiales') {
    // Solo mostrar el campo de perritos
    seccionPapas.classList.add('hidden');
    seccionBebida.classList.add('hidden');
    document.getElementById('perritosInput').placeholder = '¿Que llevarán los perritos con tinder?';
  } else {
    // Mostrar todos los campos
    seccionPapas.classList.remove('hidden');
    seccionBebida.classList.remove('hidden');
    document.getElementById('perritosInput').placeholder = '¿Que llevarán los perritos con tinder?';
  }
  
  document.getElementById('perritosInput').value = '';
  document.getElementById('perritosInput').disabled = false;
  document.getElementById('papasPerritosInput').value = '';
  document.getElementById('papasPerritosInput').disabled = false;
  document.getElementById('bebidaPerritosInput').value = '';
  document.getElementById('bebidaPerritosInput').disabled = false;
  document.getElementById('bebidaPerritosJ').classList.remove('ring-2');
  document.getElementById('bebidaPerritosH').classList.remove('ring-2');
}

function confirmarPerritos() {
  const perritos = document.getElementById('perritosInput').value.trim();
  if (perritos) {
    selectedExtrasPerritos.perrito = perritos;
    document.getElementById('perritosInput').value = '✓ ' + perritos;
    document.getElementById('perritosInput').disabled = true;
  }
}

function confirmarPapasPerritos() {
  const papas = document.getElementById('papasPerritosInput').value.trim();
  if (papas) {
    selectedExtrasPerritos.papas = papas;
    document.getElementById('papasPerritosInput').value = '✓ ' + papas;
    document.getElementById('papasPerritosInput').disabled = true;
  }
}

function seleccionarBebidaPerritos(nombre) {
  selectedExtrasPerritos.bebida = nombre;
  document.getElementById('bebidaPerritosJ').classList.toggle('ring-2', nombre === 'Jamaica');
  document.getElementById('bebidaPerritosH').classList.toggle('ring-2', nombre === 'Horchata');
}

function confirmarBebidaPerritos() {
  const bebida = document.getElementById('bebidaPerritosInput').value.trim();
  if (bebida) {
    selectedExtrasPerritos.consideracion = bebida;
    document.getElementById('bebidaPerritosInput').value = '✓ ' + bebida;
    document.getElementById('bebidaPerritosInput').disabled = true;
  }
}

function confirmarComboPerritos() {
  if (!selectedComboPerritos) return;
  
  const cantidad = selectedComboPerritos.cantidad || 1;
  
  // Agregar el combo multiplicado por la cantidad
  for (let i = 0; i < cantidad; i++) {
    agregarProducto(selectedComboPerritos.nombre, selectedComboPerritos.precio, {
      category: 'combo',
      extras: Object.keys(selectedExtrasPerritos).length > 0 ? selectedExtrasPerritos : null
    });
  }
  
  document.getElementById('comboPerritosForm').classList.add('hidden');
  document.getElementById('formOrdenSencilla').classList.add('hidden');
  document.getElementById('formOrdenEspecial').classList.add('hidden');
  document.getElementById('formComboSencillos').classList.add('hidden');
  document.getElementById('formComboEspeciales').classList.add('hidden');
  selectedComboPerritos = null;
  selectedExtrasPerritos = {};
}

/* Funciones para Burrito Individual con long-press */
function activarPersonalizacionBurritoPastor() {
  timerBurritoPastor = setTimeout(() => {
    const box = document.getElementById('burritoPastorForm');
    if (box) {
      box.classList.remove('hidden');
      const inp = document.getElementById('burritoPastorInput');
      if (inp) inp.focus();
    }
    longPressTriggeredBurritoPastor = true;
  }, 1200);
}

function cancelarPersonalizacionBurritoPastor() {
  clearTimeout(timerBurritoPastor);
  timerBurritoPastor = null;
}

function handleClickBurritoPastor(event) {
  if (longPressTriggeredBurritoPastor) {
    longPressTriggeredBurritoPastor = false;
    event.preventDefault();
    return;
  }
  agregarProducto('Pastor', 28);
}

function activarPersonalizacionBurritoChorizo() {
  timerBurritoChorizo = setTimeout(() => {
    const box = document.getElementById('burritoChorizoForm');
    if (box) {
      box.classList.remove('hidden');
      const inp = document.getElementById('burritoChorizoInput');
      if (inp) inp.focus();
    }
    longPressTriggeredBurritoChorizo = true;
  }, 1200);
}

function cancelarPersonalizacionBurritoChorizo() {
  clearTimeout(timerBurritoChorizo);
  timerBurritoChorizo = null;
}

function handleClickBurritoChorizo(event) {
  if (longPressTriggeredBurritoChorizo) {
    longPressTriggeredBurritoChorizo = false;
    event.preventDefault();
    return;
  }
  agregarProducto('Chorizo', 28);
}

function activarPersonalizacionBurritoArrachera() {
  timerBurritoArrachera = setTimeout(() => {
    const box = document.getElementById('burritoArracheraForm');
    if (box) {
      box.classList.remove('hidden');
      const inp = document.getElementById('burritoArracheraInput');
      if (inp) inp.focus();
    }
    longPressTriggeredBurritoArrachera = true;
  }, 1200);
}

function cancelarPersonalizacionBurritoArrachera() {
  clearTimeout(timerBurritoArrachera);
  timerBurritoArrachera = null;
}

function handleClickBurritoArrachera(event) {
  if (longPressTriggeredBurritoArrachera) {
    longPressTriggeredBurritoArrachera = false;
    event.preventDefault();
    return;
  }
  agregarProducto('Arrachera', 30);
}

function confirmarBurritoIndividual(nombre, precio, inputId, formId) {
  const personalizacion = document.getElementById(inputId).value.trim();
  const extras = personalizacion ? { burrito: personalizacion } : null;
  
  agregarProducto(nombre, precio, {
    category: 'burrito_sencillo',
    extras: extras
  });
  
  // Limpiar y ocultar el formulario específico
  document.getElementById(inputId).value = '';
  document.getElementById(formId).classList.add('hidden');
  
  // Resetear flags
  if (nombre === 'Pastor') longPressTriggeredBurritoPastor = false;
  else if (nombre === 'Chorizo') longPressTriggeredBurritoChorizo = false;
  else if (nombre === 'Arrachera') longPressTriggeredBurritoArrachera = false;
}

/* Funciones para Perrito Individual con long-press */
function activarPersonalizacionPerritoSencillo() {
  timerPerritoSencillo = setTimeout(() => {
    const box = document.getElementById('perritoSencilloForm');
    if (box) {
      box.classList.remove('hidden');
      const inp = document.getElementById('perritoSencilloInput');
      if (inp) inp.focus();
    }
    longPressTriggeredPerritoSencillo = true;
  }, 1200);
}

function cancelarPersonalizacionPerritoSencillo() {
  clearTimeout(timerPerritoSencillo);
  timerPerritoSencillo = null;
}

function handleClickPerritoSencillo(event) {
  if (longPressTriggeredPerritoSencillo) {
    longPressTriggeredPerritoSencillo = false;
    event.preventDefault();
    return;
  }
  agregarProducto('Sencillo', 20);
}

function activarPersonalizacionPerritoEspecial() {
  timerPerritoEspecial = setTimeout(() => {
    const box = document.getElementById('perritoEspecialForm');
    if (box) {
      box.classList.remove('hidden');
      const inp = document.getElementById('perritoEspecialInput');
      if (inp) inp.focus();
    }
    longPressTriggeredPerritoEspecial = true;
  }, 1200);
}

function cancelarPersonalizacionPerritoEspecial() {
  clearTimeout(timerPerritoEspecial);
  timerPerritoEspecial = null;
}

function handleClickPerritoEspecial(event) {
  if (longPressTriggeredPerritoEspecial) {
    longPressTriggeredPerritoEspecial = false;
    event.preventDefault();
    return;
  }
  agregarProducto('Especial', 25);
}

function abrirPerritoIndividual(nombre, precio) {
  // Ocultar todos los formularios de perrito
  const forms = ['perritoSencilloForm', 'perritoEspecialForm'];
  forms.forEach(formId => {
    const form = document.getElementById(formId);
    if (form) form.classList.add('hidden');
  });
  
  // Mostrar el formulario específico según el tipo
  let formId = '';
  if (nombre === 'Sencillo') formId = 'perritoSencilloForm';
  else if (nombre === 'Especial') formId = 'perritoEspecialForm';
  
  if (formId) {
    document.getElementById(formId).classList.remove('hidden');
  }
}

function confirmarPerritoIndividual(nombre, precio, inputId, formId) {
  const personalizacion = document.getElementById(inputId).value.trim();
  const extras = personalizacion ? { perrito: personalizacion } : null;
  
  agregarProducto(nombre, precio, {
    category: 'perrito_individual',
    extras: extras
  });
  
  // Limpiar y ocultar el formulario específico
  document.getElementById(inputId).value = '';
  document.getElementById(formId).classList.add('hidden');
  
  // Resetear flags
  if (nombre === 'Perritos sencillos') longPressTriggeredPerritoSencillo = false;
  else if (nombre === 'Perritos especiales') longPressTriggeredPerritoEspecial = false;
}

/* Ramen Individual */
function activarPersonalizacionRamen() {
  timerRamen = setTimeout(() => {
    longPressTriggeredRamen = true;
    document.getElementById('ramenForm').classList.remove('hidden');
  }, 1200);
}

function cancelarPersonalizacionRamen() {
  clearTimeout(timerRamen);
}

function handleClickRamen(event) {
  setTimeout(() => {
    if (!longPressTriggeredRamen) {
      agregarProducto('Ramen', 50, { category: 'ramen_individual' });
    }
    longPressTriggeredRamen = false;
  }, 50);
  
  if (longPressTriggeredRamen) {
    event.preventDefault();
  }
}

function activarPersonalizacionBirriamen() {
  timerBirriamen = setTimeout(() => {
    longPressTriggeredBirriamen = true;
    document.getElementById('birriamenForm').classList.remove('hidden');
  }, 1200);
}

function cancelarPersonalizacionBirriamen() {
  clearTimeout(timerBirriamen);
}

function handleClickBirriamen(event) {
  setTimeout(() => {
    if (!longPressTriggeredBirriamen) {
      agregarProducto('Birriamen', 60, { category: 'ramen_individual' });
    }
    longPressTriggeredBirriamen = false;
  }, 50);
  
  if (longPressTriggeredBirriamen) {
    event.preventDefault();
  }
}

function confirmarRamenIndividual(nombre, precio, inputId, formId) {
  const personalizacion = document.getElementById(inputId).value.trim();
  
  // Guardar con la clave correcta según el producto
  let extras = null;
  if (personalizacion) {
    if (nombre === 'Ramen') {
      extras = { ramen: personalizacion };
    } else if (nombre === 'Birriamen') {
      extras = { birriamen: personalizacion };
    }
  }
  
  agregarProducto(nombre, precio, {
    category: 'ramen_individual',
    extras: extras
  });
  
  // Limpiar y ocultar el formulario específico
  document.getElementById(inputId).value = '';
  document.getElementById(formId).classList.add('hidden');
  
  // Resetear flags
  if (nombre === 'Ramen') longPressTriggeredRamen = false;
  else if (nombre === 'Birriamen') longPressTriggeredBirriamen = false;
}

/* carrito */
function agregarProducto(nombre, precio, options) {
  const item = {
    nombre,
    precio,
    category: (options && options.category) || 'single',
    extras: (options && options.extras) || null
  };
  historial.push(item);
  renderCarrito();
}

function renderCarrito() {
  const ul = document.getElementById("carrito");
  ul.innerHTML = "";
  let sum = 0;
  historial.forEach((item, idx) => {
    let extrasText = '';
    if (item.extras) {
      const parts = [];
      if (item.extras.hamburguesa) parts.push(`Hamburguesa: ${item.extras.hamburguesa}`);
      if (item.extras.burrito) parts.push(`Burrito: ${item.extras.burrito}`);
      if (item.extras.perrito) parts.push(`Perrito: ${item.extras.perrito}`);
      if (item.extras.papas) parts.push(`Papas: ${item.extras.papas}`);
      if (item.extras.bebida) parts.push(`Bebida: ${item.extras.bebida}`);
      if (item.extras.ramen) parts.push(`Ramen: ${item.extras.ramen}`);
      if (item.extras.birriamen) parts.push(`Birriamen: ${item.extras.birriamen}`);
      if (item.extras.consideracion) parts.push(`Nota: ${item.extras.consideracion}`);
      if (parts.length) extrasText = ' — ' + parts.join(', ');
    }
    
    ul.innerHTML += `<li class="flex justify-between items-center">
      <span>${item.nombre}${extrasText} — $${item.precio}</span>
      <button onclick="eliminarProductoCarrito(${idx})" class="ml-4 text-red-600 hover:text-red-800 font-bold">❌</button>
    </li>`;
    sum += item.precio;
  });
  total = sum;
  document.getElementById("total").innerText = total;
  
  // Actualizar texto del botón finalizar según el modo
  const finalizarBtn = document.getElementById("finalizarBtn");
  finalizarBtn.innerText = obtenerTextoBotonFinalizar();
}

function eliminarProductoCarrito(index) {
  if (index < 0 || index >= historial.length) return;
  historial.splice(index, 1);
  renderCarrito();
}

/* finalizar con pulsación */
function activarFinalizar() {
  timerFinalizar = setTimeout(async () => {
    // Guardar el chisme clientil
    chismeClientil = document.getElementById('chismeClientil').value.trim();
    
    let mensaje = "Orden finalizada\nTotal: $" + total;
    if (mesaDescripcion) mensaje = "Descripción: " + mesaDescripcion + "\n" + mensaje;
    if (mesaNum) mensaje = "Mesa: " + mesaNum + "\n" + mensaje;
    
    try {
      if (ordenEnEdicion !== null) {
        // Modo edición: actualizar orden existente
        const orden = ordenesDelDia[ordenEnEdicion];
        
        // Enviar al backend
        const result = await fetchToGAS({
          action: 'editarOrden',
          orden_id: orden.orden_id,
          cambios: {
            productos: historial,
            total: total
          },
          orden_activa: true  // Mantener la orden activa al editar
        });
        
        if (result.ok) {
          // Actualizar localmente
          orden.productos = JSON.parse(JSON.stringify(historial));
          orden.total = total;
          orden.mesa = mesaNum || orden.mesa;
          orden.descripcion = mesaDescripcion || orden.descripcion;
          orden.observaciones = chismeClientil;
          orden.usuario = usuarioActual;
          orden.estado = 'editada';
          
          mensaje = "Cambios guardados\n" + mensaje;
          alert(mensaje);
          irAOrdenes();
        } else {
          throw new Error(result.error || 'Error al editar orden');
        }
      } else {
        // Modo nuevo: crear nueva orden
        const result = await fetchToGAS({
          action: 'crearOrden',
          usuario: usuarioActual,
          mesa: mesaNum,
          descripcion: mesaDescripcion,
          productos: historial,
          total: total,
          observaciones: chismeClientil,
          orden_activa: true  // Explícitamente crear como activa
        });
        
        if (result.ok) {
          // Actualizar localmente
          const ordenGuardada = {
            orden_id: result.orden_id,
            id: ordenesDelDia.length + 1,
            mesa: mesaNum,
            descripcion: mesaDescripcion,
            productos: JSON.parse(JSON.stringify(historial)),
            total: total,
            timestamp: new Date().toLocaleTimeString(),
            estado: 'abierta',
            observacion: '',
            observaciones: chismeClientil,
            usuario: usuarioActual
          };
          ordenesDelDia.push(ordenGuardada);
          
          alert(mensaje);
          limpiarFormulario();
          irAMenu();
        } else {
          throw new Error(result.error || 'Error al crear orden');
        }
      }
    } catch (error) {
      console.error('Error al finalizar orden:', error);
      alert('Error al procesar la orden: ' + error.message);
    }
  }, 1200);
}

function obtenerTextoBotonFinalizar() {
  return ordenEnEdicion !== null ? "Guardar cambios (1.2s)" : "Finalizar Orden (1.2s)";
}

function borrarUltimo() {
  if (historial.length === 0) return;
  historial.pop();
  renderCarrito();
}

function cancelarFinalizar() {
  clearTimeout(timerFinalizar);
}

function activarVaciarCarrito() {
  const btn = document.getElementById("vaciarCarritoBtn");
  if (btn) btn.classList.add("ring-4", "ring-red-400");
  timerVaciarCarrito = setTimeout(() => {
    historial = [];
    renderCarrito();
    if (btn) btn.classList.remove("ring-4", "ring-red-400");
  }, 1200);
}

function cancelarVaciarCarrito() {
  const btn = document.getElementById("vaciarCarritoBtn");
  clearTimeout(timerVaciarCarrito);
  if (btn) btn.classList.remove("ring-4", "ring-red-400");
}

/* órdenes del día */
let timerBorrarOrdenes = null;

async function irAOrdenes() {
  ocultarTodo();
  document.getElementById("menuOrdenes").classList.remove("hidden");
  ordenEnEdicion = null; // Limpiar modo edición al ir a órdenes
  
  try {
    // Cargar órdenes desde el backend
    const result = await fetchToGAS({
      action: 'listarOrdenes'
    });
    
    if (result.ok) {
      // Verificar si hay órdenes
      if (result.ordenes && Array.isArray(result.ordenes)) {
        // Actualizar órdenes locales con las del backend
        ordenesDelDia = result.ordenes.map((orden, index) => ({
          ...orden,
          id: index + 1,
          timestamp: orden.hora ? new Date(orden.hora).toLocaleTimeString() : '',
          observacion: orden.observaciones || ''
        }));
        console.log(`✅ Cargadas ${ordenesDelDia.length} órdenes desde el backend`);
      } else {
        console.log('No hay órdenes en el backend');
        ordenesDelDia = [];
      }
    } else {
      console.error('Error al cargar órdenes:', result.error);
      // NO mostrar alert, solo log
      console.warn('Usando array vacío de órdenes');
      ordenesDelDia = [];
    }
  } catch (error) {
    console.error('Error al cargar órdenes:', error);
    // NO mostrar alert, solo log
    console.warn('Usando array vacío de órdenes');
    ordenesDelDia = [];
  }
  
  renderOrdenes();
}

function renderOrdenes() {
  const grid = document.getElementById("gridOrdenes");
  const totalDia = document.getElementById("totalDelDia");
  
  if (ordenesDelDia.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center text-gray-400">No hay órdenes registradas</div>';
    totalDia.innerText = "0";
    return;
  }
  
  let sumaTotal = 0;
  grid.innerHTML = "";
  
  ordenesDelDia.forEach(orden => {
    sumaTotal += orden.total;
    const tarjeta = document.createElement("div");
    // Determinar color según estado
    let colorClase = "bg-white";
    if (orden.estado === 'editada') {
      colorClase = "bg-yellow-200";
    } else if (orden.estado === 'cancelada') {
      colorClase = "bg-red-200";
    } else if (orden.estado === 'pagada') {
      colorClase = "bg-green-200";
    }
    tarjeta.className = `${colorClase} text-gray-900 p-4 rounded-xl cursor-pointer hover:shadow-lg transition`;
    tarjeta.onclick = () => mostrarDetallesOrden(orden.id - 1);
    tarjeta.innerHTML = `
      <div class="text-sm font-semibold">Mesa ${orden.mesa || 'N/A'}</div>
      <div class="text-xs text-gray-500">${orden.timestamp}</div>
      <div class="text-xs text-gray-400">${orden.usuario ? orden.usuario : ''}</div>
      <div class="mt-2 font-bold text-lg">$${orden.total}</div>
      ${orden.estado ? `<div class="text-xs mt-1 font-semibold uppercase">${orden.estado}</div>` : ''}
    `;
    grid.appendChild(tarjeta);
  });
  
  totalDia.innerText = sumaTotal;
}

function mostrarDetallesOrden(indice) {
  const orden = ordenesDelDia[indice];
  const modal = document.getElementById("modalDetalles");
  const contenido = document.getElementById("detallesContenido");
  const btnAgregar = document.getElementById("btnAgregarProductos");
  const botonesEdicion = document.getElementById("botonesEdicionModal");
  const seccionObservacion = document.getElementById("seccionObservacion");
  
  // Establecer la orden actual en el modal (no resetear historial de eliminaciones)
  ordenEnModalActual = indice;
  
  let html = `<div class="text-lg font-bold mb-3">Orden #${orden.id}</div>`;
  if (orden.estado) {
    let colorEstado = 'text-red-600';
    if (orden.estado === 'pagada') {
      colorEstado = 'text-green-600';
    } else if (orden.estado === 'editada') {
      colorEstado = 'text-yellow-600';
    }
    let horaEditado = '';
    if (orden.estado === 'editada' && orden.editadoHoraPrimera) {
      horaEditado = ` <span class='text-xs text-gray-500'>(primera edición: ${orden.editadoHoraPrimera}${orden.editadoHoraUltima && orden.editadoHoraUltima !== orden.editadoHoraPrimera ? `, última: ${orden.editadoHoraUltima}` : ''})</span>`;
    }
    html += `<div class=\"text-sm mb-2 font-semibold ${colorEstado}\">Estado: ${orden.estado.toUpperCase()}${horaEditado}</div>`;
  }
  html += `<div class="text-sm mb-2"><strong>Mesa:</strong> ${orden.mesa || 'N/A'}</div>`;
  html += `<div class="text-sm mb-2"><strong>Descripción:</strong> ${orden.descripcion || 'N/A'}</div>`;
  // Usar 'observaciones' del backend, pero también verificar 'observacion' local
  const observaciones = orden.observaciones || orden.observacion || '';
  if (observaciones) {
    html += `<div class="text-sm mb-2"><strong>Observaciones:</strong> ${observaciones}</div>`;
  }
  html += `<div class="text-sm mb-2"><strong>Hora:</strong> ${orden.timestamp}</div>`;
  html += `<div class="text-sm font-semibold mb-3">Productos:</div>`;
  
  if (orden.productos.length === 0) {
    html += `<div class="text-sm text-gray-500 italic">Sin productos</div>`;
  } else {
    orden.productos.forEach((prod, idx) => {
      let extrasText = '';
      if (prod.extras) {
        const parts = [];
        if (prod.extras.hamburguesa) parts.push(`Hamburguesa: ${prod.extras.hamburguesa}`);
        if (prod.extras.burrito) parts.push(`Burrito: ${prod.extras.burrito}`);
        if (prod.extras.perrito) parts.push(`Perrito: ${prod.extras.perrito}`);
        if (prod.extras.papas) parts.push(`Papas: ${prod.extras.papas}`);
        if (prod.extras.bebida) parts.push(`Bebida: ${prod.extras.bebida}`);
        if (prod.extras.ramen) parts.push(`Ramen: ${prod.extras.ramen}`);
        if (prod.extras.birriamen) parts.push(`Birriamen: ${prod.extras.birriamen}`);
        if (prod.extras.consideracion) parts.push(`Nota: ${prod.extras.consideracion}`);
        if (parts.length) extrasText = ' — ' + parts.join(', ');
      }
      html += `<div class="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span>• ${prod.nombre}${extrasText} — $${prod.precio}</span>
        <button onclick="eliminarProductoDeOrden(${indice}, ${idx})" class="text-red-600 hover:text-red-800 font-bold">❌</button>
      </div>`;
    });
  }
  
  html += `<div class="text-lg font-bold mt-4 border-t pt-2">Total: $${orden.total}</div>`;
  contenido.innerHTML = html;
  
  // Mostrar sección de observación y botones de edición (solo si no está cancelada o pagada)
  const btnRescatar = document.getElementById("btnRescatarProducto");
  if (orden.estado !== 'cancelada' && orden.estado !== 'pagada') {
    btnAgregar.classList.remove('hidden');
    btnAgregar.onclick = () => abrirModoEdicion(indice);
    botonesEdicion.classList.remove('hidden');
    seccionObservacion.classList.remove('hidden');
    
    // Resetear textarea de observación
    document.getElementById("textareaObservacion").value = '';
    const observacionGuardada = document.getElementById('observacionGuardada');
    if (orden.observacion) {
      observacionGuardada.innerText = 'Observación guardada: ' + orden.observacion;
      observacionGuardada.classList.remove('hidden');
    } else {
      observacionGuardada.innerText = '';
      observacionGuardada.classList.add('hidden');
    }
    
    // Habilitar botón rescatar si hay productos eliminados
    if (productosEliminados.length > 0) {
      btnRescatar.disabled = false;
      btnRescatar.style.opacity = '1';
    } else {
      btnRescatar.disabled = true;
      btnRescatar.style.opacity = '0.5';
    }
  } else {
    btnAgregar.classList.add('hidden');
    botonesEdicion.classList.add('hidden');
    seccionObservacion.classList.add('hidden');
  }
  
  modal.classList.remove("hidden");
  
  // Cerrar modal al hacer clic fuera del contenedor
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      cerrarDetalles();
    }
  });
}

function cerrarDetalles() {
  document.getElementById("modalDetalles").classList.add("hidden");
  // Resetear el historial de eliminaciones al cerrar el modal
  productosEliminados = [];
  ordenEnModalActual = null;
}

/* guardar observación de una orden */
async function confirmarObservacion() {
  if (ordenEnModalActual === null) {
    alert('Error: no hay orden seleccionada');
    return;
  }
  
  const observacionText = document.getElementById('textareaObservacion').value.trim();
  const orden = ordenesDelDia[ordenEnModalActual];
  
  if (observacionText) {
    orden.observacion = observacionText;
    orden.observaciones = observacionText; // Mantener consistencia con backend
    
    try {
      // Si tiene orden_id, actualizar en backend
      if (orden.orden_id) {
        // Nota: El backend de Apps Script actualiza observaciones al editar la orden
        // Aquí guardamos localmente y se sincronizará en la próxima edición
      } else {
      }
      
      // Mostrar confirmación
      const observacionGuardada = document.getElementById('observacionGuardada');
      observacionGuardada.innerText = 'Observación guardada: ' + observacionText;
      observacionGuardada.classList.remove('hidden');
      
      // Limpiar textarea
      document.getElementById('textareaObservacion').value = '';
    } catch (error) {
      console.error('Error al guardar observación:', error);
      alert('Error al guardar observación: ' + error.message);
    }
  } else {
    alert('Por favor escribe una observación');
  }
}

/* eliminar producto de una orden */
async function eliminarProductoDeOrden(ordenIndice, productoIndice) {
  if (confirm("¿Eliminar este producto?")) {
    const orden = ordenesDelDia[ordenIndice];
    
    // Guardar en historial de eliminaciones
    if (ordenEnModalActual === ordenIndice) {
      productosEliminados.push(orden.productos[productoIndice]);
    }
    orden.productos.splice(productoIndice, 1);

    // Recalcular total de la orden
    let nuevoTotal = 0;
    orden.productos.forEach(prod => {
      nuevoTotal += prod.precio;
    });
    orden.total = nuevoTotal;

    // Marcar como editada
    orden.estado = 'editada';
    
    try {
      // Enviar cambios al backend
      if (orden.orden_id) {
        const result = await fetchToGAS({
          action: 'editarOrden',
          orden_id: orden.orden_id,
          cambios: {
            productos: orden.productos,
            total: orden.total
          }
        });
        
        if (!result.ok) {
          console.error('Error al actualizar orden en backend:', result.error);
        }
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }

    mostrarDetallesOrden(ordenIndice);
    renderOrdenes();
  }
}

/* abrir modo edición de una orden */
function abrirModoEdicion(indice) {
  const orden = ordenesDelDia[indice];
  
  // Marcar que estamos editando esta orden
  ordenEnEdicion = indice;
  
  // Cargar los datos en el formulario
  mesaNum = orden.mesa;
  mesaDescripcion = orden.descripcion;
  
  // Cargar productos en el carrito
  historial = JSON.parse(JSON.stringify(orden.productos));
  ultimoProductoEliminado = null; // Resetear el producto eliminado
  renderCarrito();
  
  // Actualizar UI del formulario
  if (mesaNum) {
    document.getElementById("mesaSeleccionada").innerText = mesaNum;
  }
  
  if (mesaDescripcion) {
    const disp = document.getElementById('descripcionGuardada');
    disp.innerText = 'Descripción guardada: ' + mesaDescripcion;
    disp.classList.remove('hidden');
  }
  
  // Actualizar texto del botón finalizar
  const finalizarBtn = document.getElementById("finalizarBtn");
  finalizarBtn.innerText = obtenerTextoBotonFinalizar();
  
  // Cerrar modal y navegar a nueva orden
  cerrarDetalles();
  ocultarTodo();
  document.getElementById("nuevaOrden").classList.remove("hidden");
}

/* rescatar último producto eliminado */
async function rescatarProducto() {
  if (!productosEliminados || productosEliminados.length === 0) {
    alert('No hay productos para rescatar');
    return;
  }
  
  if (ordenEnModalActual === null) {
    alert('Error: no hay orden seleccionada');
    return;
  }
  
  // Traer el último producto eliminado
  const productoRescatado = productosEliminados.pop();
  const orden = ordenesDelDia[ordenEnModalActual];
  orden.productos.push(productoRescatado);
  
  // Recalcular total
  let nuevoTotal = 0;
  orden.productos.forEach(prod => {
    nuevoTotal += prod.precio;
  });
  orden.total = nuevoTotal;
  
  // Marcar como editada
  orden.estado = 'editada';
  
  try {
    // Enviar cambios al backend
    if (orden.orden_id) {
      const result = await fetchToGAS({
        action: 'editarOrden',
        orden_id: orden.orden_id,
        cambios: {
          productos: orden.productos,
          total: orden.total
        }
      });
      
      if (!result.ok) {
        console.error('Error al actualizar orden en backend:', result.error);
      }
    }
  } catch (error) {
    console.error('Error al rescatar producto:', error);
  }
  
  mostrarDetallesOrden(ordenEnModalActual);
  renderOrdenes();
}

let timerCancelarOrden = null;

/* activar cancelación de orden */
function activarCancelarOrden() {
  const btn = document.getElementById("btnCancelarOrden");
  btn.classList.add("ring-4", "ring-red-400");
  
  timerCancelarOrden = setTimeout(async () => {
    if (ordenEnModalActual !== null) {
      const orden = ordenesDelDia[ordenEnModalActual];
      
      try {
        // Enviar al backend
        if (orden.orden_id) {
          const result = await fetchToGAS({
            action: 'cambiarEstado',
            orden_id: orden.orden_id,
            estado: 'cancelada'
          });
          
          if (result.ok) {
            orden.estado = 'cancelada';
            renderOrdenes();
            cerrarDetalles();
            alert('Orden cancelada');
          } else {
            throw new Error(result.error || 'Error al cancelar orden');
          }
        } else {
          // Si no tiene orden_id, solo actualizar localmente
          orden.estado = 'cancelada';
          renderOrdenes();
          cerrarDetalles();
          alert('Orden cancelada');
        }
      } catch (error) {
        console.error('Error al cancelar orden:', error);
        alert('Error al cancelar orden: ' + error.message);
      }
    }
    btn.classList.remove("ring-4", "ring-red-400");
  }, 2000);
}

function cancelarCancelarOrden() {
  const btn = document.getElementById("btnCancelarOrden");
  clearTimeout(timerCancelarOrden);
  btn.classList.remove("ring-4", "ring-red-400");
}

let timerPagadoOrden = null;

/* activar pago de orden */
function activarPagadoOrden() {
  const btn = document.getElementById("btnPagadoOrden");
  btn.classList.add("ring-4", "ring-green-400");
  
  timerPagadoOrden = setTimeout(async () => {
    if (ordenEnModalActual !== null) {
      const orden = ordenesDelDia[ordenEnModalActual];
      
      try {
        // Enviar al backend
        if (orden.orden_id) {
          const result = await fetchToGAS({
            action: 'cambiarEstado',
            orden_id: orden.orden_id,
            estado: 'pagada',
            orden_activa: true  // Mantener la orden activa en el backend
          });
          
          if (result.ok) {
            orden.estado = 'pagada';
            renderOrdenes();
            cerrarDetalles();
            alert('Orden marcada como pagada');
          } else {
            throw new Error(result.error || 'Error al marcar como pagada');
          }
        } else {
          // Si no tiene orden_id, solo actualizar localmente
          orden.estado = 'pagada';
          renderOrdenes();
          cerrarDetalles();
          alert('Orden marcada como pagada');
        }
      } catch (error) {
        console.error('Error al marcar orden como pagada:', error);
        alert('Error al marcar como pagada: ' + error.message);
      }
    }
    btn.classList.remove("ring-4", "ring-green-400");
  }, 1200);
}

function cancelarPagadoOrden() {
  const btn = document.getElementById("btnPagadoOrden");
  clearTimeout(timerPagadoOrden);
  btn.classList.remove("ring-4", "ring-green-400");
}

function activarBorrarOrdenes() {
  const btn = document.getElementById("btnBorrarOrdenes");
  btn.classList.add("ring-4", "ring-red-400");
  timerBorrarOrdenes = setTimeout(() => {
    ordenesDelDia = [];
    renderOrdenes();
    cerrarDetalles();
    btn.classList.remove("ring-4", "ring-red-400");
  }, 5000);
}

function cancelarBorrarOrdenes() {
  const btn = document.getElementById("btnBorrarOrdenes");
  clearTimeout(timerBorrarOrdenes);
  btn.classList.remove("ring-4", "ring-red-400");
}
