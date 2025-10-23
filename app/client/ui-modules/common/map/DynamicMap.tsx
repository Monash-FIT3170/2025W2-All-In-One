import { APIProvider, Map } from "@vis.gl/react-google-maps";
import React from "react";
import { twMerge } from "tailwind-merge";
import { getPublicEnvOrWarn } from "/app/shared/utils/env-utils";

export enum MapZoom {
  ENTIRE_WORLD,
  LANDMASS,
  CITY,
  STREET,
  BUILDING,
}

export type InitialMapCoordinates = {
  initialLatitude: number;
  initialLongitude: number;
}

const zoomLevelMap: Record<MapZoom, number> = {
  [MapZoom.ENTIRE_WORLD]: 1,
  [MapZoom.LANDMASS]: 5,
  [MapZoom.CITY]: 10,
  [MapZoom.STREET]: 15,
  [MapZoom.BUILDING]: 20,
};

/**
 * Google Maps Platform dynamic map.
 * 
 * WARNING: This component is billed, please be careful with usage. If unsure, consult system architects.
 */
export function DynamicMap({
  initialMapCoordinates,
  defaultZoom = MapZoom.STREET,
  markers = [],
  className = "",
}: {
  initialMapCoordinates: InitialMapCoordinates;
  defaultZoom?: MapZoom;
  markers?: Array<React.JSX.Element>;
  className?: string;
}): React.JSX.Element {
  const defaultSizeClassName = "h-64 w-96";

  const defaultCenter = initialMapCoordinates ? {
    lat: initialMapCoordinates.initialLatitude,
    lng: initialMapCoordinates.initialLongitude,
  } : undefined;

  return (
    <div className={twMerge(defaultSizeClassName, className)}>
      <APIProvider apiKey={getPublicEnvOrWarn("GOOGLE_MAPS_API_KEY")}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={zoomLevelMap[defaultZoom]}
          mapId="DEMO_MAP_ID"
          colorScheme="LIGHT"
          renderingType="VECTOR"
          reuseMaps={true}
        >
          {markers}
        </Map>
      </APIProvider>
    </div>
  );
}
