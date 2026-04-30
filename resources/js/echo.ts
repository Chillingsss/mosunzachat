import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Echo: Echo<any>;
        pusher: any;
    }
}

// Only initialize Echo in browser environment, not during SSR

export const echo = typeof window !== 'undefined' ? new Echo({
    broadcaster: 'pusher' as const,
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'] as ['ws', 'wss'],
    disableStats: false,
    cluster: 'mt1',
    Pusher: Pusher,
    authEndpoint: '/broadcasting/auth',
}) : null;

console.log('Echo initialized:', echo !== null);

// Make Echo available globally for legacy code
if (typeof window !== 'undefined' && echo) {
    window.Echo = echo;
    console.log('Echo made available globally');
}
