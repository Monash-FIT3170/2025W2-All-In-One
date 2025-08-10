import { getPublicEnvOrWarn } from "../../../shared/utils/env-utils";
import { addQueryParamsToUrl } from "../../../shared/utils/url-utils";
import { GeocodeResult } from "./models/GeocodeResult";

const GEOCODE_BASE_API_URL = 'https://maps.googleapis.com/maps/api/geocode';

/**
 * Convert the address to a geocode (coordinates) using Google Maps API. Use sparingly as it may incur costs.
 * @param address address to geocode
 * @throws Error if the geocoding fails
 * @returns 
 */
export async function apiGeocodeAddress(address: string): Promise<GeocodeResult[]> {
  const queryParams = {
    "address": address,
    "key": getPublicEnvOrWarn('GOOGLE_MAPS_API_KEY')
  }

  const geocodeUrl = addQueryParamsToUrl(`${GEOCODE_BASE_API_URL}/json`, queryParams);

  const response = await fetch(geocodeUrl);
  if (!response.ok) {
    throw new Error(`Geocoding failed with status: ${response.status}`);
  }
  
  const data = await response.json();

  return data.results
}
