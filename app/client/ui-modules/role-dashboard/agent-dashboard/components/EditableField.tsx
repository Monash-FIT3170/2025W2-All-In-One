import React from "react";
import { Input } from "../../../theming-shadcn/Input";

interface EditableFieldProps {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}

export function EditableField({ label, value, editing, onChange }: EditableFieldProps) {
  return (
    <div className="grid w-full max-w-sm items-start gap-1.5">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      {editing ? (
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="bg-white"
        />
      ) : (
        <div className="border rounded px-3 py-2 text-muted-foreground bg-muted border-gray-300">
          {value}
        </div>
      )}
    </div>
  );
}