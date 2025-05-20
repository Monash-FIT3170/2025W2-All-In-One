import { ApiProfileData } from "./ApiProfileData";

export type ApiAgent = {
  agentId: string; // pk
  userAccountId: string; // id for the user account - used for auth/admin purposes only
  createdAt: Date;
  profile: ApiProfileData;
};
