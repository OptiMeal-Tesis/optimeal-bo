import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../assets/Logo";
import { OrderIcon } from "../assets/icons/OrderIcon";
import { FoodIcon } from "../assets/icons/FoodIcon";
import { StatsIcon } from "../assets/icons/StatsIcon";
import { LogOutIcon } from "../assets/icons/LogOutIcon";
import { EllipsisVerticalIcon } from "../assets/icons/EllipsisVerticalIcon";
import { useAuth } from "../contexts/AuthContext";
import { useGetCurrentUser } from "../hooks/useUser";
import { CustomButton } from ".";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navigationItems: NavItem[] = [
  {
    path: "/orders",
    label: "Pedidos",
    icon: <OrderIcon color="var(--color-primary-500)" />,
  },
  {
    path: "/products",
    label: "Productos",
    icon: <FoodIcon color="var(--color-primary-500)" />,
  },
  {
    path: "/stats",
    label: "Estadísticas",
    icon: <StatsIcon color="var(--color-primary-500)" />,
  },
];

const getInitials = (name?: string, lastName?: string) => {
  if (!name) return "";
  if (!lastName) return "";
  return (name[0] + lastName[0]).toUpperCase();
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: currentUser } = useGetCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLSpanElement | null>(null);

  const handleMouseEnter = () => {
    if (nameRef.current) {
      const isTruncated = nameRef.current.scrollWidth > nameRef.current.clientWidth;
      setShowTooltip(isTruncated);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white flex flex-col border-r border-gray-200 z-10">
      <div className="p-4">
        <div className="flex items-center justify-center gap-3">
          <Logo width={200} height={55} />
        </div>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sub1`}
                  style={{
                    color: "var(--color-primary-500)",
                    backgroundColor: isActive
                      ? "rgba(13, 71, 161, 0.2)"
                      : "transparent",
                  }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex p-3 text-primary-500 items-center justify-between relative mb-1" ref={menuRef}>
        <div className="flex flex-row items-center gap-2 max-w-[80%] min-w-0 flex-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 flex-shrink-0">
            <span className="text-white text-body2 leading-none">{getInitials(currentUser?.name, currentUser?.lastName)}</span>
          </div>
          <div className="flex flex-col gap-1 relative min-w-0 flex-1">
            <span 
              ref={nameRef}
              className="text-body1 overflow-hidden text-ellipsis whitespace-nowrap block" 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {currentUser?.name} {currentUser?.lastName}
            </span>
            {showTooltip && currentUser?.name && (
              <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-body2 rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none">
                {currentUser?.name} {currentUser?.lastName}
                <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
            <span className="text-body2 text-gray-700">Administrador</span>
          </div>
        </div>
        <EllipsisVerticalIcon color="var(--color-gray-700)" onClick={() => setMenuOpen((prev) => !prev)} />

        {menuOpen && (
          <div className="absolute -right-40 bg-white border border-gray-200 rounded-md shadow-md w-44 py-1 z-20">
            <CustomButton
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700"
              onClick={handleLogout}
            >
              <LogOutIcon color="var(--color-gray-700)" />
              <span className="text-body1 text-gray-700">Cerrar sesión</span>
            </CustomButton>
          </div>
        )}
      </div>
    </aside>
  );
}


