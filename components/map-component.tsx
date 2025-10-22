"use client";

import { Map, Marker } from "react-map-gl/mapbox";
import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapComponentProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
  className?: string;
  markerColor?: string;
  showControls?: boolean;
}

export function MapComponent({
  latitude,
  longitude,
  zoom = 12,
  height = "400px",
  className = "",
  markerColor = "#ef4444",
  showControls = true,
}: MapComponentProps) {
  const [viewState, setViewState] = useState({
    longitude,
    latitude,
    zoom,
  });

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        attributionControl={showControls}
        logoPosition="bottom-right"
      >
        <Marker longitude={longitude} latitude={latitude} color={markerColor} />
      </Map>
    </div>
  );
}
