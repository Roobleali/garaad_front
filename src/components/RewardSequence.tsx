"use client";

import { useState } from "react";
import StreakCelebration from "./StreakCelebration";
import LeaderboardLeague from "./LeaderboardLeague";
import Certificate from "./ShareLesson";
import { ArrowLeft } from "lucide-react";

interface DailyActivity {
    date: string;
    day: string;
    status: "complete" | "none";
    problems_solved: number;
    lesson_ids: number[];
    isToday: boolean;
}

interface StreakData {
    userId: string;
    username: string;
    current_streak: number;
    max_streak: number;
    lessons_completed: number;
    problems_to_next_streak: number;
    energy: {
        current: number;
        max: number;
        next_update: string;
    };
    dailyActivity: DailyActivity[];
    xp: number;
    daily_xp: number;
}
interface User {
    id: number;
    name: string;
}

interface Standing {
    rank: number;
    user: User;
    points: number;
    streak: number;
}

interface LeaderboardData {
    time_period: string;
    league: string;
    standings: Standing[];
    my_standing: {
        rank: number;
        points: number;
        streak: number;
    };
}

type RewardProps = {
    streak: StreakData;
    leaderboard: LeaderboardData;
    completedLesson: string;
    courseTitle?: string;
    isCourseComplete?: boolean;
    onContinue: () => void;
    onBack?: () => void;
};

const RewardSequence = ({
    streak,
    leaderboard,
    completedLesson,
    courseTitle,
    isCourseComplete = false,
    onContinue,
    onBack,
}: RewardProps) => {
    const [step, setStep] = useState(0);

    // Define sections dynamically based on course completion
    const activeSections = [
        "streak",
        "leaderboard",
        ...(isCourseComplete ? ["certificate"] : [])
    ] as const;

    const current = activeSections[step];

    const handleContinue = () => {
        if (step < activeSections.length - 1) {
            setStep((prev) => prev + 1);
        } else {
            onContinue();
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 gap-5 bg-background relative">
            {/* Back Button */}
            <button
                onClick={onBack || onContinue}
                className="absolute top-8 left-8 p-3 rounded-2xl bg-white dark:bg-[#1E1F22] border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all z-50 shadow-sm"
                aria-label="Back"
            >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {current === "streak" && (
                <StreakCelebration userData={streak} onContinue={handleContinue} />
            )}

            {current === "leaderboard" && (
                <LeaderboardLeague
                    data={leaderboard}
                    xp={streak.xp}
                    onContinue={handleContinue}
                />
            )}

            {current === "certificate" && (
                <Certificate
                    lessonTitle={courseTitle || completedLesson}
                    isCourse={isCourseComplete}
                    onContinue={onContinue}
                />
            )}
        </div>
    );
};

export default RewardSequence;
