import React from 'react';

interface ProfileFooterProps {
  name: string;
  title: string
}

export function ProfileFooter({ name, title }: ProfileFooterProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
        {name.charAt(0)}
      </div>
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  );
}
