import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#000000',
          200: '#1E1E1E',
          300: '#101010',
          400: '#181818',
          500: '#333638'
        },
        light: {
          100: '#FFFFFF',
          200: '#F3F5F7',
          300: '#EFEFEF',
          400: '#777777'
        },
        glassmorphism: 'rgba(16, 16, 18, 0.60)',
        'accent-blue': '#0095F6',
        'accent-gray': '#465A7E'
      },
      fontFamily: {
        inter: ['var(--font-inter)']
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0 ' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  variants: {
    fill: ['hover', 'focus']
  },
  plugins: [require('tailwindcss-animate')]
}
export default config
