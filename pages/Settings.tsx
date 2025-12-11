import React, { useEffect, useState } from 'react';
import { fetchProfile, updateProfile } from '../services/api';
import { Profile } from '../types';
import { User, Save, Loader2, Camera } from 'lucide-react';

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    const load = async () => {
      const data = await fetchProfile();
      if (data) {
        setProfile(data);
        setFormData(data);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: name === 'current_cycle' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Clean data
    const updates = { ...formData };
    if (!updates.avatar_url) delete updates.avatar_url;

    const success = await updateProfile(updates);
    if (success) {
        // Optional: Show toast
        setProfile({ ...profile, ...updates } as Profile);
    } else {
        alert("Error al guardar perfil. Asegúrate de haber ejecutado el script SQL en Supabase.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Cargando perfil...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-500">Administra tu información personal y preferencias.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center">
            <User className="w-5 h-5 text-brand-600 mr-2" />
            <h2 className="font-bold text-slate-800">Perfil del Estudiante</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Avatar Preview & Edit */}
            <div className="flex flex-col items-center sm:flex-row gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                        {formData.avatar_url ? (
                            <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-slate-300" />
                        )}
                    </div>
                </div>
                
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL de Foto de Perfil</label>
                    <div className="relative">
                        <Camera className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            name="avatar_url"
                            placeholder="https://..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm text-slate-700"
                            value={formData.avatar_url || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Pega un enlace directo a una imagen (ej. Unsplash, Imgur).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                    <input 
                        type="text"
                        name="full_name"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 bg-white"
                        value={formData.full_name || ''}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Carrera / Especialidad</label>
                    <input 
                        type="text"
                        name="major"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 bg-white"
                        value={formData.major || ''}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ciclo Actual</label>
                    <select 
                        name="current_cycle"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 bg-white"
                        value={formData.current_cycle}
                        onChange={handleChange}
                    >
                        {[1,2,3,4,5,6,7,8,9,10].map(c => (
                            <option key={c} value={c}>{c}º Ciclo</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center px-6 py-2.5 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-70"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Cambios
                        </>
                    )}
                </button>
            </div>
        </form>
      </div>

    </div>
  );
};

export default Settings;