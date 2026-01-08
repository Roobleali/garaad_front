"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function ChallengeHero() {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Load Vimeo player script
        const script = document.createElement('script');
        script.src = 'https://player.vimeo.com/api/player.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handlePrimaryCTA = () => {
        if (isAuthenticated) {
            router.push("/courses");
        } else {
            router.push("/welcome");
        }
    };

    const handleSecondaryCTA = () => {
        // Scroll to story section
        const storySection = document.getElementById("our-story");
        if (storySection) {
            storySection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-float" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 animate-fade-in-up tracking-tighter">
                    <span className="text-white">Dhis Ganacsigaaga</span>
                    <br />
                    <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        SaaS & AI Business
                    </span>
                </h1>

                {/* Sub-headline */}
                <p className="text-lg sm:text-xl md:text-2xl text-slate-400 font-bold mb-12 animate-fade-in-up delay-200 uppercase tracking-widest">
                    5 Toddobaad Gudahood
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up delay-400">
                    <button
                        onClick={handlePrimaryCTA}
                        className="group relative px-10 py-5 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50"
                    >
                        BILOW HADDA
                    </button>
                    <button
                        onClick={handleSecondaryCTA}
                        className="px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-md text-slate-400 font-bold rounded-2xl border border-white/10 transition-all duration-300 hover:scale-105"
                    >
                        Baro Sida uu u Shaqeeyo
                    </button>
                </div>

                {/* Video Section */}
                <div className="max-w-6xl mx-auto mb-16 animate-fade-in-up delay-500">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 backdrop-blur-sm bg-white/5">
                        <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                            <iframe
                                src="https://player.vimeo.com/video/1152611300?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&controls=1&background=0"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                title="Garaad SaaS Challenge"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
