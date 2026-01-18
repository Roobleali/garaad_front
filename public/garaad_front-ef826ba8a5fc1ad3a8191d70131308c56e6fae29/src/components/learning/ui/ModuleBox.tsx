"use client";

import { memo } from "react";
import type { Module } from "@/types/learning";

interface ModuleBoxProps {
  module: Module;
  onClick: () => void;
  isLocked?: boolean;
  isActive?: boolean;
  isCompleted?: boolean;
  isInProgress?: boolean;
  align?: 'left' | 'right';
}

const ModuleBox = memo(({
  module,
  onClick,
  isLocked = false,
  isActive = false,
  isCompleted = false,
  isInProgress = false,
  align = 'left'
}: ModuleBoxProps) => {
  return (
    <div
      className={`flex items-center cursor-pointer group transition-all duration-300 p-1 rounded-lg
        ${align === 'right' ? 'flex-row-reverse' : ''}`}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Module icon with rings in its own container */}
      <div className="relative">
        <div className="relative w-10 h-10 flex-shrink-0">
          {/* Outer ring with gradient */}
          <div className={`absolute inset-0 rounded-full ${isLocked
            ? 'bg-gradient-to-br from-gray-200 to-gray-300/50'
            : isCompleted
              ? 'bg-gradient-to-br from-green-200/40 to-green-300/20'
              : isInProgress
                ? 'bg-gradient-to-br from-blue-200/40 to-blue-300/20'
                : 'bg-gradient-to-br from-gray-200/40 to-gray-300/20'
            }`} />

          {/* Inner ring with gradient */}
          <div
            className={`absolute inset-1 rounded-full ${isLocked
              ? 'bg-gradient-to-br from-gray-300 to-gray-200'
              : isCompleted
                ? 'bg-gradient-to-br from-green-300/50 to-green-200/30'
                : isInProgress
                  ? 'bg-gradient-to-br from-blue-300/50 to-blue-200/30'
                  : 'bg-gradient-to-br from-gray-300/50 to-gray-200/30'
              }`}
          />

          {/* Center with gradient */}
          <div
            className={`absolute inset-2 rounded-full ${isLocked
              ? 'bg-gradient-to-br from-gray-400 to-gray-500'
              : isCompleted
                ? 'bg-gradient-to-br from-green-500 to-green-600'
                : isInProgress
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                  : 'bg-gradient-to-br from-gray-500 to-gray-600'
              } flex items-center justify-center shadow-inner`}
          >
            {isLocked && (
              <div className="w-2 h-2 bg-gray-200/90 rounded-sm" />
            )}
          </div>

          {/* Subtle glow effect */}
          <div className={`absolute -inset-0.5 rounded-full blur-md opacity-20 transition-opacity duration-300
            ${isLocked
              ? 'bg-gray-400'
              : isCompleted
                ? 'bg-green-400'
                : isInProgress
                  ? 'bg-blue-400'
                  : 'bg-gray-400'
            } 
            ${isActive ? 'opacity-40' : 'group-hover:opacity-30'}`}
          />
        </div>
      </div>

      {/* Module title in separate container */}
      <div className={`mx-2 py-1.5 px-2 rounded-md transition-colors duration-200 ${isActive
        ? 'bg-blue-50/80'
        : 'group-hover:bg-gray-50'
        }`}>
        <p className={`text-sm w-24 font-medium leading-snug
          ${isLocked
            ? 'text-gray-400'
            : isActive
              ? 'text-gray-900'
              : 'text-gray-700 group-hover:text-gray-900'}
          ${align === 'right' ? 'text-right' : 'text-left'}`}
        >
          {module.title}
        </p>
      </div>
    </div>
  );
});

ModuleBox.displayName = "ModuleBox";
export default ModuleBox;
