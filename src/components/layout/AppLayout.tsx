import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { UserPanel } from "./UserPanel";
import { useAuth } from "../common/AuthContext";
import { useDocuments } from "../../hooks/useDocuments";

function getUserFromToken(token: string | null): string {
  const storedUser = localStorage.getItem("authUser");
  if (storedUser) return storedUser;
  if (!token) return "User";
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return "User";
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const decoded = atob(padded);
    const payload = JSON.parse(decoded) as { sub?: string };
    return payload.sub || "User";
  } catch {
    return "User";
  }
}

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userPanelOpen, setUserPanelOpen] = useState(false);
  const [panelRefreshKey, setPanelRefreshKey] = useState(0);
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { documents } = useDocuments(panelRefreshKey, "");

  useEffect(() => {
    if (!userPanelOpen) return;

    const intervalId = window.setInterval(() => {
      setPanelRefreshKey((k) => k + 1);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [userPanelOpen]);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    setUserPanelOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <UserPanel
        open={userPanelOpen}
        onClose={() => setUserPanelOpen(false)}
        userEmail={getUserFromToken(token)}
        documents={documents}
        onLogout={handleLogout}
      />

      <div className="flex flex-col flex-1">
        <Header
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          onUserClick={() =>
            setUserPanelOpen((prev) => {
              const next = !prev;
              if (next) setPanelRefreshKey((k) => k + 1);
              return next;
            })
          }
        />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
