import { mapApiUserAccountToUserAccount } from "./mappers/user-account-mapper";
import { apiGetUserAccount } from "../../../apis/user/user-account-api";
import { UserAccount } from "../UserAccount";

export async function getUserAccountById(id: string): Promise<UserAccount> {
  console.log('getUserAccountById called with:', id);
  const apiUser = await apiGetUserAccount(id);
  console.log('API response:', apiUser);
  const mappedUserAccount = mapApiUserAccountToUserAccount(apiUser);

  return mappedUserAccount;
}