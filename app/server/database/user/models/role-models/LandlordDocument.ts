export type LandlordDocument = {
  _id: string; // landlord id - primary key
  userId: string; // id for the user account - used for auth/admin purposes only
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}