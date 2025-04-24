"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ModuleBox from "./ModuleBox";
import ModulePopup from "./ModulePopup";
import type { Module } from "@/types/learning";
import * as Popover from "@radix-ui/react-popover";
import axios from "axios";
import Cookies from "js-cookie";
import { UserProgress } from "@/services/progress";

interface ModuleZigzagProps {
  modules: Module[];
  activeModuleId: number | null;
  onModuleClick: (moduleId: number) => void;
}

export default function ModuleZigzag({
  modules,
  activeModuleId,
  onModuleClick,
}: ModuleZigzagProps) {
  const [zigzagPath, setZigzagPath] = useState<string>("");
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [completedPath, setCompletedPath] = useState<string>("");
  const [modulePoints, setModulePoints] = useState<
    { x: number; y: number; completed: boolean }[]
  >([]);
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/lms/user-progress/`;

  const fetchProgress = useCallback(async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Not authenticated");

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status >= 200 && status < 300,
      });

      setProgress(response.data || []);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Error fetching progress");
      }
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  console.log("++++++++++PROGRESS+++++++", progress);

  const isModuleCompleted = (
    courseTitle: string,
    progressData: UserProgress[]
  ) => {
    const moduleProgress = progressData.filter(
      (p) => p.lesson_title === courseTitle && p.status === "completed"
    );
    return moduleProgress.length > 0;
  };

  const hasModuleProgress = (
    courseTitle: string,
    progressData: UserProgress[]
  ) => {
    const moduleProgress = progressData.filter(
      (p) => p.lesson_title === courseTitle && p.status === "in_progress"
    );
    return moduleProgress.length > 0;
  };

  useEffect(() => {
    const calculateZigzagPath = () => {
      if (moduleRefs.current.length < 2) return;

      const validModules = moduleRefs.current.filter(Boolean);
      if (validModules.length < 2) return;

      let pathData = "";
      let completedPathData = "";
      const points: { x: number; y: number; completed: boolean }[] = [];

      // Get container position for relative coordinates
      const containerRect = containerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
      };

      // Start from the center of the first module
      const firstModule = validModules[0];
      if (!firstModule) return;
      const firstRect = firstModule.getBoundingClientRect();

      // Calculate center point of first module
      const startX = firstRect.left + firstRect.width / 2 - containerRect.left;
      const startY = firstRect.top + firstRect.height / 2 - containerRect.top;

      pathData = `M ${startX} ${startY}`;
      completedPathData = `M ${startX} ${startY}`;

      // Add first module point
      points.push({
        x: startX,
        y: startY,
        completed: isModuleCompleted(modules[0].title, progress),
      });

      let lastCompletedIndex = -1;

      // Find the last completed module
      for (let i = 0; i < modules.length; i++) {
        if (isModuleCompleted(modules[i].title, progress)) {
          lastCompletedIndex = i;
        } else {
          break; // Stop at first incomplete module
        }
      }

      // Connect to the center of each subsequent module with curved lines
      for (let i = 1; i < validModules.length; i++) {
        const currentModule = validModules[i];
        if (!currentModule) continue;

        const prevModule = validModules[i - 1];
        if (!prevModule) continue;
        const prevRect = prevModule.getBoundingClientRect();
        const currentRect = currentModule.getBoundingClientRect();

        // Calculate center points
        const prevX = prevRect.left + prevRect.width / 2 - containerRect.left;
        const prevY = prevRect.top + prevRect.height / 2 - containerRect.top;
        const currentX =
          currentRect.left + currentRect.width / 2 - containerRect.left;
        const currentY =
          currentRect.top + currentRect.height / 2 - containerRect.top;

        // Add current module point
        points.push({
          x: currentX,
          y: currentY,
          completed: isModuleCompleted(modules[i].title, progress),
        });

        // Calculate distance between modules
        const dx = currentX - prevX;
        const dy = currentY - prevY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate control points for the curve
        // Adjust these values to control the curvature
        const curveIntensity = distance * 0.5;

        // For zigzag pattern, alternate the control point direction
        const isEven = i % 2 === 0;
        const controlX1 = prevX + (isEven ? -curveIntensity : curveIntensity);
        const controlY1 = prevY + curveIntensity / 2;
        const controlX2 =
          currentX + (isEven ? curveIntensity : -curveIntensity);
        const controlY2 = currentY - curveIntensity / 2;

        // Add cubic Bezier curve to path
        pathData += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${currentX} ${currentY}`;

        // Add to completed path only if this module is completed
        if (i <= lastCompletedIndex) {
          completedPathData += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${currentX} ${currentY}`;
        }
      }

      setZigzagPath(pathData);
      setCompletedPath(completedPathData);
      setModulePoints(points);
    };

    calculateZigzagPath();
    window.addEventListener("resize", calculateZigzagPath);

    return () => window.removeEventListener("resize", calculateZigzagPath);
  }, [modules, progress]);

  const getModulePosition = (index: number) => {
    if (index === 0 || index === modules.length - 1) {
      return "justify-center";
    }
    return index % 2 === 1 ? "justify-start ml-56" : "justify-end mr-56";
  };

  return (
    <div className="relative" ref={containerRef}>
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Background path (incomplete) */}
        <path
          d={zigzagPath}
          fill="none"
          stroke="gray"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
          className="stroke-gray-300 transition-all duration-500 ease-in-out"
        />

        {/* Completed path */}
        <path
          d={completedPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 ease-in-out"
        />

        {/* Module markers */}
        {modulePoints.map((point, index) => (
          <g key={index} className="transition-all duration-300 ease-in-out">
            {/* Outer circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r={12}
              className={`${point.completed
                  ? "fill-blue-400"
                  : activeModuleId === modules[index]?.id
                    ? "fill-blue-200"
                    : "fill-gray-200"
                } transition-all duration-300`}
            />

            {/* Inner circle or check icon for completed modules */}
            {point.completed ? (
              <g transform={`translate(${point.x - 6}, ${point.y - 6})`}>
                <circle cx="6" cy="6" r="6" fill="white" />
                <path
                  d="M3.5 6.5L5 8L8.5 4.5"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            ) : (
              <circle
                cx={point.x}
                cy={point.y}
                r={6}
                className={`${activeModuleId === modules[index]?.id
                    ? "fill-blue-400"
                    : "fill-white"
                  } transition-all duration-300`}
              />
            )}

            {/* Module number */}
            <text
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="central"
              className={`text-xs font-bold ${point.completed || activeModuleId === modules[index]?.id
                  ? "fill-white"
                  : "fill-gray-500"
                }`}
            >
              {index + 1}
            </text>
          </g>
        ))}
      </svg>

      <div className="relative flex flex-col items-center z-10 no animate">
        {modules.map((module, index) => (
          <div
            key={module.id}
            ref={(el) => {
              moduleRefs.current[index] = el;
            }}
            className={`relative mb-24 ${getModulePosition(index)}`}
          >
            <Popover.Root
              open={openPopoverId === module.id}
              onOpenChange={(open) => setOpenPopoverId(open ? module.id : null)}
            >
              <Popover.Trigger asChild>
                <div>
                  <ModuleBox
                    module={module}
                    isActive={openPopoverId === module.id}
                    onClick={() => onModuleClick(module.id)}
                    iconType={
                      isModuleCompleted(module.title, progress)
                        ? "green"
                        : hasModuleProgress(module.title, progress)
                          ? "blue"
                          : "gray"
                    }
                  />
                </div>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  side={index % 2 === 0 ? "right" : "left"}
                  sideOffset={30}
                  className="z-[1000] bg-transparent p-0 shadow-none"
                >
                  <ModulePopup module={module} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
