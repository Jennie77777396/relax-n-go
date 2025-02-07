import { TaskCardServer } from "./TaskCard.server";
import { TaskCardClient } from "./TaskCard.client";
import { Task as TasksBlockType } from "@/payload-types";

export function FullTaskCard({ data }: { data: TasksBlockType | undefined }) {
  return (
    <div className="w-full">
      <TaskCardServer data={data} />
      <TaskCardClient data={data} />
    </div>
  );
}
