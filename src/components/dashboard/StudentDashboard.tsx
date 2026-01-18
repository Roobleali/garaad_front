"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGamificationData } from "@/hooks/useGamificationData";
import { StatusScreen } from "./StatusScreen";
import { DailyFocus } from "./DailyFocus";
import { LeaderboardWidget } from "./LeaderboardWidget";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap, LayoutDashboard } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";

export function StudentDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { streak, leaderboard, isLoading, hasError } = useGamificationData();

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            {/* Welcome Head */}
            <header className="space-y-4">
                <Reveal>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
                        <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                            Boorka Shaqada
                        </span>
                    </div>
                </Reveal>
                <Reveal delay={0.1}>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                        Kusoo dhawaaw, <span className="text-primary">{user?.first_name || user?.username}</span>! 👋
                    </h1>
                </Reveal>
                <Reveal delay={0.2}>
                    <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                        Waa ku kan horumarkaaga iyo waxyaabaha kuu qorsheeyan maanta. Diyaar ma u tahay inaad wax cusub barato?
                    </p>
                </Reveal>
            </header>

            {/* Quick Stats Grid */}
            <Reveal delay={0.3}>
                <section className="space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Horumarka Maanta</h2>
                    <StatusScreen status={streak} loading={isLoading} />
                </section>
            </Reveal>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 pt-4">
                {/* Left: Learning Column */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Next Activity */}
                    <Reveal delay={0.4}>
                        <section className="space-y-6">
                            <h2 className="text-xl font-black tracking-tight flex items-center gap-2 px-1">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Shaqada Kugu Sugan
                            </h2>
                            <DailyFocus nextAction={streak?.next_action} />
                        </section>
                    </Reveal>

                    {/* Navigation Cards */}
                    <Reveal delay={0.5}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <Button
                                variant="outline"
                                className="h-28 rounded-3xl border-gray-100 dark:border-white/5 bg-white dark:bg-[#1E1F22] flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all group"
                                onClick={() => router.push('/courses')}
                            >
                                <GraduationCap className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                <span className="font-black uppercase tracking-widest text-xs">Dhammaan Koorsooyinka</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-28 rounded-3xl border-gray-100 dark:border-white/5 bg-white dark:bg-[#1E1F22] flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all group"
                                onClick={() => router.push('/community')}
                            >
                                <LayoutDashboard className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                                <span className="font-black uppercase tracking-widest text-xs">Beesha Garaad</span>
                            </Button>
                        </div>
                    </Reveal>
                </div>

                {/* Right: Leaderboard */}
                <div className="space-y-6">
                    <Reveal delay={0.6}>
                        <h2 className="text-xl font-black tracking-tight flex items-center gap-2 px-1 mb-6">
                            <GraduationCap className="w-5 h-5 text-yellow-500" />
                            Tartanka Toddobaadka
                        </h2>
                        <div className="rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-xl bg-white dark:bg-[#1E1F22]">
                            <LeaderboardWidget
                                data={leaderboard || { standings: [], my_standing: null, league: "Beginner", time_period: "weekly" }}
                                loading={isLoading}
                            />
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}
