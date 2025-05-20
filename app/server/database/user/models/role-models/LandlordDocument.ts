export type LandlordDocument = {
  _id: string; // landlord id - primary key
  userAccountId: string; // id for the user account - used for auth/admin purposes only
  task_ids: string[]; // array of task ids
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}