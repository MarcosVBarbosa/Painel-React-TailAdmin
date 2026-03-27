import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import { ChevronDownIcon, UserCircleIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { UserKey } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "Usuários",
    path: "/users",
  },
  {
    icon: <UserKey  />,
    name: "Permissões",
    path: "/permissionsusers",
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
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {/* ITEM COM SUBMENU */}
          {nav.subItems ? (
            <>
              <button
                onClick={() => toggleSubmenu(index)}
                className={`menu-item group ${
                  openIndex === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    openIndex === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform ${
                        openIndex === index ? "rotate-180 text-brand-500" : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {/* SUBMENU */}
              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[index] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openIndex === index
                        ? `${subMenuHeight[index] || 0}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {nav.subItems.map((s) => (
                      <li key={s.name}>
                        <Link
                          to={s.path}
                          className={`menu-dropdown-item ${
                            isActive(s.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            /* ITEM SIMPLES */
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 px-5 bg-white dark:bg-gray-900 border-r 
        ${isExpanded || isHovered || isMobileOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        h-screen transition-all duration-300`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LOGO */}
      <div
        className={`py-8 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
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

      <nav className="flex flex-col overflow-y-auto no-scrollbar">
        {renderMenu(navItems)}
      </nav>
    </aside>
  );
};

export default AppSidebar;
