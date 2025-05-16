export type UserProfileDocument = {
  _id: string;
  firstName: string;
  lastName: string;
  role: "agent" | "tenant" | "landlord";
  agentCode?: string;
  createdAt: Date;
};
