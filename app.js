let total = 0;
let timerFinalizar = null;
let historial = [];
let selectedCombo = null;
let selectedExtras = {};
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

/* inicializar órdenes del día desde localStorage */
function inicializarOrdenes() {
  const guardadas = localStorage.getItem('ordenesDelDia');
  if (guardadas) {
    ordenesDelDia = JSON.parse(guardadas);
  }
}


/* guardar órdenes en localStorage */
function guardarOrdenesLocal() {
  localStorage.setItem('ordenesDelDia', JSON.stringify(ordenesDelDia));
}

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

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', inicializarOrdenes);

/* navegación */
function ocultarTodo() {
  ["bienvenida","menuPrincipal","nuevaOrden","menuOrdenes","barraUsuarios"].forEach(id =>
    document.getElementById(id).classList.add("hidden")
  );
}


let usuarioActual = null;

function irAMenu() {
  ocultarTodo();
  // Si no hay usuario seleccionado, mostrar barra de usuarios
  if (!usuarioActual) {
    document.getElementById("barraUsuarios").classList.remove("hidden");
  } else {
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

  const disp = document.getElementById('descripcionGuardada');
  if (disp) { 
    disp.innerText = ''; 
    disp.classList.add('hidden'); 
  }

  const ta = document.getElementById('descripcionText');
  if (ta) ta.value = '';

  document.getElementById('descripcionBox').classList.add('hidden');
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  document.getElementById('bebidaJ').classList.remove('ring-2');
  document.getElementById('bebidaH').classList.remove('ring-2');
  const psBox = document.getElementById('personalSencillaBox');
  if (psBox) psBox.classList.add('hidden');
  const phBox = document.getElementById('personalHawaiianaBox');
  if (phBox) phBox.classList.add('hidden');
  const peBox = document.getElementById('personalEspecialBox');
  if (peBox) peBox.classList.add('hidden');
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
  document.getElementById("papasForm").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  document.getElementById("menuHamburguesas").classList.toggle("hidden");
}

function toggleCombos() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  document.getElementById("menuCombos").classList.toggle("hidden");
}

function togglePapasForm() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  document.getElementById("papasForm").classList.toggle("hidden");
}

function toggleBebidas() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  const ps = document.getElementById('personalSencillaBox');
  if (ps) ps.classList.add('hidden');
  const ph = document.getElementById('personalHawaiianaBox');
  if (ph) ph.classList.add('hidden');
  const pe = document.getElementById('personalEspecialBox');
  if (pe) pe.classList.add('hidden');
  const mb = document.getElementById("menuBebidas");
  if (mb) mb.classList.toggle("hidden");
}

function abrirCombo(nombre, precio) {
  // Obtener la cantidad según el combo que se abrió
  let cantidadSeleccionada = 1;
  if (nombre === 'Combo Sencilla') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboSencilla').value);
  } else if (nombre === 'Combo Hawaiiana') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboHawaiiana').value);
  } else if (nombre === 'Combo Especial') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboEspecial').value);
  }
  
  selectedCombo = { nombre, precio, cantidad: cantidadSeleccionada };
  selectedExtras = {};
  document.getElementById('comboForm').classList.remove('hidden');
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
  agregarProducto('Sencilla', 60);
}

function confirmarPersonalizacionSencilla() {
  const val = document.getElementById('sencillaPersonalInput').value.trim();
  const extras = val ? { hamburguesa: val } : null;
  agregarProducto('Sencilla', 60, { extras });
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
  agregarProducto('Hawaiiana', 75);
}

function confirmarPersonalizacionHawaiiana() {
  const val = document.getElementById('hawaiianaPersonalInput').value.trim();
  const extras = val ? { hamburguesa: val } : null;
  agregarProducto('Hawaiiana', 75, { extras });
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
  agregarProducto('Especial', 90);
}

function confirmarPersonalizacionEspecial() {
  const val = document.getElementById('especialPersonalInput').value.trim();
  const extras = val ? { hamburguesa: val } : null;
  agregarProducto('Especial', 90, { extras });
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
      if (item.extras.papas) parts.push(`Papas: ${item.extras.papas}`);
      if (item.extras.bebida) parts.push(`Bebida: ${item.extras.bebida}`);
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
  timerFinalizar = setTimeout(() => {
    // Guardar el chisme clientil
    chismeClientil = document.getElementById('chismeClientil').value.trim();
    
    let mensaje = "Orden finalizada\nTotal: $" + total;
    if (mesaDescripcion) mensaje = "Descripción: " + mesaDescripcion + "\n" + mensaje;
    if (mesaNum) mensaje = "Mesa: " + mesaNum + "\n" + mensaje;
    
    if (ordenEnEdicion !== null) {
      // Modo edición: actualizar orden existente
      const orden = ordenesDelDia[ordenEnEdicion];
      orden.productos = JSON.parse(JSON.stringify(historial));
      orden.total = total;
      orden.mesa = mesaNum || orden.mesa;
      orden.descripcion = mesaDescripcion || orden.descripcion;
      orden.chisme = chismeClientil;
      orden.usuario = usuarioActual;
      // Si es la primera vez que se edita, guarda la hora de la primera edición
      if (!orden.editadoHoraPrimera) {
        orden.editadoHoraPrimera = new Date().toLocaleTimeString();
      }
      orden.editadoHoraUltima = new Date().toLocaleTimeString();
      orden.estado = 'editada'; // Marcar como editada
      mensaje = "Cambios guardados\n" + mensaje;
    } else {
      // Modo nuevo: crear nueva orden
      const ordenGuardada = {
        id: ordenesDelDia.length + 1,
        mesa: mesaNum,
        descripcion: mesaDescripcion,
        productos: JSON.parse(JSON.stringify(historial)),
        total: total,
        timestamp: new Date().toLocaleTimeString(),
        estado: null, // Nueva orden sin estado
        observacion: '', // Nueva orden sin observación
        chisme: chismeClientil, // Guardar chisme clientil
        usuario: usuarioActual // Guardar usuario
      };
      ordenesDelDia.push(ordenGuardada);
    }
    
    alert(mensaje);
    guardarOrdenesLocal();
    limpiarFormulario();
    if (ordenEnEdicion !== null) {
      irAOrdenes();
    } else {
      irAMenu();
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

function irAOrdenes() {
  ocultarTodo();
  document.getElementById("menuOrdenes").classList.remove("hidden");
  ordenEnEdicion = null; // Limpiar modo edición al ir a órdenes
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
  if (orden.chisme) {
    html += `<div class="text-sm mb-2"><strong>Chisme:</strong> ${orden.chisme}</div>`;
  }
  if (orden.observacion) {
    html += `<div class="text-sm mb-2"><strong>Observación:</strong> ${orden.observacion}</div>`;
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
        if (prod.extras.papas) parts.push(`Papas: ${prod.extras.papas}`);
        if (prod.extras.bebida) parts.push(`Bebida: ${prod.extras.bebida}`);
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
function confirmarObservacion() {
  if (ordenEnModalActual === null) {
    alert('Error: no hay orden seleccionada');
    return;
  }
  
  const observacionText = document.getElementById('textareaObservacion').value.trim();
  const orden = ordenesDelDia[ordenEnModalActual];
  
  if (observacionText) {
    orden.observacion = observacionText;
    guardarOrdenesLocal();
    
    // Mostrar confirmación
    const observacionGuardada = document.getElementById('observacionGuardada');
    observacionGuardada.innerText = 'Observación guardada: ' + observacionText;
    observacionGuardada.classList.remove('hidden');
    
    // Limpiar textarea
    document.getElementById('textareaObservacion').value = '';
  } else {
    alert('Por favor escribe una observación');
  }
}

/* eliminar producto de una orden */
function eliminarProductoDeOrden(ordenIndice, productoIndice) {
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

    // Marcar como editada con color amarillo y registrar hora de edición
    if (!orden.editadoHoraPrimera) {
      orden.editadoHoraPrimera = new Date().toLocaleTimeString();
    }
    orden.editadoHoraUltima = new Date().toLocaleTimeString();
    orden.estado = 'editada';

    guardarOrdenesLocal();
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
function rescatarProducto() {
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
  
  guardarOrdenesLocal();
  mostrarDetallesOrden(ordenEnModalActual);
  renderOrdenes();
}

let timerCancelarOrden = null;

/* activar cancelación de orden */
function activarCancelarOrden() {
  const btn = document.getElementById("btnCancelarOrden");
  btn.classList.add("ring-4", "ring-red-400");
  
  timerCancelarOrden = setTimeout(() => {
    if (ordenEnModalActual !== null) {
      const orden = ordenesDelDia[ordenEnModalActual];
      orden.estado = 'cancelada';
      guardarOrdenesLocal();
      renderOrdenes();
      cerrarDetalles();
      alert('Orden cancelada');
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
  
  timerPagadoOrden = setTimeout(() => {
    if (ordenEnModalActual !== null) {
      const orden = ordenesDelDia[ordenEnModalActual];
      orden.estado = 'pagada';
      guardarOrdenesLocal();
      renderOrdenes();
      cerrarDetalles();
      alert('Orden marcada como pagada');
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
    guardarOrdenesLocal();
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
