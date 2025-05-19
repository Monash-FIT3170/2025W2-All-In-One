import { mapLandlordToLandlord } from "./mappers/landlord-mapper";
import { apiGetLandlord } from "../../../apis/user/user-role-api";
import { Landlord } from "../Landlord";

export async function getLandlordById(id: string): Promise<Landlord> {
  const apiLandlord = await apiGetLandlord(id);
  const mappedLandlord = mapLandlordToLandlord(apiLandlord);

  return mappedLandlord;
}