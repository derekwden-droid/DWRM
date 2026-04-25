/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        surface:  '#0d1117',
        panel:    '#111827',
        border:   '#1f2937',
        dim:      '#374151',
        muted:    '#6b7280',
        body:     '#e2e8f0',
        cpu:      '#f59e0b',
        gpu:      '#60a5fa',
        quantum:  '#a78bfa',
        success:  '#4ade80',
        caution:  '#fbbf24',
        danger:   '#f87171',
      },
    },
  },
  plugins: [],
}
