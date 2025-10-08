import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Logo } from "../assets/Logo";
import { OrderIcon } from "../assets/icons/OrderIcon";
import { FoodIcon } from "../assets/icons/FoodIcon";
import { StatsIcon } from "../assets/icons/StatsIcon";
import { LogOutIcon } from "../assets/icons/LogOutIcon";
import { useGetCurrentUser } from "../hooks/useUser";
import { UserIcon } from "../assets/icons/UserIcon";

interface LayoutProps {
  children: React.ReactNode;
}

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

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: currentUser } = useGetCurrentUser();

  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) {
      const word = parts[0];
      const firstTwo = (word[0] || "") + (word[1] || "");
      return firstTwo.toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white flex flex-col border-r border-gray-200 z-10">
        {/* Logo at the top */}
        <div className="p-4">
          <div className="flex items-center justify-center gap-3">
            <Logo width={200} height={55} />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sub1`}
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

        {/* Admin and Logout at bottom */}
        <div className="flex p-3 text-primary-500 items-center justify-between">
          <div className="flex flex-row items-center gap-2 max-w-[80%]">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 flex-shrink-0">
              <span className="text-white text-body2 leading-none">{getInitials(currentUser?.name)}</span>
            </div>
            <span className="text-body1 overflow-hidden text-ellipsis whitespace-nowrap">{currentUser?.name}</span>
          </div>
          <LogOutIcon color="var(--color-gray-700)" onClick={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="p-9">
            <span className="text-h1-bold text-primary-500">
              {import.meta.env.VITE_COMPANY_NAME || "OptiMeal"}
            </span>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-9 pb-4">
            <div className="relative">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
