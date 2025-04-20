import { Lock } from "lucide-react";

interface LevelIndicatorProps {
  level: number;
  isLocked?: boolean;
}

export function LevelIndicator({
  level,
  isLocked = false,
}: LevelIndicatorProps) {
  return (
    <div className="relative">
      {/* 3D effect bottom layers */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-400 rounded-full transform translate-y-1 z-0"></div> */}

      {/* Main indicator */}
      <div
        className={`
        relative w-16 h-16 rounded-full flex items-center justify-center z-10
        ${isLocked ? "bg-gray-400" : "bg-blue-500"}
        transform transition-transform hover:scale-105
      `}
      >
        <div className="text-white font-bold">{level}</div>

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
            <Lock className="h-6 w-6 text-white opacity-80" />
          </div>
        )}
      </div>

      <div className="absolute  left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-500 mt-3">
        LEVEL {level}
      </div>
    </div>
  );
}
