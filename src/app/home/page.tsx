"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { API_BASE_URL } from "@/lib/constants";
import type React from "react";
import Image from "next/image";
import useSWR from "swr";
import {
  Clock,
  ChevronRight,
  Zap,
  Crown,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthService from "@/services/auth";
import { Header } from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useGamificationStatus } from "@/services/gamification";
import { DailyFocus } from "@/components/dashboard/DailyFocus";
import { StatusScreen } from "@/components/dashboard/StatusScreen";
import { SafetyReturnScreen } from "@/components/dashboard/SafetyReturnScreen";

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  progress: number;
  is_published: boolean;
  lesson_count?: number;
  estimatedHours?: number;
}

interface LeagueStanding {
  rank: number;
  user: {
    id: string;
    name: string;
  };
  points: number;
  streak: number;
}

interface LeagueLeaderboard {
  time_period: string;
  league: string;
  standings: LeagueStanding[];
  my_standing: {
    rank: number;
    points: number;
    streak: number;
  };
}

interface LeagueStatus {
  current_league: {
    id: number;
    name: string;
    somali_name: string;
  };
  current_points: number;
}

interface StreakData {
  current_streak: number;
  lessons_completed: number;
  problems_to_next_streak: number;
  dailyActivity: {
    day: string;
    status: "complete" | "incomplete";
  }[];
}

const authFetcher = async <T = unknown>(url: string): Promise<T> => {
  const service = AuthService.getInstance();
  return await service.makeAuthenticatedRequest("get", url);
};

const publicFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Ku guuldaraystay in la soo raro");
  return response.json();
};

export default function Home() {
  const { user } = useAuth();
  const { gamificationStatus, isLoading: isLoadingStatus } = useGamificationStatus();
  const [showReturnScreen, setShowReturnScreen] = useState(false);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState("weekly");

  const router = useRouter();

  // 1. Fetch Courses
  const {
    data: courses = [],
    isLoading: isLoadingCourses,
  } = useSWR<Course[]>(
    `${API_BASE_URL}/api/lms/courses/`,
    publicFetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  // 2. Fetch League Status
  const { data: leagueStatus } = useSWR<LeagueStatus>("/api/league/leagues/status/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // 3. Fetch Leaderboard
  const {
    data: leagueLeaderboard,
    isLoading: isLoadingLeaderboard,
  } = useSWR<LeagueLeaderboard>(
    leagueStatus?.current_league?.id
      ? `/api/league/leagues/leaderboard/?time_period=${leaderboardPeriod}&league=${leagueStatus.current_league.id}`
      : null,
    authFetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  // Check for return-from-decay parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("recovery") === "true") {
      setShowReturnScreen(true);
    }
  }, []);

  useEffect(() => {
    const authService = AuthService.getInstance();
    if (!authService.isAuthenticated()) router.push("/");
  }, [router]);



  return (
    <>
      <Header />

      <div className="flex flex-col gap-12 p-6 md:p-12 max-w-6xl mx-auto mt-20 pb-32">
        {showReturnScreen ? (
          <SafetyReturnScreen onReturn={() => setShowReturnScreen(false)} />
        ) : (
          <>
            {/* 1. Daily Focus & Stats */}
            <div className="space-y-8">
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <DailyFocus nextAction={user?.next_action || gamificationStatus?.next_action} />
              </section>

              <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                <StatusScreen status={gamificationStatus} loading={isLoadingStatus} />
              </section>
            </div>

            {/* 2. Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">

              {/* Left: Courses */}
              <div className="lg:col-span-2 space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tight text-black dark:text-white">Koorsooyinkaaga</h3>
                  <Link href="/courses">
                    <Button variant="link" className="font-black text-[10px] uppercase tracking-widest text-primary p-0 h-auto">
                      Eeg Dhammaan
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoadingCourses ? (
                    [1, 2].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)
                  ) : courses?.slice(0, 4).map(course => (
                    <Link href={`/courses/default/${course.slug}`} key={course.id}>
                      <Card className="p-2 rounded-[2rem] bg-white dark:bg-[#1E1F22] border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                        <div className="aspect-video rounded-3xl bg-slate-100 dark:bg-[#2B2D31] relative overflow-hidden mb-4">
                          {course.thumbnail && (
                            <Image src={course.thumbnail} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          )}
                        </div>
                        <div className="px-4 pb-4">
                          <h4 className="font-bold text-lg mb-2 text-black dark:text-white truncate">{course.title}</h4>
                          <div className="flex items-center justify-between gap-4">
                            <Progress value={course.progress} className="h-1 flex-1" />
                            <span className="text-[10px] font-black text-primary uppercase">{course.progress}%</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right: Leaderboard */}
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black uppercase tracking-tight text-black dark:text-white italic">Horyaalka</h3>
                  <Tabs value={leaderboardPeriod} onValueChange={setLeaderboardPeriod} className="w-auto">
                    <TabsList className="bg-transparent h-auto p-0 gap-3">
                      <TabsTrigger value="weekly" className="text-[10px] font-black uppercase tracking-widest p-0 h-auto data-[state=active]:text-primary border-none shadow-none bg-transparent">Usbuuca</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-[10px] font-black uppercase tracking-widest p-0 h-auto data-[state=active]:text-primary border-none shadow-none bg-transparent">Bisha</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Card className="p-6 rounded-[2.5rem] bg-white dark:bg-[#1E1F22] border-none shadow-sm">
                  <div className="space-y-4">
                    {isLoadingLeaderboard ? (
                      [1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14 rounded-2xl" />)
                    ) : leagueLeaderboard?.standings.slice(0, 6).map((standing, idx) => (
                      <div key={standing.user.id} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs",
                          idx === 0 ? "bg-yellow-400 text-black shadow-sm" : "text-gray-400"
                        )}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-black dark:text-white truncate">{standing.user.name}</div>
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{standing.points} XP</div>
                        </div>
                        {idx < 3 && <Crown className={cn("w-4 h-4", idx === 0 ? "text-yellow-500" : "text-gray-300")} />}
                      </div>
                    ))}
                  </div>

                  {leagueLeaderboard?.my_standing && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-4 p-3 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs bg-primary text-white">
                          {leagueLeaderboard.my_standing.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-primary">Kaalintaada</div>
                          <div className="text-[9px] font-black text-primary/70 uppercase tracking-widest">{leagueLeaderboard.my_standing.points} XP</div>
                        </div>
                        <Trophy className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
