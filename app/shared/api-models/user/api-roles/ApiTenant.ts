export type ApiTenant = {
  tenantId: string; // pk
  userAccountId: string; // id for the user account - used for auth/admin purposes only
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}