import React from 'react';
import { ReviewTenantModalProps } from './types/ReviewTenantModalProps';
import { TenantApplication } from './types/TenantApplication';
import { TenantApplicationStatus } from './enums/TenantApplicationStatus';
import { BackgroundCheckStatus } from './enums/BackgroundCheckStatus';
import { FilterType } from './enums/FilterType';
import { ModalHeader } from './components/ModalHeader';
import { FilterTabs } from './components/FilterTabs';
import { ModalContent } from './components/ModalContent';
import { ModalDone } from './components/ModalDone';

export function ReviewTenantModal({
  isOpen,
  onClose,
  onReject,
  onProgress,
  onBackgroundPass,
  onBackgroundFail,
  onSendToLandlord,
  propertyAddress,
  tenantApplications = [
    // Default mock data for backward compatibility
    {
      id: '1',
      name: 'Rehan W',
      status: TenantApplicationStatus.UNDETERMINED,
    },
    {
      id: '2',
      name: 'Dylan C',
      status: TenantApplicationStatus.UNDETERMINED,
    },
    {
      id: '3',
      name: 'Tony X',
      status: TenantApplicationStatus.UNDETERMINED,
    },
    {
      id: '4',
      name: 'Shannon W',
      status: TenantApplicationStatus.REJECTED,
    },
    {
      id: '5',
      name: 'Ashleigh C',
      status: TenantApplicationStatus.ACCEPTED,
    },
    {
      id: '6',
      name: 'Maddy C',
      status: TenantApplicationStatus.ACCEPTED,
      backgroundCheck: BackgroundCheckStatus.PASS,
    },
  ],
}: ReviewTenantModalProps): React.JSX.Element {
  const [applications, setApplications] = React.useState<TenantApplication[]>(tenantApplications);

  const [activeFilter, setActiveFilter] = React.useState<FilterType>(FilterType.ALL);

  // update applications when tenantApplications changes
  React.useEffect(() => {
    setApplications(tenantApplications);
  }, [tenantApplications]);

  const handleReject = (applicationId: string) => {
    setApplications(currentApplications => 
      currentApplications.map(app => 
        app.id === applicationId ? { ...app, status: TenantApplicationStatus.REJECTED } : app
      )
    );
    onReject(applicationId);
  };

  const handleProgress = (applicationId: string) => {
    setApplications(currentApplications => 
      currentApplications.map(app => 
        app.id === applicationId ? { ...app, status: TenantApplicationStatus.ACCEPTED } : app
      )
    );
    onProgress(applicationId);
  };

  const handleBackgroundPass = (applicationId: string) => {
    setApplications(currentApplications => 
      currentApplications.map(app => 
        app.id === applicationId ? { ...app, backgroundCheck: BackgroundCheckStatus.PASS } : app
      )
    );
    onBackgroundPass(applicationId);
  };

  const handleBackgroundFail = (applicationId: string) => {
    setApplications(currentApplications => 
      currentApplications.map(app => 
        app.id === applicationId ? { ...app, backgroundCheck: BackgroundCheckStatus.FAIL } : app
      )
    );
    onBackgroundFail(applicationId);
  };

  const filteredApplications = applications.filter(app => {
    if (activeFilter === FilterType.ALL) return true;
    if (activeFilter === FilterType.REJECTED) return app.status === TenantApplicationStatus.REJECTED;
    if (activeFilter === FilterType.ACCEPTED) return app.status === TenantApplicationStatus.ACCEPTED;
    return false;
  });

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-screen overflow-hidden shadow-xl">
        <ModalHeader onClose={onClose} />
        
        <FilterTabs 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
        
        <ModalContent
          applications={filteredApplications}
          onReject={handleReject}
          onProgress={handleProgress}
          onBackgroundPass={handleBackgroundPass}
          onBackgroundFail={handleBackgroundFail}
          onSendToLandlord={onSendToLandlord}
        />
        
        <ModalDone onClose={onClose} />
      </div>
    </div>
  );
}
