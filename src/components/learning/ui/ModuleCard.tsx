import {
  HelpCircle,
  Code2,
  Boxes,
  PuzzleIcon as PuzzlePiece,
  CheckCircle,
  Lock,
  BookOpen,
} from "lucide-react";

interface ModuleCardProps {
  title: string;
  icon: "question" | "formula" | "blocks" | "puzzle";
  progress: number;
  isCompleted: boolean;
  isLocked?: boolean;
  description?: string;
  lessons?: number;
}

export function ModuleCard({
  title,
  icon,
  progress,
  isCompleted,
  isLocked = false,
  description,
  lessons = 0,
}: ModuleCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "question":
        return <HelpCircle className="h-8 w-8 text-white" />;
      case "formula":
        return <Code2 className="h-8 w-8 text-white" />;
      case "blocks":
        return <Boxes className="h-8 w-8 text-white" />;
      case "puzzle":
        return <PuzzlePiece className="h-8 w-8 text-white" />;
    }
  };

  return (
    <div
      className={`
        relative w-48 h-48 rounded-lg shadow-lg transform transition-transform hover:scale-105
        ${isLocked ? "opacity-60" : ""}
      `}
    >
      {/* 3D effect bottom layers */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gray-700 rounded-b-lg transform translate-y-2 z-0"></div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-800 rounded-b-lg transform translate-y-1 z-0"></div>

      {/* Main card */}
      <div
        className={`
        relative h-full w-full rounded-lg p-4 flex flex-col items-center justify-center z-10
        ${isCompleted ? "bg-blue-600" : "bg-gray-500"}
      `}
      >
        {/* Icon container */}
        <div className="mb-3 p-3 rounded-full bg-opacity-20 bg-white">
          {getIcon()}
        </div>

        <h3 className="text-white font-medium text-center mb-1">{title}</h3>

        {description && (
          <p className="text-white text-opacity-80 text-xs text-center mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {lessons > 0 && (
          <div className="flex items-center text-xs text-white text-opacity-70 mt-1">
            <BookOpen className="h-3 w-3 mr-1" />
            {lessons} {lessons === 1 ? "Lesson" : "Lessons"}
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-400 h-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Status indicators */}
        {isCompleted && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="h-5 w-5 text-green-300" />
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
            <Lock className="h-10 w-10 text-white opacity-80" />
          </div>
        )}
      </div>
    </div>
  );
}
