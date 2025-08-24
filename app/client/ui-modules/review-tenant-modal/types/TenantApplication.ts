import { TenantApplicationStatus } from '../enums/TenantApplicationStatus';
// import { BackgroundCheckStatus } from '../enums/BackgroundCheckStatus';

export type TenantApplication = {
  id: string;
  name: string;
  status: TenantApplicationStatus;
  step?: number; //Track which step the tenant application is on
}
