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
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthService from "@/services/auth";
import { Header } from "@/components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useGamificationStatus } from "@/services/gamification";
import { IdentityWrapper } from "@/components/IdentityWrapper";
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

  // 4. Fetch Streak Data
  const { data: streak } = useSWR<StreakData>("/api/streaks/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

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

  const streakVisualization = useMemo(() => {
    if (!streak?.dailyActivity) return null;
    return (
      <div className="flex justify-between px-4 w-full mt-4">
        {streak.dailyActivity
          .slice(0, 7)
          .reverse()
          .map((activity, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                  activity.status === "complete" ? "bg-yellow-400 shadow-lg shadow-yellow-400/20" : "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <Zap
                  className={cn(
                    "w-4 h-4",
                    activity.status === "complete" ? "text-black" : "text-gray-400"
                  )}
                />
              </div>
              <span className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">{activity.day}</span>
            </div>
          ))}
      </div>
    );
  }, [streak]);

  return (
    <>
      <Header />

      <div className="flex flex-col gap-10 p-4 md:p-8 max-w-7xl mx-auto mt-20 pb-20">

        {showReturnScreen ? (
          <SafetyReturnScreen onReturn={() => setShowReturnScreen(false)} />
        ) : (
          <>
            {/* 1. Daily Focus (Entry Point) - Always visible, but adapts to next_action */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <DailyFocus nextAction={user?.next_action || gamificationStatus?.next_action} />
            </section>

            {/* 2. Status / Perception Screen */}
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              <StatusScreen status={gamificationStatus} loading={isLoadingStatus} />
            </section>

            {/* 3. Conditional Content based on Identity */}

            {/* Stats & Progress - Visible for Builder and above */}
            <IdentityWrapper minIdentity="Builder">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="lg:col-span-2 space-y-10">
                  {/* XP & Weekly Progress */}
                  <Card className="p-8 md:p-10 rounded-[3rem] bg-white dark:bg-[#2B2D31] border-none shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl" />
                    <h3 className="text-2xl font-black mb-8 uppercase tracking-tight text-black dark:text-white">Dhaqdhaqaaqaaga</h3>
                    {streakVisualization}
                    <div className="mt-10 p-8 bg-slate-50 dark:bg-[#1E1F22] rounded-[2rem] border border-slate-100 dark:border-white/5">
                      <div className="flex justify-between items-end mb-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Hadafka Toddobaadka</span>
                          <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Waxa kuu dhiman {streak?.problems_to_next_streak || 0} tallaabo</p>
                        </div>
                        <span className="text-lg font-black text-primary">{((streak?.lessons_completed || 0) * 10)}%</span>
                      </div>
                      <Progress value={Math.min(100, ((streak?.lessons_completed || 0) / 10) * 100)} className="h-4 rounded-full" />
                    </div>
                  </Card>
                </div>

                <div className="space-y-10">
                  {/* League Info */}
                  {leagueStatus && (
                    <Card className="p-10 rounded-[3rem] bg-gradient-to-br from-yellow-400/10 via-transparent to-transparent border-none shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400/20" />
                      <div className="w-24 h-24 bg-yellow-400 rounded-[2rem] rotate-12 flex items-center justify-center text-black mb-8 shadow-2xl shadow-yellow-400/20">
                        <Crown className="w-12 h-12" />
                      </div>
                      <h3 className="text-3xl font-black mb-2 italic text-black dark:text-white">{leagueStatus.current_league.name}</h3>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Current League</p>

                      <div className="w-full space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <span>Wadarta XP</span>
                          <span>{leagueStatus.current_points}</span>
                        </div>
                        <Progress value={Math.min(100, (leagueStatus.current_points / 500) * 100)} className="h-2.5 rounded-full bg-yellow-400/10" />
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </IdentityWrapper>

            {/* Leaderboards - Visible for Solver and above */}
            <IdentityWrapper minIdentity="Solver">
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tight text-black dark:text-white italic">Tartanka Jira</h3>
                    <p className="text-sm font-medium text-gray-500">Baro, xali, oo horyaal noqo.</p>
                  </div>
                  <Tabs value={leaderboardPeriod} onValueChange={setLeaderboardPeriod} className="w-auto">
                    <TabsList className="rounded-full p-1 bg-slate-100 dark:bg-[#2B2D31] h-12">
                      <TabsTrigger value="weekly" className="rounded-full px-6 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Usbuuca</TabsTrigger>
                      <TabsTrigger value="monthly" className="rounded-full px-6 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Bisha</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {isLoadingLeaderboard ? (
                    [1, 2, 3].map(i => <Card key={i} className="h-56 animate-pulse rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/50" />)
                  ) : leagueLeaderboard?.standings.slice(0, 3).map((standing, idx) => (
                    <Card key={standing.user.id} className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-[#2B2D31] flex items-center gap-6 group/card hover:shadow-xl transition-all">
                      <div className={cn(
                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl transition-transform group-hover/card:scale-110",
                        idx === 0 ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20" : "bg-slate-100 dark:bg-[#1E1F22] text-black dark:text-white"
                      )}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="font-black text-lg text-black dark:text-white tracking-tight">{standing.user.name}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary">{standing.points} XP</Badge>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Velocity {Math.floor(Math.random() * 10) + 1}x</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </IdentityWrapper>

            {/* Course Carousel - Visible to all, but secondary to Daily Focus */}
            <section className="space-y-8 pt-10 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">Koorsooyinkaaga</h3>
                  <p className="text-sm font-medium text-gray-500">Dhammaan casharrada aad baranayso.</p>
                </div>
                <Link href="/courses">
                  <Button variant="ghost" className="h-12 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/5 hover:text-primary px-6">
                    Eeg Dhammaan <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <ScrollArea className="w-full whitespace-nowrap rounded-[3rem]">
                <div className="flex gap-8 pb-8">
                  {isLoadingCourses ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="w-[380px] h-[300px] shrink-0 rounded-[2.5rem]" />)
                  ) : courses?.map(course => (
                    <Card key={course.id} className="w-[380px] shrink-0 p-3 rounded-[3rem] bg-white dark:bg-[#2B2D31] border-none shadow-sm hover:shadow-2xl transition-all group/card overflow-hidden">
                      <div className="aspect-[16/10] rounded-[2rem] bg-slate-100 dark:bg-[#1E1F22] relative overflow-hidden mb-5">
                        {course.thumbnail && (
                          <Image src={course.thumbnail} alt={course.title} fill className="object-cover group-hover/card:scale-110 transition-transform duration-700" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        <div className="absolute top-5 right-5">
                          <Badge className="rounded-full font-black text-[9px] uppercase tracking-widest px-4 py-1.5 bg-white/90 dark:bg-[#1E1F22]/90 text-black dark:text-white backdrop-blur-md border-none shadow-xl">
                            {course.lesson_count || 0} Cashar
                          </Badge>
                        </div>
                      </div>
                      <div className="p-5 pt-0">
                        <Link href={`/courses/default/${course.slug}`}>
                          <h4 className="font-black text-xl mb-3 truncate text-black dark:text-white tracking-tight hover:text-primary transition-colors cursor-pointer">{course.title}</h4>
                        </Link>
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" />
                            {course.estimatedHours || 5}h Content
                          </div>
                          <div className="text-[10px] font-black text-primary uppercase tracking-[0.15em] bg-primary/5 px-2 py-1 rounded-md">
                            {course.progress}% Completed
                          </div>
                        </div>
                        <Progress value={course.progress} className="h-2 rounded-full bg-slate-100 dark:bg-[#1E1F22]" />
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </section>
          </>
        )}
      </div>
    </>
  );
}
