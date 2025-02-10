"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Step 1", progress: 20 },
  { name: "Step 2", progress: 40 },
  { name: "Step 3", progress: 60 },
  { name: "Step 4", progress: 80 },
];

export default function LineChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="progress" stroke="#8b5cf6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
