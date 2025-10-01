import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '/app/client/store';
import {
  selectFilteredApplications,
  loadTenantApplicationsForPropertyAsync,
  selectLandlordApprovedApplicantCountForProperty,
  selectHasLandlordApprovedApplicationsForProperty,
  intentAcceptApplicationAsync,
  intentRejectApplicationAsync,
  intentResetApplicationDecisionAsync,
  intentSendApplicationToAgentAsync,
  intentSendApplicationToLandlordAsync,
  selectHasFinalApprovedApplicationForProperty,
  selectFinalApprovedApplicantCountForProperty,
  sendFinalApprovedApplicationToAgentAsync,
  selectAcceptedApplicantCountForProperty,
  selectHasAcceptedApplicationsForProperty,
  selectHasBackgroundPassedApplicationsForProperty,
  selectBackgroundPassedApplicantCountForProperty,
} from '../state/reducers/tenant-selection-slice';
import { TenantApplicationStatus } from '/app/shared/api-models/tenant-application/TenantApplicationStatus';
import { Role } from '/app/shared/user-role-identifier';

export function useTenantApplicationReview(propertyId: string, userRole: Role) {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load tenant applications when propertyId changes
  useEffect(() => {
    if (propertyId) {
      dispatch(loadTenantApplicationsForPropertyAsync(propertyId));
    }
  }, [dispatch, propertyId]);

  // Selectors
  const tenantApplications = useAppSelector((state) =>
    selectFilteredApplications(state, propertyId)
  );

  const hasLandlordApprovedApplications = useAppSelector((state) =>
    selectHasLandlordApprovedApplicationsForProperty(state, propertyId)
  );
  const landlordApprovedApplicantCount = useAppSelector((state) =>
    selectLandlordApprovedApplicantCountForProperty(state, propertyId)
  );

  const hasFinalApprovedApplications = useAppSelector((state) =>
    selectHasFinalApprovedApplicationForProperty(state, propertyId)
  );
  const finalApprovedApplicantCount = useAppSelector((state) =>
    selectFinalApprovedApplicantCountForProperty(state, propertyId)
  );

  // Additional selectors for agent functionality
  const acceptedApplicantCount = useAppSelector((state) =>
    selectAcceptedApplicantCountForProperty(state, propertyId)
  );
  const hasAcceptedApplications = useAppSelector((state) =>
    selectHasAcceptedApplicationsForProperty(state, propertyId)
  );
  const hasBackgroundPassedApplications = useAppSelector((state) =>
    selectHasBackgroundPassedApplicationsForProperty(state, propertyId)
  );
  const backgroundPassedApplicantCount = useAppSelector((state) =>
    selectBackgroundPassedApplicantCountForProperty(state, propertyId)
  );

  // Computed values
  const shouldShowSendToAgentButton =
    hasLandlordApprovedApplications && userRole === Role.LANDLORD;
  const shouldShowSendFinalApprovedToAgentButton =
    hasFinalApprovedApplications && userRole === Role.LANDLORD;
  const shouldShowSendToLandlordButton =
    (hasAcceptedApplications || hasBackgroundPassedApplications) &&
    userRole === Role.AGENT;

  // Handlers
  const handleAccept = async (applicationId: string) => {
    try {
      await dispatch(
        intentAcceptApplicationAsync({ propertyId, applicationId })
      ).unwrap();
    } catch (error) {
      console.error("Failed to accept application:", error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await dispatch(
        intentRejectApplicationAsync({ propertyId, applicationId })
      ).unwrap();
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  const handleReset = async (applicationId: string, currentStatus: TenantApplicationStatus) => {
    try {
      await dispatch(intentResetApplicationDecisionAsync({
        applicationId: [applicationId],
        currentStatus: currentStatus
      })).unwrap();
    } catch (error) {
      console.error("Failed to reset application:", error);
    }
  };

  const handleSendToAgent = async () => {
    try {
      await dispatch(intentSendApplicationToAgentAsync()).unwrap();
    } catch (error) {
      console.error("Failed to send applications to agent:", error);
    }
  };

  const handleSendToLandlord = async () => {
    try {
      await dispatch(intentSendApplicationToLandlordAsync()).unwrap();
    } catch (error) {
      console.error("Failed to send applications to landlord:", error);
    }
  };

  const handleSendFinalApprovedToAgent = async () => {
    try {
      await dispatch(sendFinalApprovedApplicationToAgentAsync()).unwrap();
    } catch (error) {
      console.error("Failed to send final approved application to agent:", error);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    tenantApplications,
    landlordApprovedApplicantCount,
    finalApprovedApplicantCount,
    acceptedApplicantCount,
    backgroundPassedApplicantCount,
    hasAcceptedApplications,
    hasBackgroundPassedApplications,
    shouldShowSendToAgentButton,
    shouldShowSendFinalApprovedToAgentButton,
    shouldShowSendToLandlordButton,
    handleAccept,
    handleReject,
    handleReset,
    handleSendToAgent,
    handleSendToLandlord,
    handleSendFinalApprovedToAgent,
  };
}