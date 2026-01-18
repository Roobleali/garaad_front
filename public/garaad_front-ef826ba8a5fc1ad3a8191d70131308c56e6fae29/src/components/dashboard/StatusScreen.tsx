"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Flame,
    Star,
    Trophy,
    Activity,
    Zap,
    Info
} from "lucide-react";
import { GamificationStatus } from "@/types/gamification";
import { cn } from "@/lib/utils";

interface StatusScreenProps {
    status?: GamificationStatus;
    loading?: boolean;
}

export function StatusScreen({ status, loading }: StatusScreenProps) {
    if (loading || !status) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="h-32 animate-pulse bg-gray-100 dark:bg-gray-800" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Momentum / Streak Status */}
            <div className="p-4 rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1E1F22]">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Xiriirka</div>
                <div className="text-2xl font-black dark:text-white flex items-center gap-2">
                    {status.streak.count}
                    <Flame className="w-4 h-4 text-orange-500" />
                </div>
            </div>

            {/* Energy Status */}
            <div className="p-4 rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1E1F22]">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Awoodda</div>
                <div className="text-2xl font-black dark:text-white flex items-center gap-2">
                    {Math.round((status.energy?.current / status.energy?.max) * 100)}%
                    <Zap className="w-4 h-4 text-blue-500" />
                </div>
            </div>

            {/* Level / Identity Status */}
            <div className="p-4 rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1E1F22]">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Heerka</div>
                <div className="text-2xl font-black dark:text-white flex items-center gap-2">
                    {status.level}
                    <Trophy className="w-4 h-4 text-purple-500" />
                </div>
            </div>

            {/* XP Status */}
            <div className="p-4 rounded-3xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#1E1F22]">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">XP</div>
                <div className="text-2xl font-black dark:text-white flex items-center gap-2">
                    {status.xp}
                    <Star className="w-4 h-4 text-yellow-500" />
                </div>
            </div>
        </div>
    );
}
