"use client";

import { useEffect } from "react";

interface XPToastProps {
    xp: number;
    onDismiss: () => void;
    durationMs?: number;
}

/**
 * Transient toast for XP earned (vote +2, comment +5, project submit +15).
 * Bottom-right, purple bg, auto-dismiss after durationMs (default 2500).
 */
export function XPToast({ xp, onDismiss, durationMs = 2500 }: XPToastProps) {
    useEffect(() => {
        const t = setTimeout(() => onDismiss(), durationMs);
        return () => clearTimeout(t);
    }, [onDismiss, durationMs]);

    return (
        <button
            type="button"
            onClick={onDismiss}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-white shadow-lg transition hover:opacity-90 font-medium"
            aria-label="Dismiss"
        >
            <span aria-hidden>⚡</span>
            <span>+{xp} XP</span>
        </button>
    );
}
