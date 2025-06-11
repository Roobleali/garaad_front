"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import ModuleBox from "./ModuleBox";
import ModulePopup from "./ModulePopup";
import type { Module } from "@/types/learning";
import * as Popover from "@radix-ui/react-popover";
import { UserProgress } from "@/services/progress";

interface ModuleZigzagProps {
  modules: Module[];
  progress: UserProgress[];
  onModuleClick: (moduleId: number) => void;
  energyKeys: number;
}

export default function ModuleZigzag({
  modules,
  progress,
  onModuleClick,
  energyKeys,
}: ModuleZigzagProps) {
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  const uniqueModules = useMemo(() => {
    return modules.filter(
      (module, index, self) =>
        index === self.findIndex((m) => m.id === module.id)
    );
  }, [modules]);

  console.log("+++++++++++++++++MODULES+++++++++++++");

  const isModuleCompleted = useCallback(
    (lessonTitle: string) => {
      const moduleProgress = progress.filter(
        (p) => p.lesson_title === lessonTitle && p.status === "completed"
      );
      return moduleProgress.length > 0;
    },
    [progress]
  );

  const hasModuleProgress = useCallback(
    (moduleId: number) => {
      const moduleProgress = progress.filter(
        (p) => p.module_id === moduleId && p.status === "in_progress"
      );
      return moduleProgress.length > 0;
    },
    [progress]
  );

  const isModuleLocked = useCallback(() => {
    return energyKeys === 0;
  }, [energyKeys]);

  const getModulePosition = (index: number) => {
    // On mobile, always center
    return "justify-center w-full";
  };

  return (
    <div className="relative w-full px-2 sm:px-0" ref={containerRef}>
      <div className="relative flex flex-col items-center z-10">
        {uniqueModules.map((module, index) => (
          <div
            key={module.id}
            ref={(el) => {
              moduleRefs.current[index] = el;
            }}
            className={`relative mb-6 w-full max-w-xs mx-auto ${getModulePosition(index)}`}
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
                      isModuleCompleted(module.title)
                        ? "green"
                        : hasModuleProgress(module.course_id)
                          ? "blue"
                          : "gray"
                    }
                  />
                </div>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  sideOffset={0}
                  className="z-[1000] bg-transparent p-0 shadow-none no-animate"
                >
                  <ModulePopup
                    module={module}
                    isInProgress={hasModuleProgress(module.course_id)}
                    isCompleted={isModuleCompleted(module.title)}
                    isLocked={isModuleLocked()}
                    side={index % 2 === 0 ? "right" : "left"}
                    isFirstModule={module.id === modules[0]?.id}
                    isLastModule={module.id === modules[modules.length - 1].id}
                  />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
