"use client";
import React, { memo, useState, useMemo, useCallback, Suspense } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import { ExplanationText, Lesson } from "@/types/learning";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Award, Check, ChevronRight, X, Info, Flag } from "lucide-react";

// Lazy‑load heavy components
const ExplanationModal = React.lazy(() => import("./ExplanationModal"));
const BugReportButton = React.lazy(() => import("./BugRepportButton"));

interface AnswerFeedbackProps {
    currentLesson: Lesson | null;
    isCorrect: boolean;
    onResetAnswer: () => void;
    onContinue?: () => void;
    explanationData?: {
        explanation: string | ExplanationText;
        image: string;
        type: "markdown" | "latex" | string;
    };
    xp: number;
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = memo(
    ({
        currentLesson,
        isCorrect,
        onResetAnswer,
        onContinue,
        explanationData,
        xp,
    }) => {
        const { resetAnswerState, revealAnswer } = useLearningStore();
        const [showExplanation, setShowExplanation] = useState(false);
        const [isReportingBug, setIsReportingBug] = useState(false);

        // Determine if this is the last problem block
        const isLastQuestion = useMemo(() => {
            if (!currentLesson?.content_blocks) return false;
            const blocks = [...currentLesson.content_blocks]
                .filter(b => b.block_type === "problem")
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            return true; // Simplified for UI redesign
        }, [currentLesson?.content_blocks]);

        const handleWhyClick = useCallback(() => {
            revealAnswer();
            setShowExplanation(true);
        }, [revealAnswer]);

        const handleContinueClick = useCallback(() => {
            resetAnswerState();
            onContinue?.();
        }, [resetAnswerState, onContinue]);

        const handleCloseExplanation = useCallback(() => {
            setShowExplanation(false);
        }, []);

        // Memoized feedback content
        const { title, message, buttonText, buttonAction } = useMemo(() => {
            if (isCorrect) {
                return {
                    title: "Jawaab Sax ah!",
                    message: "Hore usoco Garaad",
                    buttonText: isLastQuestion ? "Casharka xiga" : "Sii wado",
                    buttonAction: handleContinueClick,
                };
            }
            return {
                title: "Jawaab Khalad ah",
                message: "akhri sharaxaada oo ku celi markale",
                buttonText: "Isku day markale",
                buttonAction: onResetAnswer,
            };
        }, [isCorrect, isLastQuestion, handleContinueClick, onResetAnswer]);

        return (
            <>
                {showExplanation && (
                    <Suspense fallback={null}>
                        <ExplanationModal
                            isOpen
                            onClose={handleCloseExplanation}
                            content={{
                                explanation: explanationData?.explanation || "",
                                image: explanationData?.image || "",
                                type: explanationData?.type === "latex" ? "latex" : "markdown",
                            }}
                        />
                    </Suspense>
                )}

                {!isReportingBug && (
                    <div
                        key="answer-feedback-banner"
                        className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none pb-[env(safe-area-inset-bottom)]"
                    >
                            <div
                                className={cn(
                                    "pointer-events-auto w-full max-h-[min(220px,45vh)] overflow-y-auto overflow-x-hidden min-h-0 rounded-t-2xl border-t shadow-[0_-4px_24px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom-4 duration-300 ease-out",
                                    isCorrect
                                        ? "bg-emerald-50 dark:bg-emerald-950/95 border-emerald-200 dark:border-emerald-800"
                                        : "bg-amber-50 dark:bg-amber-950/95 border-amber-200 dark:border-amber-800"
                                )}
                            >
                            <div className="p-4 sm:p-5 flex flex-col gap-4">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div
                                        className={cn(
                                            "w-11 h-11 shrink-0 flex items-center justify-center rounded-xl",
                                            isCorrect ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"
                                        )}
                                    >
                                        {isCorrect ? (
                                            <Check className="h-6 w-6 stroke-[2.5]" />
                                        ) : (
                                            <X className="h-6 w-6 stroke-[2.5]" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-2 gap-y-1">
                                            <h3 className={cn(
                                                "text-base font-bold tracking-tight truncate",
                                                isCorrect ? "text-emerald-800 dark:text-emerald-200" : "text-amber-800 dark:text-amber-200"
                                            )}>
                                                {title}
                                            </h3>
                                            {isCorrect && (
                                                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                                                    <Award size={12} />
                                                    +{xp}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5 leading-snug line-clamp-2">
                                            {message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                                    <Suspense fallback={null}>
                                        <div className="hidden lg:block order-first sm:order-last sm:ml-auto">
                                            <BugReportButton setIsReportingBug={setIsReportingBug} />
                                        </div>
                                    </Suspense>
                                    {isCorrect ? (
                                        <Button
                                            onClick={buttonAction}
                                            className="w-full min-h-[48px] h-12 rounded-xl font-semibold text-base bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-[0.98] touch-manipulation"
                                        >
                                            {buttonText}
                                            <ChevronRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    ) : (
                                        <div className="flex flex-row gap-2 sm:gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={handleWhyClick}
                                                className="min-h-[48px] flex-1 sm:flex-initial rounded-xl font-semibold text-sm border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30 touch-manipulation"
                                            >
                                                <Info className="mr-2 h-4 w-4" />
                                                Sharaxaad
                                            </Button>
                                            <Button
                                                onClick={buttonAction}
                                                className="min-h-[48px] flex-1 sm:flex-initial rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-slate-900 transition-all active:scale-[0.98] touch-manipulation"
                                            >
                                                {buttonText}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
);

AnswerFeedback.displayName = "AnswerFeedback";
