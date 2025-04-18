import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { resetAnswerState, revealAnswer } from '@/store/features/learningSlice';
import { LessonContentBlock, ProblemContent } from '@/types/learning';
import ExplanationModal from './ExplanationModal';

const SuccessIcon = () => (
    <div className="w-8 h-8">
        <svg viewBox="0 0 48 48" className="text-[#58CC02]" fill="currentColor">
            <path d="M14 24a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H16a2 2 0 01-2-2V24z" />
            <path d="M21 23a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M24 9c-4.902 0-7.071 1.434-7.071 1.434l-.129.066C14.408 11.652 13 14.118 13 17v19a2 2 0 002 2h18a2 2 0 002-2V17c0-2.882-1.408-5.348-3.8-6.5l-.129-.066S28.902 9 24 9zM15 24a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1H16a1 1 0 01-1-1V24z" />
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
                                        <span className="font-bold text-[#58CC02]">Waa sax!</span>
                                        <span className="text-[#58CC02] font-bold">+15 XP</span>
                                    </>
                                ) : (
                                    <span className="font-medium">Ma ahan. Isku day mar kale.</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {answerState.isCorrect && (
                                <button
                                    onClick={handleWhyClick}
                                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white/80 text-[#1C1B1F] hover:bg-white transition-colors border border-[#1C1B1F]/10"
                                >
                                    Maxay?
                                </button>
                            )}
                            <button
                                onClick={() => dispatch(resetAnswerState())}
                                className={`
                                    px-6 py-2.5 rounded-xl text-sm font-bold transition-colors
                                    ${answerState.isCorrect
                                        ? 'bg-[#58CC02] text-white hover:bg-[#58CC02]/90'
                                        : 'bg-[#1C1B1F] text-white hover:bg-black/90'}
                                `}
                            >
                                {answerState.isCorrect ? 'Sii wad' : 'Isku day mar kale'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnswerFeedback; 