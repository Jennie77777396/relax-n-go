"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "System Design", value: 10 },
  { name: "Algorithm", value: 40 },
  { name: "Full Stack Knowledge", value: 20 },
  { name: "Life", value: 30}
];

const COLORS = ["#10b981", "#6366f1", "#facc15"];

export default function PieChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={50}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
