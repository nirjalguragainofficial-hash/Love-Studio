import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for Love Studio — uses the official React plugin for JSX transforms and Fast Refresh.
// See https://vite.dev/config/ for all available options.
export default defineConfig({
  plugins: [react()],
})
