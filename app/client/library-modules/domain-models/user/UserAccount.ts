import { Role } from "/app/shared/user-role-identifier";

export type UserAccount = {
  userId: string;
  role: Role;
};