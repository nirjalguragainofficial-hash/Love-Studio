import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for Love Studio — uses the official React plugin for JSX transforms and Fast Refresh.
// For all available configuration options, see: https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    host: true, // Allow access from local network
    allowedHosts: true, // Allow external tunnel hosts (Serveo, localtunnel, etc.)
    proxy: {
      '/api': 'http://localhost:3001',
      '/tts': 'http://localhost:8000'
    }
  }
})
