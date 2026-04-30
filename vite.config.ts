import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    define: {
        'import.meta.env.VITE_REVERB_APP_KEY': JSON.stringify(process.env.REVERB_APP_KEY || '7de7a40db3937288493c0bae27b25a5e'),
        'import.meta.env.VITE_REVERB_HOST': JSON.stringify(process.env.REVERB_HOST || 'localhost'),
        'import.meta.env.VITE_REVERB_PORT': JSON.stringify(process.env.REVERB_PORT || '8080'),
        'import.meta.env.VITE_REVERB_SCHEME': JSON.stringify(process.env.REVERB_SCHEME || 'http'),
    },
});
