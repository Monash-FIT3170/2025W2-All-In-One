type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type LatLngLocation = {
  lat: number;
  lng: number;
};

type Viewport = {
  northeast: LatLngLocation;
  southwest: LatLngLocation;
};

type Geometry = {
  location: LatLngLocation;
  location_type: string;
  viewport: Viewport;
};

type PlusCode = {
  compound_code: string;
  global_code: string;
};

export type GeocodeResult = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code: PlusCode;
  types: string[];
};