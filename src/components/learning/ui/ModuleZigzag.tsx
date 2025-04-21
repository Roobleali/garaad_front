"use client";

import { useState, useRef, useEffect } from "react";
import ModuleBox from "./ModuleBox";
import ModulePopup from "./ModulePopup";
import { Module } from "@/types/learning";
import * as Popover from "@radix-ui/react-popover";

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
  // State for the zigzag path
  const [zigzagPath, setZigzagPath] = useState<string>("");
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  useEffect(() => {
    // Calculate a single continuous zigzag path connecting all modules
    const calculateZigzagPath = () => {
      if (moduleRefs.current.length < 2) return;

      const validModules = moduleRefs.current.filter(Boolean);
      if (validModules.length < 2) return;

      // Start building the path
      let pathData = "";

      // Get the first module position
      const firstModule = validModules[0];
      if (!firstModule) return;

      const firstRect = firstModule.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
      };

      // Starting point (center bottom of first module)
      let currentX = firstRect.left + firstRect.width / 2 - containerRect.left;
      let currentY = firstRect.bottom - containerRect.top + 10; // Add a small offset

      // Initialize the path with the starting point
      pathData = `M ${currentX} ${currentY}`;

      // For each subsequent module, add zigzag segments
      for (let i = 1; i < validModules.length; i++) {
        const currentModule = validModules[i];
        const currentRect =
          currentModule?.getBoundingClientRect() || new DOMRect();
        // Calculate endpoint (center top of current module)
        const endX =
          currentRect.left + currentRect.width / 2 - containerRect.left;
        const endY = currentRect.top - containerRect.top - 10; // Add a small offset

        // Determine if this is an even or odd segment to create the zigzag pattern
        // For even segments, go right then down; for odd segments, go left then down
        const isEven = i % 2 === 0;
        const horizontalOffset = isEven ? -120 : 120; // Adjust this value to control zigzag width

        // Add zigzag segment
        // First go down a bit
        pathData += ` L ${currentX} ${currentY + 40}`;
        currentY += 40;

        // Then go diagonally to the side and down
        pathData += ` L ${currentX + horizontalOffset} ${
          (currentY + endY) / 2
        }`;
        currentX += horizontalOffset;
        currentY = (currentY + endY) / 2;

        // Then go diagonally to the module
        pathData += ` L ${endX} ${endY}`;

        // Update current position for next segment
        currentX = endX;
        currentY = currentRect.bottom - containerRect.top + 10;
      }

      setZigzagPath(pathData);
    };

    // Calculate path on mount and window resize
    calculateZigzagPath();
    window.addEventListener("resize", calculateZigzagPath);

    return () => {
      window.removeEventListener("resize", calculateZigzagPath);
    };
  }, [modules]);

  // Determine the position of each module in the zigzag pattern
  const getModulePosition = (index: number) => {
    if (index === 0 || index === modules.length - 1) {
      // Level indicators are centered
      return "justify-center";
    }

    // Alternate between left and right for regular modules
    return index % 2 === 1 ? "justify-start ml-16" : "justify-end mr-16";
  };

  return (
    <div className="relative" ref={containerRef}>
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <path d={zigzagPath} fill="none" stroke="gray" strokeWidth={2} />
      </svg>

      <div className="relative flex flex-col items-center z-10">
        {modules.map((module, index) => (
          <div
            key={module.id}
            ref={(el) => {
              moduleRefs.current[index] = el;
            }}
            className={`relative mb-16 ${getModulePosition(index)}`}
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
                    iconType={index % 2 === 0 ? "blue" : "green"}
                  />
                </div>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  side={index % 2 === 0 ? "right" : "left"}
                  sideOffset={10}
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
