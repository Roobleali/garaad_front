"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { ProgressCard } from "@/components/progress/ProgressCard";
import { progressService } from "@/services/progress";
import type { UserProgress } from "@/services/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen, Trophy, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StudentDashboard() {
    const user = useSelector(selectCurrentUser);
    const [progress, setProgress] = useState<UserProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                setIsLoading(true);
                const progressData = await progressService.getUserProgress();
                setProgress(progressData);
            } catch (error) {
                console.error("Error fetching progress:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchProgress();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Ku soo dhawaaw, {user?.name || "Arday"}! 👋
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Halkaan ka eeg horumarkaaga iyo casharrada kuu dhiman.
                    </p>
                </div>
                <Link href="/courses">
                    <Button className="bg-primary hover:bg-primary/90">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Sii wad barashada
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<GraduationCap className="w-5 h-5 text-blue-500" />}
                    title="Koorsooyinka Gacanta"
                    value={progress.length.toString()}
                    description="Koorsooyin aad bilowday"
                />
                <StatCard
                    icon={<Trophy className="w-5 h-5 text-yellow-500" />}
                    title="Dhibcahaaga"
                    value="1,250"
                    description="XP aad heshay"
                />
                <StatCard
                    icon={<Clock className="w-5 h-5 text-green-500" />}
                    title="Wakhtiga Barashada"
                    value="12h 30m"
                    description="Toddobaadkan"
                />
                <StatCard
                    icon={<BookOpen className="w-5 h-5 text-purple-500" />}
                    title="Casharrada"
                    value="45"
                    description="Luuqadaha la dhammaystiray"
                />
            </div>

            {/* Main Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ActivityIcon className="w-5 h-5 text-primary" />
                        Horumarka Koorsooyinka
                    </h2>
                    <ProgressCard progress={progress} />
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4">Dhaqdhaqaaqii ugu dambeeyay</h2>
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            {progress.slice(0, 3).map((item, i) => (
                                <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{item.category}</p>
                                        <p className="text-xs text-slate-500">{item.completed_lessons} cashar ayaa la dhameeyay</p>
                                    </div>
                                </div>
                            ))}
                            {progress.length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-4">
                                    Ma jiraan dhaqdhaqaaqyo dhow dhow ah.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, description }: { icon: React.ReactNode, title: string, value: string, description: string }) {
    return (
        <Card>
            <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{description}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
