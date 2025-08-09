import { APIProvider, Map } from "@vis.gl/react-google-maps";
import React from "react";
import { twMerge } from "tailwind-merge";
import { getEnvOrWarn } from "/app/client/library-modules/utils/env-utils";

enum MapZoom {
  ENTIRE_WORLD,
  LANDMASS,
  CITY,
  STREET,
  BUILDING,
}

const zoomLevelMap: Record<MapZoom, number> = {
  [MapZoom.ENTIRE_WORLD]: 1,
  [MapZoom.LANDMASS]: 5,
  [MapZoom.CITY]: 10,
  [MapZoom.STREET]: 15,
  [MapZoom.BUILDING]: 20,
};

export function DynamicMap({
  initialLatitude,
  initialLongitude,
  defaultZoom = MapZoom.CITY,
  heightClassName = "h-64",
  widthClassName = "w-96",
  className = "",
}: {
  initialLatitude: number;
  initialLongitude: number;
  heightClassName?: string;
  widthClassName?: string;
  defaultZoom?: MapZoom;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={twMerge(heightClassName, widthClassName, className)}>
      <APIProvider apiKey={getEnvOrWarn("GOOGLE_MAPS_API_KEY")}>
        <Map
          defaultCenter={{ lat: initialLatitude, lng: initialLongitude }}
          defaultZoom={zoomLevelMap[defaultZoom]}
          mapId="DEMO_MAP_ID"
          reuseMaps={true}
        />
      </APIProvider>
    </div>
  );
}
