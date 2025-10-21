import React from "react";
import { Input } from "../../theming-shadcn/Input";

interface EditableFieldProps {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
}

export function EditableField({
  label,
  value,
  editing,
  onChange,
  type = "text",
  error,
}: EditableFieldProps) {
  const maxDate =
    type === "date" ? new Date().toISOString().split("T")[0] : undefined;

  return (
    <div className="grid w-full items-start gap-0.5 min-w-0">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      <Input
        max={maxDate}
        value={value ?? ""}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        readOnly={!editing}
        className={`w-full h-10 px-3 py-2 text-sm border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
