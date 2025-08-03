import { z } from "zod";
import { TaskStatus } from "/app/shared/task-status-identifier";

// Form schema using Zod for task creation
export const taskFormSchema = z.object({
  name: z.string().min(1, "Task title is required"),
  description: z.string(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["Low", "Medium", "High"]),
});

// Inferred type from the schema
export type TaskFormData = z.infer<typeof taskFormSchema>;

// Task data interface for the final task object
export interface TaskData {
  name: string;
  description: string;
  dueDate: Date;
  priority: string;
  taskStatus: TaskStatus;
  createdDate: Date;
}

// Default form values
export const defaultTaskFormValues: TaskFormData = {
  name: "",
  description: "",
  dueDate: "",
  priority: "Medium",
};
