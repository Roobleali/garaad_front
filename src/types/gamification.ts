import { UserIdentity, NextAction } from "./auth";

export interface GamificationStatus {
    identity: UserIdentity;
    xp: number;
    level: number;
    streak: {
        current: number;
        status: "Stable" | "Unstable" | "At Risk";
        days_left_in_cycle?: number;
        last_activity_date: string;
    };
    energy: {
        current: number;
        max: number;
        next_refill?: string;
    };
    next_action: NextAction;
}

export interface ActivityUpdatePayload {
    action_type: string;
    request_id: string; // UUID enforced
    payload?: Record<string, any>;
}

export interface ActivityUpdateResponse {
    success: boolean;
    xp_gained: number;
    energy_used: number;
    new_status: GamificationStatus;
    milestones?: string[];
}
