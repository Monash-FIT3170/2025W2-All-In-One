import React from "react";

export function UserDropdown({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="mb-4 border border-gray-300 p-4 rounded-md shadow-sm">
      <summary className="font-semibold text-lg cursor-pointer">{title}</summary>
      <div className="mt-2 text-gray-700">{children}</div>
    </details>
  );
}
