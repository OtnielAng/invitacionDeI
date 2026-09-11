tailwind.config = {
      theme: {
        extend: {
          colors: {
            crema: '#F4EFE6',
            sepia: '#B89B72',
            cafeOscuro: '#3E2A1E',
            dorado: '#D4AF37',
          },
          fontFamily: {
            clasica: ['"Cormorant Garamond"', 'serif'],
            cursiva: ['"Great Vibes"', 'cursive'],
          }
        }
      }
    }


document.addEventListener('DOMContentLoaded', () => {
  /* =========================================
     LÓGICA DEL CARRUSEL (Autoplay, Dots y Swipe)
     ========================================= */
  const carouselInner = document.getElementById('carousel-inner');
  const images = carouselInner.querySelectorAll('img');
  const dotsContainer = document.getElementById('carousel-dots');
  let currentIndex = 0;
  let slideInterval;
  
  // Variables para detectar el arrastre
  let startX = 0;
  let endX = 0;

  // 1. Generar los puntos (dots)
  images.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `w-2.5 h-2.5 rounded-full transition-colors duration-300 ${index === 0 ? 'bg-crema' : 'bg-crema/50'}`;
    dot.onclick = () => {
      goToSlide(index);
      resetInterval();
    };
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('button');

  // 2. Función para cambiar de slide
  function goToSlide(index) {
    currentIndex = index;
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => {
      dot.className = `w-2.5 h-2.5 rounded-full transition-colors duration-300 ${i === index ? 'bg-crema' : 'bg-crema/50'}`;
    });
  }

  // 3. Lógica de Autoplay
  function startInterval() {
    slideInterval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % images.length;
      goToSlide(nextIndex);
    }, 3000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  // 4. Lógica de Deslizamiento (Swipe)
  function handleSwipe() {
    const umbral = 50; // Distancia mínima en píxeles para considerar que fue un arrastre
    const diferencia = startX - endX;

    if (diferencia > umbral) {
      // Arrastró hacia la izquierda -> Siguiente foto
      let nextIndex = (currentIndex + 1) % images.length;
      goToSlide(nextIndex);
    } else if (diferencia < -umbral) {
      // Arrastró hacia la derecha -> Foto anterior
      let prevIndex = (currentIndex - 1 + images.length) % images.length;
      goToSlide(prevIndex);
    }
  }

  // Eventos para Celulares (Touch)
  carouselInner.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    clearInterval(slideInterval); // Pausar autoplay al tocar
  });

  carouselInner.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
    startInterval(); // Reanudar autoplay
  });

  // Eventos para Computadora (Mouse)
  carouselInner.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    clearInterval(slideInterval);
  });

  carouselInner.addEventListener('mouseup', (e) => {
    endX = e.clientX;
    handleSwipe();
    startInterval();
  });

  // Iniciar el carrusel
  startInterval();
});

/* =========================================
   LÓGICA DEL CALENDARIO (.ICS)
   ========================================= */
function descargarCalendario() {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Invitacion Boda//ES",
    "BEGIN:VEVENT",
    "UID:" + new Date().getTime() + "@tudominio.com",
    "DTSTAMP:20260911T000000Z",
    "DTSTART:20261205T190000Z", 
    "DTEND:20261205T210000Z",   
    "SUMMARY:Boda (Ceremonia)",
    "DESCRIPTION:Acompáñanos en nuestra ceremonia.",
    "LOCATION:Hacienda de la Realeza, Centro Histórico",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.href = url;
  a.download = 'ceremonia_boda.ics';
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/* =========================================
   LÓGICA DE LOS CONTADORES
   ========================================= */
function iniciarContadores() {
  // Fecha límite de confirmación: 15 de Noviembre 2026, 14:00 hrs
  const fechaLimite = new Date("Nov 15, 2026 14:00:00").getTime();
  
  // Fecha del evento: 6 de Diciembre 2026, 14:00 hrs
  const fechaEvento = new Date("Dec 6, 2026 14:00:00").getTime();

  setInterval(() => {
    const ahora = new Date().getTime();

    // 1. CÁLCULO CONTADOR LÍMITE (RSVP)
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

    // 2. CÁLCULO CONTADOR EVENTO (Permite negativos)
    const difEvento = fechaEvento - ahora;
    const esNegativo = difEvento < 0;
    const absDif = Math.abs(difEvento); // Usamos valor absoluto para que la matemática no se rompa al pasar a negativo

    const diasEv = Math.floor(absDif / (1000 * 60 * 60 * 24));
    const horasEv = Math.floor((absDif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minEv = Math.floor((absDif % (1000 * 60 * 60)) / (1000 * 60));
    const segEv = Math.floor((absDif % (1000 * 60)) / 1000);

    // Si ya pasó la fecha, le agregamos el signo de menos (-) a los días
    const signo = esNegativo ? "-" : "";

    document.getElementById("ev-dias").innerText = signo + diasEv.toString().padStart(2, '0');
    document.getElementById("ev-horas").innerText = horasEv.toString().padStart(2, '0');
    document.getElementById("ev-min").innerText = minEv.toString().padStart(2, '0');
    document.getElementById("ev-seg").innerText = segEv.toString().padStart(2, '0');

  }, 1000); // Se actualiza cada segundo
}

// Iniciar los cronómetros cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
  iniciarContadores();
});