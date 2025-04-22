import React from "react";
import { Lock } from "lucide-react";
import { useState } from "react";

interface LevelMarkerProps {
  level: number;
  isLocked?: boolean;
}

export const LevelMarker: React.FC<LevelMarkerProps> = ({ level, isLocked = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group perspective-1000 relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Depth layers for 3D effect */}
      {/* <div className="absolute inset-0 rounded-full bg-blue-400/30 transform translate-y-4 scale-90 transition-all duration-300 group-hover:translate-y-6 group-hover:scale-95"></div> */}
      {/* <div className="absolute inset-0 rounded-full bg-blue-300/40 transform translate-y-2 scale-95 transition-all duration-300 group-hover:translate-y-4 group-hover:scale-97"></div> */}

      {/* Main 3D circle */}
      <div
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center mx-auto
          transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isHovered && !isLocked
            ? "rotate-x-[20deg] rotate-z-[-5deg] translate-z-8"
            : ""
          }
          ${isLocked
            ? "bg-gradient-to-br from-gray-400 to-gray-600"
            : "bg-gradient-to-br from-blue-400 to-blue-600"
          }
          shadow-2xl shadow-blue-900/40 hover:shadow-blue-900/60
          hover:scale-110
        `}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Inner shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-40"></div>

        {/* Animated core */}
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="absolute inset-0 animate-pulse-slow rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="text-white font-bold text-2xl z-10 transform transition-all duration-300 group-hover:scale-125">
            {level}
          </div>
        </div>

        {/* Lock overlay with animation */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
            <Lock
              className={`h-8 w-8 text-white transform transition-transform duration-500 ${isHovered ? "animate-bounce-slow" : ""
                }`}
            />
          </div>
        )}

        {/* Edge highlight for 3D effect */}
        <div
          className="absolute inset-0 rounded-full border-2 border-white/20 pointer-events-none"
          style={{ transform: "translateZ(1px)" }}
        ></div>
      </div>

      {/* Animated level text */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-600 uppercase tracking-wider transition-opacity duration-300 opacity-70 group-hover:opacity-100">
        <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">
          LEVEL {level}
        </span>
      </div>

      {/* Add sparkle particles when hovered */}
      {!isLocked && isHovered && (
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/80 rounded-full animate-sparkle"
              style={{
                transform: `rotate(${i * 60}deg) translateY(-15px)`,
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}
