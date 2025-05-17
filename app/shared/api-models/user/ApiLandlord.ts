export type ApiLandlord = {
  LandlordId: string; // pk
  userId: string; // id for the user account - used for auth/admin purposes only
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}