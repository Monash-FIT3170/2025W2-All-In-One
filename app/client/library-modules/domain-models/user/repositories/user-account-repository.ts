import { mapApiUserAccountToUserAccount } from "./mappers/user-account-mapper";
import { apiGetUserAccount } from "../../../apis/user/user-account-api";
import { UserAccount } from "../UserAccount";

export async function getUserAccountById(id: string): Promise<UserAccount> {
  const apiUser = await apiGetUserAccount(id);
  const mappedUserAccount = mapApiUserAccountToUserAccount(apiUser);

  return mappedUserAccount;
}