import { AdvancedMarker } from "@vis.gl/react-google-maps";
import React from "react";

export function BasicMarker({ 
  latitude, 
  longitude 
}: { 
  latitude: number; 
  longitude: number 
}): React.JSX.Element {
  return <AdvancedMarker position={{ lat: latitude, lng: longitude }} />;
}
