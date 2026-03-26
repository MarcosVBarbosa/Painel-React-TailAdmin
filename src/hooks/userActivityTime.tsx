import { useEffect } from "react";
import { isAuthenticated, logout } from "../utils/auth";
import { useNavigate } from "react-router";

export function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        logout();
        navigate("/signin");
      }
    }, 5000); // verifica a cada 5s

    return () => clearInterval(interval);
  }, []);
}