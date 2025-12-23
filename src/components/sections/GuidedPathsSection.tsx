"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const subjects = [
  { id: "math", label: "Xisaabta" },
  { id: "cs", label: "Computer Science" },
  { id: "data", label: "Data Science and AI" },
  { id: "science", label: "Logic and Thinking" },
];

const mathCourses = [
  {
    title: "Xalinta Isla'egyada",
    description: "Solving Equations",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Nidaamyada Isla'egyada",
    description: "Systems of Equations",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Xisaabta Dhabta ah",
    description: "Real World Algebra",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.97 4.06L14.09 9l1.06 1.06l-2.83 2.83l2.83 2.83l-1.06 1.06L11.25 14l-2.83 2.83l-1.06-1.06l2.83-2.83l-2.83-2.83l1.06-1.06L11.25 12l2.78-2.94z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Fahamka Jaantuska",
    description: "Understanding Graphs",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M3.5 18.49l6-6.01l4 4L22 6.92l-1.41-1.41l-7.09 7.97l-4-4L2 16.99z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Joomitri I",
    description: "Geometry I",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Vectors",
    description: "Vectors",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M12 2L3 9l3 3L3 15l9 7 9-7-3-3 3-3-9-7zm0 4.6L15.89 9 12 12.1 8.11 9 12 6.6z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Calculus",
    description: "Calculus",
    icon: (
      <svg viewBox="0 0 24 24" className="w-full h-full text-primary">
        <path
          d="M4 19h16v2H4zm16-6H4v2h16zm0-6H4v2h16zm0-6H4v2h16z M7 17h2v-3H7zm4 0h2V7h-2zm4 0h2v-5h-2z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export function GuidedPathsSection() {
  const [activeTab, setActiveTab] = useState("math");
  const [angle, setAngle] = useState(300);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-foreground">
            Waddooyinka lagugu hagayo
          </h2>
          <p className="mt-4 text-muted-foreground font-medium text-lg">Xulo maadooyinka aad xiiseyneyso</p>
        </div>

        {/* Tab Navigation */}
        <div role="tablist" className="flex justify-center mb-16 overflow-x-auto pb-4">
          <div className="flex p-2 bg-gray-50 rounded-2xl gap-2">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                role="tab"
                aria-selected={activeTab === subject.id}
                onClick={() => subject.id === "math" && setActiveTab(subject.id)}
                className={cn(
                  "px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap",
                  subject.id === "math"
                    ? activeTab === subject.id
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                    : "text-gray-400 cursor-not-allowed opacity-60"
                )}
              >
                {subject.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Course List */}
            <div className="space-y-4">
              <div className="grid gap-3">
                {mathCourses.map((course) => (
                  <div
                    key={course.title}
                    className="flex items-center gap-4 p-5 group bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer border border-transparent hover:border-primary/10"
                  >
                    <div className="w-10 h-10 shrink-0 text-primary">
                      {course.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {course.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Visualization */}
            <div className="relative aspect-square bg-gray-50/50 rounded-[2.5rem] p-12 border border-primary/5">
              <div className="relative h-full flex flex-col items-center">
                <svg className="w-full h-full max-w-[320px]" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  <circle
                    cx="200"
                    cy="200"
                    r="150"
                    fill="url(#circGrad)"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-primary/20"
                  />

                  {/* Angle Line */}
                  <line
                    x1="200"
                    y1="200"
                    x2={200 + 150 * Math.cos((angle * Math.PI) / 180)}
                    y2={200 + 150 * Math.sin((angle * Math.PI) / 180)}
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="text-primary"
                  />

                  <circle cx="200" cy="200" r="6" fill="currentColor" className="text-primary" />

                  <text
                    x="200"
                    y="200"
                    dy="-20"
                    className="text-3xl font-black fill-primary"
                    textAnchor="middle"
                  >
                    {angle}°
                  </text>
                </svg>

                <div className="mt-8 w-full max-w-xs space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full h-1.5 bg-primary/10 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Xagalada Dibadda
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
