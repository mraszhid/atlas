import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ATLAS Brand Colors - Clinical, Premium, Global
        atlas: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36aaf8',
          500: '#0c8ee9',
          600: '#0070c7',
          700: '#0159a1',
          800: '#064b85',
          900: '#0b3f6e',
          950: '#072849',
        },
        // Secondary - Teal for medical trust
        medical: {
          50: '#effefb',
          100: '#c8fff4',
          200: '#91feea',
          300: '#53f5dc',
          400: '#1fe2c8',
          500: '#06c6ae',
          600: '#02a08f',
          700: '#068074',
          800: '#0a655d',
          900: '#0d534d',
        },
        // Accent - Warm coral for alerts/emergency
        alert: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd5cc',
          300: '#ffb5a6',
          400: '#ff8a71',
          500: '#f86545',
          600: '#e54a27',
          700: '#c13b1c',
          800: '#a0341b',
          900: '#84301d',
        },
        // Neutral slate for clinical UI
        clinical: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        'atlas': '0 4px 6px -1px rgba(7, 40, 73, 0.1), 0 2px 4px -1px rgba(7, 40, 73, 0.06)',
        'atlas-lg': '0 10px 15px -3px rgba(7, 40, 73, 0.1), 0 4px 6px -2px rgba(7, 40, 73, 0.05)',
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
