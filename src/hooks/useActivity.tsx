import { useEffect, useRef, useCallback } from "react";
import { logout, updateActivity, getAccessToken } from "../utils/auth";

interface UseActivityProps {
  timeout?: number;
}

export function useActivity({ timeout = 15 * 60 * 1000 }: UseActivityProps) {
  const timerRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    const token = getAccessToken();

    if (!token) return;

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    updateActivity();

    timerRef.current = window.setTimeout(() => {
      const stillHasToken = getAccessToken();

      if (stillHasToken) {
        logout();
        window.location.href = "/signin";
      }
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) return;

    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer]);
}
