"use client";

import { useMemo } from "react";
import {
    useGamificationStatus,
    useLeagueLeaderboard,
} from "@/services/gamification";

interface UseGamificationDataProps {
    leagueId?: string;
    timePeriod?: string;
    limit?: number;
}

export function useGamificationData({
    leagueId,
    timePeriod = "weekly",
    limit = 10,
}: UseGamificationDataProps = {}) {
    // Use the summarized status endpoint which contains streak, energy, and xp
    const {
        gamificationStatus,
        isLoading: isLoadingStatus,
        isError: isStatusError,
        mutate: mutateStatus,
    } = useGamificationStatus();

    const {
        leaderboard,
        isLoading: isLoadingLeaderboard,
        isError: isLeaderboardError,
        mutate: mutateLeaderboard,
    } = useLeagueLeaderboard(timePeriod, leagueId, limit);

    const isLoading = useMemo(() => {
        return (
            isLoadingStatus ||
            isLoadingLeaderboard
        );
    }, [
        isLoadingStatus,
        isLoadingLeaderboard,
    ]);

    const hasError = useMemo(() => {
        return (
            isStatusError || isLeaderboardError
        );
    }, [isStatusError, isLeaderboardError]);

    const mutateAll = useMemo(() => {
        return () =>
            Promise.all([
                mutateStatus(),
                mutateLeaderboard(),
            ]);
    }, [mutateStatus, mutateLeaderboard]);

    return {
        // Map gamificationStatus to the properties components expect
        streak: gamificationStatus, // Now matches StreakData interface
        progress: gamificationStatus, // Also contains level/xp info
        league: gamificationStatus?.league,
        leaderboard,
        isLoading,
        hasError,
        mutateAll,
    };
}
