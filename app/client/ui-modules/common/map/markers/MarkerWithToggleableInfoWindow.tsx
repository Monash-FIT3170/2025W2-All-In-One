import { useAdvancedMarkerRef, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import React, { useState } from "react";

export function MarkerWithToggleableInfoWindow({
  latitude,
  longitude,
  shouldInitiallyShowInfoWindow = false,
  infoWindowContent,
}: {
  latitude: number;
  longitude: number;
  shouldInitiallyShowInfoWindow?: boolean;
  infoWindowContent: React.JSX.Element;
}): React.JSX.Element {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [shouldShowInfoWindow, setShouldShowInfoWindow] = useState(shouldInitiallyShowInfoWindow);

  return (
    <>
      <AdvancedMarker
        position={{ lat: latitude, lng: longitude }}
        onClick={() => {
          setShouldShowInfoWindow(!shouldShowInfoWindow);
        }}
        ref={markerRef}
      />
      {shouldShowInfoWindow && (
        <InfoWindow anchor={marker} onClose={() => setShouldShowInfoWindow(false)}>
          {infoWindowContent}
        </InfoWindow>
      )}
    </>
  );
}
