import { createClient } from '@supabase/supabase-js';

// Helper seguro para leer variables de entorno en Vite
const getEnvVar = (key: string, defaultValue: string) => {
  try {
    // Verificamos si import.meta.env existe
    if (import.meta && (import.meta as any).env) {
      return (import.meta as any).env[key] || defaultValue;
    }
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// En Vite, las variables de entorno deben empezar con VITE_
const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL', 'https://dcnapmmhabygebcvudfr.supabase.co');
const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY', 'sb_publishable_OcpXB3TdWiGea8hfIMmqPg_12SR2YZ0');

// Verificación para saber si estamos conectados.
export const isSupabaseConfigured = () => {
  return SUPABASE_URL.includes('supabase.co') && SUPABASE_ANON_KEY.length > 0 && SUPABASE_ANON_KEY !== 'placeholder';
};

// Crear cliente solo si existen credenciales, de lo contrario un cliente "dummy" para evitar crashes inmediatos
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co', 
  SUPABASE_ANON_KEY || 'placeholder'
);