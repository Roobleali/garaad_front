export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  inProgress: boolean;
  courses: Course[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  level: "beginner" | "intermediate" | "advanced";
  progress?: number;
  is_new: boolean;
  category_id: string;
  modules?: Module[];
  author_id: string;
  is_published: boolean;
  module_count: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string;
  content: string;
  type: "video" | "text" | "quiz";
  order: number;
  progress: number;
  problem?: Problem;
  language_options: string[];
}

export interface Problem {
  question: string;
  example: {
    equation: string;
    visual: string;
    visualAlt: string;
    context: string;
  };
  options: string[];
}

// State interfaces
export interface CategoryState {
  items: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
}

export interface CourseState {
  items: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

export interface ModuleState {
  items: Module[];
  currentModule: Module | null;
  loading: boolean;
  error: string | null;
}

export interface LessonState {
  items: Lesson[];
  currentLesson: Lesson | null;
  loading: boolean;
  error: string | null;
}
