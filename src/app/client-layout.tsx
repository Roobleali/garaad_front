// app/ClientLayout.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthService from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useCommunityStore } from "@/store/useCommunityStore";
import communityService from "@/services/community";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, logout, isAuthenticated } = useAuthStore();
  const { setNotifications, setUserProfile } = useCommunityStore();

  const pathname = usePathname();

  useEffect(() => {
    const authService = AuthService.getInstance();

    const init = async () => {
      const isValid = await authService.ensureValidToken();
      if (isValid) {
        const user = authService.getCurrentUser();
        if (user) {
          setUser(user);

          try {
            const profile = await communityService.profile.getUserProfile().catch(err => {
              console.warn("Failed to fetch community profile:", err);
              return null;
            });
            const notifs = await communityService.notification.getNotifications().catch(err => {
              console.warn("Failed to fetch notifications:", err);
              return { results: [] };
            });

            if (profile) setUserProfile(profile as any);
            if (notifs) setNotifications(((notifs as any).results || notifs) as any[]);
          } catch (err) {
            console.error("Failed to fetch initial community data:", err);
          }

          // Initialize Global WebSocket for real-time notifications
          // Skip if on community page, as that page handles its own connection logic
          if (!pathname?.startsWith('/community')) {
            const { default: CommunityWebSocket } = await import("@/services/communityWebSocket");
            CommunityWebSocket.getInstance().connect(null); // Connect to 'global' room
          }
        }
      } else if (isAuthenticated) {
        logout();
      }
    };

    init();
  }, [setUser, logout, isAuthenticated, setNotifications, setUserProfile, pathname]);

  // Just render children - no Providers here
  return (
    <>
      {children}
    </>
  );
}
