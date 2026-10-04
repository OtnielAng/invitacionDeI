document.addEventListener('DOMContentLoaded', () => {
  /* =========================================
     LÓGICA DEL CARRUSEL (Autoplay, Dots y Swipe)
     ========================================= */
  const carouselInner = document.getElementById('carousel-inner');
  const images = carouselInner.querySelectorAll('img');
  const dotsContainer = document.getElementById('carousel-dots');
  let currentIndex = 0;
  let slideInterval;
  
  let startX = 0;
  let endX = 0;

  // 1. Generar los puntos (dots)
  images.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `w-2 h-2 rounded-full transition-colors duration-300 ${index === 0 ? 'bg-crema' : 'bg-crema/40'}`;
    dot.onclick = () => {
      goToSlide(index);
      resetInterval();
    };
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('button');

  function goToSlide(index) {
    currentIndex = index;
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => {
      dot.className = `w-2 h-2 rounded-full transition-colors duration-300 ${i === index ? 'bg-crema' : 'bg-crema/40'}`;
    });
  }

  function startInterval() {
    slideInterval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % images.length;
      goToSlide(nextIndex);
    }, 3500);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  function handleSwipe() {
    const umbral = 50;
    const diferencia = startX - endX;

    if (diferencia > umbral) {
      let nextIndex = (currentIndex + 1) % images.length;
      goToSlide(nextIndex);
    } else if (diferencia < -umbral) {
      let prevIndex = (currentIndex - 1 + images.length) % images.length;
      goToSlide(prevIndex);
    }
  }

  carouselInner.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    clearInterval(slideInterval);
  });

  carouselInner.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
    startInterval();
  });

  carouselInner.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    clearInterval(slideInterval);
  });

  carouselInner.addEventListener('mouseup', (e) => {
    endX = e.clientX;
    handleSwipe();
    startInterval();
  });

  startInterval();
});

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

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
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

if (seal && env && intro) {
  seal.addEventListener('click', () => {
    if (introStarted) return;
    introStarted = true;
    
    // 1. Cae el sello
    seal.classList.add('drop'); 
    
    // 2. Abre solapa y saca carta
    setTimeout(() => env.classList.add('open'), 450); 
    
    // 3. Sube el sobre hacia arriba para salir
    setTimeout(() => env.classList.add('leave'), 1900); 
    
    // 4. Desaparece el fondo oscuro y desbloquea el scroll
    setTimeout(() => {
      intro.classList.add('out');
      document.body.classList.remove('locked'); 
    }, 2300);
    
    // 5. Borra el intro del HTML para no estorbar clics
    setTimeout(() => intro.remove(), 3200); 
  });
}