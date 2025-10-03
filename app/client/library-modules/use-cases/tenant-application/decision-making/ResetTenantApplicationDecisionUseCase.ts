import { updateTenantApplicationStatus } from '../../../domain-models/tenant-application/repositories/tenant-application-repository';
import { TenantApplicationStatus } from '/app/shared/api-models/tenant-application/TenantApplicationStatus';

export class ResetTenantApplicationDecisionUseCase {
    async execute(applicationIds: string[], currentStatus: TenantApplicationStatus): Promise<TenantApplicationStatus> {
        let newStatus: TenantApplicationStatus;
        let newStep: number;

        switch (currentStatus) {
            case TenantApplicationStatus.ACCEPTED:
            case TenantApplicationStatus.REJECTED:
                newStatus = TenantApplicationStatus.UNDETERMINED;
                newStep = 1;
                break;
            case TenantApplicationStatus.BACKGROUND_CHECK_PASSED:
            case TenantApplicationStatus.BACKGROUND_CHECK_FAILED:
                newStatus = TenantApplicationStatus.BACKGROUND_CHECK_PENDING;
                newStep = 2;
                break;
            case TenantApplicationStatus.LANDLORD_APPROVED:
            case TenantApplicationStatus.LANDLORD_REJECTED:
                newStatus = TenantApplicationStatus.LANDLORD_REVIEW;
                newStep = 3;
                break;
            case TenantApplicationStatus.FINAL_APPROVED:
            case TenantApplicationStatus.FINAL_REJECTED:
                newStatus = TenantApplicationStatus.FINAL_REVIEW;
                newStep = 4;
                break;
            default:
                throw new Error(`Cannot undo status: ${currentStatus}`);
        }
        console.log('Calculated new status:', newStatus, 'new step:', newStep);
        await updateTenantApplicationStatus(applicationIds, newStatus, newStep);
        console.log('updateTenantApplicationStatus completed');
        return newStatus;
    }
}