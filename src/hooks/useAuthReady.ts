import { useAuthStore } from "@/store/useAuthStore";

/**
 * True only after the auth Zustand store has rehydrated from localStorage.
 * Use this to avoid rendering auth-dependent UI (nav, premium content, etc.)
 * with wrong initial state, which causes flash/flicker.
 */
export const useAuthReady = () => useAuthStore((s) => s.hydrated);
