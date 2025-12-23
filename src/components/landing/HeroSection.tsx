"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { Atom, Braces, Calculator, CircuitBoard, Lightbulb, PieChart } from "lucide-react";

export function HeroSection() {
    const router = useRouter();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = !!user;

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white px-4 sm:px-6 lg:px-8">
            {/* Ultra-soft background mesh */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content Column */}
                    <div className="text-center lg:text-left space-y-10">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border border-primary/20">
                                    Educating the next generation
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-5xl sm:text-2xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.02]"
                            >
                                Barashada STEM oo loo beddelay <span className="text-primary italic">waayo-aragnimo</span>.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
                            >
                                Platform-ka ugu horreeya ee Soomaalida ee lagu barto Xisaabta, Physics, iyo AI. Ku baro afkaaga hooyo adigoo isticmaalaya qalab is-dhexgal ah.
                            </motion.p>
                        </div>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5"
                        >
                            <Button
                                size="lg"
                                className="w-full sm:w-auto text-lg px-12 py-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-xl shadow-primary/20"
                                onClick={() => router.push(isAuthenticated ? "/courses" : "/welcome")}
                            >
                                {isAuthenticated ? "Koorsooyinka" : "Bilow Hadda"}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto text-lg px-12 py-8 rounded-2xl border-2 font-bold hover:bg-muted/50 transition-all"
                                onClick={() => router.push("/courses")}
                            >
                                Eeg Koorsooyinka
                            </Button>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="pt-10 flex items-center justify-center lg:justify-start gap-8 opacity-60"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                                        {i === 4 ? "+10k" : ""}
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Ku biir kumannaan arday ah
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Column */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border border-primary/5">
                            <img
                                src="/images/hero-visual.png"
                                alt="Garaad STEM Dashboard"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        {/* Decorative floating element */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
