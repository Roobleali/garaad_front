"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { fetchLesson, submitAnswer, resetAnswerState } from '@/store/features/learningSlice';
import AnswerFeedback from '@/components/AnswerFeedback';
import LessonHeader from '@/components/LessonHeader';
import type { LessonContentBlock, ProblemContent, TextContent } from '@/types/learning';
import { Button } from '@/components/ui/button';
import { ChevronRight, Scale, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ScaleBalanceProblem {
    equation: string;
    steps: string[];
}

interface ScaleBalanceContent {
    type: 'scale_balance';
    problems: ScaleBalanceProblem[];
    instructions: string;
}

const ScaleBalanceInteractive: React.FC<{
    content: ScaleBalanceContent;
    onComplete: () => void;
}> = ({ content, onComplete }) => {
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [showSolution, setShowSolution] = useState(false);

    const currentProblem = content.problems[currentProblemIndex];

    const handleNextProblem = () => {
        if (currentProblemIndex < content.problems.length - 1) {
            setCurrentProblemIndex(prev => prev + 1);
            setCurrentStepIndex(-1);
            setShowSolution(false);
        } else {
            onComplete();
        }
    };

    const handleShowNextStep = () => {
        if (currentStepIndex < currentProblem.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            setShowSolution(true);
        }
    };

    return (
        <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold">Scale Balance Exercise</h3>
                <p className="text-lg">{content.instructions}</p>
            </div>

            <div className="p-6 border rounded-lg bg-gray-50">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            Problem {currentProblemIndex + 1} of {content.problems.length}
                        </span>
                        <Scale className="h-6 w-6 text-primary" />
                    </div>

                    <div className="text-2xl font-semibold text-center py-4">
                        {currentProblem.equation}
                    </div>

                    <div className="space-y-3">
                        {currentStepIndex >= 0 && (
                            <div className="space-y-2">
                                <p className="font-medium">Steps:</p>
                                {currentProblem.steps.slice(0, currentStepIndex + 1).map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <MinusCircle className="h-4 w-4 text-primary" />
                                        {step}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {showSolution && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <p className="text-green-700 font-medium">Solution Complete!</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    {!showSolution && (
                        <Button
                            onClick={handleShowNextStep}
                            className="flex-1"
                        >
                            {currentStepIndex === -1 ? 'Start Solving' : 'Next Step'}
                        </Button>
                    )}
                    {showSolution && (
                        <Button
                            onClick={handleNextProblem}
                            className="flex-1"
                        >
                            {currentProblemIndex < content.problems.length - 1 ? 'Next Problem' : 'Complete Lesson'}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const LessonPage = () => {
    const params = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const currentLesson = useSelector((state: RootState) => state.learning.currentLesson);
    const answerState = useSelector((state: RootState) => state.learning.answerState);
    const isLoading = useSelector((state: RootState) => state.learning.isLoading);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentBlock, setCurrentBlock] = useState<React.ReactNode>(null);
    const [forceUpdate, setForceUpdate] = useState(0);

    // Create refs for audio elements
    const audioRefs = React.useRef<{ [key: string]: HTMLAudioElement | null }>({});

    // Initialize audio elements
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRefs.current = {
                click: new Audio('/sounds/toggle-on.mp3'),
                correct: new Audio('/sounds/correct.mp3'),
                incorrect: new Audio('/sounds/incorrect.mp3'),
                continue: new Audio('/sounds/lightweight-choice.mp3')
            };

            // Preload all sounds
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.preload = 'auto';
                    // Try to load the audio
                    audio.load();
                }
            });
        }

        // Cleanup function
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        };
    }, []);

    const playSound = async (soundName: 'click' | 'correct' | 'incorrect' | 'continue') => {
        const audio = audioRefs.current[soundName];
        if (audio) {
            try {
                audio.currentTime = 0;
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    await playPromise;
                }
            } catch (error) {
                console.error(`Error playing ${soundName} sound:`, error);
            }
        }
    };

    // Debug state changes
    useEffect(() => {
        console.log('State updated:', {
            selectedOption,
            answerState,
            currentBlockIndex,
            currentBlock,
            forceUpdate
        });
    }, [selectedOption, answerState, currentBlockIndex, currentBlock, forceUpdate]);

    // Reset state when block changes
    useEffect(() => {
        setSelectedOption(null);
        setShowExplanation(false);
    }, [currentBlockIndex]);

    const handleOptionSelect = (option: string) => {
        console.log('Selecting option:', option);
        // Reset answer state when selecting a new option
        dispatch(resetAnswerState());
        // Set the selected option
        setSelectedOption(String(option));
        // Force a re-render
        setForceUpdate(prev => prev + 1);
        // Play sound
        playSound('click');
    };

    const handleCheckAnswer = async () => {
        console.log('Checking answer, selectedOption:', selectedOption);
        if (selectedOption === null || selectedOption === '') {
            console.log('No option selected');
            return;
        }

        try {
            const result = await dispatch(submitAnswer({
                lessonId: params.lessonId as string,
                answer: selectedOption
            })).unwrap();

            console.log('Submit result:', result);

            // Play sound based on result
            if (result.correct) {
                playSound('correct');
            } else {
                playSound('incorrect');
            }
        } catch (error) {
            console.error('Error checking answer:', error);
        }
    };

    const handleContinue = () => {
        console.log('Continuing to next block');
        const contentBlocks = currentLesson?.content_blocks || [];
        if (contentBlocks.length > 0) {
            playSound('continue');
            setCurrentBlockIndex(prev => Math.min(prev + 1, contentBlocks.length - 1));
            setSelectedOption(null);
            setShowExplanation(false);
        }
    };

    useEffect(() => {
        if (params.lessonId) {
            dispatch(fetchLesson(params.lessonId as string));
        }
    }, [dispatch, params.lessonId]);

    useEffect(() => {
        const loadBlock = async () => {
            console.log('Loading block:', currentBlockIndex);
            if (currentLesson?.content_blocks && currentLesson.content_blocks.length > 0) {
                const sortedBlocks = [...currentLesson.content_blocks].sort((a, b) =>
                    (a.order || 0) - (b.order || 0)
                );
                const block = sortedBlocks[currentBlockIndex];
                if (block) {
                    console.log('Current block:', block);
                    const renderedBlock = await renderBlock(block);
                    setCurrentBlock(renderedBlock);
                }
            }
        };

        loadBlock();
    }, [currentLesson, currentBlockIndex]);

    const renderContinueButton = (isLastBlock: boolean) => (
        <Button
            onClick={handleContinue}
            className="px-8 py-6 text-lg rounded-full"
        >
            {isLastBlock ? 'Finish' : 'Continue'}
            <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
    );

    const renderOptions = (options: string[]) => {
        console.log('Rendering options with selectedOption:', selectedOption);
        return options.map((option, index) => {
            const isSelected = selectedOption === String(option);
            const isCorrect = answerState.lastAttempt === String(option) && answerState.isCorrect;
            const isIncorrect = answerState.lastAttempt === String(option) && !answerState.isCorrect;

            console.log('Option rendering state:', {
                option,
                isSelected,
                selectedOption,
                isCorrect,
                isIncorrect
            });

            return (
                <button
                    key={`option-${index}-${option}`}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    disabled={!!answerState.lastAttempt}
                    className={cn(
                        "p-6 rounded-lg border-2 transition-all w-full text-center text-xl relative",
                        "hover:border-[#58CC02] hover:bg-[#E5F7D4]/50",
                        "focus:outline-none focus:ring-2 focus:ring-[#58CC02] focus:ring-offset-2",
                        isSelected && !answerState.lastAttempt && "border-[#58CC02] bg-[#E5F7D4]",
                        !isSelected && !answerState.lastAttempt && "border-gray-200",
                        isCorrect && "border-[#58CC02] bg-[#D7FFB8] text-[#58CC02]",
                        isIncorrect && "border-red-500 bg-red-50 text-red-700"
                    )}
                >
                    <span className="block">{option}</span>
                    {isSelected && !answerState.lastAttempt && (
                        <div className="absolute inset-0 border-2 border-[#58CC02] rounded-lg pointer-events-none" />
                    )}
                </button>
            );
        });
    };

    const renderBlock = async (block: LessonContentBlock) => {
        console.log('Rendering block:', block);
        const sortedBlocks = [...(currentLesson?.content_blocks || [])].sort((a, b) =>
            (a.order || 0) - (b.order || 0)
        );
        const isLastBlock = currentBlockIndex === sortedBlocks.length - 1;

        switch (block.block_type) {
            case 'problem': {
                let content: ProblemContent;
                try {
                    const problemId = block.problem;
                    if (!problemId) {
                        console.error('No problem ID found in block:', block);
                        return (
                            <div className="p-4 border rounded-lg text-center">
                                <p className="text-muted-foreground">Problem ID not found</p>
                            </div>
                        );
                    }

                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lms/problems/${problemId}/`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch problem: ${response.statusText}`);
                    }
                    const problemData = await response.json();

                    console.log('Problem data from API:', problemData);

                    content = {
                        question: problemData.question_text,
                        options: problemData.options.map((opt: { id: string; text: string }) => {
                            console.log('Processing option:', opt);
                            return opt.text;
                        }),
                        correct_answer: problemData.correct_answer[0]?.text || '',
                        explanation: problemData.explanation || "No explanation available"
                    };

                    console.log('Transformed content:', content);

                    if (!content || !content.options || !Array.isArray(content.options)) {
                        console.error('Invalid problem content structure:', content);
                        return (
                            <div className="p-4 border rounded-lg text-center">
                                <p className="text-muted-foreground">Problem content is not properly formatted</p>
                            </div>
                        );
                    }
                } catch (error) {
                    console.error('Error parsing problem content:', error);
                    return (
                        <div className="p-4 border rounded-lg text-center">
                            <p className="text-muted-foreground">Error loading problem content</p>
                        </div>
                    );
                }

                return (
                    <div className="max-w-2xl mx-auto px-4">
                        <div className="space-y-8">
                            {/* Question and Scale Image */}
                            <div className="max-w-[600px] mx-auto mb-8">
                                {content.image && (
                                    <div className="flex justify-center mb-6">
                                        <img
                                            src={content.image}
                                            alt="Question visualization"
                                            className="w-auto h-[200px] object-contain"
                                        />
                                    </div>
                                )}
                                <h3 className="text-2xl font-semibold text-center mb-8">{content.question}</h3>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-2 gap-4 max-w-[600px] mx-auto">
                                {renderOptions(content.options)}
                            </div>

                            {/* Check Button */}
                            <div className="flex justify-center mt-8">
                                {!answerState.lastAttempt && (
                                    <button
                                        type="button"
                                        onClick={handleCheckAnswer}
                                        disabled={!selectedOption}
                                        className={cn(
                                            "w-full max-w-[240px] py-4 text-xl font-bold rounded-2xl transition-all",
                                            "disabled:opacity-50 disabled:cursor-not-allowed",
                                            selectedOption
                                                ? "bg-[#58CC02] hover:bg-[#58CC02]/90 text-white"
                                                : "bg-[#E5E5E5] text-[#AFAFAF]"
                                        )}
                                    >
                                        Check
                                    </button>
                                )}
                            </div>

                            {/* Debug info */}
                            <pre className="text-sm text-gray-500 text-center mt-4">
                                {JSON.stringify({
                                    selectedOption: selectedOption || 'none',
                                    lastAttempt: answerState.lastAttempt || 'none',
                                    isCorrect: answerState.isCorrect,
                                    showAnswer: answerState.showAnswer,
                                    options: content.options,
                                    forceUpdate
                                }, null, 2)}
                            </pre>

                            {/* Feedback Cards */}
                            {answerState.showAnswer && (
                                <div className="mt-6">
                                    {answerState.isCorrect ? (
                                        <div className="bg-[#D7FFB8] border border-[#58CC02] rounded-2xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6">
                                                    <svg viewBox="0 0 24 24" className="text-[#58CC02]" fill="currentColor">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                    </svg>
                                                </div>
                                                <span className="font-bold text-[#58CC02]">Correct!</span>
                                                <span className="text-[#58CC02] font-bold">+15 XP</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowExplanation(!showExplanation)}
                                                    className="border-[#58CC02] text-[#58CC02] hover:bg-[#D7FFB8]/50"
                                                >
                                                    Why?
                                                </Button>
                                                <Button
                                                    onClick={handleContinue}
                                                    className="bg-[#58CC02] hover:bg-[#58CC02]/90 text-white"
                                                >
                                                    Continue
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#FFF5F5] border border-red-200 rounded-2xl p-4 flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-red-600">That&apos;s incorrect. Try again.</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    className="bg-[#1C1B1F] text-white hover:bg-[#1C1B1F]/90"
                                                    onClick={() => {
                                                        setSelectedOption(null);
                                                        dispatch(resetAnswerState());
                                                    }}
                                                >
                                                    Try again
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowExplanation(!showExplanation)}
                                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    See answer
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Explanation */}
                            {showExplanation && (
                                <div className={cn(
                                    "p-4 rounded-lg mt-4",
                                    answerState.isCorrect ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"
                                )}>
                                    <p className="text-lg">{content.explanation}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }
            case 'text': {
                const textContent = typeof block.content === 'string'
                    ? JSON.parse(block.content) as TextContent
                    : block.content as TextContent;

                return (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
                        <div className="w-full space-y-6">
                            {textContent.text && (
                                <ReactMarkdown>{textContent.text}</ReactMarkdown>
                            )}
                            {textContent.desc && (
                                <div className="text-muted-foreground mt-4">
                                    <ReactMarkdown>{textContent.desc}</ReactMarkdown>
                                </div>
                            )}
                            <div className="flex justify-center">
                                {renderContinueButton(isLastBlock)}
                            </div>
                        </div>
                    </div>
                );
            }
            case 'example': {
                const content = typeof block.content === 'string'
                    ? JSON.parse(block.content)
                    : block.content;

                const title = 'title' in content ? content.title : 'Example';
                const description = 'description' in content ? content.description : '';
                const examples = 'examples' in content && Array.isArray(content.examples) ? content.examples : [];

                return (
                    <div className="space-y-6">
                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-semibold">{title}</h3>
                            <p className="text-lg">{description}</p>
                            <ul className="list-disc pl-6">
                                {examples.map((example: string, index: number) => (
                                    <li key={index} className="text-lg">{example}</li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            onClick={handleContinue}
                            className="w-full sm:w-auto"
                        >
                            Continue
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            }
            case 'image': {
                const imageContent = typeof block.content === 'string'
                    ? JSON.parse(block.content)
                    : block.content;

                if (!imageContent?.url) {
                    return (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
                            <div className="p-4 border rounded-lg text-center">
                                <p className="text-muted-foreground">Image not available</p>
                                <div className="flex justify-center">
                                    {renderContinueButton(isLastBlock)}
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
                        <div className="w-full space-y-6">
                            <figure className="space-y-3">
                                <div className="flex justify-center">
                                    <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ maxWidth: '320px', maxHeight: '320px' }}>
                                        <img
                                            src={imageContent.url}
                                            alt={imageContent.alt || "Lesson content"}
                                            width={imageContent.width}
                                            height={imageContent.height}
                                            className="w-full h-full object-contain"
                                            style={{ aspectRatio: `${imageContent.width} / ${imageContent.height}` }}
                                        />
                                    </div>
                                </div>
                                {imageContent.caption && (
                                    <figcaption className="text-center text-base text-muted-foreground">
                                        {imageContent.caption}
                                    </figcaption>
                                )}
                            </figure>
                            <div className="flex justify-center">
                                {renderContinueButton(isLastBlock)}
                            </div>
                        </div>
                    </div>
                );
            }
            case 'video':
            case 'interactive': {
                const content = typeof block.content === 'string'
                    ? JSON.parse(block.content)
                    : block.content;

                if (content.type === 'scale_balance') {
                    return (
                        <ScaleBalanceInteractive
                            content={content as ScaleBalanceContent}
                            onComplete={handleContinue}
                        />
                    );
                }

                // Fallback for other interactive types
                return (
                    <div className="p-4 border rounded-lg">
                        <p className="text-muted-foreground">
                            This type of interactive content is not supported yet.
                        </p>
                        <Button
                            onClick={handleContinue}
                            className="mt-4 w-full sm:w-auto"
                        >
                            Continue
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            }
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!currentLesson) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-600">No lesson found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-4 mt-8 flex justify-between items-center">
                <LessonHeader
                    currentQuestion={currentBlockIndex + 1}
                    totalQuestions={currentLesson.content_blocks?.length || 0}
                />
            </div>
            <main className="pt-20 pb-32">
                <div>
                    {currentBlock}
                </div>
            </main>
            <AnswerFeedback />
        </div>
    );
};

export default LessonPage;