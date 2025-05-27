import { Agent } from "/app/client/library-modules/domain-models/user/Agent";
import { Landlord } from "/app/client/library-modules/domain-models/user/Landlord";
import { ProfileData } from "/app/client/library-modules/domain-models/user/ProfileData";
import { Tenant } from "/app/client/library-modules/domain-models/user/Tenant";
import { UserAccount } from "/app/client/library-modules/domain-models/user/UserAccount";

export type CurrentUserState = {
  authUser: UserAccount | null; // for authentication purposes only
  currentUser: Agent | Tenant | Landlord | null; // THE user account that everything will revolve around it.
  profileData: ProfileData | null; // the data of the user i.e name image ect.
};
