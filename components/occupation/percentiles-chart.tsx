"use client";

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LabelList, Label, ReferenceLine } from "recharts";
import { formatCurrency } from "@/lib/format/currency";

interface PercentilesChartDatum {
  name: string;
  value: number;
}

interface PercentilesChartProps {
  data: PercentilesChartDatum[];
  title: string;
  subtitle?: string;
  country?: string; // Add country for currency formatting
}

export function PercentilesChart({ data, title, subtitle, country }: PercentilesChartProps) {
  const gradientId = "percentilesGradient";
  const formatCurrencyValue = (v: number) => {
    const n = Number(v) || 0;
    if (country) {
      // Use proper currency formatting with country-specific symbols
      return formatCurrency(n, country);
    }
    // Fallback to simple formatting if no country provided
    if (Math.abs(n) >= 1000) {
      const k = Math.round(n / 1000);
      return `$${k}k`;
    }
    return `$${n.toLocaleString()}`;
  };

  return (
    <div className="bg-card rounded-lg shadow-xs p-4 sm:p-6 border">
      <div className="mb-6">
        <h3>{title}</h3>
        {subtitle && <p className="mt-1">{subtitle}</p>}
      </div>

      {/* Mobile message - shown only on screens below sm */}
      <div className="sm:hidden">
        <div className="h-72 flex flex-col items-center justify-center text-center p-6 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-primary/10">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">Chart Best Viewed on Desktop</h4>
          <p className="text-sm mb-4">
            This interactive chart is optimized for larger screens. For the best experience, please view on desktop or rotate your device to landscape mode.
          </p>
        </div>
      </div>

      {/* Desktop chart - shown only on sm and above */}
      <div className="hidden sm:block h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 56, left: 56, bottom: 28 }}>
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
                const text = formatCurrencyValue(payload?.value);
                return (
                  <text x={x} y={y} textAnchor="end" fill="var(--primary)" fontSize={14} fontWeight={600}>
                    {text}
                  </text>
                );
              }}
            >
              <Label
                value={country ? `Annual Salary (${formatCurrency(0, country).replace(/\d/g, '')})` : "Annual Salary ($)"}
                angle={-90}
                position="insideLeft"
                offset={-10}
                style={{ fill: 'var(--muted-foreground)', fontSize: 14, textAnchor: 'middle', fontWeight: 500 }}
              />
            </YAxis>
            {Array.isArray(data) && data.length > 0 ? (
              <ReferenceLine
                y={Number(data[0]?.value) || 0}
                stroke="transparent"
                ifOverflow="extendDomain"
                label={{
                  value: formatCurrencyValue(Number(data[0]?.value) || 0),
                  position: 'left',
                  fill: 'var(--primary)',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              />
            ) : null}
            <Tooltip
              formatter={(value: number) => [formatCurrencyValue(value), 'Annual Salary']}
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
                  const text = formatCurrencyValue(Number(value));
                  const isLast = index === (data?.length ? data.length - 1 : -1);
                  const adjustedX = (x ?? 0) + (isLast ? -12 : 0);
                  return (
                    <text x={adjustedX} y={(y ?? 0) - 8} textAnchor={isLast ? "end" : "middle"} fill="var(--primary)" fontSize={14} fontWeight={600}>
                      {text}
                    </text>
                  );
                }}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend and axis help - shown only on sm and above */}
      <div className="hidden sm:flex mt-4 flex-col items-center gap-1">
        <div className="flex items-center space-x-2 rounded-full px-2 sm:px-4 py-0.5 sm:py-1 bg-secondary/30 border border-input mt-2">
          <div className="w-3 h-3 rounded-full bg-chart-1" />
          <span className="text-xs sm:text-sm font-bold text-black">Annual salary at each percentile</span>
        </div>
      </div>
    </div>
  );
}
