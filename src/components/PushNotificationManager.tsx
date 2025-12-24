"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function PushNotificationManager() {
    const [permission, setPermission] = useState<NotificationPermission>("default");

    useEffect(() => {
        if ("Notification" in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!("Notification" in window)) {
            console.log("Lama taageero: Browser-kaagu ma taageero ogeysiisyada.");
            return;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === "granted") {
                console.log("Waad mahadsantahay! Waxaad hadda heli doontaa ogeysiisyada muhiimka ah.");

                // Ensure Service Worker is ready and subscribe if needed
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.ready;
                    // logic to subscribe user to backend would go here
                    console.log("Service Worker ready for push subscription", registration);
                }
            }
        } catch (error) {
            console.error("Error requesting permission:", error);
        }
    };

    if (permission === "granted" || permission === "denied") {
        return null; // Don't show button if already handled
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button
                onClick={requestPermission}
                className="gap-2 shadow-lg bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-6"
            >
                <Bell className="h-5 w-5" />
                Dar Ogeysiisyada
            </Button>
        </div>
    );
}
