import React from "react";
import { DynamicMap } from "../../../common/map/DynamicMap";
import { BasicMarker } from "../../../common/map/markers/BasicMarker";
import { twMerge } from "tailwind-merge";

export type Marker = {
  latitude: number;
  longitude: number;
};

export type TaskMapUiState = {
  markers: Marker[];
};

export function TaskMap({ 
  mapUiState, 
  className = "" 
}: { 
  mapUiState: TaskMapUiState; 
  className?: string 
}): React.JSX.Element {
  
  const initialMapCoordinates = mapUiState.markers.length > 0 ? {
    initialLatitude: mapUiState.markers[0].latitude,
    initialLongitude: mapUiState.markers[0].longitude,
  } : undefined;

  return (
      <DynamicMap
        initialMapCoordinates={initialMapCoordinates}
        markers={mapUiState.markers.map((marker, index) => (
          <BasicMarker
          key={index}
          latitude={marker.latitude}
          longitude={marker.longitude}
        />
        ))}
        className={twMerge("w-full h-[350px]", className)}
      />
  );
}
