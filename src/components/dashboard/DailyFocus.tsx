"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle } from "lucide-react";
import { NextAction } from "@/types/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DailyFocusProps {
    nextAction?: NextAction;
}

export function DailyFocus({ nextAction }: DailyFocusProps) {
    if (!nextAction) {
        return (
            <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-4 bg-transparent border-gray-200 dark:border-white/10">
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-gray-300" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-gray-400 text-sm">Ma jiraan waxqabad la qorsheeyay</h3>
                    <p className="text-[10px] text-gray-400">Dooros koorso aad xiisaynayso si aad u bilawdo.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-8 bg-white dark:bg-[#1E1F22] border-gray-100 dark:border-white/5 shadow-sm rounded-[2rem]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Casharka Xiga</span>
                    </div>
                    <h2 className="text-2xl font-black dark:text-white tracking-tight">{nextAction.title}</h2>
                </div>

                <Link href={nextAction.action_type === 'solve' ? '/practice' : '/courses'} className="w-full md:w-auto">
                    <Button size="lg" className="w-full h-14 px-8 rounded-2xl font-black uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all">
                        Hadda Bilaw
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
