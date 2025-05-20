export type TenantDocument = {
  _id: string; // tenant id - primary key
  userAccountId: string; // id for the user account - used for auth/admin purposes only
  task_ids: string[]; // array of task ids
  createdAt: Date;
};
