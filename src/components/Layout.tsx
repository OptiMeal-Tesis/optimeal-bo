import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import optimealLogo from "../assets/images/optimeal-logo.png";
import { OrderIcon } from "../assets/icons/OrderIcon";
import { FoodIcon } from "../assets/icons/FoodIcon";
import { StatsIcon } from "../assets/icons/StatsIcon";
import { LogOutIcon } from "../assets/icons/LogOutIcon";

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen flex flex-col border-r border-gray-200">
          {/* Logo at the top */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <img src={optimealLogo} alt="OptiMeal Logo" />
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
          <div className="flex gap-3 px-4 py-3 text-sub1 text-primary-500 items-center justify-between">
            <span>Admin</span>
            <LogOutIcon color="var(--color-error)" onClick={handleLogout} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 p-9 gap-10 bg-gray-100">
          <span className="text-h1-bold text-primary-500">
            {import.meta.env.VITE_COMPANY_NAME || "OptiMeal"}
          </span>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
