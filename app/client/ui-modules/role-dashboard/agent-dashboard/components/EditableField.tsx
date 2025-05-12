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
    <div className="grid w-full items-start gap-0.5 min-w-0">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={!editing}
        className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
