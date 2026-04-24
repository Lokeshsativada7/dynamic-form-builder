import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'fetch("https://your-backend.onrender.com/api/form/submit")',
        changeOrigin: true,
      }
    }
  }
})
