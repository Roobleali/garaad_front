import {
  HelpCircle,
  Code2,
  Boxes,
  PuzzleIcon as PuzzlePiece,
  CheckCircle,
  Lock,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModuleBlockProps {
  title: string;
  icon: "question" | "formula" | "blocks" | "puzzle";
  progress: number;
  isCompleted: boolean;
  isLocked?: boolean;
  description?: string;
  lessons?: number;
  position: "left" | "center" | "right";
  prerequisites?: number;
  onClick?: () => void;
}

export function ModuleBlock({
  title,
  icon,
  progress,
  isCompleted,
  isLocked = false,
  description,
  lessons = 0,
  position,
  prerequisites = 0,
  onClick,
}: ModuleBlockProps) {
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

  const getPositionClasses = () => {
    switch (position) {
      case "left":
        return "transform rotate-1";
      case "center":
        return "";
      case "right":
        return "transform -rotate-1";
    }
  };

  return (
    <div
      className={cn(
        "relative w-56 h-56 transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer",
        getPositionClasses(),
        isLocked ? "opacity-70" : ""
      )}
      onClick={onClick}
    >
      {/* 3D effect layers */}
      <div className="absolute inset-0 bg-gray-800 rounded-xl transform translate-y-4 rotate-3 z-0 opacity-20"></div>
      <div className="absolute inset-0 bg-gray-700 rounded-xl transform translate-y-2 -rotate-1 z-0 opacity-30"></div>

      {/* Main block */}
      <div
        className={cn(
          "relative h-full w-full rounded-xl p-5 flex flex-col items-center justify-center z-10 shadow-xl",
          isCompleted
            ? "bg-gradient-to-br from-blue-500 to-blue-700"
            : progress > 0
            ? "bg-gradient-to-br from-amber-500 to-amber-700"
            : "bg-gradient-to-br from-gray-500 to-gray-700"
        )}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-black opacity-10 rounded-full translate-y-1/4 -translate-x-1/4"></div>

        {/* Icon container */}
        <div className="mb-4 p-4 rounded-full bg-white bg-opacity-20 shadow-inner">
          {getIcon()}
        </div>

        <h3 className="text-white font-bold text-center mb-1 text-lg">
          {title}
        </h3>

        {description && (
          <p className="text-white text-opacity-90 text-xs text-center mb-2 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-1">
          {lessons > 0 && (
            <div className="flex items-center text-xs text-white text-opacity-80 font-medium">
              <BookOpen className="h-3 w-3 mr-1" />
              {lessons}
            </div>
          )}

          {prerequisites > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center text-xs text-white text-opacity-80 font-medium">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {prerequisites}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Requires {prerequisites} prerequisite module(s)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full mt-3 bg-black bg-opacity-20 rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              "h-full",
              isCompleted
                ? "bg-gradient-to-r from-green-300 to-green-500"
                : "bg-gradient-to-r from-amber-300 to-amber-500"
            )}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Status indicators */}
        {isCompleted && (
          <div className="absolute top-3 right-3">
            <CheckCircle className="h-6 w-6 text-green-300 drop-shadow-md" />
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl backdrop-blur-sm">
            <Lock className="h-12 w-12 text-white opacity-90" />
          </div>
        )}
      </div>
    </div>
  );
}
