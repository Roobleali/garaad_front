"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  SquareFunction,
  Grid3X3,
  LineChart,
  Pyramid,
  MoveRight,
  Compass,
  ChevronRight,
  TrendingUp,
  Activity
} from "lucide-react";

const subjects = [
  { id: "math", label: "Xisaabta" },
  { id: "cs", label: "Cilmiga Kombiyuutarka" },
  { id: "data", label: "Xogta iyo AI" },
  { id: "science", label: "Mantiqiyadda" },
];

const mathCourses = [
  {
    title: "Xalinta Isla'egyada",
    description: "Xalinta isla'egyada fudud iyo kuwa adag",
    icon: SquareFunction,
  },
  {
    title: "Nidaamyada Isla'egyada",
    description: "Nidaamyada isla'egyada toosan",
    icon: Grid3X3,
  },
  {
    title: "Xisaabta Dhabta ah",
    description: "Aljebra-da adduunka dhabta ah",
    icon: Activity,
  },
  {
    title: "Fahamka Jaantuska",
    description: "Sidee loo akhriyaa jaantusyada",
    icon: LineChart,
  },
  {
    title: "Joomitri I",
    description: "Barashada qaababka iyo fahamka Joomitri",
    icon: Pyramid,
  },
  {
    title: "Vectors",
    description: "Cilmiga Vectors-ka iyo jihada",
    icon: MoveRight,
  },
  {
    title: "Calculus",
    description: "Hordhaca Calculus iyo isbeddelka xisaabta",
    icon: TrendingUp,
  },
];

export function GuidedPathsSection() {
  const [activeTab, setActiveTab] = useState("math");
  const [angle, setAngle] = useState(300);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-20 space-y-6">
          <div>
            <h2 className="text-5xl lg:text-7xl font-black text-foreground tracking-tight">
              Waddooyinka <span className="text-primary">lagugu</span> hagayo.
            </h2>
            <p className="mt-6 text-muted-foreground font-medium text-xl max-w-2xl mx-auto">
              Xulo maadooyinka aad xiiseyneyso oo ku bilow safarkaaga STEM-ka.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div role="tablist" className="flex justify-center mb-20 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex p-2 bg-gray-50 rounded-[2rem] gap-2 border border-gray-100">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                role="tab"
                aria-selected={activeTab === subject.id}
                onClick={() => subject.id === "math" && setActiveTab(subject.id)}
                className={cn(
                  "px-10 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap",
                  subject.id === "math"
                    ? activeTab === subject.id
                      ? "bg-white text-primary shadow-xl shadow-primary/5"
                      : "text-gray-500 hover:text-gray-900"
                    : "text-gray-300 cursor-not-allowed opacity-50"
                )}
              >
                {subject.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Course List */}
            <div className="space-y-4">
              <div className="grid gap-4">
                {mathCourses.map((course, index) => (
                  <div
                    key={course.title}
                    className="flex justify-between items-center p-6 group bg-[#F9FBFF] rounded-[2rem] hover:bg-white hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-primary/10"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 shrink-0 bg-white rounded-[1rem] flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                        <course.icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">
                          {course.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Visualization */}
            <div
              className="relative aspect-square bg-[#F9FBFF] rounded-[4rem] p-16 border border-primary/5 flex flex-col items-center justify-center group shadow-2xl shadow-primary/5"
            >
              <div className="relative w-full h-full flex flex-col items-center max-w-[340px]">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.05" />
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
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="text-primary"
                  />

                  <circle cx="200" cy="200" r="10" fill="currentColor" className="text-primary" />

                  <text
                    x="200"
                    y="200"
                    dy="-30"
                    className="text-5xl font-black fill-primary"
                    textAnchor="middle"
                  >
                    {angle}°
                  </text>
                </svg>

                <div className="mt-12 w-full space-y-6">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full h-2 bg-primary/10 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-primary">
                    <div className="flex items-center gap-2">
                      <Compass size={14} />
                      <span>Xagalada Dibadda</span>
                    </div>
                    <span>360°</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
