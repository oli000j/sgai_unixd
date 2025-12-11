import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCoursesWithProgress, fetchProfile } from '../services/api';
import { CourseWithProgress, Profile } from '../types';
import { ProgressBar } from '../components/ui/ProgressBar';
import { DifficultyBadge } from '../components/ui/Badge';
import { ArrowRight, BookOpen, Clock, Zap, PlusCircle, Image as ImageIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [coursesData, profileData] = await Promise.all([
        fetchCoursesWithProgress(),
        fetchProfile()
      ]);
      setCourses(coursesData);
      setProfile(profileData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-slate-400 animate-pulse">Cargando tu centro de control...</div>;
  }

  // Determine "Up Next" - simple logic: first course with < 100% progress
  const activeCourse = courses.find(c => c.progressPercentage < 100) || courses[0];
  const currentWeek = 5; 

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Greeting Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Hola, {profile?.full_name.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-1">
            Estás en la <span className="font-semibold text-brand-600">semana {currentWeek}</span> del ciclo. ¡Mantén el enfoque!
          </p>
        </div>
        <div className="flex items-center space-x-4">
            <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="block text-2xl font-bold text-slate-900">{profile?.current_cycle}º</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Ciclo</span>
            </div>
            <div className="text-center px-4 py-2 bg-brand-50 rounded-lg border border-brand-100">
                <span className="block text-2xl font-bold text-brand-700">{courses.length}</span>
                <span className="text-xs text-brand-600 uppercase tracking-wide">Cursos</span>
            </div>
        </div>
      </section>

      {/* Empty State */}
      {courses.length === 0 && (
        <section className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
          <div className="inline-flex p-4 rounded-full bg-slate-100 mb-4">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No tienes cursos activos</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Parece que aún no te has matriculado en ningún curso para este ciclo.</p>
          <button 
            onClick={() => navigate('/courses')}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Seleccionar Cursos
          </button>
        </section>
      )}

      {/* 2. Up Next Suggestion */}
      {courses.length > 0 && activeCourse && (
        <section>
          <div className="flex items-center mb-4">
            <Zap className="w-5 h-5 text-amber-500 mr-2" />
            <h2 className="text-lg font-semibold text-slate-900">Lo que sigue</h2>
          </div>
          <div 
            onClick={() => navigate(`/course/${activeCourse.id}`)}
            className="group cursor-pointer bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden transition-transform hover:-translate-y-1"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <BookOpen className="w-32 h-32 transform rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-2 text-slate-300 text-sm mb-2">
                        <span>{activeCourse.code}</span>
                        <span>•</span>
                        <span>{activeCourse.credits} créditos</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{activeCourse.name}</h3>
                    <p className="text-slate-300 flex items-center">
                        <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Próximo tema: <span className="font-semibold text-white ml-1">{activeCourse.nextTopic || 'Repaso General'}</span>
                    </p>
                </div>
                <div className="md:w-1/3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progreso General</span>
                        <span>{activeCourse.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                            className="bg-brand-400 h-2 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]" 
                            style={{ width: `${activeCourse.progressPercentage}%` }} 
                        />
                    </div>
                </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Status Summary Grid */}
      {courses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <Clock className="w-5 h-5 text-slate-400 mr-2" />
                Estado Actual
            </h2>
            <button onClick={() => navigate('/courses')} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              Gestionar Cursos
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                  <div 
                      key={course.id}
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-200 transition-all cursor-pointer flex flex-col h-full overflow-hidden"
                  >
                      {/* Card Banner Image */}
                      <div className="h-24 w-full relative bg-slate-100 overflow-hidden">
                        {course.banner_url ? (
                          <img 
                            src={course.banner_url} 
                            alt={course.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                             <ImageIcon className="text-slate-300 w-8 h-8" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                           <DifficultyBadge level={course.difficulty_level} />
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                              <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                {course.code}
                              </span>
                          </div>
                          
                          <h3 className="font-bold text-slate-900 mb-1 flex-1 text-lg leading-tight">{course.name}</h3>
                          
                          <div className="mt-4">
                              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                                  <span>{course.completedTopics} / {course.totalTopics} temas</span>
                                  <span className="font-medium text-slate-700">{course.progressPercentage}%</span>
                              </div>
                              <ProgressBar progress={course.progressPercentage} />
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;