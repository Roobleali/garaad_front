"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface PremiumContentProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function PremiumContent({ children, fallback }: PremiumContentProps) {
    const router = useRouter();
    const { user } = useAuth();

    if (!user) {
        router.push("/login");
        return null;
    }

    if (!user.is_premium) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="relative">
                {/* Blurred content preview */}
                <div className="blur-sm pointer-events-none">
                    {children}
                </div>

                {/* Premium overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="text-center p-8 rounded-2xl bg-white shadow-xl max-w-md mx-4">
                        <h2 className="text-2xl font-semibold mb-4">Waxaad u baahan tahay Premium</h2>
                        <p className="text-gray-600 mb-6">Si aad u hesho dhammaan koorsooyinka iyo casharrada, fadlan isdiiwaangeli Premium</p>
                        <button
                            onClick={() => router.push("/subscribe")}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Isdiiwaangeli Premium
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 