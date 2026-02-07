"use client";

import { useEffect } from "react";

export default function PWARegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator && window.location.hostname !== "localhost") {
            let refreshing = false;

            // Handle controller change (new SW takes over)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                console.log("New content available, reloading...");
                window.location.reload();
            });

            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then(registration => {
                        console.log("PWA Service Worker registered with scope:", registration.scope);

                        // If there's an updated SW waiting, tell it to skip waiting
                        if (registration.waiting) {
                            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                        }

                        // Listen for future updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            if (newWorker) {
                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        // New service worker is installed, send message to skip waiting
                                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                                    }
                                });
                            }
                        });

                        // Check for updates every hour
                        setInterval(() => {
                            registration.update();
                            console.log("Checked for PWA update");
                        }, 60 * 60 * 1000);
                    })
                    .catch(error => {
                        console.error("PWA Service Worker registration failed:", error);
                    });
            });
        }
    }, []);

    return null;
}
