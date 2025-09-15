export enum TenantApplicationStatus {
  UNDETERMINED = 'undetermined',
  ACCEPTED = 'accepted', // Step 1: Agent accepts
  REJECTED = 'rejected', // Step 1: Agent rejects
  LANDLORD_REVIEW = 'landlord_review',      // Step 2: Sent to landlord for review
  LANDLORD_APPROVED = 'landlord_approved',  // Step 2: Landlord approves for background check
  LANDLORD_REJECTED = 'landlord_rejected',  // Step 2: Landlord rejects
  BACKGROUND_CHECK_PENDING = 'background_check_pending',  // Step 3: Agent background check pending
  BACKGROUND_CHECK_PASSED = 'background_check_passed',  // Step 3: Agent background check passed
  BACKGROUND_CHECK_FAILED = 'background_check_failed',  // Step 3: Agent background check failed
  FINAL_REVIEW = 'final_review',             // Step 4: Sent to landlord for final review
  FINAL_APPROVED = 'final_approved',        // Step 4: Landlord final approval
  FINAL_REJECTED = 'final_rejected',         // Step 4: Landlord final rejection
  TENANT_CHOSEN = 'tenant_chosen'
}
