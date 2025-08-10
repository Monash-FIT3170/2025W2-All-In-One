import { ExternalApiError } from "../../errors/ExternalApiError";
import { apiGeocodeAddress } from "../../external-apis/google-maps/google-maps-platform-api";
import { Geocode } from "./models/Geocode";

/**
 * Convert an address to a geocode (latitude, longitude). Uses the best matching geocode.
 *
 * WARNING: Use sparingly as it may incur costs.
 *
 * @param address the address
 * @param fallback optional fallback geocode to use if the geocoding fails or no results are found
 * @throws ExternalApiError if the geocoding fails or no results are found
 * @returns latitude and longitude of the address
 */
export async function getGeocode(address: string, fallback?: Geocode): Promise<Geocode> {
  try {
    const geocodeResult = await apiGeocodeAddress(address);

    if (geocodeResult.length === 0) {
      if (!fallback) {
        throw new ExternalApiError(`No geocode results found for the address (${address}).`);
      } else {
        console.warn(`No geocode results found for the address (${address}), using fallback geocode: ${fallback}`);
        return fallback;
      }
    }

    const { lat, lng } = geocodeResult[0].geometry.location;

    const geocode: Geocode = {
      latitude: lat,
      longitude: lng,
    };

    return geocode;
  } catch (error) {
    console.warn(`Geocoding failed for address "${address}":`, error);

    if (!fallback) {
      throw new ExternalApiError(`Geocoding failed for address "${address}": ${error}`);
    }

    return fallback;
  }
}
