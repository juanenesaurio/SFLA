let total = 0;
let timerFinalizar = null;
let historial = [];
let selectedCombo = null;
let selectedExtras = {};
let selectedComboBurrito = null;
let selectedExtrasBurrito = {};
let selectedComboPeato = null;
let selectedExtrasPeato = {};
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
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("menuCombosPeatos").classList.add("hidden");
  document.getElementById("comboPeatoForm").classList.add("hidden");
  document.getElementById("papasForm").classList.add("hidden");
  document.getElementById("menuBurritoSencillo").classList.add("hidden");
  document.getElementById("burritoPastorForm").classList.add("hidden");
  document.getElementById("burritoChorizoForm").classList.add("hidden");
  document.getElementById("burritoArracheraForm").classList.add("hidden");
  document.getElementById("menuRamen").classList.add("hidden");
  document.getElementById("ramenForm").classList.add("hidden");
  document.getElementById("birriamenForm").classList.add("hidden");
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
  document.getElementById("menuCombosPeatos").classList.add("hidden");
  document.getElementById("comboPeatoForm").classList.add("hidden");
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
  document.getElementById("menuCombosPeatos").classList.add("hidden");
  document.getElementById("comboPeatoForm").classList.add("hidden");
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
  document.getElementById("menuCombosPeatos").classList.add("hidden");
  document.getElementById("comboPeatoForm").classList.add("hidden");
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
  document.getElementById("menuCombosPeatos").classList.add("hidden");
  document.getElementById("comboPeatoForm").classList.add("hidden");
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

function toggleCombosPeatos() {
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
  document.getElementById("menuCombosPeatos").classList.toggle("hidden");
}

function togglePapasForm() {
  document.getElementById("menuHamburguesas").classList.add("hidden");
  document.getElementById("menuCombos").classList.add("hidden");
  document.getElementById("comboForm").classList.add("hidden");
  document.getElementById("menuCombosBurrito").classList.add("hidden");
  document.getElementById("comboBurritoForm").classList.add("hidden");
  document.getElementById("menuCombosPeatos").classList.add("hidden");
  document.getElementById("comboPeatoForm").classList.add("hidden");
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
  document.getElementById("menuCombosPeatos").classList.add("hidden");
  document.getElementById("comboPeatoForm").classList.add("hidden");
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
  document.getElementById("menuCombosPeatos").classList.add("hidden");
  document.getElementById("comboPeatoForm").classList.add("hidden");
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
  document.getElementById("menuCombosPeatos").classList.add("hidden");
  document.getElementById("comboPeatoForm").classList.add("hidden");
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

/* Combos Burrito */
function abrirComboBurrito(nombre, precio) {
  // Obtener la cantidad según el combo que se abrió
  let cantidadSeleccionada = 1;
  if (nombre === 'Combo Pastor') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboPastor').value);
  } else if (nombre === 'Combo Chorizo') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboChorizo').value);
  } else if (nombre === 'Combo Arrachera') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboArrachera').value);
  }
  
  selectedComboBurrito = { nombre, precio, cantidad: cantidadSeleccionada };
  selectedExtrasBurrito = {};
  document.getElementById('comboBurritoForm').classList.remove('hidden');
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
function abrirComboPeato(nombre, precio) {
  // Obtener la cantidad según el combo que se abrió
  let cantidadSeleccionada = 1;
  if (nombre === 'Orden sencilla') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadOrdenSencilla').value);
  } else if (nombre === 'Combo perritos calientes') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboPerritos').value);
  } else if (nombre === 'Combo especiales') {
    cantidadSeleccionada = parseInt(document.getElementById('cantidadComboEspeciales').value);
  }
  
  selectedComboPeato = { nombre, precio, cantidad: cantidadSeleccionada };
  selectedExtrasPeato = {};
  document.getElementById('comboPeatoForm').classList.remove('hidden');
  
  // Mostrar/ocultar secciones según el tipo de combo
  const seccionPapas = document.getElementById('seccionPapasPeato');
  const seccionBebida = document.getElementById('seccionBebidaPeato');
  
  if (nombre === 'Orden sencilla') {
    // Solo mostrar el campo de perritos
    seccionPapas.classList.add('hidden');
    seccionBebida.classList.add('hidden');
    document.getElementById('peatoInput').placeholder = '¿Que llevarán los perritos con tinder?';
  } else {
    // Mostrar todos los campos
    seccionPapas.classList.remove('hidden');
    seccionBebida.classList.remove('hidden');
    document.getElementById('peatoInput').placeholder = '¿Que llevarán los perritos con tinder?';
  }
  
  document.getElementById('peatoInput').value = '';
  document.getElementById('peatoInput').disabled = false;
  document.getElementById('papasPeatoInput').value = '';
  document.getElementById('papasPeatoInput').disabled = false;
  document.getElementById('bebidaPeatoInput').value = '';
  document.getElementById('bebidaPeatoInput').disabled = false;
  document.getElementById('bebidaPeatoJ').classList.remove('ring-2');
  document.getElementById('bebidaPeatoH').classList.remove('ring-2');
}

function confirmarPeato() {
  const peato = document.getElementById('peatoInput').value.trim();
  if (peato) {
    selectedExtrasPeato.perrito = peato;
    document.getElementById('peatoInput').value = '✓ ' + peato;
    document.getElementById('peatoInput').disabled = true;
  }
}

function confirmarPapasPeato() {
  const papas = document.getElementById('papasPeatoInput').value.trim();
  if (papas) {
    selectedExtrasPeato.papas = papas;
    document.getElementById('papasPeatoInput').value = '✓ ' + papas;
    document.getElementById('papasPeatoInput').disabled = true;
  }
}

function seleccionarBebidaPeato(nombre) {
  selectedExtrasPeato.bebida = nombre;
  document.getElementById('bebidaPeatoJ').classList.toggle('ring-2', nombre === 'Jamaica');
  document.getElementById('bebidaPeatoH').classList.toggle('ring-2', nombre === 'Horchata');
}

function confirmarBebidaPeato() {
  const bebida = document.getElementById('bebidaPeatoInput').value.trim();
  if (bebida) {
    selectedExtrasPeato.consideracion = bebida;
    document.getElementById('bebidaPeatoInput').value = '✓ ' + bebida;
    document.getElementById('bebidaPeatoInput').disabled = true;
  }
}

function confirmarComboPeato() {
  if (!selectedComboPeato) return;
  
  const cantidad = selectedComboPeato.cantidad || 1;
  
  // Agregar el combo multiplicado por la cantidad
  for (let i = 0; i < cantidad; i++) {
    agregarProducto(selectedComboPeato.nombre, selectedComboPeato.precio, {
      category: 'combo',
      extras: Object.keys(selectedExtrasPeato).length > 0 ? selectedExtrasPeato : null
    });
  }
  
  document.getElementById('comboPeatoForm').classList.add('hidden');
  selectedComboPeato = null;
  selectedExtrasPeato = {};
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
  document.getElementById('menuBurritoSencillo').classList.add('hidden');
  renderCarrito();
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
  if (nombre === 'Sencillo') longPressTriggeredPerritoSencillo = false;
  else if (nombre === 'Especial') longPressTriggeredPerritoEspecial = false;
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
  const extras = personalizacion ? { ramen: personalizacion } : null;
  
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
    
    guardarOrdenesLocal();
    
    // Enviar orden al Google Apps Script
    const ordenParaEnviar = ordenEnEdicion !== null ? ordenesDelDia[ordenEnEdicion] : ordenesDelDia[ordenesDelDia.length - 1];
    
    fetch('https://script.google.com/macros/s/AKfycbzzZyhrYwcH4xcIq48VLKD2aWLuM910j1plfTgI1GnrSAkcaidZOXYMHx-1RYcLJANH/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: "crearOrden",
        usuario: usuarioActual,
        mesa: mesaNum,
        descripcion: mesaDescripcion,
        productos: historial,
        total: total,
        observaciones: chismeClientil
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok === true) {
        alert("Orden enviada correctamente");
      } else {
        alert("Error al enviar la orden");
      }
    })
    .catch(error => {
      alert("Error al enviar la orden");
      console.error('Error:', error);
    });
    
    alert(mensaje);
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
        if (prod.extras.burrito) parts.push(`Burrito: ${prod.extras.burrito}`);
        if (prod.extras.peato) parts.push(`Peato: ${prod.extras.peato}`);
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
