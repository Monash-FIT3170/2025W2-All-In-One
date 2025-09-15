import { getPublicEnvOrWarn } from "../../../shared/utils/env-utils";
import { addQueryParamsToUrl } from "../../../shared/utils/url-utils";
import { ApiGeocodeResult } from "./models/ApiGeocodeResult";

const GEOCODE_BASE_API_URL = "https://maps.googleapis.com/maps/api/geocode";

/**
 * Convert an address to a geocode (latitude, longitude) using Google Maps API. Use sparingly as it may incur costs.
 *
 * @param address address to geocode
 * @throws Error if the geocoding fails
 */
export async function apiGeocodeAddress(address: string): Promise<ApiGeocodeResult[]> {
  const queryParams = {
    "address": address,
    "key": getPublicEnvOrWarn("GOOGLE_MAPS_API_KEY"),
  };

  const geocodeUrl = addQueryParamsToUrl(`${GEOCODE_BASE_API_URL}/json`, queryParams);

  const response = await fetch(geocodeUrl);

  if (!response.ok) {
    return Promise.reject(new Error(`Geocoding API call failed with status: ${response.status}`));
  }

  const data = await response.json();

  if (data.status !== "OK") {
    return Promise.reject(new Error(`Geocoding API call failed with status: ${data.status}, error_message: ${data.error_message}`));
  }

  return data.results;
}
