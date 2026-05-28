import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true
  },
optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'zustand', 'framer-motion', 'recharts', 'react-hot-toast']
}
})
