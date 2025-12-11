import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (development/production)
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Polyfill para que `process.env.API_KEY` funcione en el navegador (Requerido por @google/genai)
      // Mapeamos VITE_GEMINI_API_KEY a process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
      // Evitar crash si alguna librería intenta acceder a process.env
      'process.env': {}
    }
  };
});