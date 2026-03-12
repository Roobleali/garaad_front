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
                        className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none"
                        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                    >
                        <div
                            className={cn(
                                "pointer-events-auto w-full max-h-[min(200px,40vh)] overflow-y-auto overflow-x-hidden min-h-0 p-4 sm:p-5 rounded-t-2xl sm:rounded-t-[2rem] shadow-[0_-8px_30px_rgba(0,0,0,0.2)] border-t animate-in slide-in-from-bottom-6 duration-300 ease-out",
                                isCorrect
                                    ? "bg-emerald-900/95 sm:bg-white/95 sm:dark:bg-zinc-900/95 border-emerald-500 backdrop-blur-xl"
                                    : "bg-red-950/95 sm:bg-white/95 sm:dark:bg-zinc-900/95 border-red-500 sm:border-slate-200 sm:dark:border-white/10 backdrop-blur-xl"
                            )}
                        >
                            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4">
                                {/* Icon + Text + XP */}
                                <div className="flex items-center gap-3 text-left flex-1 min-w-0">
                                    <div
                                        className={cn(
                                            "w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-sm",
                                            isCorrect
                                                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                                : "bg-red-500 text-white shadow-red-500/20"
                                        )}
                                    >
                                        {isCorrect ? (
                                            <Check className="h-5 w-5 sm:h-7 sm:w-7 stroke-[3.5]" />
                                        ) : (
                                            <X className="h-5 w-5 sm:h-7 sm:w-7 stroke-[3.5]" />
                                        )}
                                    </div>
                                    <div className="space-y-0.5 flex-1 min-w-0">
                                        <div className="flex items-center flex-wrap gap-2">
                                            <h3 className={cn(
                                                "text-base sm:text-xl font-black tracking-tight truncate",
                                                isCorrect ? "text-emerald-100 sm:text-emerald-600 dark:sm:text-emerald-400" : "text-red-100 sm:text-slate-600 dark:sm:text-slate-400"
                                            )}>
                                                {title}
                                            </h3>
                                            {isCorrect && (
                                                <div className="py-0.5 px-2.5 font-black text-[10px] rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 sm:text-emerald-600 dark:sm:text-emerald-400 flex items-center gap-1 shrink-0">
                                                    <Award size={12} />
                                                    <span className="tracking-widest uppercase">+{xp}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-slate-300 sm:text-slate-500 dark:sm:text-slate-400 font-bold text-xs sm:text-sm leading-tight line-clamp-2">
                                            {message}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions: correct = full-width CTA; wrong = Sharaxaad + pill "Isku day markale" */}
                                <div className="flex flex-row flex-wrap items-center justify-end gap-2 sm:gap-3 w-full md:w-auto shrink-0">
                                    {isCorrect ? (
                                        <Button
                                            size="lg"
                                            onClick={buttonAction}
                                            className="w-full min-h-[44px] h-11 px-6 rounded-xl gap-2 text-white font-black text-base sm:text-lg transition-all active:scale-[0.96] shadow-xl bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30"
                                        >
                                            {buttonText}
                                            <ChevronRight className="h-5 w-5 stroke-[3]" />
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleWhyClick}
                                                className="min-h-[44px] h-11 rounded-xl font-black px-4 text-sm transition-colors text-red-100 sm:text-slate-600 dark:sm:text-slate-400 hover:bg-red-500/20 sm:hover:bg-slate-500/10"
                                            >
                                                <Info className="mr-2 h-4 w-4 stroke-[2.5]" />
                                                Sharaxaad
                                            </Button>
                                            <Button
                                                size="lg"
                                                onClick={buttonAction}
                                                className="min-h-[44px] h-11 rounded-full px-6 font-black text-sm sm:text-base text-white transition-all active:scale-[0.96] shadow-xl bg-red-600 hover:bg-red-500 shadow-red-500/30 w-auto"
                                            >
                                                {buttonText}
                                            </Button>
                                        </>
                                    )}

                                    <Suspense fallback={null}>
                                        <div className="hidden lg:block">
                                            <BugReportButton setIsReportingBug={setIsReportingBug} />
                                        </div>
                                    </Suspense>
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
