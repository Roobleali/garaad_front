import { useEffect, useState, useCallback, useRef } from "react";
import ActivityService from "@/services/activity";
import AuthService from "@/services/auth";

// Define the structure of ActivityData locally if it's simpler or if the backend structure is known
export interface ActivityData {
    streak: {
        current_streak: number;
        max_streak: number;
    };
    activity: {
        status: "complete" | "partial" | "none";
        problems_solved: number;
    };
    user: {
        last_active: string;
        last_login: string;
    };
    activity_date: string;
}

export interface UseActivityTrackingReturn {
    activityData: ActivityData | null;
    isLoading: boolean;
    error: string | null;
    updateActivity: () => Promise<void>;
    isTracking: boolean;
}

export function useActivityTracking(): UseActivityTrackingReturn {
    const [activityData, setActivityData] = useState<ActivityData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const activityService = useRef(ActivityService.getInstance());
    const authService = useRef(AuthService.getInstance());

    const updateActivity = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await activityService.current.updateActivity();
            // Assuming the response data maps to ActivityData
            setActivityData(data as any);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Activity update failed";
            setError(errorMessage);
            console.error("Activity update error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const startTracking = useCallback(() => {
        if (authService.current.isAuthenticated()) {
            activityService.current.initializeTracking();
            setIsTracking(true);

            // Initial activity update
            updateActivity();
        }
    }, [updateActivity]);

    const stopTracking = useCallback(() => {
        activityService.current.cleanup();
        setIsTracking(false);
    }, []);

    // Initialize tracking when component mounts
    useEffect(() => {
        if (authService.current.isAuthenticated()) {
            startTracking();
        }

        return () => {
            stopTracking();
        };
    }, [startTracking, stopTracking]);

    // Listen for authentication state changes
    useEffect(() => {
        const checkAuthAndUpdateTracking = () => {
            if (authService.current.isAuthenticated()) {
                if (!isTracking) {
                    startTracking();
                }
            } else {
                if (isTracking) {
                    stopTracking();
                }
            }
        };

        // Check on mount
        checkAuthAndUpdateTracking();

        // Set up periodic auth check (every 30 seconds)
        const authCheckInterval = setInterval(checkAuthAndUpdateTracking, 30000);

        return () => {
            clearInterval(authCheckInterval);
        };
    }, [isTracking, startTracking, stopTracking]);

    return {
        activityData,
        isLoading,
        error,
        updateActivity,
        isTracking,
    };
}
