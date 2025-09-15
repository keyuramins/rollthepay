"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface SalaryDistributionChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  title: string;
  subtitle?: string;
}

export function SalaryDistributionChart({ data, title, subtitle }: SalaryDistributionChartProps) {
  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Salary']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="value" fill="#3B82F6">
              <LabelList dataKey="value" position="top" formatter={(value: number) => `$${value.toLocaleString()}`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
