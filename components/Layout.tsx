import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { fetchProfile } from '../services/api';
import { Profile } from '../types';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth(); 
  const [profile, setProfile] = useState<Profile | null>(null);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Fetch profile whenever location changes (in case we updated settings) or on mount
  useEffect(() => {
    const loadProfile = async () => {
        const data = await fetchProfile();
        setProfile(data);
    };
    loadProfile();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/landing');
    } catch (error) {
      console.error("Error signing out:", error);
      // Force redirect anyway
      navigate('/landing');
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Mis Cursos', icon: BookOpen, path: '/courses' }, 
    { name: 'Configuración', icon: Settings, path: '/settings' }, 
  ];

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex font-sans text-slate-800">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-brand-600 mr-2" />
            <span className="text-xl font-bold tracking-tight text-slate-900">SGAI-UNI</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                  ${isActive 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 mr-3 ${location.pathname === item.path ? 'text-brand-600' : 'text-slate-400'}`} />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User Profile / Footer */}
          <div className="p-4 border-t border-slate-100 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden border border-brand-200 flex-shrink-0">
                {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-brand-700 text-xs font-bold">{profile ? getInitials(profile.full_name) : '...'}</span>
                )}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">
                    {profile?.full_name || 'Cargando...'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                    {profile?.major || 'Estudiante'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 w-full flex items-center px-2 py-1.5 text-xs text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="flex items-center font-bold text-slate-900">
             <GraduationCap className="w-5 h-5 text-brand-600 mr-2" />
             SGAI-UNI
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;