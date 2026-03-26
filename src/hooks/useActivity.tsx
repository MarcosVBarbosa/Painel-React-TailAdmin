import { useEffect, useRef, useCallback } from "react";
import { logout } from "../utils/auth";

interface UseActivityProps {
  timeout?: number;
}

export function useActivity({ timeout = 15 * 60 * 1000 }: UseActivityProps) {
  const timerRef = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      console.log("Usuário inativo → logout automático");
      logout();
      window.location.href = "/signin";
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetTimer]);
}
