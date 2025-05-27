import { mapLandlordToLandlord } from "./mappers/landlord-mapper";
import {
  apiGetAllLandlords,
  apiGetLandlord,
} from "../../../apis/user/user-role-api";
import { Landlord } from "../Landlord";
import { ApiLandlord } from "/app/shared/api-models/user/api-roles/ApiLandlord";

export async function getLandlordById(id: string): Promise<Landlord> {
  const apiLandlord = await apiGetLandlord(id);
  const mappedLandlord = mapLandlordToLandlord(apiLandlord);

  return mappedLandlord;
}

export async function getAllLandlords(): Promise<Landlord[]> {
  const apiLandlords: ApiLandlord[] = await apiGetAllLandlords();
  const mappedLandlords: Landlord[] = apiLandlords.map(mapLandlordToLandlord);

  return mappedLandlords;
}
