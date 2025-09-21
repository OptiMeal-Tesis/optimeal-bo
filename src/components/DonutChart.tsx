import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface DonutChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface DonutChartProps {
  data: DonutChartData[];
  title: string;
  total: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  total,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <span className="text-h3-bold mb-4">{title}</span>

      <div className="flex items-center gap-6 flex-1">
        {/* Legend */}
        <div className="flex flex-col justify-center space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {item.name}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Donut Chart */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
