"use client";

import { BookOpen, Languages, UserCheck } from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
    {
        icon: BookOpen,
        title: "Barasho ku dhisan Camal",
        subtitle: "Ku Baro Ficil",
        description:
            "Ma jiro cashar dheer oo lagu caajiso. Wax walba waxaad ku baranaysaa adiga oo ficil samaynaya.",
    },
    {
        icon: Languages,
        title: "Af-Soomaali hufan",
        subtitle: "Luuqadaada Hooyo",
        description:
            "Luuqaddu caqabad kuguma noqonayso. Maaddooyinka adag waxaan kuugu dhignay luuqadaada hooyo.",
    },
    {
        icon: UserCheck,
        title: "Macalin looma baahna",
        subtitle: "Adiga ayaa is baranaya",
        description:
            "Hanaanka Garaad wuxuu kuu saamaxayaa inaad adigu is bari kartid, heer kasta oo aad joogto.",
    },
];

export function WhyGaraadSection() {
    return (
        <section className="py-16 sm:py-24 px-4 bg-muted/30">
            <div className="max-w-6xl mx-auto">
                <Reveal>
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
                            Maxay Garaad uga duwan tahay{" "}
                            <span className="text-primary">dugsiyada kale?</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Garaad waa qaab cusub oo waxbarasho oo ku dhisan ciyaar iyo tartanka
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <Reveal key={feature.title}>
                            <div
                                className="group relative bg-card rounded-2xl p-6 sm:p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Icon Container */}
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                                            {feature.title}
                                        </h3>
                                        <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                                            {feature.subtitle}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Decorative gradient */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
