"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth";
import { useAuthReady } from "@/hooks/useAuthReady";

interface PremiumContentProps {
    children: React.ReactNode;
}

export default function PremiumContent({ children }: PremiumContentProps) {
    const router = useRouter();
    const isReady = useAuthReady();
    const authService = AuthService.getInstance();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isReady) return;
        const user = authService.getCurrentUser();

        // Gated content: no session → login so returning users don't get full onboarding.
        if (!user) {
            router.push("/login");
            return;
        }

        if (!user.is_premium) {
            router.push("/subscribe");
            return;
        }

        setIsLoading(false);
    }, [router, isReady]);

    if (!isReady || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <div className="animate-pulse rounded-2xl h-32 w-64 bg-muted" />
            </div>
        );
    }

    return <>{children}</>;
} 