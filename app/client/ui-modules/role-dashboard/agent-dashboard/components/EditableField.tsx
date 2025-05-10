import React from "react";
import { Input } from "../../../theming-shadcn/Input";

interface EditableFieldProps {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}

export function EditableField({
  label,
  value,
  editing,
  onChange,
}: EditableFieldProps) {
  return (
    <div className="grid w-full items-start gap-0.5">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      {editing ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-auto text-sm px-3 py-2 focus:ring-0 focus-visible:ring-0 shadow-none"
        />
      ) : (
        <div className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-muted text-muted-foreground">
          {value}
        </div>
      )}
    </div>
  );
}
