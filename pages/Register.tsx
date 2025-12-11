import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createProfile } from '../services/api';
import { GraduationCap, Loader2, AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    major: 'Ingeniería de Sistemas',
    currentCycle: 1,
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Validation
    if (!formData.email.includes('@')) { 
       setError('Ingresa un correo válido.');
       setLoading(false);
       return;
    }

    // 2. Supabase Auth SignUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 3. Create Profile in 'profiles' table
      const success = await createProfile({
        id: authData.user.id,
        full_name: formData.fullName,
        major: formData.major,
        current_cycle: Number(formData.currentCycle),
        email: formData.email,
        role: 'student', // Default role
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random`
      });

      if (!success) {
        setError("La cuenta se creó, pero hubo un error al crear el perfil. Contacta soporte.");
        setLoading(false);
      } else {
        // Success Check: If session is null, Supabase requires email confirmation
        if (!authData.session) {
            setError("Cuenta creada, PERO Supabase pide confirmar correo. Ve a Authentication > Providers > Email y desactiva 'Confirm email'.");
            setLoading(false);
        } else {
            navigate('/'); 
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 text-center bg-white border-b border-slate-100">
          <GraduationCap className="w-10 h-10 mx-auto mb-2 text-brand-600" />
          <h2 className="text-xl font-bold text-slate-900">Registro de Estudiante</h2>
          <p className="text-slate-500 text-sm">Crea tu cuenta institucional</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 space-y-4 bg-white">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
            <input 
              type="text"
              name="fullName"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Carrera</label>
            <select 
              name="major"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.major}
              onChange={handleChange}
            >
              <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
              <option value="Ingeniería Industrial">Ingeniería Industrial</option>
              <option value="Ingeniería de Software">Ingeniería de Software</option>
            </select>
          </div>

           <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ciclo Actual</label>
            <select 
              name="currentCycle"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.currentCycle}
              onChange={handleChange}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(c => <option key={c} value={c}>{c}º Ciclo</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo UNI</label>
            <input 
              type="email"
              name="email"
              required
              placeholder="@uni.pe"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña</label>
            <input 
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.password}
              onChange={handleChange}
            />
             <p className="text-[10px] text-slate-400 mt-1">Mínimo 6 caracteres.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center mt-6"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Registrarse e Ingresar'}
          </button>

          <div className="text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <button type="button" onClick={() => navigate('/login')} className="text-brand-600 font-bold hover:underline">
              Inicia Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;