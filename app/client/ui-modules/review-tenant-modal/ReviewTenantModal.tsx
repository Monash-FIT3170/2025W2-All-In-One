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
import { apiCreateTaskForAgent } from '/app/client/library-modules/apis/task/task-api';
import { TaskPriority } from '/app/shared/task-priority-identifier';
import { apiCreateTaskForLandlord } from '/app/client/library-modules/apis/task/task-api';



export function ReviewTenantModal({
  isOpen,
  onClose,
  onReject,
  onProgress,
  // onBackgroundPass,
  // onBackgroundFail,
  onSendToLandlord,
  propertyAddress,
  propertyLandlordId,
  propertyId,
  tenantApplications = [
    // Default mock data
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
    },
  ],
}: ReviewTenantModalProps): React.JSX.Element {
  const [applications, setApplications] = React.useState<TenantApplication[]>(tenantApplications);
  const [activeFilter, setActiveFilter] = React.useState<FilterType>(FilterType.ALL);
  const [currentStep, setCurrentStep] = React.useState<number>(1); // Track which step the tenant application is on

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

  // const handleBackgroundPass = (applicationId: string) => {
  //   setApplications(currentApplications =>
  //     currentApplications.map(app =>
  //       app.id === applicationId ? {
  //         ...app,
  //         status: TenantApplicationStatus.BACKGROUND_CHECK_PASSED
  //       } : app
  //     )
  //   );
  //   onBackgroundPass(applicationId);
  // };

  // const handleBackgroundFail = (applicationId: string) => {
  //   setApplications(currentApplications =>
  //     currentApplications.map(app =>
  //       app.id === applicationId ? {
  //         ...app,
  //         status: TenantApplicationStatus.BACKGROUND_CHECK_FAILED
  //        } : app
  //     )
  //   );
  //   onBackgroundFail(applicationId);
  // };

  // Step 1: Send all accepted applicants to landlord
  const handleSendToLandlord = async (applicationId: string) => {
    try {
      if (!propertyLandlordId) {
        console.error('Property landlord ID is required to send tenant to landlord');
        return;
      }

      // // Get the tenant application details
      // const application = applications.find(app => app.id === applicationId);
      // if (!application) {
      //   console.error('Application not found');
      //   return;
      // }

      // Check if there are any accepted applications
      const acceptedApplications = applications.filter(app =>
        app.status === TenantApplicationStatus.ACCEPTED
      );

      if (acceptedApplications.length === 0) {
        console.error('No accepted applications to send to landlord');
        return;
      }

      // Create a task for the landlord with all accepted applications
      const taskName = `Review ${acceptedApplications.length} Tenant Application(s)`;
      const taskDescription = `Review ${acceptedApplications.length} accepted tenant application(s) for property at ${propertyAddress || 'your property'}. Applicants: ${acceptedApplications.map(app => app.name).join(', ')}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // Due in 7 days

      await apiCreateTaskForLandlord({
        name: taskName,
        description: taskDescription,
        dueDate: dueDate,
        priority: TaskPriority.MEDIUM,
        landlordId: propertyLandlordId,
      });

      // Update all accepted applications to landlord review status
      setApplications(currentApplications =>
        currentApplications.map(app =>
          app.status === TenantApplicationStatus.ACCEPTED
            ? { ...app, status: TenantApplicationStatus.LANDLORD_REVIEW, step: 2 }
            : app
        )
      );

      console.log(`Successfully sent ${acceptedApplications.length} application(s) to landlord ${propertyLandlordId}`);
      onSendToLandlord(acceptedApplications.map(app => app.id).join(','));
    } catch (error) {
      console.error('Failed to send applications to landlord:', error);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (activeFilter === FilterType.ALL) return true;
    if (activeFilter === FilterType.REJECTED) return app.status === TenantApplicationStatus.REJECTED;
    if (activeFilter === FilterType.ACCEPTED) return app.status === TenantApplicationStatus.ACCEPTED;
    return false;
  });

  // Get counts of accepted applications
  const acceptedCount = applications.filter(app => app.status === TenantApplicationStatus.ACCEPTED).length;
  // const backgroundCheckPassedCount = applications.filter(app => app.status === TenantApplicationStatus.BACKGROUND_CHECK_PASSED).length;

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
          onSendToLandlord={handleSendToLandlord}
        />

         {/* Step 1: Send accepted applicants to landlord */}
         {acceptedCount > 0 && (
          <div className="p-4 border-t">
            <button
              onClick={handleSendToLandlord}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Send {acceptedCount} Accepted Applicant(s) to Landlord
            </button>
          </div>
        )}


        <ModalDone onClose={onClose} />
      </div>
    </div>
  );
}
