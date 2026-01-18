"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
    } | null;
}

interface LeaderboardWidgetProps {
    data?: LeaderboardData;
    loading?: boolean;
}

export function LeaderboardWidget({ data, loading }: LeaderboardWidgetProps) {
    const getInitials = (name: string) => {
        if (!name) return "??";
        return name
            .split(" ")
            .map((n) => n ? n[0] : "")
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getAvatarColor = (index: number) => {
        const colors = [
            "bg-pink-400",
            "bg-blue-500",
            "bg-emerald-500",
            "bg-orange-500",
            "bg-purple-500",
        ];
        return colors[index % colors.length];
    };

    if (loading) {
        return (
            <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-gray-100 rounded" />
                            <div className="w-10 h-10 bg-gray-100 rounded-full" />
                            <div className="w-24 h-4 bg-gray-100 rounded" />
                        </div>
                        <div className="w-12 h-4 bg-gray-100 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Header Info */}
            <div className="p-6 pb-2 text-center border-b border-gray-100 dark:border-white/5">
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                    {data?.league || "Beginner"} Liigaha
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                    {data?.time_period === 'weekly' ? 'Todobaadkan' : 'Bishan'} tartanka
                </div>
            </div>

            {/* List */}
            <div className="p-2 space-y-1">
                {data?.standings?.map((standing, index) => {
                    // Check if it's the current user (simplified check)
                    const isCurrentUser = data.my_standing && standing.rank === data.my_standing.rank && standing.points === data.my_standing.points;

                    return (
                        <div
                            key={standing.user.id}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-2xl transition-all duration-200",
                                isCurrentUser
                                    ? "bg-primary/10 border border-primary/20"
                                    : "hover:bg-gray-50 dark:hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className={cn(
                                    "text-xs font-black w-4 text-center",
                                    standing.rank === 1 ? "text-yellow-500" :
                                        standing.rank === 2 ? "text-gray-400" :
                                            standing.rank === 3 ? "text-amber-600" : "text-gray-300"
                                )}>
                                    {standing.rank}
                                </span>
                                <div
                                    className={cn(
                                        "w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-black",
                                        getAvatarColor(index)
                                    )}
                                >
                                    {getInitials(standing.user.name)}
                                </div>
                                <span className="text-sm font-bold text-foreground truncate max-w-[120px]">
                                    {standing.user.name}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-black text-foreground">
                                    {standing.points}
                                </span>
                                <span className="text-[9px] font-medium text-muted-foreground ml-1">XP</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* My standing footer if not in top list */}
            {data?.my_standing && !data.standings?.some(s => s.rank === data.my_standing?.rank) && (
                <div className="mt-2 p-4 pt-2 border-t border-gray-100 dark:border-white/5 bg-primary/5">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-black/20 border border-primary/20">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-black w-4 text-center text-primary">
                                {data.my_standing.rank}
                            </span>
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black">
                                ME
                            </div>
                            <span className="text-sm font-bold text-foreground">Adiga</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-black text-foreground">
                                {data.my_standing.points}
                            </span>
                            <span className="text-[9px] font-medium text-muted-foreground ml-1">XP</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
