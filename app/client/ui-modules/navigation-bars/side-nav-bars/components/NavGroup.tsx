import React from 'react';

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
}

export function NavGroup({ title, children }: NavGroupProps): React.JSX.Element {
  return (
    <div className="py-1">
      <h3 className="px-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <div className="mt-1 space-y-1">
        {children}
      </div>
    </div>
  );
}
