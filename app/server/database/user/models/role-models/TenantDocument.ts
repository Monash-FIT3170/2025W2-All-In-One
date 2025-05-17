export type TenantDocument = {
  _id: string; // tenant id - primary key
  userId: string; // id for the user account - used for auth/admin purposes only
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}