// hooks/useSoundManager.ts
"use client";

import { useEffect, useRef, useCallback } from "react";

type SoundKey = "click" | "correct" | "incorrect" | "continue" | "start-lesson";

interface SoundMap {
  [key: string]: HTMLAudioElement;
}

export function useSoundManager() {
  const soundsRef = useRef<Partial<SoundMap>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create and preload
    const soundFiles: Record<SoundKey, string> = {
      click: "/sounds/toggle-on.mp3",
      correct: "/sounds/correct.mp3",
      incorrect: "/sounds/incorrect.mp3",
      continue: "/sounds/lightweight-choice.mp3",
      "start-lesson": "/sounds/start-lesson.mp3",
    };

    const map: Partial<SoundMap> = {};

    for (const key of Object.keys(soundFiles) as SoundKey[]) {
      const audio = new Audio(soundFiles[key]);
      audio.preload = "auto";
      audio.load();
      map[key] = audio;
    }

    soundsRef.current = map;

    // Cleanup: pause and reset
    return () => {
      Object.values(map).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const playSound = useCallback(async (key: SoundKey) => {
    const audio = soundsRef.current[key];
    if (!audio) return;
    try {
      audio.currentTime = 0;
      const promise = audio.play();
      if (promise instanceof Promise) {
        await promise;
      }
    } catch (err) {
      // ignore play errors (e.g. user hasn't interacted yet)
      console.warn(`Sound "${key}" play failed:`, err);
    }
  }, []);

  return { playSound };
}
