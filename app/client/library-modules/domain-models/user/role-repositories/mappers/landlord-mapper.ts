import { Landlord } from "../../Landlord";
import { ApiLandlord } from "/app/shared/api-models/user/api-roles/ApiLandlord";

export function mapLandlordToLandlord(landlord: ApiLandlord): Landlord {
  return {
    landlordId: landlord.landlordId, 
    userAccountId: landlord.userAccountId,
    tasks: landlord.tasks,
    firstName: landlord.firstName,
    lastName: landlord.lastName,
    email: landlord.email,
    createdAt: landlord.createdAt.toISOString(),
  };
}