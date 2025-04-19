// src/mocks/learningMockData.ts
import type { Category } from "@/types/lms";

export const mockCategories: Category[] = [
  {
    id: "1",
    title: "Web Development",
    description: "Learn to build modern, responsive websites and applications.",
    image: "./images/programming-icon.svg",
    inProgress: true,
    courses: [
      {
        id: 2,
        title: "Introduction to HTML & CSS",
        slug: "intro-to-html-css",
        thumbnail: "./images/courses/cs.svg",
        isNew: true,
        description: "",
        progress: 10,
        level: "beginner",
        category_id: "",
        modules: [],
      },
      {
        id: 3,
        title: "JavaScript Essentials",
        slug: "javascript-essentials",
        thumbnail: "./images/courses/ai.svg",
        isNew: false,
        description: "",
        level: "beginner",
        progress: 0,
        category_id: "",
        modules: [],
      },
    ],
  },
  {
    id: "4",
    title: "Data Science",
    description: "Master data analysis, visualization, and machine learning.",
    image: "./images/math-icon.svg",

    courses: [
      {
        id: 7,
        title: "Python for Data Analysis",
        slug: "python-data-analysis",
        thumbnail: "./images/courses/python.svg",
        isNew: false,
        description: "",
        level: "beginner",
        progress: 0,
        category_id: "",
        modules: [],
      },
      {
        id: 6,
        title: "Introduction to Machine Learning",
        slug: "intro-to-ml",
        thumbnail: "./images/courses/ai.svg",
        isNew: true,
        description: "",
        level: "beginner",
        progress: 0,
        category_id: "",
        modules: [],
      },
    ],
    inProgress: false,
  },
];
