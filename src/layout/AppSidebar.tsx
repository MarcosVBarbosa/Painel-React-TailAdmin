import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronDownIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { LayoutDashboard, Folder, Bell } from "lucide-react";
import { NavItem } from "../interface";

export const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <Folder size={20} />,
    name: "Cadastros",
    subItems: [
      { name: "Usuários", path: "/users" },
      { name: "Perfis de Acesso", path: "/permissionsusers" },
    ],
  },
  {
    icon: <Bell size={20} />,
    name: "Notificações",
    path: "/Notifications",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  const showFullContent = isMobileOpen || isExpanded || isHovered;

  // 🔥 trava scroll no mobile
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileOpen]);

  // abre submenu automaticamente se rota ativa estiver dentro
  useEffect(() => {
    let matched = false;

    navItems.forEach((item, index) => {
      if (item.subItems) {
        if (item.subItems.some((s) => isActive(s.path))) {
          setOpenIndex(index);
          matched = true;
        }
      }
    });

    if (!matched) setOpenIndex(null);
  }, [location, isActive]);

  // calcula altura do submenu
  useEffect(() => {
    if (openIndex !== null) {
      const el = subMenuRefs.current[openIndex];
      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [openIndex]: el.scrollHeight,
        }));
      }
    }
  }, [openIndex]);

  const toggleSubmenu = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const renderMenu = (items: NavItem[]) => (
    <ul className="flex flex-col gap-2 px-3">
      {items.map((nav, index) => {
        const isNavActive = nav.path ? isActive(nav.path) : false;
        const isSubmenuOpen = openIndex === index;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <>
                <button
                  onClick={() => toggleSubmenu(index)}
                  className={`menu-item group ${
                    isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
                  } ${!showFullContent ? "justify-center" : ""}`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isSubmenuOpen
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>

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
                    subMenuRefs.current[index] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      isSubmenuOpen && showFullContent
                        ? `${subMenuHeight[index] || 0}px`
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
                  <span
                    className={`menu-item-icon-size ${
                      isNavActive
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>

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
      {/* OVERLAY MOBILE */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsHovered(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-dvh max-h-dvh overflow-hidden z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out
          ${showFullContent ? "w-[280px]" : "w-[90px]"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && !isMobileOpen && setIsHovered(true)}
        onMouseLeave={() => !isMobileOpen && setIsHovered(false)}
      >
        {/* LOGO ORIGINAL MANTIDO */}
        <div
          className={`flex items-center py-8 px-4 ${
            !showFullContent ? "justify-center" : "justify-start"
          }`}
        >
          <Link to="/" className="flex items-center">
            {showFullContent ? (
              <>
                <img
                  src="/images/logo/logo.svg"
                  className="dark:hidden"
                  width={150}
                />
                <img
                  src="/images/logo/logo-dark.svg"
                  className="hidden dark:block"
                  width={150}
                />
              </>
            ) : (
              <img src="/images/logo/logo-icon.svg" width={32} />
            )}
          </Link>
        </div>

        {/* MENU */}
        <nav className="flex flex-col h-[calc(100dvh-80px)] overflow-y-auto overflow-x-hidden no-scrollbar py-4">
          {renderMenu(navItems)}
        </nav>
      </aside>
    </>
  );
};

export default AppSidebar;
