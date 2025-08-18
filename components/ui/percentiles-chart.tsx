"use client";

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LabelList } from "recharts";

interface PercentilesChartDatum {
  name: string;
  value: number;
}

interface PercentilesChartProps {
  data: PercentilesChartDatum[];
  title: string;
  subtitle?: string;
}

export function PercentilesChart({ data, title, subtitle }: PercentilesChartProps) {
  const gradientId = "percentilesGradient";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 ">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 24, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Salary"]}
              labelStyle={{ color: "#374151" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#0EA5E9"
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="value"
                position="top"
                formatter={(label: any) => `$${Number(label).toLocaleString()}`}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
