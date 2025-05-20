export type TenantDocument = {
  _id: string; // tenant id - primary key
  userId: string; // id for the user account - used for auth/admin purposes only
  createdAt: Date;
};
