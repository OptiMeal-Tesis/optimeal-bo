import React from "react";

interface StatsSummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow";
}

export const StatsSummaryCard: React.FC<StatsSummaryCardProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <div className="rounded-lg p-6 bg-primary-500">
      <div className="flex items-center justify-between text-white">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {icon && <div className="text-3xl opacity-80">{icon}</div>}
      </div>
    </div>
  );
};
