import React from "react";
import { UseFormRegister } from "react-hook-form";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  options: DropdownOption[];
  register: UseFormRegister<any>; // can type more specifically
  fieldName: string;
  label?: string;
  placeholder?: string;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  register,
  fieldName,
  label,
  placeholder = "Select an option",
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={fieldName} className="text-black font-medium">
          {label}
        </label>
      )}
      <select
        id={fieldName}
        {...register(fieldName)}
        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
