"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Task A", time: 4 },
  { name: "Task B", time: 7 },
  { name: "Task C", time: 3 },
];

export default function BarChartComponent() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="time" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
