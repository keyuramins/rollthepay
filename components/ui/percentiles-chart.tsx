"use client";

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LabelList, Label } from "recharts";

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
  const formatDollarsK = (v: number) => {
    const n = Number(v) || 0;
    if (Math.abs(n) >= 1000) {
      const k = Math.round(n / 1000);
      return `$${k}k`;
    }
    return `$${n.toLocaleString()}`;
  };

  return (
    <div className="bg-card rounded-lg shadow-xs p-6 border">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 24, left: 56, bottom: 28 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{ value: 'Percentile (10th to 90th)', position: 'insideBottom', offset: -18, fill: 'var(--muted-foreground)', fontSize: 14, fontWeight: 500 }}
              tick={(props: any) => {
                const { x, y, payload } = props;
                const text = payload?.value;
                return (
                  <text x={x} y={y} textAnchor="middle" fill="var(--primary)" fontSize={14} fontWeight={600}>
                    {text}
                  </text>
                );
              }}
              tickLine={false}
              axisLine={false}
              tickMargin={15}
            />
            <YAxis
              width={80}
              tickLine={false}
              axisLine={false}
              tick={(props: any) => {
                const { x, y, payload } = props;
                const text = formatDollarsK(payload?.value);
                return (
                  <text x={x} y={y} textAnchor="end" fill="var(--primary)" fontSize={14} fontWeight={600}>
                    {text}
                  </text>
                );
              }}
            >
              <Label
                value="Annual Salary ($)"
                angle={-90}
                position="insideLeft"
                offset={-10}
                style={{ fill: 'var(--muted-foreground)', fontSize: 14, textAnchor: 'middle', fontWeight: 500 }}
              />
            </YAxis>
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Annual Salary']}
              labelFormatter={(label: string) => `${label} percentile`}
              labelStyle={{ color: "var(--primary)" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="value"
                position="top"
                content={(props: any) => {
                  const { x, y, value, index } = props;
                  if (index === 0) return null; // avoid overlapping the y-axis at the first point
                  const text = `$${Number(value).toLocaleString()}`;
                  return (
                    <text x={x} y={(y ?? 0) - 8} textAnchor="middle" fill="var(--primary)" fontSize={14} fontWeight={600}>
                      {text}
                    </text>
                  );
                }}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend and axis help */}
      <div className="mt-4 flex flex-col items-center gap-1">
        <div className="flex items-center space-x-2 rounded-full px-4 py-1 bg-secondary/30 border border-input mt-2">
          <div className="w-3 h-3 rounded-full bg-chart-1" />
          <span className="text-sm font-bold text-black">Annual salary at each percentile</span>
        </div>
      </div>
    </div>
  );
}
