import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useActivity } from "../hooks/useActivity";
import { isAuthenticated } from "../utils/auth";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // 🔥 SÓ ATIVA SE ESTIVER AUTENTICADO
  const isAuth = isAuthenticated();

  useActivity({
    timeout: isAuth ? 15 * 60 * 1000 : undefined,
  });

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#0B1220]">
      <div className="flex min-h-screen">
        <AppSidebar />
        <Backdrop />

        <div
          className={`flex min-h-0 flex-1 flex-col transition-all duration-300 ease-in-out
            ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"}
            ${isMobileOpen ? "ml-0" : ""}`}
        >
          <AppHeader />

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
