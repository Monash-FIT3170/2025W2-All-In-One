import React from 'react';

interface ProfileFooterProps {
  firstName: string;
  lastName: string;
  title: string;
  profileImage?: string;
}

export function ProfileFooter({ firstName, lastName, title, profileImage }: ProfileFooterProps): React.JSX.Element {
  const initials = `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`;
  const name = `${firstName} ${lastName}`;
  
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl overflow-hidden">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile Picture"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          initials
        )}
      </div>
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-base text-gray-500 font-medium">{title}</div>
      </div>
    </div>
  );
}
