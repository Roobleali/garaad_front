"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  PlayCircle,
  RefreshCwIcon,
  ReplyAll,
  ReplyIcon,
} from "lucide-react";
import { Module } from "@/types/learning";
import { Button } from "@/components/ui/button";

interface ModulePopupProps {
  module: Module;
  isInProgress: boolean;
  isCompleted: boolean;
  side: "left" | "right";
  isFirstModule: boolean;
  isLastModule: boolean;
}

export default function ModulePopup({
  module,
  isInProgress,
  isCompleted,
  side,
  isFirstModule,
  isLastModule,
}: ModulePopupProps) {
  const params = useParams();
  const router = useRouter();

  const handleModuleClick = (moduleId: string | number) => {
    const storageKey = `lesson_progress_${moduleId}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        blockIndex: 0,
        timestamp: new Date().toISOString(),
      })
    );
    router.push(
      `/courses/${params.categoryId}/${params.courseSlug}/lessons/${moduleId}`
    );
  };

  console.log(isLastModule);

  return (
    <div
      className={`
        absolute
        top-full mt-8
        left-1/2
        transform
        -translate-y-16
        ${
          side === "left" && !isLastModule
            ? " -translate-x-[70%]"
            : "-translate-x-[10%]"
        }
        ${isFirstModule ? "-translate-x-[50%]" : ""} 
        ${isLastModule ? "-translate-x-[50%]" : ""}

        w-80
        bg-white
        rounded-lg
        shadow-lg
        p-4
        border-2 border-border
        z-20
        animate-fadeIn
        text-center
      `}
    >
      <h3 className="font-bold mb-2">{module.title}</h3>
      <p className="text-sm mb-4">{module.description}</p>

      <Button
        onClick={() => handleModuleClick(module.id)}
        variant="default"
        className="w-full bg-foreground text-background hover:bg-foreground/70 rounded-full"
      >
        {isInProgress
          ? "Sii Wado Casharka"
          : isCompleted
          ? "Muraajacee Casharka"
          : "Billow Casharka"}
        {isInProgress ? (
          <PlayCircle className="ml-2 w-4 h-4" />
        ) : isCompleted ? (
          <ReplyIcon className="ml-2 w-4 h-4" />
        ) : (
          <PlayCircle className="ml-2 w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
