import { useParams, useRouter } from "next/navigation";
import { ArrowRight, PlayCircle, RefreshCwIcon } from "lucide-react";
import { Module } from "@/types/learning";
import { Button } from "@/components/ui/button";

interface ModulePopupProps {
  module: Module;
  isInProgress: boolean;
  isCompleted: boolean;
}

export default function ModulePopup({
  module,
  isInProgress,
  isCompleted,
}: ModulePopupProps) {
  const params = useParams();
  const router = useRouter();

  const handleModuleClick = (moduleId: string | number) => {
    router.push(
      `/courses/${params.categoryId}/${params.courseSlug}/lessons/${moduleId}`
    );
  };

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[calc(100%+55px)] w-full max-w-xs sm:w-80 bg-white rounded-lg shadow-lg p-4 z-20 animate-fadeIn border-2 border-border">
      <div className="absolute top-0 left-1/2 transform translate-y-full -translate-x-1/2">
        <div className="w-4 h-4 bg-white rotate-45 transform -translate-y-6 -translate-x-0 -z-30"></div>
      </div>
      <h3 className="font-bold mb-2">{module.title}</h3>
      <p className="text-sm mb-4">{module.description}</p>

      <div className="flex justify-center w-full mt-4">
        <Button
          onClick={() => handleModuleClick(module.id)}
          variant="default"
          className="w-full max-w-xs mx-auto bg-foreground text-background hover:bg-foreground/70 rounded-full py-3 px-4 text-base sm:text-lg font-semibold shadow-lg"
        >
          {isInProgress
            ? "Sii Wado Casharka"
            : isCompleted
              ? "Muraajacee Casharka"
              : "Billow Casharka"}{" "}
          {isInProgress ? (
            <PlayCircle className="ml-2 w-4 h-4" />
          ) : isCompleted ? (
            <RefreshCwIcon className="ml-2 w-4 h-4" />
          ) : (
            <ArrowRight className="ml-2 w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
