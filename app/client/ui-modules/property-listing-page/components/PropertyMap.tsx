import React from "react";
import { DynamicMap } from "../../common/map/DynamicMap";
import { BasicMarker } from "../../common/map/markers/BasicMarker";
import { twMerge } from "tailwind-merge";

export type PropertyMapUiState = {
  markerLatitude: number;
  markerLongitude: number;
};

export function PropertyMap({ 
  mapUiState, 
  className = "" 
}: { 
  mapUiState: PropertyMapUiState; 
  className?: string 
}): React.JSX.Element {
  return (
      <DynamicMap
        initialLatitude={mapUiState.markerLatitude}
        initialLongitude={mapUiState.markerLongitude}
        markers={[<BasicMarker latitude={mapUiState.markerLatitude} longitude={mapUiState.markerLongitude} />]}
        className={twMerge("w-full h-[350px]", className)}
      />
  );
}
