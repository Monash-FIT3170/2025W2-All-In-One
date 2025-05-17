export type ApiUserProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  role: "agent" | "tenant" | "landlord";
  agentCode?: string;
  createdAt: Date;
};