import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 8px grid spacing system
      spacing: {
        '0': '0',
        '1': '4px',    // 0.5 * 8px
        '2': '8px',    // 1 * 8px
        '3': '12px',   // 1.5 * 8px
        '4': '16px',   // 2 * 8px
        '5': '20px',   // 2.5 * 8px
        '6': '24px',   // 3 * 8px
        '7': '28px',   // 3.5 * 8px
        '8': '32px',   // 4 * 8px
        '10': '40px',  // 5 * 8px
        '12': '48px',  // 6 * 8px
        '16': '64px',  // 8 * 8px
        '20': '80px',  // 10 * 8px
        '24': '96px',  // 12 * 8px
        '32': '128px', // 16 * 8px
      },
      // Typography scale
      fontSize: {
        'xs': ['12px', { lineHeight: '16px', letterSpacing: '0' }],
        'sm': ['14px', { lineHeight: '20px', letterSpacing: '0' }],
        'base': ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        'lg': ['18px', { lineHeight: '28px', letterSpacing: '0' }],
        'xl': ['20px', { lineHeight: '28px', letterSpacing: '0' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.01em' }],
        '4xl': ['36px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        '5xl': ['48px', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '6xl': ['60px', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      // Semantic color system
      colors: {
        // Primary palette
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Accent for interactive states
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
      // Remove rounded corners by default
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '0',
        'md': '0',
        'lg': '0',
        'xl': '0',
        '2xl': '0',
        '3xl': '0',
        'full': '9999px',
      },
      // Focus ring configuration
      ringWidth: {
        'DEFAULT': '3px',
        '0': '0',
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      // Container widths
      maxWidth: {
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1536px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
