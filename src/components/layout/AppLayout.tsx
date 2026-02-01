import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1">
        <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
