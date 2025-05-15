"use client";

import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "./AuthDialog";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="relative">
                {/* Blurred content preview */}
                <div className="blur-sm pointer-events-none">
                    {children}
                </div>

                {/* Login overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="text-center p-8 rounded-2xl bg-white shadow-xl max-w-md mx-4">
                        <h2 className="text-2xl font-semibold mb-4">Fadlan gal si aad u hesho koorsooyinka</h2>
                        <p className="text-gray-600 mb-6">Waxaad u baahan tahay inaad gasho si aad u hesho koorsooyinka</p>
                        <AuthDialog />
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 