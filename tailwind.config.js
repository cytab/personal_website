/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-muted': 'var(--ink-muted)',
        primary: 'var(--primary)',
        accent: 'var(--accent)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      screens: {
        mobile: '375px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1440px',
        large: '1920px',
      },
    },
  },
  plugins: [],
};
