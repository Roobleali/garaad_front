"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
    onLanguageChange?: (lang: "en" | "so") => void;
    className?: string;
}

export function LanguageSwitcher({ onLanguageChange, className }: LanguageSwitcherProps) {
    const [language, setLanguage] = useState<"en" | "so">("en");

    const handleToggle = () => {
        const newLang = language === "en" ? "so" : "en";
        setLanguage(newLang);
        onLanguageChange?.(newLang);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            className={cn("flex items-center gap-2", className)}
        >
            <Globe className="h-4 w-4" />
            <span className="font-medium">{language === "en" ? "Soomaali" : "English"}</span>
        </Button>
    );
}
