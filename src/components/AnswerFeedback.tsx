import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetAnswerState, revealAnswer } from "@/store/features/learningSlice";
import { Lesson } from "@/types/learning";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, ChevronRight, X } from "lucide-react";
import ExplanationModal from "./ExplanationModal";

interface AnswerFeedbackProps {
  currentLesson: Lesson | null;
  isCorrect: boolean;
  onResetAnswer: () => void;
  onContinue?: () => void;
  explanationData?: {
    explanation: string;
    image: string;
  };
}

const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  currentLesson,
  isCorrect,
  onResetAnswer,
  onContinue,
  explanationData,
}) => {
  const dispatch = useDispatch();
  const [showExplanation, setShowExplanation] = useState(false);

  // Determine if this is the last block in the lesson
  const sortedBlocks = currentLesson?.content_blocks
    ? [...currentLesson.content_blocks].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    )
    : [];

  // Find the current problem block
  const problemBlockIndex = sortedBlocks.findIndex(
    (block) => block.block_type === "problem"
  );

  // Check if this is the last block in the lesson
  const isLastQuestion = problemBlockIndex === sortedBlocks.length - 1;

  const handleWhyClick = () => {
    dispatch(revealAnswer());
    setShowExplanation(true);
  };

  const handleContinueClick = () => {
    dispatch(resetAnswerState());
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <>
      <ExplanationModal
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        content={{
          explanation: explanationData?.explanation || "",
          image: explanationData?.image || "",
        }}
      />

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center p-2 sm:p-4"
      >
        <div
          className={cn(
            "w-full max-w-2xl p-4 sm:p-6 rounded-2xl shadow-xl border",
            isCorrect
              ? "bg-[#D7FFB8] border-[#58CC02]"
              : "bg-red-50 border-red-200"
          )}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  isCorrect ? "bg-[#58CC02]" : "bg-red-500"
                )}
              >
                {isCorrect ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <X className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm sm:text-base">
                  {isCorrect ? "Jawaab Sax ah!" : "Jawaab Khalad ah"}
                </p>
                <p className="text-xs sm:text-sm">
                  {isCorrect
                    ? "waxaad ku guulaysatay 15 XP"
                    : "akhri sharaxaada oo ku celi markale"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <Button
                size="sm"
                variant={isCorrect ? "default" : "secondary"}
                onClick={isCorrect ? handleContinueClick : onResetAnswer}
                className="rounded-full gap-1 flex-1 sm:flex-none"
              >
                {isCorrect
                  ? (isLastQuestion ? "Casharka xiga" : "Sii wado")
                  : "Isku day markale"}
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleWhyClick}
                className="rounded-full border-gray-300 flex-1 sm:flex-none"
              >
                Sharaxaad
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AnswerFeedback;
