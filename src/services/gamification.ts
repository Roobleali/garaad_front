import useSWR from "swr";
import AuthService from "./auth";
import { API_BASE_URL } from "@/lib/constants";

const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    provider: () => new Map(),
    revalidateIfStale: true,
    revalidateOnMount: true,
};

const fetcher = async (url: string) => {
    const token = await AuthService.getInstance().ensureValidToken();

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
    return response.json();
};

// --- SWR Hooks ---

export function useProblem(problemId?: string) {
    const shouldFetch = !!problemId;
    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? `${API_BASE_URL}/api/problems/${problemId}/` : null,
        fetcher,
        swrConfig
    );

    return {
        problem: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useGamificationStatus() {
    const { data, error, isLoading, mutate } = useSWR(
        `${API_BASE_URL}/api/gamification/status/`,
        fetcher,
        swrConfig
    );

    return {
        gamificationStatus: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useNotification() {
    const { data, error, isLoading, mutate } = useSWR(
        `${API_BASE_URL}/api/notifications/`,
        fetcher,
        swrConfig
    );

    return {
        notification: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useStreak() {
    const { data, error, isLoading, mutate } = useSWR(
        `${API_BASE_URL}/api/gamification/streak/`,
        fetcher,
        swrConfig
    );

    return {
        streak: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useProgress() {
    const { data, error, isLoading, mutate } = useSWR(
        `${API_BASE_URL}/api/gamification/progress/`,
        fetcher,
        swrConfig
    );

    return {
        progress: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useLeague() {
    const { data, error, isLoading, mutate } = useSWR(
        `${API_BASE_URL}/api/gamification/league/`,
        fetcher,
        swrConfig
    );

    return {
        league: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useLeagues() {
    const { data, error, isLoading, mutate } = useSWR(
        `${API_BASE_URL}/api/gamification/leagues/`,
        fetcher,
        swrConfig
    );

    return {
        leagues: data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useLeagueLeaderboard(
    timePeriod = "weekly",
    leagueId?: string,
    limit = 10
) {
    const query = new URLSearchParams({
        time_period: timePeriod,
        ...(leagueId ? { league: leagueId } : {}),
        ...(limit ? { limit: limit.toString() } : {}),
    });

    const url = `${API_BASE_URL}/api/gamification/leaderboard/?${query.toString()}`;

    const { data, error, isLoading, mutate } = useSWR(url, fetcher, swrConfig);

    return {
        leaderboard: data,
        isLoading,
        isError: error,
        mutate,
    };
}
