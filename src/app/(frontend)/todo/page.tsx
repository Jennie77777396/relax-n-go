'use client'

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ToDoPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Learn Next.js", completed: false },
    { id: 2, text: "Build a full-stack app", completed: true },
    { id: 4, text: "Learn Hooks for StopWatch Feature", completed: false },
    { id: 5, text: "Learn other 3 knowledge points", completed: false },
    { id: 6, text: "Global Header with Dynamic Links based on fields", completed: false }, 
    { id: 7, text: "Enable Rich Text Editor for Task Description, and Task Answer", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold">To-Do List for {new Date().toLocaleDateString()}</h1>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <span
                  className={`text-lg ${task.completed ? "line-through text-gray-500" : ""}`}
                >
                  {task.text}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-3 mt-4">
              <Input
                placeholder="New task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <Button onClick={addTask}>Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
