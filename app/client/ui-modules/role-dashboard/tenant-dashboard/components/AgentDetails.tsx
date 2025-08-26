import React from 'react';
import { Agent } from '/app/client/library-modules/domain-models/user/Agent';
import { ProfileData } from '/app/client/library-modules/domain-models/user/ProfileData';
import { twMerge } from 'tailwind-merge';
import { ContactAgentButton } from './ContactAgentButton';

interface AgentDetailsProps {
  agent: Agent | null;
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  className?: string;
}

export const AgentDetails: React.FC<AgentDetailsProps> = ({
  agent,
  profile,
  isLoading,
  error,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={twMerge('bg-white rounded-lg shadow-md p-6', className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={twMerge('bg-white rounded-lg shadow-md p-6', className)}>
        <p className="text-red-500">Error loading agent details: {error}</p>
      </div>
    );
  }

  if (!agent || !profile) {
    return null;
  }

  return (
    <div className={twMerge('bg-white rounded-lg shadow-md p-6', className)}>
      <h3 className="text-xl font-semibold mb-4">Property Agent</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {profile.profilePicture && (
            <img
              src={profile.profilePicture}
              alt={`${profile.firstName} ${profile.lastName}`}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-lg">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-gray-600">Agent Code: {agent.agentCode}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">Email: </span>
            <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
              {profile.email}
            </a>
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Phone: </span>
            <a href={`tel:${profile.phone}`} className="text-blue-600 hover:underline">
              {profile.phone}
            </a>
          </p>
        </div>

        <ContactAgentButton
          propertyId={agent.agentId}
          className="w-full mt-4"
        />
      </div>
    </div>
  );
};