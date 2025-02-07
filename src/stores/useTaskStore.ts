import { create } from "zustand";
import { Task } from "@/payload-types";
import { getTask, getTasks, createTask, updateTask, deleteTask } from "@/app/(frontend)/actions";

interface TaskStore {
  tasks: Task[];
  taskDetails: Record<string, Task>; // Store individual tasks by their ID
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTask: (id: number) => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  taskDetails: {}, // Store for individual tasks
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await getTasks();
      set({ tasks: tasks.docs as Task[] });
    } catch (error) {
      set({ error: error as string });
    } finally {
      set({ loading: false });
    }
  },

  fetchTask: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const task = await getTask(id);
      set((state) => ({
        taskDetails: {
          ...state.taskDetails,
          [id]: task as Task,
        }
      }));
    } catch (error) {   
      set({ error: error as string });
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (task: Task) => {
    set({ loading: true, error: null });
    try {
      const newTask = await createTask(task);
      set((state) => ({ tasks: [...state.tasks, newTask.data as Task] }));
    } catch (error) {
      set({ error: error as string });
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await updateTask(parseInt(id), data);
      set((state) => ({
        taskDetails: {
          ...state.taskDetails,
          [id]: updatedTask.data as Task,
        },
        tasks: state.tasks.map((task) =>
          task.id === parseInt(id) ? updatedTask.data as Task : task
        ),
      }));
    } catch (error) {
      set({ error: error as string });
    } finally {
      set({ loading: false });
    }
  },

  removeTask: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteTask(parseInt(id));
      set((state) => ({ tasks: state.tasks.filter((task) => task.id !== parseInt(id)) }));
    } catch (error) {
      set({ error: error as string });
    } finally {
      set({ loading: false });
    }
  },
}));