import { baseURL } from "@/config";
import AuthService from "@/services/auth";

export interface ContentBlock {
  id: number;
  lesson: number;
  block_type: "text" | "example" | "interactive";
  content: {
    text?: string;
    title?: string;
    examples?: string[];
    description?: string;
    type?: "quiz";
    question?: string;
    options?: string[];
    correct?: string;
    explanation?: string;
  };
  order: number;
  created_at: string;
}

export interface Lesson {
  id: number;
  title: string;
  slug: string;
  module: string;
  lesson_number: number;
  estimated_time: number;
  is_published: boolean;
  content_blocks: ContentBlock[];
  created_at: string;
  updated_at: string;
}

export interface Problem {
  id: number;
  question_text: string;
  question_type: "single_choice" | "multiple_choice";
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  hints: string[];
  solution_steps: string[];
  created_at: string;
  updated_at: string;
}

export interface PracticeSetProblem {
  id: number;
  practice_set: number;
  problem: number;
  problem_details: Problem;
  order: number;
}

export interface PracticeSet {
  id: number;
  title: string;
  lesson: number;
  module: string | null;
  practice_type: "lesson" | "module";
  difficulty_level: "beginner" | "intermediate" | "advanced";
  is_randomized: boolean;
  is_published: boolean;
  practice_set_problems: PracticeSetProblem[];
  created_at: string;
  updated_at: string;
}

export const lessonService = {
  async getLessons() {
    try {
      const response = await fetch(`${baseURL}/api/lms/lessons/`);
      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }
      return (await response.json()) as Lesson[];
    } catch (error) {
      console.error("Error fetching lessons:", error);
      throw error;
    }
  },

  async getLesson(lessonId: number) {
    try {
      const response = await fetch(`${baseURL}/api/lms/lessons/${lessonId}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch lesson");
      }
      return (await response.json()) as Lesson;
    } catch (error) {
      console.error("Error fetching lesson:", error);
      throw error;
    }
  },

  async getPracticeSets(lessonId: number) {
    try {
      const response = await fetch(
        `${baseURL}/api/lms/practice-sets/?lesson=${lessonId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch practice sets");
      }
      return (await response.json()) as PracticeSet[];
    } catch (error) {
      console.error("Error fetching practice sets:", error);
      throw error;
    }
  },

  async getPracticeSet(practiceSetId: number) {
    try {
      const response = await fetch(
        `${baseURL}/api/lms/practice-sets/${practiceSetId}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch practice set");
      }
      return (await response.json()) as PracticeSet;
    } catch (error) {
      console.error("Error fetching practice set:", error);
      throw error;
    }
  },
};
