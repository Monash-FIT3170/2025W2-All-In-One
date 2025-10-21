import { Role } from "/app/shared/user-role-identifier";

export type SignupFormUIState = {
  accountType: Role;
  passwordVisible: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agentCode: string;
  message: string;
  isLoading: boolean;
};

export const initialState: SignupFormUIState = {
  accountType: Role.TENANT,
  passwordVisible: false,
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  agentCode: "",
  message: "",
  isLoading: false
};