import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDownIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { LayoutDashboard, Folder, Bell } from "lucide-react";
import { NavItem } from "../interface";
import { usePermission } from "../permissions/usePermission";

// 🔥 normalize helper
const normalize = (str?: string) => str?.toLowerCase();

// 🔥 nav com permission
export const navItems: (NavItem & {
  permission?: string;
  subItems?: (NavItem["subItems"][0] & { permission?: string })[];
})[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/",
    permission: "dashboard",
  },
  {
    icon: <Folder size={20} />,
    name: "Cadastros",
    subItems: [
      {
        name: "Usuários",
        path: "/users",
        permission: "users",
      },
      {
        name: "Perfis de Acesso",
        path: "/permissionsusers",
        permission: "permissionsusers",
      },
    ],
  },
  {
    icon: <Bell size={20} />,
    name: "Notificações",
    path: "/notifications",
    permission: "notifications",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const auth = JSON.parse(localStorage.getItem("auth") || "{}");

  // 🔥 normaliza permissions (chaves lowercase)
  const rawPermissions = auth?.user?.role || {};
  const permissions = Object.keys(rawPermissions).reduce((acc, key) => {
    acc[key.toLowerCase()] = rawPermissions[key];
    return acc;
  }, {} as any);

  const { can } = usePermission(permissions);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  const showFullContent = isMobileOpen || isExpanded || isHovered;

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileOpen]);

  // 🔥 FILTRO RBAC
  const filteredNavItems = navItems
    .map((item) => {
      if (!item.subItems) {
        if (!item.permission) return item;

        return can(normalize(item.permission)!) ? item : null;
      }

      const visibleSubItems = item.subItems.filter((sub) => {
        if (!sub.permission) return true;
        return can(normalize(sub.permission)!);
      });

      if (visibleSubItems.length === 0) return null;

      return {
        ...item,
        subItems: visibleSubItems,
      };
    })
    .filter((item): item is NavItem => item !== null);

  // 🔥 AUTO OPEN
  useEffect(() => {
    let matched = false;

    filteredNavItems.forEach((item) => {
      if (item.subItems) {
        if (item.subItems.some((s) => isActive(s.path))) {
          setOpenMenu(item.name);
          matched = true;
        }
      }
    });

    if (matched) setOpenMenu(null);
  }, [location, isActive, filteredNavItems]);

  // 🔥 CALC HEIGHT
  useEffect(() => {
    if (openMenu) {
      const el = subMenuRefs.current[openMenu];
      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [openMenu]: el.scrollHeight,
        }));
      }
    }
  }, [openMenu]);

  const toggleSubmenu = (name: string) => {
    setOpenMenu((prev) => (prev === name ? null : name));
  };

  const renderMenu = (items: typeof filteredNavItems) => (
    <ul className="flex flex-col gap-2 px-3">
      {items.map((nav) => {
        const isNavActive = nav.path ? isActive(nav.path) : false;
        const isSubmenuOpen = openMenu === nav.name;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <>
                <button
                  onClick={() => toggleSubmenu(nav.name)}
                  className={`menu-item group ${
                    isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
                  } ${!showFullContent ? "justify-center" : ""}`}
                >
                  <span className="menu-item-icon-size">{nav.icon}</span>

                  {showFullContent && (
                    <>
                      <span className="menu-item-text">{nav.name}</span>
                      <ChevronDownIcon
                        className={`ml-auto w-5 h-5 transition-transform ${
                          isSubmenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                <div
                  ref={(el) => {
                    subMenuRefs.current[nav.name] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      isSubmenuOpen && showFullContent
                        ? `${subMenuHeight[nav.name] || 0}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((s) => {
                      const isChildActive = isActive(s.path);

                      return (
                        <li key={s.name}>
                          <Link
                            to={s.path}
                            onClick={() => {
                              if (isMobileOpen) setIsHovered(false);
                            }}
                            className={`menu-dropdown-item ${
                              isChildActive
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                            }`}
                          >
                            {s.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  onClick={() => {
                    if (isMobileOpen) setIsHovered(false);
                  }}
                  className={`menu-item group ${
                    isNavActive ? "menu-item-active" : "menu-item-inactive"
                  } ${!showFullContent ? "justify-center" : ""}`}
                >
                  <span className="menu-item-icon-size">{nav.icon}</span>

                  {showFullContent && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsHovered(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-dvh z-50 bg-white dark:bg-gray-900 border-r
        transition-all duration-300
        ${showFullContent ? "w-[280px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && !isMobileOpen && setIsHovered(true)}
        onMouseLeave={() => !isMobileOpen && setIsHovered(false)}
      >
        <div
          className={`flex items-center py-8 px-4 ${
            !showFullContent ? "justify-center" : "justify-start"
          }`}
        >
          <Link to="/" className="flex items-center">
            {showFullContent ? (
              <img src="/images/logo/logo.svg" width={150} />
            ) : (
              <img src="/images/logo/logo-icon.svg" width={32} />
            )}
          </Link>
        </div>

        <nav className="flex flex-col h-[calc(100dvh-80px)] overflow-y-auto py-4">
          {renderMenu(filteredNavItems)}
        </nav>
      </aside>
    </>
  );
};

export default AppSidebar;
