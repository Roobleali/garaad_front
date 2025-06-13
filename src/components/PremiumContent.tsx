"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slices/authSlice";

interface PremiumContentProps {
    children: React.ReactNode;
}

export default function PremiumContent({ children }: PremiumContentProps) {
    const router = useRouter();
    const currentUser = useSelector(selectCurrentUser);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            router.push("/login");
            return;
        }

        if (!currentUser.is_premium) {
            router.push("/subscribe");
            return;
        }

        setIsLoading(false);
    }, [currentUser, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
} 