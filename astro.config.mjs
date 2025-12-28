// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
// import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    // Server-side rendering is required for dynamic routes like /manga/[id]
    output: 'server',

    // Cloudflare adapter for Edge-like performance
    // Cloudflare adapter for Edge-like performance (production only)
    // adapter: process.env.NODE_ENV === 'development' ? undefined : cloudflare({
    //     imageService: 'cloudflare',
    // }),

    integrations: [
        react(),
        tailwind({
            // Disable base styles if we want to keep using globals.css manually, 
            // but usually safe to keep allowed.
            applyBaseStyles: false,
            configFile: './tailwind.config.mjs'
        }),
    ],

    // Security & Image Optimization
    image: {
        service: {
            entrypoint: 'astro/assets/services/noop', // Use Cloudflare's image service defined in adapter above, or 'sharp' locally
        }
    },

    // Vite config to ensure compatibility with existing React code
    vite: {
        ssr: {
            // Handle packages that might cause SSR issues
            noExternal: ['lucide-react'],
        },
        resolve: {
            alias: {
                '@': '/src',
            },
        },
    },
});
