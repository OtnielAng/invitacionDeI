// tailwind.config.js
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        crema: '#F4EFE6',    // Beige/crema claro para fondo
        sepia: '#B89B72',    // Café claro/sepia para detalles florales
        cafeOscuro: '#3E2A1E', // Café oscuro para textos principales
        dorado: '#D4AF37',   // Dorado/champagne para acentos y líneas
      },
      fontFamily: {
        // Fuente para títulos y texto general (elegante pero ligera)
        clasica: ['"Cormorant Garamond"', 'serif'],
        // Fuente para las iniciales y detalles a mano
        cursiva: ['"Great Vibes"', 'cursive'],
        // (Opcional) Una fuente muy limpia por si requieres datos duros como fechas o direcciones
        sans: ['"Montserrat"', 'sans-serif'], 
      },
      backgroundImage: {
        // Aquí agregaremos la textura de papel corrugado/antiguo más adelante
        'papel-antiguo': "url('../assets/textura-papel.png')", 
      }
    },
  },
  plugins: [],
}