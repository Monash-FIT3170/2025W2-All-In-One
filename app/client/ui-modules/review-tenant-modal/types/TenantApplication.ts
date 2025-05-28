import { TenantApplicationStatus } from '../enums/TenantApplicationStatus';
import { BackgroundCheckStatus } from '../enums/BackgroundCheckStatus';

export type TenantApplication = {
  id: string;
  name: string;
  status: TenantApplicationStatus;
  backgroundCheck?: BackgroundCheckStatus;
}
