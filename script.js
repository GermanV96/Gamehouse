// Variables globales
let carrito = [];
const precios = {
  ps4: 3500,
  simultaneo: 5000,
  dosVsDos: 4000,
  torneo: 3000,
  joystickExtra: 300
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  cargarCarrito();
  actualizarContadorCarrito();
  actualizarTotal();
});

// Funciones del carrito
function agregarAlCarrito(producto, precio) {
  const item = { producto, precio };
  carrito.push(item);
  guardarCarrito();
  mostrarCarrito();
  mostrarNotificacion();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
}

function mostrarCarrito() {
  const lista = document.getElementById('carrito');
  lista.innerHTML = '';

  if (carrito.length === 0) {
    lista.innerHTML = '<li class="list-group-item empty-cart">Tu carrito está vacío</li>';
  } else {
    carrito.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span>${item.producto}</span>
        <span>$${item.precio.toLocaleString()}</span>
        <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">×</button>
      `;
      lista.appendChild(li);
    });
  }

  actualizarContadorCarrito();
  actualizarTotal();
}

function actualizarContadorCarrito() {
  document.getElementById('cart-count').textContent = carrito.length;
}

function actualizarTotal() {
  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  document.getElementById('total-precio').textContent = `$${total.toLocaleString()}`;
}

function cargarCarrito() {
  const datos = localStorage.getItem('carrito');
  if (datos) {
    carrito = JSON.parse(datos);
    mostrarCarrito();
  }
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para calcular horas
function calcularHoras(inicio, fin) {
  const [h1, m1] = inicio.split(':').map(Number);
  const [h2, m2] = fin.split(':').map(Number);
  const minutos1 = h1 * 60 + m1;
  const minutos2 = h2 * 60 + m2;
  return Math.max(1, Math.ceil((minutos2 - minutos1) / 60));
}

// Funciones de reservas
function agregarReservaPS4() {
  const hInicio = document.getElementById("horaInicio").value;
  const hFin = document.getElementById("horaFin").value;
  const extras = parseInt(document.getElementById("joysticks").value);
  if (!hInicio || !hFin) return alert("Seleccioná un horario válido");

  const horas = calcularHoras(hInicio, hFin);
  const precio = (horas * precios.ps4) + (extras * precios.joystickExtra);
  agregarAlCarrito(`Reserva PS4 Pro (${horas}h + ${extras} joystick extra)`, precio);
}

function agregarReservaSimultaneo() {
  const hInicio = document.getElementById("horaInicioSimultaneo").value;
  const hFin = document.getElementById("horaFinSimultaneo").value;
  const extras = parseInt(document.getElementById("joysticksSimultaneo").value);
  if (!hInicio || !hFin) return alert("Seleccioná un horario válido");

  const horas = calcularHoras(hInicio, hFin);
  const precio = (horas * precios.simultaneo) + (extras * precios.joystickExtra);
  agregarAlCarrito(`Reserva PS4 Simultáneo (${horas}h + ${extras} joystick extra)`, precio);
}

function agregarReserva2v2() {
  const hInicio = document.getElementById("horaInicio2v2").value;
  const hFin = document.getElementById("horaFin2v2").value;
  if (!hInicio || !hFin) return alert("Seleccioná un horario válido");

  const horas = calcularHoras(hInicio, hFin);
  const precio = horas * precios.dosVsDos;
  agregarAlCarrito(`Reserva PS4 2v2 (${horas}h)`, precio);
}

function agregarReservaTorneo() {
  const nombre = document.getElementById("nombreTorneo").value;
  const participantes = parseInt(document.getElementById("participantes").value);
  if (!nombre) return alert("Ingresá el nombre del torneo");

  const precio = participantes * precios.torneo;
  agregarAlCarrito(`Inscripción Torneo "${nombre}" (${participantes} participantes)`, precio);
}

// Juegos digitales
function agregarJuegoDigital(nombre, precio) {
  agregarAlCarrito(`Juego digital: ${nombre}`, precio);
  mostrarNotificacion(`¡${nombre} agregado al carrito!`);
}

// Enviar por WhatsApp
function enviarPedido() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  const mensaje = carrito.map(item => `• ${item.producto} - $${item.precio.toLocaleString()}`).join('\n');
  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  const texto = `Hola, quiero hacer la siguiente reserva:\n\n${mensaje}\n\nTotal: $${total.toLocaleString()}`;
  const url = `https://wa.me/543513525612?text=${encodeURIComponent(texto)}`;

  window.open(url, '_blank');
}

function mostrarNotificacion(mensaje = '¡Agregado al carrito!') {
  const noti = document.getElementById('notificacion-carrito');
  noti.textContent = mensaje;
  noti.classList.add('mostrar');

  setTimeout(() => {
    noti.classList.remove('mostrar');
  }, 2500);
}

function abrirImagen(src) {
  const modal = new bootstrap.Modal(document.getElementById('imagenModal'));
  document.getElementById('imagenAmpliada').src = src;
  modal.show();
}