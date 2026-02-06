"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
    className?: string;
    priority?: boolean;
    loading?: "lazy" | "eager";
    sizes?: string;
    width?: number;
    height?: number;
}

export function Logo({
    className,
    priority = false,
    loading = "lazy",
    sizes = "(max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, 200px",
    width = 200,
    height = 60
}: LogoProps) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");
    const logoSrc = isDarkMode ? "/logo_darkmode.png" : "/logo.png";

    return (
        <Image
            src={logoSrc}
            alt="Garaad"
            width={692}
            height={461}
            className={cn(
                "w-32 sm:w-36 md:w-40 lg:w-44",
                "h-auto object-contain",
                className
            )}
            priority={priority}
            loading={loading}
            sizes={sizes}
        />
    );
}

export default Logo;
