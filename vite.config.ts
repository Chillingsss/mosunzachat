import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }: { mode: string }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    return defineConfig({
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
        'import.meta.env.VITE_REVERB_APP_KEY': JSON.stringify(env.VITE_REVERB_APP_KEY),
        'import.meta.env.VITE_REVERB_HOST': JSON.stringify(env.VITE_REVERB_HOST),
        'import.meta.env.VITE_REVERB_PORT': JSON.stringify(env.VITE_REVERB_PORT),
        'import.meta.env.VITE_REVERB_SCHEME': JSON.stringify(env.VITE_REVERB_SCHEME),
    },
});
};
