import { useCallback, useEffect, useState } from "react";
import { generateToken } from "../api/auth.api";

const STORAGE_KEY = "authToken";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (token) localStorage.setItem(STORAGE_KEY, token);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [token]);

  const login = useCallback(async (userId?: string) => {
    const t = await generateToken(userId);
    setToken(t);
    return t;
  }, []);

  const logout = useCallback(() => setToken(null), []);

  return { token, login, logout } as const;
}

export default useAuth;
