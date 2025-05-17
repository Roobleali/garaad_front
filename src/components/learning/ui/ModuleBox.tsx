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
    const radius = 28; // Single radius for circles

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
        drawCompletedModule(ctx, size, radius);
      } else if (!isActive) {
        drawInactiveModule(ctx, size, radius);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius + 2, radius + 2, 0, 0, 2 * Math.PI);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#D1D5DB";
        ctx.stroke();
        ctx.restore();
      } else {
        // Pass theme colors for active module base
        drawActiveModuleBase(ctx, size, radius, primary, secondary, glow);
      }

      if (isActive) {
        ctx.save();
        // Outer circle border
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius + 4, radius + 4, 0, 0, 2 * Math.PI);
        ctx.lineWidth = 4;
        ctx.strokeStyle = primary;
        ctx.stroke();

        // Inner circle border
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius - 2, radius - 2, 0, 0, 2 * Math.PI);
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
        radius + 4 + offset,
        radius + 4 + offset,
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
  }, [isActive, iconType, isCompleted]); // Dependencies remain the same

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

/**
 * Draws the base for an active module with a 3D-like spherical gradient.
 */
function drawActiveModuleBase(
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number,
  primaryColor: string,
  secondaryColor: string,
  glowColor: string
) {
  const cx = size / 2;
  const cy = size / 2;

  // Create a radial gradient for a spherical 3D effect
  const fillGrad = ctx.createRadialGradient(
    cx - radius * 0.4, // Start X (light source, top-left)
    cy - radius * 0.4, // Start Y (light source, top-left)
    radius * 0.1, // Start Radius (small for a sharp highlight)
    cx, // End X (center of the circle)
    cy, // End Y (center of the circle)
    radius // End Radius (full circle radius)
  );
  fillGrad.addColorStop(0, "rgba(255,255,255,0.9)"); // Brightest highlight
  fillGrad.addColorStop(0.2, glowColor); // Transition to glow color
  fillGrad.addColorStop(0.6, primaryColor); // Main color
  fillGrad.addColorStop(1, secondaryColor); // Darker shadow color

  ctx.beginPath();
  ctx.ellipse(cx, cy, radius, radius, 0, 0, 2 * Math.PI);
  ctx.fillStyle = fillGrad;
  ctx.fill();

  // Add a subtle inner highlight for extra depth
  ctx.beginPath();
  ctx.ellipse(
    cx - radius * 0.3,
    cy - radius * 0.3,
    radius / 5,
    radius / 5,
    0,
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "rgba(255,255,255,0.2)"; // Softer white highlight
  ctx.fill();
}

/**
 * Draws a completed module with a 3D-like spherical gradient.
 */
function drawCompletedModule(
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number
) {
  const centerX = size / 2;
  const centerY = size / 2;

  // Create a radial gradient for a spherical 3D effect
  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.4, // Start X (light source)
    centerY - radius * 0.4, // Start Y (light source)
    radius * 0.1, // Start Radius
    centerX, // End X
    centerY, // End Y
    radius // End Radius
  );
  gradient.addColorStop(0, "rgba(255,255,255,0.9)"); // Bright highlight
  gradient.addColorStop(0.2, "#E9D5FF"); // Lighter purple
  gradient.addColorStop(0.6, "#C084FC"); // Main purple
  gradient.addColorStop(1, "#A855F7"); // Darker purple

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radius, radius, 0, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw the checkmark
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

/**
 * Draws an inactive module with a 3D-like spherical gradient.
 */
function drawInactiveModule(
  ctx: CanvasRenderingContext2D,
  size: number,
  radius: number
) {
  const centerX = size / 2;
  const centerY = size / 2;

  // Define specific gray theme colors for inactive state
  const primaryGray = "#6B7280";
  const secondaryGray = "#4B5563";
  const glowGray = "#E5E7EB";

  // Create a radial gradient for a spherical 3D effect
  const gradient = ctx.createRadialGradient(
    centerX - radius * 0.4, // Start X (light source)
    centerY - radius * 0.4, // Start Y (light source)
    radius * 0.1, // Start Radius
    centerX, // End X
    centerY, // End Y
    radius // End Radius
  );
  gradient.addColorStop(0, "rgba(255,255,255,0.9)"); // Bright highlight
  gradient.addColorStop(0.2, glowGray); // Lighter gray
  gradient.addColorStop(0.6, primaryGray); // Main gray
  gradient.addColorStop(1, secondaryGray); // Darker gray

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radius, radius, 0, 0, 2 * Math.PI);
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
