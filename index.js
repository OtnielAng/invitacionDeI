/* =========================================
     LÓGICA DEL CARRUSEL (Pila de Polaroids)
     ========================================= */
const stackContainer = document.getElementById('polaroid-stack');

if (stackContainer) {
  const cards = stackContainer.querySelectorAll('.polaroid-card');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  let currentIndex = 0;
  let slideInterval;
  let startX = 0;
  let endX = 0;

  /* --- LÓGICA PARA VER FOTOS EN PANTALLA COMPLETA --- */
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeModalBtn = document.getElementById('close-modal');

  // 1. Al hacer clic en una tarjeta de la pila
  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Obtenemos la URL de la imagen clickeada
      const imgSrc = card.querySelector('img').src;
      modalImg.src = imgSrc;

      // Pausamos el carrusel de fondo para que no se mueva mientras vemos la foto
      clearInterval(slideInterval);

      // Mostramos la ventana negra
      modal.classList.remove('hidden');

      // Un micro-retraso para que se vea la transición de entrada
      setTimeout(() => {
        modal.classList.remove('opacity-0');
      }, 10);
    });
  });

  // 2. Función para cerrar el visor
  function cerrarModal() {
    modal.classList.add('opacity-0'); // Se desvanece
    setTimeout(() => {
      modal.classList.add('hidden'); // Se esconde completamente
      modalImg.src = ""; // Limpiamos la foto

      // Reanudamos el carrusel donde se quedó
      startInterval();
    }, 300);
  }

  // 3. Cerrar al picar la "X"
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', cerrarModal);
  }

  // 4. Cerrar al tocar en el fondo negro (fuera de la foto)
  if (modal) {
    modal.addEventListener('click', (e) => {
      // Si tocamos el fondo y NO la foto directamente
      if (e.target === modal) {
        cerrarModal();
      }
    });
  }

  // Función mágica que acomoda las fotos como una baraja
  function updateCards() {
    cards.forEach((card, index) => {
      // Distancia relativa entre la tarjeta y la posición actual
      let diff = (index - currentIndex + cards.length) % cards.length;

      if (diff === 0) {
        // 1. Tarjeta al FRENTE (Activa)
        card.style.zIndex = "30";
        card.style.transform = "translate(-50%, -50%) scale(1) rotate(-2deg)";
        card.style.opacity = "1";
        card.style.pointerEvents = "auto";
      } else if (diff === 1) {
        // 2. Tarjeta justo ATRÁS (Asomándose a la derecha)
        card.style.zIndex = "20";
        card.style.transform = "translate(-40%, -48%) scale(0.95) rotate(4deg)";
        card.style.opacity = "0.9";
        card.style.pointerEvents = "none";
      } else if (diff === 2) {
        // 3. Tarjeta MÁS ATRÁS (Asomándose a la izquierda)
        card.style.zIndex = "10";
        card.style.transform = "translate(-60%, -52%) scale(0.9) rotate(-3deg)";
        card.style.opacity = "0.7";
        card.style.pointerEvents = "none";
      } else if (diff === cards.length - 1) {
        // 4. Tarjeta que acaba de SALIR (Vuela hacia la izquierda y se esfuma)
        card.style.zIndex = "40"; // Se pone por encima de todas mientras vuela
        card.style.transform = "translate(-150%, -60%) scale(0.8) rotate(-20deg)";
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
      } else {
        // 5. El resto están Ocultas en el centro, invisibles, esperando su turno
        card.style.zIndex = "0";
        card.style.transform = "translate(-50%, -50%) scale(0.6)";
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
      }
    });
  }

  function nextPolaroid() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCards();
  }

  function prevPolaroid() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCards();
  }

  // Eventos de los botones
  btnNext.addEventListener('click', () => {
    nextPolaroid();
    resetInterval();
  });

  btnPrev.addEventListener('click', () => {
    prevPolaroid();
    resetInterval();
  });

  // Auto-reproducción cada 2 segundos (2000 ms)
  function startInterval() {
    clearInterval(slideInterval); // evita que se acumulen relojes
    slideInterval = setInterval(nextPolaroid, 4000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  // Soporte para deslizar (Swipe en celulares)
  function handleSwipe() {
    const umbral = 50;
    const diferencia = startX - endX;
    if (diferencia > umbral) {
      nextPolaroid();
      resetInterval();
    } else if (diferencia < -umbral) {
      prevPolaroid();
      resetInterval();
    }
  }

  stackContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    clearInterval(slideInterval);
  });
  stackContainer.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
    startInterval();
  });

  // Iniciar
  updateCards();
  startInterval();
}

/* =========================================
   LÓGICA DE LOS CONTADORES
   ========================================= */
function iniciarContadores() {
  // Fecha límite de confirmación: 15 de Noviembre 2026, 14:00 hrs
  const fechaLimite = new Date("Nov 15, 2026 14:00:00").getTime();

  // Fecha del evento: 7 de Diciembre 2026, 13:00 hrs
  const fechaEvento = new Date("Dec 7, 2026 13:00:00").getTime();

  setInterval(() => {
    const ahora = new Date().getTime();

    // 1. Contador Límite (RSVP)
    const difLimite = fechaLimite - ahora;
    if (difLimite > 0) {
      document.getElementById("lim-dias").innerText = Math.floor(difLimite / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      document.getElementById("lim-horas").innerText = Math.floor((difLimite % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      document.getElementById("lim-min").innerText = Math.floor((difLimite % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    } else {
      document.getElementById("lim-dias").innerText = "00";
      document.getElementById("lim-horas").innerText = "00";
      document.getElementById("lim-min").innerText = "00";
    }

    // 2. Contador Evento (Soporta negativos si ya pasó)
    const difEvento = fechaEvento - ahora;
    const esNegativo = difEvento < 0;
    const absDif = Math.abs(difEvento);

    const diasEv = Math.floor(absDif / (1000 * 60 * 60 * 24));
    const horasEv = Math.floor((absDif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minEv = Math.floor((absDif % (1000 * 60 * 60)) / (1000 * 60));
    const segEv = Math.floor((absDif % (1000 * 60)) / 1000);

    const signo = esNegativo ? "-" : "";

    document.getElementById("ev-dias").innerText = signo + diasEv.toString().padStart(2, '0');
    document.getElementById("ev-horas").innerText = horasEv.toString().padStart(2, '0');
    document.getElementById("ev-min").innerText = minEv.toString().padStart(2, '0');
    document.getElementById("ev-seg").innerText = segEv.toString().padStart(2, '0');

  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarContadores();
});

/* =========================================
   LÓGICA DEL CALENDARIO (.ICS)
   ========================================= */
function descargarCalendario() {
  // 7 de Diciembre 2026, 13:00 hrs locales (Oaxaca CST = UTC-6 -> 19:00 UTC)
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitacion Boda Diego e Itzel//ES",
    "BEGIN:VEVENT",
    "UID:" + new Date().getTime() + "@bodadiegoitzel.com",
    "DTSTAMP:20261001T000000Z",
    "DTSTART:20261207T190000Z",
    "DTEND:20261207T220000Z",
    "SUMMARY:Boda - Diego e Itzel",
    "DESCRIPTION:¡Acompáñanos a celebrar nuestra boda!",
    "LOCATION:Ocotlán de Morelos, Oax.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], {
    type: 'text/calendar;charset=utf-8'
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = 'Boda_Diego_Itzel.ics';
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/* =========================================
   LÓGICA DE LA ANIMACIÓN DEL SOBRE (Intro)
   ========================================= */
const seal = document.getElementById('seal');
const env = document.getElementById('env');
const intro = document.getElementById('intro');
let introStarted = false;
let autoOpenTimer;

function abrirSobre() {
  if (introStarted) return;
  introStarted = true;
  clearTimeout(autoOpenTimer); // cancela la apertura automática si ya se abrió

  seal.classList.add('drop');
  setTimeout(() => env.classList.add('open'), 450);
  setTimeout(() => env.classList.add('leave'), 1900);

  setTimeout(() => {
    intro.classList.add('out');
    document.body.classList.remove('locked');
    document.body.classList.add('empezar-magia'); // arranca la animación
  }, 2300);

  setTimeout(() => intro.remove(), 3200);
}

if (seal && env && intro) {
  // Forma principal: tocar el sello
  seal.addEventListener('click', abrirSobre);

  // Respaldo: si nadie lo toca, se abre solo a los 20 segundos
  autoOpenTimer = setTimeout(abrirSobre, 20000);
}