"use client";
import type React from "react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import type { RootState, AppDispatch } from "@/store";
import { fetchLesson, resetAnswerState } from "@/store/features/learningSlice";
import { Button } from "@/components/ui/button";
import { ChevronRight, ReplaceIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { ExplanationText, TextContent } from "@/types/learning";
import LessonHeader from "@/components/LessonHeader";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import type {
  LeaderboardEntry,
  UserRank,
  UserReward,
} from "@/services/progress";
import AuthService from "@/services/auth";
import type { Course } from "@/types/lms";
import RewardComponent from "@/components/RewardComponent";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import ShareLesson from "@/components/ShareLesson";
import {
  useCourseProgress,
  useLeaderboard,
  useRewards,
  useUserRank,
} from "@/hooks/useCompletedLessonFetch";
import "katex/dist/katex.min.css";
import ProblemBlock from "@/components/lesson/ProblemBlock";
import TextBlock from "@/components/lesson/TextBlock";
import ImageBlock from "@/components/lesson/ImageBlock";
import VideoBlock from "@/components/lesson/VideoBlock";
import CalculatorProblemBlock from "@/components/lesson/CalculatorProblemBlock";
import { useSoundManager } from "@/hooks/use-sound-effects";
import { useToast } from "@/hooks/use-toast";

type Position = "left" | "center" | "right";
type Orientation = "vertical" | "horizontal" | "none";

interface DiagramObject {
  type: string;
  color: string;
  number: number;
  position: Position;
  orientation: Orientation;
  weight_value?: number;
}

interface DiagramConfig {
  diagram_id: number;
  diagram_type: string;
  scale_weight: number;
  objects: DiagramObject[];
}

interface ProblemData {
  id: number;
  question_text: string;
  which: string;
  options: { text: string }[];
  correct_answer: { text: string }[];
  explanation?: string;
  diagram_config?: DiagramConfig;
  question_type: string;
  img?: string;
  alt?: string;
  content: {
    format?: string;
    type?: string;
  };
}

export interface ProblemContent {
  id: number;
  question: string;
  which: string;
  options: string[];
  correct_answer: { id: string; text: string }[];
  explanation?: string;
  diagram_config?: DiagramConfig;
  question_type?:
    | "code"
    | "mcq"
    | "short_input"
    | "diagram"
    | "multiple_choice";
  img?: string;
  alt?: string;
  content: {
    format?: string;
    type?: string;
  };
}

interface ProblemOptions {
  view?: {
    type: string;
    config: Record<string, unknown>;
  };
}

// SWR fetchers
const publicFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  return response.json();
};

const authFetcher = async (
  url: string,
  method: "get" | "post" = "get",
  body?: Record<string, unknown>
) => {
  const service = AuthService.getInstance();
  return service.makeAuthenticatedRequest(method, url, body);
};

// Memoized loading component
const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

// Memoized error component
const ErrorCard = ({
  coursePath,
  onRetry,
}: {
  coursePath: string;
  onRetry: () => void;
}) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <Card className="max-w-md w-full">
      <CardContent className="p-6 text-center">
        <div className="text-gray-600 space-y-4">
          <h2 className="text-xl font-semibold">No Lesson Found</h2>
          <p>The requested lesson could not be found or loaded.</p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <Button asChild>
              <a href={coursePath}>Kulaabo Bogga Casharka</a>
            </Button>
            <Button className="gap-2" onClick={onRetry}>
              <ReplaceIcon /> Isku day
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const LessonPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { answerState, currentLesson } = useSelector(
    (state: RootState) => state.learning
  );
  const isLoading = useSelector((state: RootState) => state.learning.isLoading);

  // Local state
  const [courseId, setCourseId] = useState("");
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [problemLoading, setProblemLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [explanationData, setExplanationData] = useState<{
    explanation: string | ExplanationText;
    image: string;
    type: string;
  }>({
    explanation: "",
    image: "",
    type: "",
  });
  const [navigating, setNavigating] = useState(false);
  const [problems, setProblems] = useState<ProblemContent[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentBlock, setCurrentBlock] = useState<React.ReactNode>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

  const { playSound } = useSoundManager();
  const continueRef = useRef<() => void>(() => {});

  // SWR hooks for data fetching with caching
  const { data: courses } = useSWR<Course[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/`,
    publicFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  const {
    data: rewards,
    mutate: mutateRewards,
    isLoading: isLoadingRewards,
  } = useRewards(currentLesson?.id) as {
    data: UserReward[];
    mutate: () => void;
    isLoading: boolean;
  };

  const { data: leaderboard, mutate: mutateLeaderboard } = useLeaderboard() as {
    data: LeaderboardEntry[];
    mutate: () => void;
  };

  const { data: userRank, mutate: mutateUserRank } = useUserRank() as {
    data: Partial<UserRank>;
    mutate: () => void;
  };

  const { mutate: mutateCourseProgress } = useCourseProgress(courseId);

  // Memoized derived values
  const currentProblem = useMemo(() => {
    return problems.length > 0 && currentProblemIndex < problems.length
      ? problems[currentProblemIndex]
      : null;
  }, [problems, currentProblemIndex]);

  const coursePath = useMemo(
    () => `/courses/${params.categoryId}/${params.courseSlug}`,
    [params]
  );

  const sortedBlocks = useMemo(() => {
    if (!currentLesson?.content_blocks) return [];
    return [...currentLesson.content_blocks]
      .filter((b) => !(b.block_type === "problem" && !b.problem))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [currentLesson?.content_blocks]);

  // Memoized course ID lookup
  const courseIdFromSlug = useMemo(() => {
    if (!courses || !params.courseSlug) return null;
    const course = courses.find(
      (course: Course) => course.slug === params.courseSlug
    );
    return course?.id || null;
  }, [courses, params.courseSlug]);

  // Update courseId when found
  useEffect(() => {
    if (courseIdFromSlug) {
      setCourseId(String(courseIdFromSlug));
    }
  }, [courseIdFromSlug]);

  // Reset state when block changes
  useEffect(() => {
    setSelectedOption(null);
    setDisabledOptions([]);
  }, [currentBlockIndex]);

  // Fetch lesson data
  useEffect(() => {
    if (params.lessonId) {
      dispatch(fetchLesson(params.lessonId as string));
    }
  }, [dispatch, params.lessonId]);

  // Memoized problem fetching function
  const fetchAllProblems = useCallback(async () => {
    if (!currentLesson?.content_blocks) {
      setProblems([]);
      return;
    }

    const problemBlocks = sortedBlocks.filter(
      (b) => b.block_type === "problem" && b.problem !== null
    );

    if (problemBlocks.length === 0) {
      setProblems([]);
      setProblemLoading(false);
      return;
    }

    setProblemLoading(true);

    try {
      // Parallel fetching for better performance
      const fetches = problemBlocks.map((block) =>
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lms/problems/${block.problem}/`
        )
      );
      const responses = await Promise.all(fetches);

      // Check for errors
      responses.forEach((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch problem: ${res.statusText}`);
        }
      });

      // Parse JSON bodies in parallel
      const datas = await Promise.all(
        responses.map((r) => r.json() as Promise<ProblemData>)
      );

      // Transform data
      const transformed: ProblemContent[] = datas.map((pd: ProblemData) => ({
        id: pd.id,
        question: pd.question_text,
        which: pd.which,
        options: Array.isArray(pd.options)
          ? pd.options.map((opt) => opt.text)
          : pd?.options,
        correct_answer: pd.correct_answer.map((ans, index) => ({
          id: `answer-${index}`,
          text: ans.text,
        })),
        img: pd.img,
        alt: pd.alt,
        explanation: pd.explanation || "No explanation available",
        diagram_config: pd.diagram_config,
        question_type: ["code", "mcq", "short_input", "diagram"].includes(
          pd.question_type
        )
          ? (pd.question_type as "code" | "mcq" | "short_input" | "diagram")
          : undefined,
        content: pd.content,
        type: pd.content.type,
      }));

      setProblems(transformed);

      // Set initial explanation data
      if (transformed.length > 0) {
        setExplanationData({
          explanation: transformed[0].explanation || "",
          image: "",
          type: transformed[0].content.type || "",
        });
      }

      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching problems:", err);
      setError(
        (err instanceof Error ? err.message : String(err)) ||
          "Failed to load problems"
      );
    } finally {
      setProblemLoading(false);
    }
  }, [currentLesson, sortedBlocks]);

  // Fetch problems when lesson changes
  useEffect(() => {
    fetchAllProblems();
  }, [fetchAllProblems]);

  // Memoized progress management
  useEffect(() => {
    if (currentLesson?.id) {
      const storageKey = `lesson_progress_${currentLesson.id}`;
      const savedProgress = localStorage.getItem(storageKey);

      if (savedProgress) {
        try {
          const { blockIndex } = JSON.parse(savedProgress);
          if (
            blockIndex >= 0 &&
            sortedBlocks &&
            blockIndex < sortedBlocks.length
          ) {
            setCurrentBlockIndex(blockIndex);
          }
        } catch (e) {
          console.error("Error parsing saved lesson progress:", e);
        }
      }
    }
  }, [currentLesson?.id, sortedBlocks]);

  // Save progress
  useEffect(() => {
    if (currentLesson?.id && currentBlockIndex >= 0) {
      const storageKey = `lesson_progress_${currentLesson.id}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          blockIndex: currentBlockIndex,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }, [currentLesson?.id, currentBlockIndex]);

  // Update explanation data when current problem changes
  useEffect(() => {
    if (currentProblem) {
      setExplanationData({
        explanation: currentProblem.explanation || "",
        image: "",
        type: currentProblem.content.type || "",
      });
    }
  }, [currentProblem]);

  // Memoized event handlers
  const handleOptionSelect = useCallback(
    (option: string) => {
      setShowFeedback(false);
      dispatch(resetAnswerState());
      setSelectedOption(String(option));
      playSound("click");
    },
    [dispatch, playSound]
  );

  const handleContinue = useCallback(async () => {
    if (sortedBlocks.length === 0) return;

    const lastIndex = sortedBlocks.length - 1;
    const isLastBlock = currentBlockIndex === lastIndex;

    playSound("continue");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowFeedback(false);

    if (!isLastBlock) {
      setCurrentBlockIndex((i) => Math.min(i + 1, lastIndex));
      return;
    }

    // Handle completion
    setIsLessonCompleted(true);

    if (currentLesson?.id) {
      try {
        const done = JSON.parse(
          localStorage.getItem("completedLessons") || "[]"
        );
        if (!done.includes(currentLesson.id)) {
          done.push(currentLesson.id);
          localStorage.setItem("completedLessons", JSON.stringify(done));
        }
      } catch (err) {
        console.error("LocalStorage error", err);
      }

      try {
        await authFetcher(
          `/api/lms/lessons/${currentLesson.id}/complete/`,
          "post",
          {
            score: isCorrect ? 100 : 0,
          }
        );

        // Revalidate all SWR hooks in parallel
        await Promise.all([
          mutateCourseProgress(),
          mutateRewards(),
          mutateLeaderboard(),
          mutateUserRank(),
        ]);
      } catch (err) {
        console.error("Completion error", err);
        toast({
          title: "Error",
          description: "Khalad ayaa dhacay markii la jawaabayo su'aasha",
          variant: "destructive",
        });
      }
    }
  }, [
    currentBlockIndex,
    currentLesson,
    isCorrect,
    playSound,
    mutateRewards,
    mutateLeaderboard,
    mutateUserRank,
    mutateCourseProgress,
    toast,
    sortedBlocks,
  ]);

  // Update the ref when handleContinue changes
  useEffect(() => {
    continueRef.current = handleContinue;
  }, [handleContinue]);

  const handleCheckAnswer = useCallback(() => {
    if (!selectedOption || !currentProblem) return;

    const correctAnswer = currentProblem.correct_answer?.map((ans) => ans.text);
    const isCorrect = correctAnswer?.includes(selectedOption) || false;

    setIsCorrect(isCorrect);
    setShowFeedback(true);
    playSound(isCorrect ? "correct" : "incorrect");

    if (!isCorrect) {
      setDisabledOptions((prev) => [...prev, selectedOption]);
      setSelectedOption(null);
    }
  }, [selectedOption, currentProblem, playSound]);

  const handleContinueAfterCompletion = useCallback(() => {
    setShowLeaderboard(false);
    setIsLessonCompleted(false);
    setNavigating(true);
    router.push(coursePath);
  }, [router, coursePath]);

  const handleShowLeaderboard = useCallback(() => {
    setShowLeaderboard(true);
  }, []);

  const handleResetAnswer = useCallback(() => {
    dispatch(resetAnswerState());
    setShowFeedback(false);
    setSelectedOption(null);
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    router.refresh();
  }, [router]);

  // Memoized block rendering
  const renderCurrentBlock = useCallback(() => {
    if (!sortedBlocks || sortedBlocks.length === 0) return null;

    const block = sortedBlocks[currentBlockIndex];
    if (!block) return null;

    const isLastBlock = currentBlockIndex === sortedBlocks.length - 1;

    switch (block.block_type) {
      case "problem":
        const problemId = block.problem;
        const problemIndex = problems.findIndex((p) => p.id === problemId);

        if (problemIndex !== -1) {
          const currentProblem = problems[problemIndex];

          if (
            currentProblem.content &&
            currentProblem.content.type === "calculator"
          ) {
            const options = currentProblem.options as unknown as ProblemOptions;
            return (
              <CalculatorProblemBlock
                question={currentProblem.question}
                which={currentProblem?.which}
                view={options?.view}
                onContinue={handleContinue}
              />
            );
          }
          setCurrentProblemIndex(problemIndex);
        }

        return (
          <ProblemBlock
            onContinue={handleContinue}
            selectedOption={selectedOption}
            answerState={answerState}
            onOptionSelect={handleOptionSelect}
            onCheckAnswer={handleCheckAnswer}
            isLoading={problemLoading}
            error={error}
            content={currentProblem}
            isCorrect={isCorrect}
            isLastInLesson={isLastBlock}
            disabledOptions={disabledOptions}
          />
        );

      case "diagram":
        const diagramProblemId = block.problem;
        const diagramProblemIndex = problems.findIndex(
          (p) => p.id === diagramProblemId
        );

        if (diagramProblemIndex !== -1) {
          setCurrentProblemIndex(diagramProblemIndex);
        }

        return (
          <ProblemBlock
            onContinue={handleContinue}
            selectedOption={selectedOption}
            answerState={answerState}
            onOptionSelect={handleOptionSelect}
            onCheckAnswer={handleCheckAnswer}
            isLoading={problemLoading}
            error={error}
            content={currentProblem}
            isCorrect={isCorrect}
            isLastInLesson={isLastBlock}
            disabledOptions={disabledOptions}
          />
        );

      case "text":
        const textContent =
          typeof block.content === "string"
            ? (JSON.parse(block.content) as TextContent)
            : (block.content as TextContent);

        return (
          <TextBlock
            content={textContent}
            onContinue={handleContinue}
            isLastBlock={isLastBlock}
          />
        );

      case "image":
        const imageContent =
          typeof block.content === "string"
            ? JSON.parse(block.content)
            : block.content;

        return (
          <ImageBlock
            content={imageContent}
            onContinue={handleContinue}
            isLastBlock={isLastBlock}
          />
        );

      case "video":
        const videoContent =
          typeof block.content === "string"
            ? JSON.parse(block.content)
            : block.content;

        return (
          <VideoBlock
            content={videoContent}
            onContinue={handleContinue}
            isLastBlock={isLastBlock}
          />
        );

      default:
        return (
          <div className="max-w-2xl mx-auto px-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  This content type is not supported.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={handleContinue}>
                  Sii wado
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
    }
  }, [
    sortedBlocks,
    currentBlockIndex,
    problems,
    handleContinue,
    selectedOption,
    answerState,
    handleOptionSelect,
    handleCheckAnswer,
    problemLoading,
    error,
    currentProblem,
    isCorrect,
    disabledOptions,
  ]);

  // Update current block when dependencies change
  useEffect(() => {
    setCurrentBlock(renderCurrentBlock());
  }, [renderCurrentBlock]);

  // Memoized total questions count
  const totalQuestions = useMemo(() => {
    return sortedBlocks.length;
  }, [sortedBlocks]);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Soo-dejinaya casharada...." />;
  }

  // No lesson found
  if (!currentLesson) {
    return <ErrorCard coursePath={coursePath} onRetry={handleRetry} />;
  }

  // Render the page
  return (
    <div className="min-h-screen bg-white">
      {navigating ? (
        <LoadingSpinner message="Soo dajinaya bogga casharada..." />
      ) : isLessonCompleted && showLeaderboard ? (
        <Leaderboard
          onContinue={handleContinueAfterCompletion}
          leaderboard={leaderboard || []}
          userRank={userRank}
        />
      ) : isLessonCompleted ? (
        <div>
          {isLoadingRewards ? (
            <LoadingSpinner message="soo dajinaya abaalmarinada..." />
          ) : rewards.length === 0 && !isLoadingRewards ? (
            <ShareLesson lessonTitle={currentLesson?.title || "Cashar"} />
          ) : (
            <RewardComponent
              onContinue={handleShowLeaderboard}
              rewards={rewards.map((reward) => ({
                id: reward.id,
                user: reward.user,
                reward_type: reward.reward_type,
                reward_name: reward.reward_name,
                value: reward.value,
                awarded_at: reward.awarded_at,
              }))}
            />
          )}
        </div>
      ) : (
        <div>
          <LessonHeader
            currentQuestion={currentBlockIndex + 1}
            totalQuestions={totalQuestions}
            coursePath={coursePath}
          />

          <main className="pt-20 pb-32 mt-4">
            <div className="container mx-auto">{currentBlock}</div>
          </main>

          {showFeedback && (
            <AnswerFeedback
              isCorrect={isCorrect}
              currentLesson={currentLesson}
              onResetAnswer={handleResetAnswer}
              onContinue={handleContinue}
              explanationData={explanationData}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LessonPage;
