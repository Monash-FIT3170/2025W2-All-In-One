import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../theming-shadcn/Dialog";
import { Button } from "../../../theming-shadcn/Button";
import { Input } from "../../../theming-shadcn/Input";
import { Label } from "../../../theming-shadcn/Label";
import { Textarea } from "../../../theming-shadcn/Textarea";
import { TaskStatus } from "/app/shared/task-status-identifier";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskData) => void;
  selectedDateISO?: string | null;
}

export interface TaskData {
  name: string;
  description: string;
  dueDate: Date;
  priority: string;
  taskStatus: TaskStatus;
  createdDate: Date;
}

export function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDateISO,
}: AddTaskModalProps): React.JSX.Element {
  // Task form state
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskDueDate, setTaskDueDate] = useState<string>("");
  const [taskPriority, setTaskPriority] = useState<string>("Medium");

  // Pre-fill due date when selectedDateISO changes
  useEffect(() => {
    if (selectedDateISO && isOpen) {
      setTaskDueDate(selectedDateISO);
    }
  }, [selectedDateISO, isOpen]);

  const handleClose = () => {
    // Clear form
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskPriority("Medium");
    onClose();
  };

  const handleSubmitTask = () => {
    // Basic validation
    if (!taskTitle.trim()) {
      alert("Please enter a task title");
      return;
    }
    if (!taskDueDate) {
      alert("Please select a due date");
      return;
    }

    // Create task object matching TaskDocument structure
    const newTask: TaskData = {
      name: taskTitle,
      description: taskDescription,
      dueDate: new Date(taskDueDate),
      priority: taskPriority,
      taskStatus: TaskStatus.NOTSTARTED,
      createdDate: new Date(),
    };

    onSubmit(newTask);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white z-[100] border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-black text-lg font-semibold">Add New Task</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          {/* Task Title */}
          <div>
            <Label htmlFor="task-title" className="text-black font-medium">
              Task Title *
            </Label>
            <Input
              id="task-title"
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter task title"
              className="mt-1"
            />
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="task-due-date" className="text-black font-medium">
              Due Date *
            </Label>
            <Input
              id="task-due-date"
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="task-description" className="text-black font-medium">
              Description
            </Label>
            <Textarea
              id="task-description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Enter task description"
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="task-priority" className="text-black font-medium">
              Priority
            </Label>
            <select
              id="task-priority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmitTask}>
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
