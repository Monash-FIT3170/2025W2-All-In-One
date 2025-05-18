export type ApiAgent = {
  agentId: string; // pk
  userAccountId: string; // id for the user account - used for auth/admin purposes only
  firstName: string;
  lastName: string;
  email: string;
  agentCode: string;
  createdAt: Date;
}