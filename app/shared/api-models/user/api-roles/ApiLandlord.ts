export type ApiLandlord = {
  landlordId: string; // pk
  userAccountId: string; // id for the user account - used for auth/admin purposes only
  tasks: string[]; // array of task ids
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};
