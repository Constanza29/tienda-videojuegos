import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// "base" debe coincidir EXACTAMENTE con el nombre de tu repositorio en GitHub,
// entre slashes. Si el repo se llama distinto, cambia este valor.
export default defineConfig({
  plugins: [react()],
  base: '/tienda-videojuegos/',
})
