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
  inicializarModales();
});

// Funciones del carrito
function agregarAlCarrito(producto, precio) {
  const item = { producto, precio };
  carrito.push(item);
  guardarCarrito();
  mostrarCarrito();
  mostrarNotificacion('¡Agregado al carrito!');
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  mostrarCarrito();
  mostrarNotificacion('Item eliminado', 'warning');
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
        <span class="cart-item-name">${item.producto}</span>
        <span class="cart-item-price">$${item.precio}</span>
        <button onclick="eliminarDelCarrito(${index})" class="btn btn-sm btn-danger">×</button>
      `;
      lista.appendChild(li);
    });
  }
  
  actualizarContadorCarrito();
  actualizarTotal();
}

function actualizarContadorCarrito() {
  const contador = document.getElementById('cart-count');
  contador.textContent = carrito.length;
}

function actualizarTotal() {
  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  document.getElementById('total-precio').textContent = `$${total}`;
}

// Persistencia del carrito
function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    mostrarCarrito();
  }
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Funciones de reserva
function agregarReservaPS4() {
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;
  const extras = parseInt(document.getElementById("joysticks").value);

  if (!horaInicio || !horaFin) {
    mostrarNotificacion("Por favor, seleccioná un horario válido", "error");
    return;
  }

  const horas = calcularHoras(horaInicio, horaFin);
  
  if (horas <= 0) {
    mostrarNotificacion("La hora final debe ser mayor que la inicial", "error");
    return;
  }

  const precioTotal = (horas * precios.ps4) + (extras * precios.joystickExtra);
  const descripcion = `PS4: ${horaInicio} a ${horaFin} (${horas}h) | Joysticks +${extras}`;
  
  agregarAlCarrito(descripcion, precioTotal);
}

function agregarReservaSimultaneo() {
  const horaInicio = document.getElementById("horaInicioSimultaneo").value;
  const horaFin = document.getElementById("horaFinSimultaneo").value;
  const extras = parseInt(document.getElementById("joysticksSimultaneo").value);

  if (!horaInicio || !horaFin) {
    mostrarNotificacion("Por favor, seleccioná un horario válido", "error");
    return;
  }

  const horas = calcularHoras(horaInicio, horaFin);
  
  if (horas <= 0) {
    mostrarNotificacion("La hora final debe ser mayor que la inicial", "error");
    return;
  }

  const precioTotal = (horas * precios.simultaneo) + (extras * precios.joystickExtra);
  const descripcion = `PS4 Simultáneo: ${horaInicio} a ${horaFin} (${horas}h) | Joysticks +${extras}`;
  
  agregarAlCarrito(descripcion, precioTotal);
}

function agregarReserva2v2() {
  const horaInicio = document.getElementById("horaInicio2v2").value;
  const horaFin = document.getElementById("horaFin2v2").value;

  if (!horaInicio || !horaFin) {
    mostrarNotificacion("Por favor, seleccioná un horario válido", "error");
    return;
  }

  const horas = calcularHoras(horaInicio, horaFin);
  
  if (horas <= 0) {
    mostrarNotificacion("La hora final debe ser mayor que la inicial", "error");
    return;
  }

  const precioTotal = horas * precios.dosVsDos;
  const descripcion = `PS4 2v2: ${horaInicio} a ${horaFin} (${horas}h)`;
  
  agregarAlCarrito(descripcion, precioTotal);
}

function agregarReservaTorneo() {
  const nombreTorneo = document.getElementById("nombreTorneo").value;
  const participantes = parseInt(document.getElementById("participantes").value);

  if (!nombreTorneo) {
    mostrarNotificacion("Por favor, ingresá un nombre para el torneo", "error");
    return;
  }

  const precioTotal = participantes * precios.torneo;
  const descripcion = `Torneo: ${nombreTorneo} | Participantes: ${participantes}`;
  
  agregarAlCarrito(descripcion, precioTotal);
}

function calcularHoras(horaInicio, horaFin) {
  const [hIni, mIni] = horaInicio.split(':').map(Number);
  const [hFin, mFin] = horaFin.split(':').map(Number);
  let horas = (hFin - hIni) + (mFin - mIni) / 60;
  if (horas <= 0) horas += 24; // permite reservar entre días
  return Math.round(horas * 10) / 10;
}

// Función para enviar pedido
function enviarPedido() {
  if (carrito.length === 0) {
    mostrarNotificacion("Tu carrito está vacío", "error");
    return;
  }
  
  if (confirm("¿Confirmar el envío del pedido?")) {
    const items = carrito.map(item => `• ${item.producto} - $${item.precio}`).join('\n');
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    
    const mensaje = encodeURIComponent(
      `Hola GAMEHOUSE, quiero reservar:\n${items}\n\n*Total: $${total}*`
    );
    
    window.open(`https://wa.me/543513525612?text=${mensaje}`, '_blank');
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    mostrarNotificacion('Pedido enviado con éxito');
  }
}

// Notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
  const notif = document.createElement('div');
  notif.className = `position-fixed bottom-0 end-0 p-3`;
  notif.innerHTML = `
    <div class="alert alert-${tipo === 'error' ? 'danger' : tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.remove();
  }, 3000);
}

// Inicialización de modales
function inicializarModales() {
  // Inicializar tooltips si los hay
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });
}

// Efecto parallax para la sección hero
window.addEventListener('scroll', function() {
  const hero = document.querySelector('.hero-section');
  if (hero) {
    const scrollPosition = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
  }
});