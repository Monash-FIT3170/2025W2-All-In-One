import React from 'react';
import { twMerge } from 'tailwind-merge';
import { RejectButton, ProgressButton, BackgroundPassButton, BackgroundFailButton, SendToLandlordButton, DoneButton } from './TenantReviewButtons';

interface TenantApplication {
  id: string;
  name: string;
  status: 'undetermined' | 'accepted' | 'rejected';
  backgroundCheck?: 'pass' | 'fail' | 'pending';
}

interface ReviewTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (applicationId: string) => void;
  onProgress: (applicationId: string) => void;
  onBackgroundPass: (applicationId: string) => void;
  onBackgroundFail: (applicationId: string) => void;
  onSendToLandlord: (applicationId: string) => void;
  propertyAddress?: string;
}

export function ReviewTenantModal({
  isOpen,
  onClose,
  onReject,
  onProgress,
  onBackgroundPass,
  onBackgroundFail,
  onSendToLandlord,
  propertyAddress,
}: ReviewTenantModalProps): React.JSX.Element {
  // Mock data matching figma
  const [applications, setApplications] = React.useState<TenantApplication[]>([
    {
      id: '1',
      name: 'Rehan W',
      status: 'undetermined',
    },
    {
      id: '2',
      name: 'Dylan C',
      status: 'undetermined',
    },
    {
      id: '3',
      name: 'Tony X',
      status: 'undetermined',
    },
    {
      id: '4',
      name: 'Shannon W',
      status: 'rejected',
    },
    {
      id: '5',
      name: 'Ashleigh C',
      status: 'accepted',
    },
    {
      id: '6',
      name: 'Maddy C',
      status: 'accepted',
      backgroundCheck: 'pass',
    },
  ]);

  const [activeFilter, setActiveFilter] = React.useState<'all' | 'rejected' | 'accepted'>('all');

  const handleReject = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status: 'rejected' as const } : app
      )
    );
    onReject(applicationId);
  };

  const handleProgress = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status: 'accepted' as const } : app
      )
    );
    onProgress(applicationId);
  };

  const handleBackgroundPass = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, backgroundCheck: 'pass' as const } : app
      )
    );
    onBackgroundPass(applicationId);
  };

  const handleBackgroundFail = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, backgroundCheck: 'fail' as const } : app
      )
    );
    onBackgroundFail(applicationId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'undetermined':
        return (
          <span className="px-2 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded">
            UNDETERMINED
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded">
            REJECTED
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded">
            ACCEPTED
          </span>
        );
      default:
        return null;
    }
  };

  const getBackgroundBadge = (backgroundCheck?: string) => {
    switch (backgroundCheck) {
      case 'pass':
        return (
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
            BACKGROUND PASS
          </span>
        );
      case 'fail':
        return (
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
            BACKGROUND FAIL
          </span>
        );
      default:
        return null;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (activeFilter === 'all') return true;
    return app.status === activeFilter;
  });

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-screen overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Review Potential Tenant List</h2>
            <p className="text-sm text-gray-600">Reject/Approve Tenants and add background check status</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveFilter('all')}
                className={twMerge(
                  "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                  activeFilter === 'all'
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('rejected')}
                className={twMerge(
                  "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                  activeFilter === 'rejected'
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Rejected
              </button>
              <button
                onClick={() => setActiveFilter('accepted')}
                className={twMerge(
                  "px-3 py-1 text-sm font-medium rounded-md transition-colors",
                  activeFilter === 'accepted'
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Accepted
              </button>
            </div>
            
            {/* Filter Icon */}
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-100 px-4">
          <div className="space-y-3">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{application.name}</span>
                    {getStatusBadge(application.status)}
                  </div>
                  
                  {/* Background check badge if exists */}
                  {application.backgroundCheck && (
                    <div className="mb-2">
                      {getBackgroundBadge(application.backgroundCheck)}
                    </div>
                  )}

                  {/* Action buttons based on status */}
                  <div className="flex gap-2">
                    {application.status === 'undetermined' && (
                      <>
                        <RejectButton onClick={() => handleReject(application.id)} />
                        <ProgressButton onClick={() => handleProgress(application.id)} />
                      </>
                    )}

                    {application.status === 'accepted' && !application.backgroundCheck && (
                      <>
                        <BackgroundPassButton onClick={() => handleBackgroundPass(application.id)} />
                        <BackgroundFailButton onClick={() => handleBackgroundFail(application.id)} />
                      </>
                    )}

                    {application.status === 'accepted' && application.backgroundCheck === 'pass' && (
                      <SendToLandlordButton onClick={() => onSendToLandlord(application.id)} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex justify-end">
            <DoneButton onClick={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}