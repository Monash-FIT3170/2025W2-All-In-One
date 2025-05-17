export type AgentDocument = {
  _id: string; // agent id - primary key
  userId: string; // id for the user account - used for auth/admin purposes only
  firstName: string;
  lastName: string;
  email: string;
  agentCode: string;
  createdAt: Date;
}