import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { resetAnswerState, revealAnswer } from '@/store/features/learningSlice';
import { LessonContentBlock, ProblemContent } from '@/types/learning';
import ExplanationModal from './ExplanationModal';

const SuccessIcon = () => (
    <div className="w-6 h-6">
        <svg viewBox="0 0 24 24" className="text-[#58CC02]" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
    </div>
);

const AnswerFeedback = () => {
    const dispatch = useDispatch();
    const answerState = useSelector((state: RootState) => state.learning.answerState);
    const currentLesson = useSelector((state: RootState) => state.learning.currentLesson);
    const [showExplanation, setShowExplanation] = useState(false);

    useEffect(() => {
        if (answerState.isCorrect !== null) {
            const sound = new Audio(
                answerState.isCorrect
                    ? '/sounds/correct.mp3'
                    : '/sounds/incorrect.mp3'
            );
            sound.play().catch(console.error);
        }
    }, [answerState.isCorrect]);

    if (!answerState.lastAttempt) return null;

    const problemBlock = currentLesson?.content_blocks?.find(
        (block: LessonContentBlock) => block.block_type === 'problem'
    );

    const content = problemBlock?.content
        ? (typeof problemBlock.content === 'string'
            ? JSON.parse(problemBlock.content) as ProblemContent
            : problemBlock.content as ProblemContent)
        : null;

    const explanation = content?.explanation || '';
    const explanationImage = content?.image || '';

    const handleWhyClick = () => {
        setShowExplanation(true);
        dispatch(revealAnswer());
    };

    return (
        <>
            <ExplanationModal
                isOpen={showExplanation}
                onClose={() => setShowExplanation(false)}
                explanation={explanation}
                image={explanationImage}
            />

            <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center">
                <div
                    className={`
                        ${answerState.isCorrect ? 'bg-[#D7FFB8]' : 'bg-[#FFF5F5]'}
                        w-full max-w-3xl px-6 py-4 rounded-2xl mx-4 mb-4
                        transform transition-all duration-300 ease-out shadow-lg
                        ${answerState.lastAttempt ? 'translate-y-0' : 'translate-y-full'}
                    `}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {answerState.isCorrect && <SuccessIcon />}
                            <div className="flex items-center gap-2">
                                {answerState.isCorrect ? (
                                    <>
                                        <span className="font-bold text-[#58CC02]">Correct!</span>
                                        <span className="text-[#58CC02] font-bold">+15 XP</span>
                                    </>
                                ) : (
                                    <span className="font-medium text-red-600">That&apos;s incorrect. Try again.</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {answerState.isCorrect ? (
                                <>
                                    <button
                                        onClick={handleWhyClick}
                                        className="px-4 py-2 rounded-xl text-sm font-bold bg-white/80 text-[#1C1B1F] hover:bg-white transition-colors border border-[#1C1B1F]/10"
                                    >
                                        Why?
                                    </button>
                                    <button
                                        onClick={() => dispatch(resetAnswerState())}
                                        className="px-4 py-2 rounded-xl text-sm font-bold bg-[#58CC02] text-white hover:bg-[#58CC02]/90 transition-colors"
                                    >
                                        Continue
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => dispatch(resetAnswerState())}
                                        className="px-4 py-2 rounded-xl text-sm font-bold bg-[#1C1B1F] text-white hover:bg-black/90 transition-colors"
                                    >
                                        Try again
                                    </button>
                                    <button
                                        onClick={handleWhyClick}
                                        className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-[#1C1B1F] hover:bg-gray-50 transition-colors border border-[#1C1B1F]/10"
                                    >
                                        See answer
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnswerFeedback; 