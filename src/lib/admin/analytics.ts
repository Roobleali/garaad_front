import { adminApi as api } from "@/lib/admin-api";

export interface OnboardingStats {
    goals: Record<string, number>;
    tracks: Record<string, number>;
    levels: Record<string, number>;
    time_per_day: Record<string, number>;
    completion_rate: number;
    total_with_onboarding?: number;
    completed_count?: number;
    /** Users with no UserOnboarding record (signed up before onboarding existed). */
    no_onboarding_data?: number;
}

export interface UserListItem {
    id: number;
    email: string;
    username: string;
    goal: string;
    track: string;
    level: string;
    time_per_day: string;
    date_joined: string | null;
}

export interface UserAnalytics {
    total: number;
    change: number;
    newUsers: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    activeUsers: {
        dau: number;
        dauChange: number;
        wau: number;
        wauChange: number;
        mau: number;
        mauChange: number;
    };
    retention: {
        day1: number;
        day7: number;
        day30: number;
    };
    churnRate: number;
    trends: {
        labels: string[];
        newUsers: number[];
        activeUsers: number[];
    };
    onboardingStats?: OnboardingStats | null;
    userList?: UserListItem[];
}

export interface RevenueAnalytics {
    total: number;
    change: number;
    arpu: number;
    arpuChange: number;
    conversionRate: number;
    conversionChange: number;
    revenueByCourse: {
        name: string;
        revenue: number;
        percentage: number;
    }[];
    trends: {
        labels: string[];
        revenue: number[];
    };
}

export interface CourseAnalytics {
    topCourses: {
        id: number;
        title: string;
        enrollments: number;
        completionRate: number;
        avgRating: number;
        revenue: number;
        trend: "up" | "down" | "neutral";
    }[];
    dropOffPoints: {
        lessonTitle: string;
        courseTitle: string;
        dropOffRate: number;
    }[];
}

export interface RecentActivity {
    signups: {
        userName: string;
        timestamp: string;
        avatar: string;
    }[];
    purchases: {
        userName: string;
        course: string;
        amount: number;
        timestamp: string;
    }[];
    enrollments: {
        userName: string;
        course: string;
        timestamp: string;
    }[];
}

export const analyticsService = {
    getUsers: async (): Promise<UserAnalytics> => {
        const response = await api.get("/lms/analytics/users/");
        return response.data;
    },
    getRevenue: async (): Promise<RevenueAnalytics> => {
        const response = await api.get("/lms/analytics/revenue/");
        return response.data;
    },
    getCourses: async (): Promise<CourseAnalytics> => {
        const response = await api.get("/lms/analytics/courses/");
        return response.data;
    },
    getActivity: async (): Promise<RecentActivity> => {
        const response = await api.get("/lms/analytics/activity/");
        return response.data;
    },
};
