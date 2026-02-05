import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { generateToken } from "../../api/auth.api";

const STORAGE_KEY = "authToken";

type AuthContextType = {
  token: string | null;
  login: (userId?: string) => Promise<string>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  // 🔹 Load token once on app start
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = useCallback(async (userId?: string) => {
    const t = await generateToken(userId);
    localStorage.setItem(STORAGE_KEY, t);
    setToken(t);
    return t;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
