"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { Sparkles, Zap, Trophy, Star } from "lucide-react";

export function HeroSection() {
    const router = useRouter();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = !!user;

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
            {/* Simple background */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-white pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto py-16 lg:py-24 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content Column */}
                    <div className="text-center lg:text-left space-y-8">
                        {/* Badge */}
                        <div>
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                <Sparkles size={14} />
                                Mustaqbalkaaga Bilow Maanta
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground leading-tight">
                            Noqo Garaadka{" "}
                            <span className="text-primary">STEM-ka</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Ku baro <strong className="text-foreground">Xisaabta, Fiisikiska, iyo Sirdoonka Macmalka ah</strong> afkaaga hooyo. Casharadeena waxaa loo sameeyay ardayda Soomaaliyeed.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto text-lg px-10 py-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-shadow"
                                onClick={() => router.push(isAuthenticated ? "/courses" : "/welcome")}
                            >
                                {isAuthenticated ? "Koorsooyinka" : "Bilow Hadda"}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto text-lg px-10 py-6 rounded-2xl border-2 border-primary/20 font-bold hover:bg-primary/5 transition-colors"
                                onClick={() => router.push("/courses")}
                            >
                                Eeg Koorsooyinka
                            </Button>
                        </div>
                    </div>

                    {/* Visual Column */}
                    <div className="relative hidden lg:block">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/10">
                            <img
                                src="/images/hero-visual.png"
                                alt="Garaad - Barashada STEM (Xisaabta, Fiisikiska, iyo Tiknoolajiyadda) ee ardayda Soomaaliyeed"
                                className="w-full h-auto"
                                loading="eager"
                                fetchPriority="high"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
