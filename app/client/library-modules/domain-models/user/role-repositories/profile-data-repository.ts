import { apiGetProfileData } from "../../../apis/user/user-role-api";
import { ProfileData } from "../ProfileData";
import { mapApiProfileDataToProfileData } from "./mappers/profile-data-mapper";

export async function getProfileDataById(id: string): Promise<ProfileData> {
    const apiLandlord = await apiGetProfileData(id);
    const mappedLandlord = mapApiProfileDataToProfileData(apiLandlord);

    return mappedLandlord;
}
