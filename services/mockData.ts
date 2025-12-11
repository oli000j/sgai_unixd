import { 
  Profile, 
  Course, 
  SyllabusTopic, 
  StudyMaterial, 
  UserProgress, 
  DifficultyLevel, 
  MaterialType, 
  TopicStatus 
} from '../types';

export const MOCK_PROFILE: Profile = {
  id: 'user-uuid-123',
  full_name: 'Alejandro Ingeniero',
  major: 'Ingeniería Mecatrónica',
  current_cycle: 5,
  avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop'
};

export const MOCK_COURSES: Course[] = [
  { 
    id: 'c1', 
    code: 'BMA02', 
    name: 'Cálculo Diferencial', 
    difficulty_level: DifficultyLevel.HARD, 
    credits: 5, 
    cycle: 2,
    banner_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: 'c2', 
    code: 'BFI01', 
    name: 'Física I', 
    difficulty_level: DifficultyLevel.VERY_HARD, 
    credits: 4, 
    cycle: 2,
    banner_url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    id: 'c3', 
    code: 'BIC01', 
    name: 'Introducción a la Programación', 
    difficulty_level: DifficultyLevel.MEDIUM, 
    credits: 3, 
    cycle: 1,
    banner_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: 'c4', 
    code: 'BEG01', 
    name: 'Estática', 
    difficulty_level: DifficultyLevel.HARD, 
    credits: 4, 
    cycle: 3,
    banner_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
  },
];

export const MOCK_TOPICS: SyllabusTopic[] = [
  // Cálculo Topics
  { id: 't1', course_id: 'c1', week_number: 1, topic_name: 'Números Reales y Desigualdades', is_completed: true },
  { id: 't2', course_id: 'c1', week_number: 2, topic_name: 'Funciones y Gráficas', is_completed: true },
  { id: 't3', course_id: 'c1', week_number: 3, topic_name: 'Límites y Continuidad', is_completed: true },
  { id: 't4', course_id: 'c1', week_number: 4, topic_name: 'Derivadas: Definición y Reglas', is_completed: true },
  { id: 't5', course_id: 'c1', week_number: 5, topic_name: 'Aplicaciones de la Derivada', is_completed: false },
  { id: 't6', course_id: 'c1', week_number: 6, topic_name: 'Optimización', is_completed: false },

  // Física Topics
  { id: 't7', course_id: 'c2', week_number: 1, topic_name: 'Vectores y Sistemas de Unidades', is_completed: true },
  { id: 't8', course_id: 'c2', week_number: 2, topic_name: 'Cinemática en 1D y 2D', is_completed: true },
  { id: 't9', course_id: 'c2', week_number: 3, topic_name: 'Leyes de Newton', is_completed: false },
  
  // Programación
  { id: 't10', course_id: 'c3', week_number: 1, topic_name: 'Variables y Tipos de Datos', is_completed: true },
  { id: 't11', course_id: 'c3', week_number: 2, topic_name: 'Estructuras de Control (If/Else)', is_completed: true },
];

export const MOCK_MATERIALS: StudyMaterial[] = [
  // Calculo - Derivadas
  { id: 'm1', topic_id: 't4', type: MaterialType.THEORY, title: 'PDF: Reglas de Derivación (Larson)', content_url: '#', difficulty_rating: 2 },
  { id: 'm2', topic_id: 't4', type: MaterialType.EXERCISE, title: 'Hoja de Práctica: Regla de la Cadena', content_url: '#', difficulty_rating: 4 },
  { id: 'm3', topic_id: 't4', type: MaterialType.EXAM, title: 'Parcial 2022-1 (Pregunta 3)', content_url: '#', difficulty_rating: 5 },
  
  // Calculo - Aplicaciones
  { id: 'm4', topic_id: 't5', type: MaterialType.THEORY, title: 'Diapositivas: Razones de Cambio Relacionadas', content_url: '#', difficulty_rating: 3 },
  { id: 'm5', topic_id: 't5', type: MaterialType.EXERCISE, title: 'Problemas propuestos Espinoza Ramos', content_url: '#', difficulty_rating: 4 },
];

export const MOCK_PROGRESS: UserProgress[] = [
  { id: 'up1', user_id: 'user-uuid-123', topic_id: 't1', status: TopicStatus.MASTERED, last_review: '2023-09-01' },
  { id: 'up2', user_id: 'user-uuid-123', topic_id: 't2', status: TopicStatus.MASTERED, last_review: '2023-09-08' },
  { id: 'up3', user_id: 'user-uuid-123', topic_id: 't3', status: TopicStatus.MASTERED, last_review: '2023-09-15' },
  { id: 'up4', user_id: 'user-uuid-123', topic_id: 't4', status: TopicStatus.MASTERED, last_review: '2023-09-22' },
  { id: 'up5', user_id: 'user-uuid-123', topic_id: 't5', status: TopicStatus.IN_PROGRESS, last_review: '2023-09-29' },
  { id: 'up6', user_id: 'user-uuid-123', topic_id: 't7', status: TopicStatus.MASTERED, last_review: '2023-09-01' },
  { id: 'up7', user_id: 'user-uuid-123', topic_id: 't8', status: TopicStatus.MASTERED, last_review: '2023-09-10' },
  { id: 'up8', user_id: 'user-uuid-123', topic_id: 't9', status: TopicStatus.PENDING, last_review: '2023-09-10' },
];