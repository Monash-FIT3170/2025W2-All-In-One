import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export function DashboardCard({
  title,
  value,
  icon,
  subtitle,
  className = "",
  children,
}: DashboardCardProps): React.JSX.Element {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-gray-600">{title}</h3>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      {children}
    </div>
  );
}