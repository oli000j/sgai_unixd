import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GraduationCap, Loader2, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic UNI email check (Simulation only)
    if (!email.includes('uni.edu.pe') && !email.includes('uni.pe')) {
       // Optional warning
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let msg = error.message;
      // Traducción de errores comunes de Supabase
      if (msg === 'Invalid login credentials') msg = 'Correo o contraseña incorrectos.';
      if (msg.includes('Email not confirmed')) msg = 'El correo no ha sido confirmado. (Configura Supabase para no pedir confirmación).';
      
      setError(msg);
      setLoading(false);
    } else {
      // Auth state change will be caught by AuthContext which redirects
      navigate('/'); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 text-center bg-slate-900 text-white">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 text-brand-400" />
          <h2 className="text-2xl font-bold">Bienvenido de nuevo</h2>
          <p className="text-slate-400 mt-2">Ingresa a tu panel académico</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6 bg-white">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo UNI</label>
            <input 
              type="email"
              required
              placeholder="codigo@uni.pe"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none placeholder:text-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
            <input 
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none placeholder:text-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Ingresar'}
          </button>

          <div className="text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <button type="button" onClick={() => navigate('/register')} className="text-brand-600 font-bold hover:underline">
              Regístrate aquí
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;