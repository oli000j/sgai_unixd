import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  MOCK_COURSES, 
  MOCK_TOPICS, 
  MOCK_PROGRESS, 
  MOCK_PROFILE, 
  MOCK_MATERIALS 
} from './mockData';
import { 
  CourseWithProgress, 
  TopicWithMaterials, 
  TopicStatus,
  Profile,
  Course
} from '../types';

// Helper to get current user ID
const getCurrentUserId = async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    // Fallback to Demo ID only if no auth user is found (for backward compatibility with the SQL script demo user)
    return user?.id || '00000000-0000-0000-0000-000000000001';
};

export const fetchProfile = async (userId?: string): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return MOCK_PROFILE;

  const uid = userId || await getCurrentUserId();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    // Return null instead of mock if we expect a real user but they don't have a profile yet
    return null; 
  }
  return data;
};

export const createProfile = async (profile: Profile): Promise<boolean> => {
    const { error } = await supabase
        .from('profiles')
        .insert(profile);
    
    if (error) {
        console.error("Error creating profile:", error);
        return false;
    }
    return true;
};

export const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
        Object.assign(MOCK_PROFILE, updates);
        return true;
    }

    const uid = await getCurrentUserId();

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', uid);

    if (error) {
        console.error('Error updating profile:', error);
        return false;
    }
    return true;
};

// Fetch ALL courses to display in the Selection Screen, marking which ones are active
export const fetchAllCoursesWithEnrollmentStatus = async (): Promise<Course[]> => {
  if (!isSupabaseConfigured()) return MOCK_COURSES;

  const uid = await getCurrentUserId();

  // 1. Get All Courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .order('cycle', { ascending: true })
    .order('code', { ascending: true });

  if (coursesError || !courses) return [];

  // 2. Get User Enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', uid)
    .eq('is_active', true);

  const enrolledIds = new Set(enrollments?.map((e: any) => e.course_id));

  // 3. Merge
  return courses.map((c: Course) => ({
    ...c,
    is_enrolled: enrolledIds.has(c.id)
  }));
};

export const updateEnrollment = async (courseId: string, isActive: boolean) => {
  if (!isSupabaseConfigured()) return true;
  
  const uid = await getCurrentUserId();

  if (isActive) {
    // Upsert to true
    const { error } = await supabase
      .from('enrollments')
      .upsert({ 
        user_id: uid, 
        course_id: courseId, 
        is_active: true 
      });
    return !error;
  } else {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', uid)
      .eq('course_id', courseId);
    return !error;
  }
};

export const fetchCoursesWithProgress = async (): Promise<CourseWithProgress[]> => {
  if (!isSupabaseConfigured()) {
    // MOCK Fallback (unchanged)
    return MOCK_COURSES.map(course => {
        const topics = MOCK_TOPICS.filter(t => t.course_id === course.id);
        const totalTopics = topics.length;
        const completedTopics = topics.filter(t => {
          const progress = MOCK_PROGRESS.find(p => p.topic_id === t.id);
          return progress?.status === TopicStatus.MASTERED;
        }).length;
        const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
        return {
          ...course,
          totalTopics,
          completedTopics,
          progressPercentage,
        };
      });
  }

  const uid = await getCurrentUserId();
  
  // 1. Fetch Enrollments first (Filter!)
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', uid)
    .eq('is_active', true);
  
  const enrolledCourseIds = enrollments?.map((e:any) => e.course_id) || [];

  if (enrolledCourseIds.length === 0) return [];

  // 2. Fetch only enrolled courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .in('id', enrolledCourseIds)
    .order('cycle', { ascending: true })
    .order('code', { ascending: true });

  if (coursesError || !courses) {
    console.error("Error fetching courses:", coursesError);
    return [];
  }

  // 3. Fetch all topics for these courses
  const { data: allTopics } = await supabase
    .from('syllabus_topics')
    .select('id, course_id, topic_name, week_number')
    .in('course_id', enrolledCourseIds);

  // 4. Fetch user progress
  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('topic_id, status')
    .eq('user_id', uid);

  // 5. Aggregate
  const result: CourseWithProgress[] = courses.map((course: Course) => {
    const courseTopics = allTopics?.filter((t: any) => t.course_id === course.id) || [];
    const totalTopics = courseTopics.length;
    
    let completedTopics = 0;
    let firstPendingTopicName = undefined;

    courseTopics.sort((a: any, b: any) => a.week_number - b.week_number);

    for (const topic of courseTopics) {
      const p = userProgress?.find((up: any) => up.topic_id === topic.id);
      const isMastered = p?.status === TopicStatus.MASTERED;
      
      if (isMastered) {
        completedTopics++;
      } else if (!firstPendingTopicName) {
        firstPendingTopicName = topic.topic_name;
      }
    }

    const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

    return {
      ...course,
      totalTopics,
      completedTopics,
      progressPercentage,
      nextTopic: firstPendingTopicName
    };
  });

  return result;
};

export const fetchCourseDetails = async (courseId: string) => {
  if (!isSupabaseConfigured()) return MOCK_COURSES.find(c => c.id === courseId);

  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();
    
  if (error) return null;
  return data;
};

export const updateCourseDetails = async (courseId: string, updates: Partial<Course>) => {
  if (!isSupabaseConfigured()) {
    // Mock Update Logic
    const index = MOCK_COURSES.findIndex(c => c.id === courseId);
    if (index !== -1) {
      MOCK_COURSES[index] = { ...MOCK_COURSES[index], ...updates };
      return true;
    }
    return false;
  }

  const { error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId);

  if (error) {
    console.error('Error updating course:', error);
    return false;
  }
  return true;
};

export const fetchSyllabusWithMaterials = async (courseId: string): Promise<TopicWithMaterials[]> => {
  if (!isSupabaseConfigured()) {
    // MOCK Fallback
     const topics = MOCK_TOPICS.filter(t => t.course_id === courseId);
     return topics.map(t => ({ ...t, materials: [], userStatus: TopicStatus.PENDING }));
  }

  const uid = await getCurrentUserId();

  // Real Supabase Logic
  const { data: topics, error: topicsError } = await supabase
    .from('syllabus_topics')
    .select('*')
    .eq('course_id', courseId)
    .order('week_number', { ascending: true });

  if (topicsError || !topics) return [];

  const topicIds = topics.map((t: any) => t.id);
  
  let materials: any[] = [];
  let progress: any[] = [];
  
  if (topicIds.length > 0) {
      const materialsResponse = await supabase
        .from('study_materials')
        .select('*')
        .in('topic_id', topicIds);
      materials = materialsResponse.data || [];

      const progressResponse = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', uid)
        .in('topic_id', topicIds);
      progress = progressResponse.data || [];
  }

  return topics.map((topic: any) => {
    const topicMaterials = materials.filter((m: any) => m.topic_id === topic.id);
    const userP = progress.find((p: any) => p.topic_id === topic.id);
    
    return {
      ...topic,
      materials: topicMaterials,
      userStatus: userP?.status || TopicStatus.PENDING,
      is_completed: userP?.status === TopicStatus.MASTERED 
    };
  });
};

export const toggleTopicStatus = async (topicId: string, newStatus: TopicStatus) => {
  if (!isSupabaseConfigured()) return true;

  const uid = await getCurrentUserId();

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: uid,
      topic_id: topicId,
      status: newStatus,
      last_review: new Date().toISOString()
    }, { onConflict: 'user_id, topic_id' });

  return !error;
};