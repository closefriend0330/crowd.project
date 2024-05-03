import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safeList: [
    'text-red-500',
    'text-green-500',
    'text-blue-400',
    'text-blue-500',
    'text-yellow-500',
    'text-purple-400',
    'text-sky-400',
    'text-orange-500',
    'text-teal-400',
    'text-indigo-400',
    'text-gray-500',
    'text-emerald-300',
    'text-fuchsia-400',
    'text-cyan-400',
    'text-rose-400',
    'text-lime-600',
    'text-green-400',
    'text-amber-700',
    'text-violet-500',
    'text-orange-300',
    'text-cyan-600',
    'text-violet-300',
    'text-emerald-600',
    'text-sky-700',
    'text-stone-400',
    'text-teal-700',
    'text-red-800',
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-blue-400',
    'bg-yellow-500',
    'bg-purple-400',
    'bg-orange-500',
    'bg-teal-400',
    'bg-indigo-400',
    'bg-gray-500',
    'bg-emerald-300',
    'bg-fuchsia-400',
    'bg-cyan-400',
    'bg-rose-400',
    'bg-lime-600',
    'bg-green-400',
    'bg-amber-700',
    'bg-violet-500',
    'bg-orange-300',
    'bg-cyan-600',
    'bg-violet-300',
    'bg-emerald-600',
    'bg-sky-700',
    'bg-stone-400',
    'bg-teal-700',
    'bg-red-800',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        header: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        link: colors.blue[500],
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
