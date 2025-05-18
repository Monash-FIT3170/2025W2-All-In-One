import React from 'react';

interface ProfileFooterProps {
  firstName: string;
  lastName: string;
  title: string
}

export function ProfileFooter({ firstName, lastName, title }: ProfileFooterProps): React.JSX.Element {
  const initials = `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`;
  const name = `${firstName} ${lastName}`;
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-base font-semibold">
        {initials}
      </div>
      <div>
        <div className="font-medium text-black text-sm">{name}</div>
        <div className="text-xs text-gray-500">{title}</div>
      </div>
    </div>
  );
}
