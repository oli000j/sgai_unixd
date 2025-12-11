import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, BarChart3, ShieldCheck } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2 font-bold text-xl text-slate-900">
          <GraduationCap className="w-8 h-8 text-brand-600" />
          <span>SGAI-UNI</span>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
          >
            Registrarse
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-6 border border-brand-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Exclusivo para Estudiantes UNI
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          Domina tu Carrera Académica <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Sin Perder el Control</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          Gestiona tus cursos, monitorea tu progreso en tiempo real y accede a materiales de estudio organizados por ciclo. Diseñado para Ingeniería de Sistemas y afines.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            Comenzar Ahora <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-brand-200 hover:bg-brand-50 transition-all flex items-center justify-center"
          >
            Ya tengo cuenta
          </button>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-brand-200 transition-colors">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Malla Curricular 2018</h3>
            <p className="text-slate-500">
              Todos los cursos precargados desde el primer hasta el décimo ciclo, con créditos y prerrequisitos actualizados.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-brand-200 transition-colors">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6 text-amber-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Progreso Visual</h3>
            <p className="text-slate-500">
              Visualiza tu avance por temas y semanas. Identifica qué áreas necesitas reforzar antes de los parciales.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-brand-200 transition-colors">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Acceso por Roles</h3>
            <p className="text-slate-500">
              Los estudiantes visualizan y marcan progreso. Los administradores actualizan contenidos y bibliografía.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} SGAI-UNI. Desarrollado para la F.I.I.S.</p>
      </footer>
    </div>
  );
};

export default Landing;