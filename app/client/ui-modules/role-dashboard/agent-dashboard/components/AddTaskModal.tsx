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
import { DropdownSelect } from "../../../common/DropdownSelect";
import { mapPropertyToOption } from "../../../../library-modules/apis/property/property-api";

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

  const propertyOptions = properties.map((p) => ({
    value: p.propertyId,
    label: `${p.streetnumber} ${p.streetname}, ${p.suburb}`,
  }));

  const priorityOptions = [
    { value: TaskPriority.LOW, label: "Low" },
    { value: TaskPriority.MEDIUM, label: "Medium" },
    { value: TaskPriority.HIGH, label: "High" },
  ];

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
          onSubmit={handleSubmit(async(data: TaskFormData) => {
            let propertyAddress = "";
            // Find the selected property object

            if (data.propertyId) {
              const selectedProperty = await mapPropertyToOption(
                data.propertyId
              );
              propertyAddress = `${selectedProperty.streetnumber} ${selectedProperty.streetname}, ${selectedProperty.suburb}`;
            }

            const task: TaskData = {
              status: TaskStatus.NOTSTARTED, // default status
              name: data.name,
              dueDate: data.dueDate,
              description: data.description,
              priority: data.priority,
              propertyId: data.propertyId || "",
              propertyAddress,
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
            <DropdownSelect
              options={priorityOptions}
              register={register}
              fieldName="priority"
              label="Priority"
            />
          </div>

          {/*Task Property*/}
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
          <Button type="submit" form="task-form">
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
