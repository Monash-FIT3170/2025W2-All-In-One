import { ExternalApiError } from "../../errors/ExternalApiError";
import { apiGeocodeAddress } from "../../external-apis/google-maps/google-maps-platform-api";
import { ApiGeocodeResult } from "../../external-apis/google-maps/models/ApiGeocodeResult";
import { Geocode } from "./models/Geocode";

/**
 * Convert an address to a geocode (latitude, longitude). Uses the best matching geocode.
 *
 * WARNING: Use sparingly as it may incur costs.
 *
 * @param address the address
 * @param fallback optional fallback geocode to use if the geocoding fails or no results are found
 * @throws ExternalApiError if the geocoding fails or no results are found, and fallback is not set
 * @returns latitude and longitude of the address
 */
export async function getGeocode(address: string, fallback?: Geocode): Promise<Geocode> {
  try {
    const geocodeResults = await apiGeocodeAddress(address);

    if (geocodeResults.length === 0) {
      if (!fallback) {
        throw new ExternalApiError(`No geocode results (length = 0) found for the address (${address}).`);
      } else {
        console.warn(`No geocode results found for the address (${address}), using fallback: ${fallback}`);
        return fallback;
      }
    }

    const geocode: Geocode = mapApiGeocodeResultsToGeocode(geocodeResults)[0];

    return geocode;
  } catch (error) {
    if (!fallback) {
      throw new ExternalApiError(`Geocoding failed for address "${address}". No fallback defined. Error=(${error})`);
    }

    console.warn(`Geocoding failed for address "${address}". Using fallback. Error=(${error})`);

    return fallback;
  }
}

function mapApiGeocodeResultsToGeocode(results: ApiGeocodeResult[]): Geocode[] {
  return results.map((result) => {
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    };
  });
}
