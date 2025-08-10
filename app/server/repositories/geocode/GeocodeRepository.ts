import { ExternalApiError } from "../../errors/ExternalApiError";
import { apiGeocodeAddress } from "../../external-apis/google-maps/google-maps-platform-api";
import { Geocode } from "./models/Geocode";

/**
 * Convert an address to a geocode (latitude, longitude). Uses the best matchin geocode. 
 * 
 * WARNING: Use sparingly as it may incur costs.
 * 
 * @param address the address
 * @throws ExternalApiError if the geocoding fails or no results are found
 * @returns latitude and longitude of the address
 */
export async function getGeocode(address: string): Promise<Geocode> {
  const geocodeResult = await apiGeocodeAddress(address);
  
  if (geocodeResult.length === 0) {
    throw new ExternalApiError(`No geocode found for address: ${address}`);
  }

  const { lat, lng } = geocodeResult[0].geometry.location;

  const geocode: Geocode = {
    latitude: lat,
    longitude: lng
  }

  return geocode;
}