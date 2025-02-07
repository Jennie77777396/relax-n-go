import { Task as TasksBlockType } from "@/payload-types";

export function TaskCardServer({ data }: { data: TasksBlockType | undefined }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{data?.taskEmoji || "📌"}</span>
        <h3 className="text-lg font-semibold">{data?.taskName}</h3>
      </div>
    </div>
  );
} 