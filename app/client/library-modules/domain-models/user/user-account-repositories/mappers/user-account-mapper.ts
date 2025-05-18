import {UserAccount} from "../../UserAccount";
import { ApiUserAccount } from "/app/shared/api-models/user/ApiUserAccount";

export function mapApiUserAccountToUserAccount(userAccount: ApiUserAccount): UserAccount {
  return {
    userId: userAccount.userId,
    role: userAccount.role,
  };
}