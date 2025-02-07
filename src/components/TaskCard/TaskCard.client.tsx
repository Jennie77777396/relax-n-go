"use client";

import { Task as TasksBlockType, Field } from "@/payload-types";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTaskStore } from "@/stores/useTaskStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export function TaskCardClient({ data }: { data: TasksBlockType | undefined }) {
  const { updateTask, fetchTask, taskDetails } = useTaskStore();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  const handleToggle = async (checked: boolean) => {
    setIsRunning(checked);
    if (checked) {
      // Start timer
      setStartTime(new Date());
      setElapsedTime(0);
      await updateTask(data?.id.toString() ?? "", {
        startTime: new Date().getTime(),
      });

    } else {
      // Stop timer and update total time
      const totalMinutes = Math.floor(elapsedTime / 60);
      await updateTask(data?.id.toString() ?? "", {
        totalMinutesSpent: (data?.totalMinutesSpent || 0) + totalMinutes,
        startTime: null,
      });
      setStartTime(null);
    }
  };

  return (
    <TooltipProvider>
      <motion.div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Timer and status controls */}
        <div className="flex items-center justify-between mb-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{formatTime(elapsedTime)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Elapsed time</p>
            </TooltipContent>
          </Tooltip>
          <Switch 
            checked={isRunning}
            onCheckedChange={handleToggle}
          />
        </div>
        {/* Fields display */}
        <div className="flex items-center justify-between mb-4 p-2 rounded-md">
          {data?.field?.map((field: number | Field) => (
            typeof field === 'object' && (
              <div 
                key={field.id.toString()} 
                className={`flex items-center bg-${field.color}-100 p-2 rounded-full`}
              >
                <p>{field.fieldName}</p>
              </div>
            )
          ))}
        </div>
      </motion.div>
    </TooltipProvider>
  );
} 