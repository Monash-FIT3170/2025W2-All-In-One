import { Landlord } from "../../Landlord";
import { ApiLandlord } from "/app/shared/api-models/user/api-roles/ApiLandlord";

export function mapLandlordToLandlord(landlord: ApiLandlord): Landlord {
    return {
        landlordId: landlord.landlordId,
        userAccountId: landlord.userAccountId,
        tasks: landlord.tasks,
        profileDataId: landlord.profileDataId,
        createdAt: landlord.createdAt.toISOString(),
    };
}
