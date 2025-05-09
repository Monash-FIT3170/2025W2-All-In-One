export type SignupFormUIState = {
  accountType: "tenant" | "landlord" | "agent";
  passwordVisible: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agentCode: string;
  message: string;
  isLoading: boolean;
};