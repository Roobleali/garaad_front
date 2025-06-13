"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

interface PremiumContentProps {
    children: React.ReactNode;
}

export default function PremiumContent({ children }: PremiumContentProps) {
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (!user.is_premium) {
            router.push("/subscribe");
        }
    }, [user, router]);

    if (!user || !user.is_premium) {
        return null;
    }

    return <>{children}</>;
} 