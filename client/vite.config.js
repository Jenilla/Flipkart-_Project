import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Only used when running `npm run dev` inside client/ on its own
    // (port 5173). Forwards /api/* to the Express backend so the frontend's
    // relative '/api' baseURL works the same way it does in combined mode.
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
