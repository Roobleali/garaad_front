"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const QUOTES = [
    {
        text: "Be a person of high ambition, for perhaps through you, Allah will revive a nation.",
        author: "Islamic Proverb",
    },
    {
        text: "I reflected upon the jihad (struggle) against the soul, and I saw it to be the greatest jihad.",
        author: "Spiritual Wisdom",
    },
    {
        text: "Beginnings are for everyone, but steadfastness is for the truthful/sincere.",
        author: "Ancient Wisdom",
    }
];

export function InspirationalQuotes() {
    return (
        <section className="py-24 relative overflow-hidden bg-background">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
                        Dhiirigelin & <span className="text-primary">Himiladaada</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Ku biir platform-ka Garaad si aad u gaarto guulo cusub adiga oo ka duulaya xigmadahan weyn.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {QUOTES.map((quote, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative p-8 rounded-3xl bg-card/50 backdrop-blur-xl border border-border shadow-xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group"
                        >
                            <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6 group-hover:text-primary/40 transition-colors" />
                            <p className="text-xl font-bold text-foreground leading-relaxed mb-6 italic pt-4">
                                "{quote.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-px w-8 bg-primary/30" />
                                <span className="text-sm font-black text-primary uppercase tracking-widest">
                                    {quote.author}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
