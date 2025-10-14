import React from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

// Sidebar extracted to its own component

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <div className="flex flex-col h-screen">
          <div className="p-9">
            <span className="text-h1-bold text-primary-500">
              {import.meta.env.VITE_COMPANY_NAME || "OptiMeal"}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-9 pb-4">
            <div className="relative">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
