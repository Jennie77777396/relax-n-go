"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";
import BarChartComponent from "@/components/BarChart";
import PieChartComponent from "@/components/PieChart";
import LineChartComponent from "@/components/LineChart";

export default function StatisticsClient() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Balance is Key</h1>
      <p className="text-center text-gray-500">Insights based on time spent on tasks</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Spent on Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-500" /> Time Spent on Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComponent />
          </CardContent>
        </Card>

        {/* Analysis Based on Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-500" /> Based on Fields
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartComponent />
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-purple-500" /> Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>Research about what interview questions will be asked now</div>
            <div>Speak more on algo</div>
            <div>Mock interview Vibe on Full-Stack Knowledge</div>
            <div>Start planning on networking</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
