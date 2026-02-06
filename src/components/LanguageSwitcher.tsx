"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageSwitcherProps {
    className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
    const { language, toggleLanguage } = useLanguage();

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className={cn("flex items-center gap-2", className)}
        >
            <Globe className="h-4 w-4" />
            <span className="font-medium">{language === "so" ? "Soomaali" : "English"}</span>
        </Button>
    );
}
