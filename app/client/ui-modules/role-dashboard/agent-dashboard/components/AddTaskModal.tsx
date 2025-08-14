import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { TaskPriority } from "/app/shared/task-priority-identifier";
import {
  taskFormSchema,
  TaskFormData,
  TaskData,
  defaultTaskFormValues,
  PropertyOption,
} from "./TaskFormSchema";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskData) => void;
  properties: PropertyOption[]; // only the "address + id"
}

export function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  properties, // passed in from parent / slice
}: AddTaskModalProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: defaultTaskFormValues,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white z-[100] border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-black text-lg font-semibold">
            Add New Task
          </DialogTitle>
        </DialogHeader>
        <form
          id="task-form"
          onSubmit={handleSubmit((data: TaskFormData) => {
            // Find the selected property object
            const selectedProperty = properties.find(
              (p) => p.propertyId === data.propertyId
            );

            const task: TaskData = {
              status: TaskStatus.NOTSTARTED, // default status
              name: data.name,
              dueDate: data.dueDate,
              description: data.description,
              priority: data.priority,
              propertyId: data.propertyId || "",
              propertyAddress: selectedProperty
                ? `${selectedProperty.streetnumber} ${selectedProperty.streetname}, ${selectedProperty.suburb}`
                : "", // fallback if none selected
            };

            onSubmit(task);
          })}
          className="p-4 space-y-4"
        >
          {/* Task Title */}
          <div>
            <Label htmlFor="task-title" className="text-black font-medium">
              Task Title *
            </Label>
            <Input
              id="task-title"
              type="text"
              {...register("name")}
              placeholder="Enter task title"
              className={`mt-1 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="task-due-date" className="text-black font-medium">
              Due Date *
            </Label>
            <Input
              id="task-due-date"
              type="date"
              {...register("dueDate")}
              className={`mt-1 ${errors.dueDate ? "border-red-500" : ""}`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label
              htmlFor="task-description"
              className="text-black font-medium"
            >
              Description
            </Label>
            <Textarea
              id="task-description"
              {...register("description")}
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
              {...register("priority")}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
            </select>
          </div>

          {/*Task Property*/}
          <div>
            <Label htmlFor="task-property" className="text-black font-medium">
              Select a property that this task will take place in.
            </Label>
            <select
              id="task-property"
              {...register("propertyId")}
              className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Property</option>
              {properties.map((p) => (
                <option key={p._id} value={p.propertyId}>
                  {`${p.streetnumber} ${p.streetname}, ${p.suburb}`}
                </option>
              ))}
            </select>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="task-form">
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
