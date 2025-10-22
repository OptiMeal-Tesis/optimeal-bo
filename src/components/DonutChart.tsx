import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
  const [tooltipPos, setTooltipPos] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const GAP = 16; // px gap from donut edge
  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: any[];
  }> = ({ active, payload }) => {
    if (active && payload && payload.length && total > 0) {
      const item = payload[0]?.payload as {
        name: string;
        value: number;
        color: string;
      };
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm px-3 py-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium text-gray-900">
              {item.name}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {percentage}% del total
          </div>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col donut-chart">
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
                <Tooltip
                  content={<CustomTooltip />}
                  position={tooltipPos}
                  offset={0}
                  wrapperStyle={{ pointerEvents: "none" }}
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  onMouseMove={(d: any, _index: number, e: any) => {
                    // Coordinates within chart
                    const cx = d?.cx ?? 0;
                    const cy = d?.cy ?? 0;
                    const outer = d?.outerRadius ?? 100;
                    const chartY = e?.chartY ?? cy;
                    // Always position to the right of the donut
                    const x = cx + outer + GAP;
                    const y = chartY - 30;
                    setTooltipPos({ x, y });
                  }}
                  onMouseLeave={() => setTooltipPos(undefined)}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
