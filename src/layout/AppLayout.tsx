import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useActivity } from "../hooks/useActivity";

const LayoutContent: React.FC = () => {
  useActivity({ timeout: 1 * 60 * 1000 });
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    // 1) Raiz da página ocupa a viewport
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#0B1220]">
      {/* 2) Linha principal: sidebar + conteúdo */}
      <div className="flex min-h-screen">
        {/* Sidebar fixa (sem wrapper extra que quebre a altura) */}
        <AppSidebar />
        <Backdrop />

        {/* 3) Coluna da direita precisa permitir expansão vertical */}
        <div
          className={`flex min-h-0 flex-1 flex-col transition-all duration-300 ease-in-out
            ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"}
            ${isMobileOpen ? "ml-0" : ""}`}
        >
          {/* Header com altura fixa */}
          <AppHeader />

          {/* 4) Área de conteúdo elástica */}
          <main className="flex-1 min-h-0">
            <div className="h-full p-1 md:p-2 mx-auto max-w-(--breakpoint-1xl)">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
