"use client";

import { Map, Marker, Source, Layer } from "react-map-gl/mapbox";
import { useState, useMemo } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

interface RoutePoint {
  id: string;
  label: string;
  address: string;
  coordinates: [number, number];
}

interface RouteMapComponentProps {
  points: RoutePoint[];
  showRoute?: boolean;
  zoom?: number;
  height?: string;
  className?: string;
  markerColor?: string;
  showControls?: boolean;
}

export function RouteMapComponent({
  points,
  showRoute = false,
  zoom = 12,
  height = "400px",
  className = "",
  markerColor = "#ef4444",
  showControls = true,
}: RouteMapComponentProps) {
  // Calculate center and bounds
  const { center, bounds } = useMemo(() => {
    if (points.length === 0) {
      return {
        center: { longitude: 0, latitude: 0 },
        bounds: null,
      };
    }

    if (points.length === 1) {
      return {
        center: {
          longitude: points[0].coordinates[0],
          latitude: points[0].coordinates[1],
        },
        bounds: null,
      };
    }

    // Calculate bounds for multiple points
    const lons = points.map((p) => p.coordinates[0]);
    const lats = points.map((p) => p.coordinates[1]);

    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;

    return {
      center: {
        longitude: centerLon,
        latitude: centerLat,
      },
      bounds: {
        minLon,
        maxLon,
        minLat,
        maxLat,
      },
    };
  }, [points]);

  const [viewState, setViewState] = useState({
    longitude: center.longitude,
    latitude: center.latitude,
    zoom: points.length > 1 ? (bounds ? zoom - 2 : zoom) : zoom,
  });

  // Create route line GeoJSON if showRoute is true and we have multiple points
  const routeGeoJson = useMemo(() => {
    if (!showRoute || points.length < 2) {
      return null;
    }

    return {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: points.map((p) => p.coordinates),
      },
      properties: {},
    };
  }, [points, showRoute]);

  // Adjust zoom to fit bounds if we have multiple points
  useMemo(() => {
    if (bounds && points.length > 1) {
      const lonDiff = bounds.maxLon - bounds.minLon;
      const latDiff = bounds.maxLat - bounds.minLat;
      const maxDiff = Math.max(lonDiff, latDiff);

      // Calculate appropriate zoom level based on bounds
      let calculatedZoom = zoom;
      if (maxDiff > 0.1) calculatedZoom = 8;
      else if (maxDiff > 0.05) calculatedZoom = 9;
      else if (maxDiff > 0.02) calculatedZoom = 10;
      else if (maxDiff > 0.01) calculatedZoom = 11;
      else calculatedZoom = 12;

      setViewState((prev) => ({
        ...prev,
        zoom: calculatedZoom,
      }));
    }
  }, [bounds, points.length, zoom]);

  if (points.length === 0) {
    return (
      <div
        className={`w-full flex items-center justify-center bg-gray-100 ${className}`}
        style={{ height }}
      >
        <p className="text-gray-500">No route points available</p>
      </div>
    );
  }

  // Color palette for multiple markers
  const markerColors = [
    "#ef4444", // red
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
  ];

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
        {/* Route line */}
        {routeGeoJson && (
          <Source id="route" type="geojson" data={routeGeoJson}>
            <Layer
              id="route-line"
              type="line"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "#3b82f6",
                "line-width": 4,
                "line-opacity": 0.7,
              }}
            />
          </Source>
        )}

        {/* Markers */}
        {points.map((point, index) => {
          const color =
            points.length === 1
              ? markerColor
              : markerColors[index % markerColors.length];

          return (
            <Marker
              key={point.id}
              longitude={point.coordinates[0]}
              latitude={point.coordinates[1]}
              color={color}
              anchor="bottom"
            >
              {/* Custom marker with label */}
              {points.length > 1 && (
                <div className="relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded shadow-md border border-gray-200 text-xs font-medium text-gray-900 z-10">
                    {point.label}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  </div>
                </div>
              )}
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}

