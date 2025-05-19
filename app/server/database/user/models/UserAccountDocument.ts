import { Role } from "/app/shared/user-role-identifier";

export type UserAccountDocument = {
  _id: string;
  role: Role;
};
