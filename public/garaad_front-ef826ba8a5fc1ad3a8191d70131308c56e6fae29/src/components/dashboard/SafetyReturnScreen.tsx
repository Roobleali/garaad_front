"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SafetyReturnScreenProps {
    onReturn?: () => void;
    actionUrl?: string;
}

export function SafetyReturnScreen({ onReturn, actionUrl = "/home" }: SafetyReturnScreenProps) {
    return (
        <Card className="max-w-xl mx-auto p-10 text-center space-y-8 rounded-[3rem] border-none shadow-2xl bg-white dark:bg-[#1E1F22]">
            <div className="w-24 h-24 rounded-[2rem] bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 mx-auto shadow-inner">
                <Heart className="w-12 h-12 fill-current" />
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl font-black dark:text-white tracking-tight leading-tight">
                    Kusoo dhawaaw, mar kale!
                </h2>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    Waanu kuu xiisnay. Ha walwalin, hal talaabo oo kaliya ayaa dib kuugu soo celinaysa hubaashaada.
                </p>
            </div>

            <div className="pt-4">
                <Link href={actionUrl}>
                    <Button
                        onClick={onReturn}
                        size="lg"
                        className="h-16 px-12 rounded-full font-black uppercase tracking-widest text-lg shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 bg-rose-500 hover:bg-rose-600 transition-all hover:-translate-y-1"
                    >
                        Dib u Bilaw
                        <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                </Link>
                <p className="text-sm text-gray-400 mt-6 font-bold uppercase tracking-widest">
                    Hal talaabo ayaa kugu filan
                </p>
            </div>
        </Card>
    );
}
