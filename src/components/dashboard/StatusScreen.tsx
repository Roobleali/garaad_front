"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
    Flame,
    Star,
    Trophy,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusScreenProps {
    status?: any; // Using any for now to handle the slightly varied structure from hook
    loading?: boolean;
}

export function StatusScreen({ status, loading }: StatusScreenProps) {
    if (loading || !status) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="h-24 sm:h-32 animate-pulse bg-gray-100 dark:bg-white/5 rounded-[2rem] border-none" />
                ))}
            </div>
        );
    }

    // Extract values with fallbacks
    const currentStreak = status.current_streak ?? status.streak?.count ?? 0;
    const energyPercent = status.energy ? Math.round((status.energy.current / status.energy.max) * 100) : 0;
    const currentLevel = status.level ?? 1;
    const currentXP = status.xp ?? 0;

    const stats = [
        {
            label: "Xiriirka",
            value: currentStreak,
            icon: Flame,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            suffix: "Maalmood"
        },
        {
            label: "Awoodda",
            value: `${energyPercent}%`,
            icon: Zap,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Heerka",
            value: currentLevel,
            icon: Trophy,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            label: "XP",
            value: currentXP,
            icon: Star,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            {stats.map((stat, idx) => (
                <Card
                    key={idx}
                    className="p-4 sm:p-6 rounded-[2rem] border-gray-100 dark:border-white/5 bg-white dark:bg-[#1E1F22] shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                {stat.label}
                            </span>
                            <div className={cn("p-1.5 rounded-lg transition-transform group-hover:scale-110", stat.bg)}>
                                <stat.icon className={cn("w-4 h-4", stat.color)} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-black dark:text-white tracking-tight">
                                {stat.value}
                            </span>
                            {stat.suffix && (
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                                    {stat.suffix}
                                </span>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
