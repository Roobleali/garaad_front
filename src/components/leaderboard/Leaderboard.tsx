import React, { useState } from "react";
import { LeaderboardEntry } from "@/services/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star } from "lucide-react";

interface LeaderboardProps {
    entries: LeaderboardEntry[];
    userRank: {
        rank: number;
        points: number;
    };
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, userRank }) => {
    const [timePeriod, setTimePeriod] = useState<"all_time" | "weekly" | "monthly">(
        "all_time"
    );

    const getMedalIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-5 w-5" />;
            case 2:
            case 3:
                return <Medal className="h-5 w-5" />;
            default:
                return <span className="text-sm font-medium">{rank}</span>;
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs
                    value={timePeriod}
                    onValueChange={(value) =>
                        setTimePeriod(value as "all_time" | "weekly" | "monthly")
                    }
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all_time">All Time</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                    <TabsContent value={timePeriod}>
                        <div className="space-y-4">
                            {/* User's Rank */}
                            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        {userRank.rank}
                                    </div>
                                    <div>
                                        <p className="font-medium">Your Rank</p>
                                        <p className="text-sm text-muted-foreground">
                                            {userRank.points} points
                                        </p>
                                    </div>
                                </div>
                                <Star className="h-5 w-5 text-yellow-500" />
                            </div>

                            {/* Leaderboard Entries */}
                            <div className="space-y-2">
                                {entries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full ${entry.user_info.stats.badges_count > 0
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                                    }`}
                                            >
                                                {getMedalIcon(entry.id)}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${entry.username}`}
                                                    />
                                                    <AvatarFallback>
                                                        {entry.username.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{entry.username}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {entry.user_info.stats.total_points} points
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {entry.user_info.badges.length > 0 && (
                                                <div className="flex -space-x-2">
                                                    {entry.user_info.badges
                                                        .slice(0, 3)
                                                        .map((badge) => (
                                                            <div
                                                                key={badge.id}
                                                                className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                                                            >
                                                                <Star className="h-3 w-3" />
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}; 