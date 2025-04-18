import React from "react";
import { ProgressCard } from "@/components/progress/ProgressCard";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { PracticeSetComponent } from "@/components/practice/PracticeSet";
import { progressService } from "@/services/progress";
import { practiceService } from "@/services/practice";

export default async function DashboardPage() {
    // Fetch all required data
    const [progress, rewards, leaderboard, userRank, practiceSets] = await Promise.all([
        progressService.getUserProgress(),
        progressService.getUserRewards(),
        progressService.getLeaderboard(),
        progressService.getUserRank(),
        practiceService.getPracticeSets(),
    ]);

    return (
        <div className="container mx-auto space-y-8 p-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Progress and Rewards */}
            <div className="grid gap-4 md:grid-cols-2">
                <ProgressCard progress={progress} rewards={rewards} />
                <Leaderboard entries={leaderboard} userRank={userRank} />
            </div>

            {/* Practice Sets */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Practice Sets</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {practiceSets.map((practiceSet) => (
                        <PracticeSetComponent
                            key={practiceSet.id}
                            practiceSet={practiceSet}
                            onComplete={async (score) => {
                                console.log(`Practice set completed with score: ${score}%`);
                                // Refresh progress and rewards after completing a practice set
                                await Promise.all([
                                    progressService.getUserProgress(),
                                    progressService.getUserRewards(),
                                ]);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
} 