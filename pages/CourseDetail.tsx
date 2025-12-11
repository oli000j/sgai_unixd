import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseDetails, fetchSyllabusWithMaterials, toggleTopicStatus, updateCourseDetails } from '../services/api';
import { generateTopicSummary } from '../services/ai';
import { Course, TopicWithMaterials, TopicStatus, MaterialType, DifficultyLevel } from '../types';
import { DifficultyBadge, StatusBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  ChevronRight, 
  FileText, 
  PenTool, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  HelpCircle,
  FileCheck,
  Pencil,
  X,
  Save,
  Sparkles,
  Loader2
} from 'lucide-react';

// Subcomponent for AI Summary
const AiSummaryCard: React.FC<{ topic: string; course: string; initialSummary?: string }> = ({ topic, course, initialSummary }) => {
    const [summary, setSummary] = useState<string | null>(initialSummary || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!summary && !loading) {
            const generate = async () => {
                setLoading(true);
                const result = await generateTopicSummary(topic, course);
                setSummary(result);
                setLoading(false);
            };
            generate();
        }
    }, []);

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 flex items-center space-x-3 mb-6 animate-pulse">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span className="text-sm text-indigo-600 font-medium">Generando resumen con IA...</span>
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-white p-4 rounded-lg border border-indigo-100 mb-6 relative overflow-hidden animate-in fade-in slide-in-from-top-2">
             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
             <div className="flex gap-3">
                <div className="mt-0.5 bg-white p-1.5 rounded-full shadow-sm border border-indigo-100 h-fit">
                     <Sparkles className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                    <h5 className="text-xs font-bold text-indigo-800 uppercase tracking-wide mb-1">Resumen Inteligente</h5>
                    <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
                </div>
             </div>
        </div>
    );
};

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [syllabus, setSyllabus] = useState<TopicWithMaterials[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Course>>({});
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      const [courseData, syllabusData] = await Promise.all([
        fetchCourseDetails(id),
        fetchSyllabusWithMaterials(id)
      ]);
      setCourse(courseData || null);
      setSyllabus(syllabusData);
      
      if (courseData) {
        setEditForm({
            name: courseData.name,
            code: courseData.code,
            credits: courseData.credits,
            difficulty_level: courseData.difficulty_level,
            banner_url: courseData.banner_url || ''
        });
      }
      
      // Auto-open the first non-mastered topic
      const nextTopic = syllabusData.find(t => t.userStatus !== TopicStatus.MASTERED);
      if (nextTopic) setOpenTopicId(nextTopic.id);
      
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleToggleStatus = async (topicId: string, currentStatus: TopicStatus) => {
    const newStatus = currentStatus === TopicStatus.MASTERED ? TopicStatus.PENDING : TopicStatus.MASTERED;
    setSyllabus(prev => prev.map(t => 
        t.id === topicId ? { ...t, userStatus: newStatus } : t
    ));
    await toggleTopicStatus(topicId, newStatus);
  };

  const handleSaveEdit = async () => {
    if (!course || !id) return;
    setIsSaving(true);
    
    // Clean up empty strings
    const updates = { ...editForm };
    if (!updates.banner_url) delete updates.banner_url;

    const success = await updateCourseDetails(id, updates);
    
    if (success) {
        setCourse({ ...course, ...updates } as Course);
        setIsEditing(false);
    } else {
        alert("Error al guardar cambios. Verifica tu conexión.");
    }
    setIsSaving(false);
  };

  if (loading || !course) {
    return <div className="p-8 text-center text-slate-400">Cargando contenido del curso...</div>;
  }

  const completedCount = syllabus.filter(t => t.userStatus === TopicStatus.MASTERED).length;
  const progress = Math.round((completedCount / syllabus.length) * 100) || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 relative">
      
      {/* Edit Modal (Only for Admin) */}
      {isEditing && isAdmin && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center">
                        <Pencil className="w-4 h-4 mr-2" /> Editar Curso
                    </h3>
                    <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Curso</label>
                        <input 
                            type="text" 
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                            value={editForm.name || ''}
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Código</label>
                            <input 
                                type="text" 
                                className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm"
                                value={editForm.code || ''}
                                onChange={e => setEditForm({...editForm, code: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Créditos</label>
                            <input 
                                type="number" 
                                className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                                value={editForm.credits || 0}
                                onChange={e => setEditForm({...editForm, credits: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dificultad (1-5)</label>
                        <select 
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                            value={editForm.difficulty_level}
                            onChange={e => setEditForm({...editForm, difficulty_level: parseInt(e.target.value) as DifficultyLevel})}
                        >
                            <option value={1}>1 - Fácil</option>
                            <option value={2}>2 - Medio</option>
                            <option value={3}>3 - Difícil</option>
                            <option value={4}>4 - Muy Difícil</option>
                            <option value={5}>5 - Extremo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL de la Portada (Banner)</label>
                        <input 
                            type="text" 
                            placeholder="https://images.unsplash.com/..."
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none text-xs"
                            value={editForm.banner_url || ''}
                            onChange={e => setEditForm({...editForm, banner_url: e.target.value})}
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Usa Unsplash o similar para imágenes de alta calidad.</p>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-sm text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors flex items-center"
                    >
                        {isSaving ? 'Guardando...' : <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 1. Navigation */}
      <div className="flex items-center space-x-2 text-sm text-slate-500">
        <button onClick={() => navigate('/')} className="hover:text-brand-600 transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver al Dashboard
        </button>
        <span>/</span>
        <span className="font-medium text-slate-900">{course.code}</span>
      </div>

      {/* 2. Banner & Header */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm group relative">
        {/* Banner Image */}
        <div className="h-48 md:h-64 w-full relative bg-slate-100">
            {course.banner_url ? (
                <img 
                    src={course.banner_url} 
                    alt="Course Banner" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-slate-400 opacity-50" />
                </div>
            )}
            
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

            {/* Edit Button (Visible only to Admin) */}
            {isAdmin && (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-slate-600 hover:text-brand-600 hover:bg-white transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                    title="Editar Curso (Admin)"
                >
                    <Pencil className="w-5 h-5" />
                </button>
            )}
        </div>

        {/* Header Info */}
        <div className="p-6 md:p-8 relative">
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{course.name}</h1>
                        <DifficultyBadge level={course.difficulty_level} />
                    </div>
                    <p className="text-slate-500 max-w-2xl">
                        Este curso tiene {course.credits} créditos. Utiliza este espacio para gestionar tus materiales y practicar semanalmente.
                    </p>
                </div>
                <div className="w-full md:w-48 pt-2">
                    <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                        <span>Dominio del curso</span>
                        <span className="text-brand-700">{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} />
                </div>
            </div>
        </div>
      </div>

      {/* 3. Syllabus Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold text-slate-900">Sílabo & Materiales</h2>
            <span className="text-sm text-slate-500">{syllabus.length} Temas</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {syllabus.map((topic) => {
                const isOpen = openTopicId === topic.id;
                const isMastered = topic.userStatus === TopicStatus.MASTERED;

                return (
                    <div key={topic.id} className={`transition-colors ${isOpen ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}>
                        {/* Topic Header */}
                        <div 
                            className="p-4 flex items-center justify-between cursor-pointer group"
                            onClick={() => setOpenTopicId(isOpen ? null : topic.id)}
                        >
                            <div className="flex items-center space-x-4">
                                <button className={`p-1 rounded-md text-slate-400 group-hover:bg-slate-200 transition-colors ${isOpen ? 'rotate-90' : ''}`}>
                                    <ChevronRight className="w-5 h-5 transition-transform" />
                                </button>
                                
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Semana {topic.week_number}</span>
                                        {isMastered && <span className="text-emerald-500"><CheckCircle2 className="w-4 h-4" /></span>}
                                    </div>
                                    <h3 className={`font-medium ${isMastered ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-900'}`}>
                                        {topic.topic_name}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <StatusBadge status={topic.userStatus} />
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {isOpen && (
                            <div className="px-4 pb-6 pt-2 pl-14 animate-in slide-in-from-top-2 duration-200">
                                
                                {/* AI SUMMARY CARD */}
                                <AiSummaryCard topic={topic.topic_name} course={course.name} initialSummary={topic.summary} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    
                                    {/* Left Column: Theory */}
                                    <div className="space-y-3">
                                        <h4 className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 mb-3">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Teoría
                                        </h4>
                                        
                                        <div className="space-y-2">
                                            {topic.materials.filter(m => m.type === MaterialType.THEORY).length === 0 && (
                                                <p className="text-sm text-slate-400 italic">No hay teoría cargada aún.</p>
                                            )}
                                            {topic.materials.filter(m => m.type === MaterialType.THEORY).map(material => (
                                                <a 
                                                    key={material.id} 
                                                    href={material.content_url}
                                                    className="flex items-start p-3 rounded-lg border border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all group"
                                                >
                                                    <div className="bg-slate-100 p-2 rounded mr-3 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800 group-hover:text-brand-700">{material.title}</p>
                                                        <p className="text-xs text-slate-400 flex items-center mt-1">
                                                            PDF <ExternalLink className="w-3 h-3 ml-1" />
                                                        </p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Column: Practice */}
                                    <div className="space-y-3">
                                        <h4 className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 mb-3">
                                            <PenTool className="w-4 h-4 mr-2" />
                                            Práctica
                                        </h4>
                                        
                                        <div className="space-y-2">
                                            {topic.materials.filter(m => m.type !== MaterialType.THEORY).length === 0 && (
                                                <p className="text-sm text-slate-400 italic">No hay ejercicios aún.</p>
                                            )}
                                            {topic.materials.filter(m => m.type !== MaterialType.THEORY).map(material => (
                                                <a 
                                                    key={material.id} 
                                                    href={material.content_url}
                                                    className="flex items-start p-3 rounded-lg border border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm transition-all group"
                                                >
                                                    <div className={`p-2 rounded mr-3 transition-colors ${material.type === MaterialType.EXAM ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500 group-hover:text-amber-600 group-hover:bg-amber-50'}`}>
                                                        {material.type === MaterialType.EXAM ? <FileCheck className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <p className="text-sm font-medium text-slate-800">{material.title}</p>
                                                            {material.difficulty_rating > 3 && (
                                                                <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">DIFÍCIL</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-400 mt-1 capitalize">
                                                            {material.type.toLowerCase()}
                                                        </p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleStatus(topic.id, topic.userStatus);
                                        }}
                                        className={`
                                            flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all
                                            ${isMastered 
                                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl'
                                            }
                                        `}
                                    >
                                        {isMastered ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Tema Dominado
                                            </>
                                        ) : (
                                            <>
                                                <Circle className="w-4 h-4 mr-2" />
                                                Marcar como Dominado
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;