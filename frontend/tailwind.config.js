/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Updated exact color palette requested
        brand: {
          DEFAULT: '#FFC107', // Amber/Yellow CTA
          hover: '#FFD54F',
          dark: '#E0A800',
          muted: 'rgba(255, 193, 7, 0.15)',
        },
        dark: {
          bg: '#0D0D0D',
          surface: '#1A1A1A',
          card: '#1E1E1E',
          border: '#2A2A2A',
          muted: '#4A4A4A',
        },
        light: {
          bg: '#FFFFFF',
          surface: '#F5F5F5',
          card: '#FFFFFF',
          border: '#E5E5E5',
          muted: '#9E9E9E',
        },
        grey: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#9E9E9E',
          500: '#6B6B6B',
          600: '#4A4A4A',
          700: '#2A2A2A',
          800: '#1E1E1E',
          900: '#121212',
          950: '#0D0D0D',
        },
        status: {
          live: '#10B981', // Soft green
          upcoming: '#F59E0B',
          ended: '#EF4444',
        }
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'soft-md': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'soft-lg': '0 10px 30px rgba(0, 0, 0, 0.4)',
        'yellow-glow': '0 0 25px rgba(255, 193, 7, 0.25)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        }
      }
    },
  },
  plugins: [],
}
