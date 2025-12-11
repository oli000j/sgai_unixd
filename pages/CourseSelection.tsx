import React, { useEffect, useState } from 'react';
import { fetchAllCoursesWithEnrollmentStatus, updateEnrollment } from '../services/api';
import { Course } from '../types';
import { DifficultyBadge } from '../components/ui/Badge';
import { Check, BookOpen, AlertCircle } from 'lucide-react';

const MAX_COURSES = 10;

const CourseSelection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllCoursesWithEnrollmentStatus();
      setCourses(data);
      setSelectedCount(data.filter(c => c.is_enrolled).length);
      setLoading(false);
    };
    load();
  }, []);

  const handleToggle = async (course: Course) => {
    const isCurrentlyEnrolled = course.is_enrolled;

    if (!isCurrentlyEnrolled && selectedCount >= MAX_COURSES) {
      alert(`Solo puedes matricularte en un máximo de ${MAX_COURSES} cursos.`);
      return;
    }

    // Optimistic Update
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_enrolled: !isCurrentlyEnrolled } : c));
    setSelectedCount(prev => isCurrentlyEnrolled ? prev - 1 : prev + 1);

    // API Call
    await updateEnrollment(course.id, !isCurrentlyEnrolled);
  };

  // Group by Cycle
  const coursesByCycle = courses.reduce((acc, course) => {
    const cycle = course.cycle || 1;
    if (!acc[cycle]) acc[cycle] = [];
    acc[cycle].push(course);
    return acc;
  }, {} as Record<number, Course[]>);

  if (loading) return <div className="p-8 text-center text-slate-400">Cargando plan de estudios...</div>;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm py-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Selección de Cursos</h1>
            <p className="text-slate-500 text-sm">Organiza tu ciclo. Selecciona los cursos que llevarás.</p>
        </div>
        
        <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-sm transition-colors ${selectedCount >= MAX_COURSES ? 'bg-amber-100 text-amber-800' : 'bg-brand-100 text-brand-800'}`}>
            <BookOpen className="w-4 h-4 mr-2" />
            {selectedCount} / {MAX_COURSES} Cursos
        </div>
      </div>

      {Object.keys(coursesByCycle).map(cycleStr => {
        const cycle = parseInt(cycleStr);
        const cycleCourses = coursesByCycle[cycle];
        
        return (
            <section key={cycle} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-sm text-slate-600 font-mono">
                        {cycle}
                    </span>
                    Ciclo {cycle}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cycleCourses.map(course => {
                        const isSelected = course.is_enrolled;
                        return (
                            <div 
                                key={course.id}
                                onClick={() => handleToggle(course)}
                                className={`
                                    relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ease-in-out group
                                    ${isSelected 
                                        ? 'border-brand-500 bg-brand-50/50' 
                                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${isSelected ? 'bg-brand-100 text-brand-700' : 'bg-white text-slate-500'}`}>
                                        {course.code}
                                    </span>
                                    {isSelected && (
                                        <div className="bg-brand-500 text-white rounded-full p-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                                <h3 className={`font-bold text-sm mb-2 ${isSelected ? 'text-brand-900' : 'text-slate-700'}`}>
                                    {course.name}
                                </h3>
                                <div className="flex items-center justify-between mt-3">
                                    <DifficultyBadge level={course.difficulty_level} />
                                    <span className="text-xs text-slate-400 font-medium">{course.credits} cr.</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
      })}
    </div>
  );
};

export default CourseSelection;