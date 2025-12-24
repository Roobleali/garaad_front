"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { Sparkles, Zap, Trophy, Star } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroSection() {
    const router = useRouter();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = !!user;

    const [activeIndex, setActiveIndex] = useState(0);
    const cycleTexts = ["Xisaab", "AI", "Fiisikis", "Tiknoolajiyad"];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % cycleTexts.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center bg-white dark:bg-slate-950 px-4 overflow-hidden">
            {/* Advanced background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_0%,transparent_70%)]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto py-10 text-center space-y-12">
                {/* Main Content */}
                <div className="space-y-8 px-4 sm:px-0">
                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[1.1] tracking-tight flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6">
                        <span className="whitespace-nowrap">Ku baro Sameyn</span>
                        <span className="inline-block relative">
                            <span
                                key={cycleTexts[activeIndex]}
                                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-500 inline-block"
                            >
                                {cycleTexts[activeIndex]}
                            </span>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium px-4">
                        Ku baro <span className="text-foreground">Xisaabta, Fiisikiska, iyo Tiknoolajiyadda</span> afkaaga hooyo. Casharo heer sare ah oo loo diyaariyay ardayda Soomaaliyeed meel kasta oo ay joogaan.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex justify-center px-4">
                    <Button
                        size="default"
                        className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 sm:px-10 sm:py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all transform hover:-translate-y-1"
                        onClick={() => router.push(isAuthenticated ? "/courses" : "/welcome")}
                    >
                        {isAuthenticated ? "Koorsooyinka" : "Bilow Hadda"}
                    </Button>
                </div>


            </div>
        </section>
    );
}
