/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-black': '#000000',
        'graphite': '#121212',
        'neon-cyan': '#00F0FF',
        'neon-pink': '#FF007A',
        'electric-mint': '#00FF85',
        'soft-silver': '#CFCFCF',
      },
      fontFamily: {
        'urbanist': ['Urbanist', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'display': ['Syne', 'sans-serif'],
      },
      animation: {
        'bid-pop': 'bidPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 1.5s ease-in-out infinite',
      },
      keyframes: {
        bidPop: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
        },
        neonPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan), 0 0 30px var(--neon-cyan)',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan), 0 0 60px var(--neon-cyan)',
            opacity: '0.8'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px currentColor)' },
          '50%': { filter: 'drop-shadow(0 0 15px currentColor)' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00F0FF, 0 0 20px #00F0FF, 0 0 30px #00F0FF',
        'neon-pink': '0 0 10px #FF007A, 0 0 20px #FF007A, 0 0 30px #FF007A',
        'neon-mint': '0 0 10px #00FF85, 0 0 20px #00FF85, 0 0 30px #00FF85',
      },
    },
  },
  plugins: [],
}
