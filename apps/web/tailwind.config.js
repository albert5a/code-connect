export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // Cores Primárias
                primary: {
                    DEFAULT: '#10b981',  // emerald-500
                    light: '#6ee7b7',    // emerald-300
                    lighter: '#d1fae5',  // emerald-100
                    dark: '#059669',     // emerald-600
                },
                // Cores Neutras (backgrounds e textos)
                neutral: {
                    bg: '#0f172a',       // slate-950
                    'bg-alt': '#1e293b', // slate-900
                    'bg-light': '#334155', // slate-700
                    text: '#f1f5f9',     // slate-100
                    'text-muted': '#cbd5e1', // slate-300
                    'text-subtle': '#64748b', // slate-500
                    border: '#475569',   // slate-600
                },
                // Cores Secundárias
                surface: {
                    DEFAULT: 'rgba(15, 23, 42, 0.9)', // slate-950 com transparência
                    glass: 'rgba(30, 41, 59, 0.95)',   // slate-900 com transparência
                },
                // Cores de Estado
                error: {
                    DEFAULT: '#ef4444', // red-500
                    light: '#fca5a5',   // red-300
                },
                success: {
                    DEFAULT: '#10b981', // green-500 (mesmo de primary)
                    light: '#6ee7b7',   // green-300
                },
                warning: {
                    DEFAULT: '#f59e0b', // amber-500
                    light: '#fbbf24',   // amber-400
                },
                // Overlay e Dividers
                overlay: {
                    DEFAULT: 'rgba(0, 0, 0, 0.5)',
                    subtle: 'rgba(255, 255, 255, 0.05)',
                    light: 'rgba(255, 255, 255, 0.05)',
                    lighter: 'rgba(255, 255, 255, 0.1)',
                },
            },
            fontSize: {
                // Usando tokens padrão do Tailwind
                xs: ['0.75rem', { lineHeight: '1rem' }],
                sm: ['0.875rem', { lineHeight: '1.25rem' }],
                base: ['1rem', { lineHeight: '1.5rem' }],
                lg: ['1.125rem', { lineHeight: '1.75rem' }],
                xl: ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            },
        },
    },
    plugins: [],
}
