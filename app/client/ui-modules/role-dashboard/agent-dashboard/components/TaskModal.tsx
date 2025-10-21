import React, { useEffect } from "react";
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
import { DropdownSelect } from "../../../common/DropdownSelect";
import { mapPropertyToOption } from "../../../../library-modules/apis/property/property-api";
import { Task } from "/app/client/library-modules/domain-models/task/Task";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: TaskData, taskId?: string) => void;
  properties: PropertyOption[];
  mode: 'add' | 'edit';
  task?: Task | null;
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  properties,
  mode,
  task,
}: TaskModalProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: mode === 'add' ? defaultTaskFormValues : undefined,
  });

  // Pre-populate form when editing or reset when adding
  useEffect(() => {
    if (mode === 'edit' && task) {
      reset({
        name: task.name,
        description: task.description || "",
        dueDate: task.dueDate,
        priority: task.priority,
        propertyId: task.propertyId || "",
      });
    } else if (mode === 'add') {
      reset(defaultTaskFormValues);
    }
  }, [mode, task, reset, isOpen]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const propertyOptions = properties.map((p) => ({
    value: p.propertyId,
    label: `${p.streetnumber} ${p.streetname}, ${p.suburb}`,
  }));

  const priorityOptions = [
    { value: TaskPriority.LOW, label: "Low" },
    { value: TaskPriority.MEDIUM, label: "Medium" },
    { value: TaskPriority.HIGH, label: "High" },
  ];

  // Dynamic values based on mode
  const title = mode === 'add' ? 'Add New Task' : 'Edit Task';
  const buttonText = mode === 'add' ? 'Add Task' : 'Update Task';
  const formId = mode === 'add' ? 'task-form' : 'edit-task-form';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white z-[100] border shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-black text-lg font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form
          id={formId}
          onSubmit={handleSubmit(async (data: TaskFormData) => {
            let propertyAddress = "";
            
            if (data.propertyId) {
              const selectedProperty = await mapPropertyToOption(
                data.propertyId
              );
              propertyAddress = `${selectedProperty.streetnumber} ${selectedProperty.streetname}, ${selectedProperty.suburb}`;
            }

            if (mode === 'edit' && task) {
              // For edit mode, pass the task data and taskId
              const updatedTask: TaskData = {
                status: task.status, // Keep existing status
                name: data.name,
                dueDate: data.dueDate,
                description: data.description,
                priority: data.priority,
                propertyId: data.propertyId || "",
                propertyAddress,
              };
              onSubmit(updatedTask, task.taskId);
            } else {
              // For add mode, create new task with default status
              const newTask: TaskData = {
                status: TaskStatus.NOTSTARTED,
                name: data.name,
                dueDate: data.dueDate,
                description: data.description,
                priority: data.priority,
                propertyId: data.propertyId || "",
                propertyAddress,
              };
              onSubmit(newTask);
            }
          })}
          className="p-4 space-y-4"
        >
          {/* Task Title */}
          <div>
            <Label htmlFor={`${mode}-task-title`} className="text-black font-medium">
              Task Title *
            </Label>
            <Input
              id={`${mode}-task-title`}
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
            <Label htmlFor={`${mode}-task-due-date`} className="text-black font-medium">
              Due Date *
            </Label>
            <Input
              id={`${mode}-task-due-date`}
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
              htmlFor={`${mode}-task-description`}
              className="text-black font-medium"
            >
              Description
            </Label>
            <Textarea
              id={`${mode}-task-description`}
              {...register("description")}
              placeholder="Enter task description"
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          {/* Priority */}
          <div>
            <DropdownSelect
              options={priorityOptions}
              register={register}
              fieldName="priority"
              label="Priority"
            />
          </div>

          {/* Task Property */}
          <div>
            <DropdownSelect
              options={propertyOptions}
              register={register}
              fieldName="propertyId"
              label="Select a property that this task will take place in."
            />
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId}>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Backward compatibility exports
export { TaskModal as AddTaskModal };
export { TaskModal as EditTaskModal };

