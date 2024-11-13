import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const dirSrc = fileURLToPath(new URL('./src', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': dirSrc
        }
    },
    define: {
        'process.env': {
            VITE_APP_BACKEND_API_URL: process.env.VITE_APP_BACKEND_API_URL,
        }
    }
})
