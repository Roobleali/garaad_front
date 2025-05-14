// "use client";

// import { useEffect, useRef } from "react";
// import type { Module } from "@/types/learning";

// interface ModuleBoxProps {
//   module: Module;
//   isActive: boolean;
//   onClick: () => void;
//   iconType: "blue" | "green" | "purple" | "gray";
// }

// export default function ModuleBox({
//   module,
//   isActive,
//   onClick,
//   iconType = "purple",
// }: ModuleBoxProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const isCompleted = iconType === "green";

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const dpr = window.devicePixelRatio || 1;
//     const size = 70;
//     canvas.width = size * dpr;
//     canvas.height = size * dpr;
//     canvas.style.width = `${size}px`;
//     canvas.style.height = `${size}px`;
//     ctx.scale(dpr, dpr);

//     const cx = size / 2;
//     const cy = size / 2;
//     const rx = 28;
//     const ry = 16;

//     const theme = {
//       blue: { primary: "#3B82F6", secondary: "#2563EB", glow: "#93C5FD" },
//       green: { primary: "#10B981", secondary: "#059669", glow: "#A7F3D0" },
//       purple: { primary: "#8B5CF6", secondary: "#7C3AED", glow: "#C4B5FD" },
//       gray: { primary: "#6B7280", secondary: "#4B5563", glow: "#E5E7EB" },
//     };
//     const { primary, secondary, glow } = theme[iconType];

//     let animId: number;
//     let tick = 0;

//     function drawBase() {
//       if (!ctx) return;
//       ctx.clearRect(0, 0, size, size);
//       if (isCompleted) {
//         drawCompletedModule(ctx, size);
//       } else if (!isActive) {
//         drawInactiveModule(ctx, size);
//         // Rounded outline for inactive
//         ctx.save();
//         ctx.beginPath();
//         ctx.ellipse(cx, cy, rx + 2, ry + 2, 0, 0, 2 * Math.PI);
//         ctx.lineWidth = 1.5;
//         ctx.strokeStyle = "#D1D5DB"; // Light gray
//         ctx.stroke();
//         ctx.restore();
//       } else {
//         drawActiveModuleBase(ctx, size, iconType);
//       }
//       // Static outline for active
//       if (isActive) {
//         ctx.save();
//         ctx.beginPath();
//         ctx.ellipse(cx, cy, rx + 2, ry + 2, 0, 0, 2 * Math.PI);
//         ctx.lineWidth = 2;
//         ctx.strokeStyle = primary;
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.ellipse(cx, cy, rx + 4, ry + 4, 0, 0, 2 * Math.PI);
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = glow;
//         ctx.stroke();
//         ctx.restore();
//       }
//       // Draw clock icon for non-completed modules
//       if (!isCompleted) {
//         drawClock(ctx, cx, cy);
//       }
//     }

//     function animateBorder() {
//       drawBase();
//       if (!ctx) return;

//       // Pulsating solid border
//       ctx.save();
//       ctx.beginPath();
//       const offset = Math.sin(tick) * 3;
//       ctx.ellipse(
//         cx,
//         cy,
//         rx + 3 + offset,
//         ry + 3 + offset * (ry / rx),
//         0,
//         0,
//         2 * Math.PI
//       );
//       ctx.lineWidth = 2;
//       ctx.strokeStyle = primary;
//       ctx.stroke();
//       ctx.restore();

//       tick += 0.05;
//       animId = requestAnimationFrame(animateBorder);
//     }

//     if (isActive) {
//       animateBorder();
//     } else {
//       drawBase();
//     }

//     return () => {
//       cancelAnimationFrame(animId);
//     };
//   }, [isActive, iconType, isCompleted]);

//   return (
//     <button
//       onClick={onClick}
//       aria-pressed={isActive}
//       className="group relative flex flex-col items-center w-48 p-4 mt-5"
//     >
//       <canvas
//         ref={canvasRef}
//         className={`
//           rounded-full transition-all duration-300 ease-in-out
//           ${
//             isActive
//               ? "rotate-0 transform drop-shadow-xl"
//               : "group-hover:rotate-6 transform drop-shadow-md"
//           }
//         `}
//         title={module.title}
//         aria-label={
//           isCompleted
//             ? `${module.title} (completed)`
//             : isActive
//             ? `${module.title} (active)`
//             : `${module.title} (locked)`
//         }
//       />
//       <h3
//         className={`
//           text-center font-semibold leading-tight text-sm
//           ${isActive ? "text-gray-900" : "text-gray-700"}
//         `}
//       >
//         {module.title}
//       </h3>
//     </button>
//   );
// }

// function drawActiveModuleBase(
//   ctx: CanvasRenderingContext2D,
//   size: number,
//   iconType: "blue" | "green" | "purple" | "gray"
// ) {
//   const cx = size / 2;
//   const cy = size / 2;
//   const rx = 28;
//   const ry = 16;
//   const theme = {
//     blue: { primary: "#3B82F6", secondary: "#2563EB", glow: "#93C5FD" },
//     green: { primary: "#10B981", secondary: "#059669", glow: "#A7F3D0" },
//     purple: { primary: "#8B5CF6", secondary: "#7C3AED", glow: "#C4B5FD" },
//     gray: { primary: "#6B7280", secondary: "#4B5563", glow: "#E5E7EB" },
//   };
//   const { primary, secondary, glow } = theme[iconType];

//   // Main ellipse with gradient
//   const fillGrad = ctx.createRadialGradient(
//     cx - rx / 2,
//     cy - ry / 2,
//     0,
//     cx,
//     cy,
//     rx
//   );
//   fillGrad.addColorStop(0, glow);
//   fillGrad.addColorStop(0.6, primary);
//   fillGrad.addColorStop(1, secondary);

//   ctx.beginPath();
//   ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
//   ctx.fillStyle = fillGrad;
//   ctx.fill();

//   // Inner highlight
//   ctx.beginPath();
//   ctx.ellipse(cx - 6, cy - 6, rx / 2.5, ry / 2.5, 0, 0, 2 * Math.PI);
//   ctx.fillStyle = "rgba(255,255,255,0.12)";
//   ctx.fill();
// }

// function drawCompletedModule(ctx: CanvasRenderingContext2D, size: number) {
//   const centerX = size / 2;
//   const centerY = size / 2;
//   const radiusX = 28;
//   const radiusY = 16;

//   // Main fill gradient
//   const gradient = ctx.createRadialGradient(
//     centerX,
//     centerY,
//     radiusY / 4,
//     centerX,
//     centerY,
//     radiusX
//   );
//   gradient.addColorStop(0, "#E9D5FF");
//   gradient.addColorStop(0.5, "#C084FC");
//   gradient.addColorStop(1, "#A855F7");

//   ctx.beginPath();
//   ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
//   ctx.fillStyle = gradient;
//   ctx.fill();

//   // Checkmark
//   ctx.beginPath();
//   ctx.moveTo(centerX - 8, centerY);
//   ctx.lineTo(centerX - 2, centerY + 6);
//   ctx.lineTo(centerX + 10, centerY - 6);
//   ctx.strokeStyle = "white";
//   ctx.lineWidth = 2;
//   ctx.lineCap = "round";
//   ctx.lineJoin = "round";
//   ctx.stroke();
// }

// function drawInactiveModule(ctx: CanvasRenderingContext2D, size: number) {
//   const centerX = size / 2;
//   const centerY = size / 2;
//   const radiusX = 28;
//   const radiusY = 16;

//   // Main inactive fill
//   const gradient = ctx.createRadialGradient(
//     centerX,
//     centerY,
//     radiusY / 4,
//     centerX,
//     centerY,
//     radiusX
//   );
//   gradient.addColorStop(0, "#F3F4F6");
//   gradient.addColorStop(1, "#9CA3AF");

//   ctx.beginPath();
//   ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
//   ctx.fillStyle = gradient;
//   ctx.fill();
// }

// function drawClock(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
//   const size = 6;
//   ctx.save();
//   // Clock face
//   ctx.beginPath();
//   ctx.arc(cx, cy, size, 0, 2 * Math.PI);
//   ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
//   ctx.fill();
//   ctx.lineWidth = 1;
//   ctx.strokeStyle = "#999";
//   ctx.stroke();
//   // Hour hand
//   ctx.beginPath();
//   ctx.moveTo(cx, cy);
//   ctx.lineTo(cx, cy - size / 2);
//   ctx.lineWidth = 1;
//   ctx.strokeStyle = "#555";
//   ctx.stroke();
//   // Minute hand
//   ctx.beginPath();
//   ctx.moveTo(cx, cy);
//   ctx.lineTo(cx + size / 2, cy);
//   ctx.lineWidth = 0.5;
//   ctx.strokeStyle = "#555";
//   ctx.stroke();
//   ctx.restore();
// }

"use client";

import { useEffect, useRef } from "react";
import type { Module } from "@/types/learning";

interface ModuleBoxProps {
  module: Module;
  isActive: boolean;
  onClick: () => void;
  iconType: "blue" | "green" | "purple" | "gray";
}

export default function ModuleBox({
  module,
  isActive,
  onClick,
  iconType = "purple",
}: ModuleBoxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isCompleted = iconType === "green";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 70;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const rx = 28;
    const ry = 16;

    const theme = {
      blue: { primary: "#3B82F6", secondary: "#2563EB", glow: "#93C5FD" },
      green: { primary: "#10B981", secondary: "#059669", glow: "#A7F3D0" },
      purple: { primary: "#8B5CF6", secondary: "#7C3AED", glow: "#C4B5FD" },
      gray: { primary: "#6B7280", secondary: "#4B5563", glow: "#E5E7EB" },
    };
    const { primary, secondary, glow } = theme[iconType];

    let animId: number;
    let tick = 0;

    function drawBase() {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);
      if (isCompleted) {
        drawCompletedModule(ctx, size);
      } else if (!isActive) {
        drawInactiveModule(ctx, size);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx + 2, ry + 2, 0, 0, 2 * Math.PI);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#D1D5DB";
        ctx.stroke();
        ctx.restore();
      } else {
        drawActiveModuleBase(ctx, size, iconType);
      }

      if (isActive) {
        ctx.save();
        // Outer ellipse
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx + 4, ry + 4, 0, 0, 2 * Math.PI);
        ctx.lineWidth = 4;
        ctx.strokeStyle = primary;
        ctx.stroke();

        // Inner ellipse
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx - 2, ry - 2, 0, 0, 2 * Math.PI);
        ctx.lineWidth = 4;
        ctx.strokeStyle = secondary;
        ctx.stroke();
        ctx.restore();
      }

      if (!isCompleted) {
        drawClock(ctx, cx, cy);
      }
    }

    function animateBorder() {
      drawBase();
      if (!ctx) return;

      ctx.save();
      ctx.beginPath();
      const offset = Math.sin(tick) * 2;
      ctx.ellipse(
        cx,
        cy,
        rx + 4 + offset,
        ry + 4 + offset * (ry / rx),
        0,
        0,
        2 * Math.PI
      );
      ctx.lineWidth = 4;
      ctx.strokeStyle = primary;
      ctx.stroke();
      ctx.restore();

      tick += 0.05;
      animId = requestAnimationFrame(animateBorder);
    }

    if (isActive) {
      animateBorder();
    } else {
      drawBase();
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive, iconType, isCompleted]);

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className="group relative flex flex-col items-center w-48 p-4 mt-5"
    >
      <canvas
        ref={canvasRef}
        className={`
          rounded-full transition-all duration-300 ease-in-out
          ${
            isActive
              ? "rotate-0 transform drop-shadow-xl"
              : "group-hover:rotate-6 transform drop-shadow-md"
          }
        `}
        title={module.title}
        aria-label={
          isCompleted
            ? `${module.title} (completed)`
            : isActive
            ? `${module.title} (active)`
            : `${module.title} (locked)`
        }
      />
      <h3
        className={`
          text-center font-semibold leading-tight text-sm
          ${isActive ? "text-gray-900" : "text-gray-700"}
        `}
      >
        {module.title}
      </h3>
    </button>
  );
}

function drawActiveModuleBase(
  ctx: CanvasRenderingContext2D,
  size: number,
  iconType: "blue" | "green" | "purple" | "gray"
) {
  const cx = size / 2;
  const cy = size / 2;
  const rx = 28;
  const ry = 16;
  const theme = {
    blue: { primary: "#3B82F6", secondary: "#2563EB", glow: "#93C5FD" },
    green: { primary: "#10B981", secondary: "#059669", glow: "#A7F3D0" },
    purple: { primary: "#8B5CF6", secondary: "#7C3AED", glow: "#C4B5FD" },
    gray: { primary: "#6B7280", secondary: "#4B5563", glow: "#E5E7EB" },
  };
  const { primary, secondary, glow } = theme[iconType];

  const fillGrad = ctx.createRadialGradient(
    cx - rx / 2,
    cy - ry / 2,
    0,
    cx,
    cy,
    rx
  );
  fillGrad.addColorStop(0, glow);
  fillGrad.addColorStop(0.6, primary);
  fillGrad.addColorStop(1, secondary);

  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
  ctx.fillStyle = fillGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx - 6, cy - 6, rx / 2.5, ry / 2.5, 0, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();
}

function drawCompletedModule(ctx: CanvasRenderingContext2D, size: number) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radiusX = 28;
  const radiusY = 16;

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    radiusY / 4,
    centerX,
    centerY,
    radiusX
  );
  gradient.addColorStop(0, "#E9D5FF");
  gradient.addColorStop(0.5, "#C084FC");
  gradient.addColorStop(1, "#A855F7");

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(centerX - 8, centerY);
  ctx.lineTo(centerX - 2, centerY + 6);
  ctx.lineTo(centerX + 10, centerY - 6);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

function drawInactiveModule(ctx: CanvasRenderingContext2D, size: number) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radiusX = 28;
  const radiusY = 16;

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    radiusY / 4,
    centerX,
    centerY,
    radiusX
  );
  gradient.addColorStop(0, "#F3F4F6");
  gradient.addColorStop(1, "#9CA3AF");

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawClock(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  const size = 6;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, size, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#999";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - size / 2);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#555";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + size / 2, cy);
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "#555";
  ctx.stroke();
  ctx.restore();
}
