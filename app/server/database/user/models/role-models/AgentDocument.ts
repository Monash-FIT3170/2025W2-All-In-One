export type AgentDocument = {
  _id: string; // agent id - primary key
  userAccountId: string; // id for the user account - used for auth/admin purposes only
  task_ids: string[]; // array of task ids
  firstName: string;
  lastName: string;
  email: string;
  agentCode: string;
  createdAt: Date;
}