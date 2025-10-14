import React from "react";

interface CardWidgetProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function CardWidget({
  title,
  value,
  icon,
  subtitle,
  className = "",
  children,
  rightElement,
}: CardWidgetProps): React.JSX.Element {
  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-md border border-gray-200 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {rightElement || (icon && <div className="text-gray-400">{icon}</div>)}
      </div>
      {children}
    </div>
  );
}
