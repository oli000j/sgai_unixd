// Enums mirroring Database Constraints
export enum DifficultyLevel {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
  VERY_HARD = 4,
  EXTREME = 5
}

export enum MaterialType {
  THEORY = 'TEORIA',
  EXERCISE = 'EJERCICIO',
  EXAM = 'EXAMEN'
}

export enum TopicStatus {
  PENDING = 'PENDIENTE',
  IN_PROGRESS = 'EN_PROGRESO',
  MASTERED = 'DOMINADO'
}

// Database Entities

export interface Profile {
  id: string;
  full_name: string;
  major: string; // carrera
  current_cycle: number;
  avatar_url?: string; // URL to profile image
  email?: string; // New field
  role?: 'student' | 'admin'; // New field
}

export interface Course {
  id: string;
  code: string;
  name: string;
  difficulty_level: DifficultyLevel;
  credits: number;
  cycle: number;
  is_enrolled?: boolean;
  banner_url?: string; // New property for cover images
}

export interface SyllabusTopic {
  id: string;
  course_id: string;
  week_number: number;
  topic_name: string;
  is_completed: boolean; // Derived from progress in real app, distinct in this schema
  summary?: string; // AI generated summary
}

export interface StudyMaterial {
  id: string;
  topic_id: string;
  type: MaterialType;
  title: string;
  content_url: string;
  difficulty_rating: number; // 1-5 stars
}

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  status: TopicStatus;
  last_review: string; // ISO Date
}

// Frontend ViewModel (Aggregated Data for easy rendering)
export interface CourseWithProgress extends Course {
  progressPercentage: number;
  totalTopics: number;
  completedTopics: number;
  nextTopic?: string;
}

export interface TopicWithMaterials extends SyllabusTopic {
  materials: StudyMaterial[];
  userStatus: TopicStatus;
}