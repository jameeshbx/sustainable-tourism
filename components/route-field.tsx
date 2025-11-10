"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Search, X, Plus, Trash2 } from "lucide-react";

interface RouteFieldProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  error?: string;
  options?: string; // JSON string with route configuration
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  context?: Array<{
    id: string;
    text: string;
  }>;
}

interface RoutePoint {
  id: string;
  label: string;
  address: string;
  coordinates: [number, number];
}

export function RouteField({
  name,
  label,
  required = false,
  placeholder = "Search for a location...",
  value = "",
  onChange,
  error,
  options,
}: RouteFieldProps) {
  // Parse route options
  let mode: "single" | "multiple" = "single";
  let showRoute = false;
  let pointLabels: string[] = [];

  if (options) {
    try {
      const parsed = JSON.parse(options);
      mode = parsed.mode || "single";
      showRoute = parsed.showRoute || false;
      pointLabels = parsed.pointLabels || [];
    } catch {
      // Use defaults
    }
  }

  // Parse current value (stored as JSON array of points)
  const [points, setPoints] = useState<RoutePoint[]>(() => {
    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return mode === "single" ? [] : [];
  });

  const [currentSearchQuery, setCurrentSearchQuery] = useState("");
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const MAPBOX_API_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

  // Update parent when points change
  useEffect(() => {
    const valueStr = JSON.stringify(points);
    onChange(name, valueStr);
  }, [points, name, onChange]);

  const searchLocation = async (query: string) => {
    if (!query.trim() || !MAPBOX_ACCESS_TOKEN) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${MAPBOX_API_URL}/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5&types=place,locality,neighborhood,address,poi`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.features || []);
      } else {
        console.error("Mapbox API error:", response.statusText);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCurrentSearchQuery(query);

    if (query.trim()) {
      const timer = setTimeout(() => {
        searchLocation(query);
        setShowSuggestions(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (
    feature: MapboxFeature,
    index: number | null
  ) => {
    const newPoint: RoutePoint = {
      id: `point_${Date.now()}`,
      label:
        index !== null && pointLabels[index]
          ? pointLabels[index]
          : mode === "single"
          ? "Location"
          : `Point ${points.length + 1}`,
      address: feature.place_name,
      coordinates: feature.center as [number, number],
    };

    if (mode === "single") {
      setPoints([newPoint]);
    } else {
      if (index !== null && index < points.length) {
        // Update existing point
        const updated = [...points];
        updated[index] = newPoint;
        setPoints(updated);
      } else {
        // Add new point
        setPoints([...points, newPoint]);
      }
    }

    setCurrentSearchQuery("");
    setCurrentSearchIndex(null);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const removePoint = (id: string) => {
    setPoints(points.filter((p) => p.id !== id));
  };

  const startAddingPoint = (index?: number) => {
    setCurrentSearchIndex(index ?? null);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              type="text"
              value={currentSearchQuery}
              onChange={handleInputChange}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              placeholder={
                mode === "single"
                  ? placeholder
                  : currentSearchIndex !== null
                  ? `Search for ${pointLabels[currentSearchIndex] || `Point ${currentSearchIndex + 1}`}...`
                  : "Search to add a point..."
              }
              className={`pl-10 ${error ? "border-red-500" : ""}`}
            />
          </div>
          {mode === "multiple" && currentSearchIndex === null && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => startAddingPoint()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Point
            </Button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((feature, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(feature, currentSearchIndex)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {feature.place_name}
                    </p>
                    {feature.context && feature.context.length > 0 && (
                      <p className="text-xs text-gray-500 truncate">
                        {feature.context
                          .slice(0, 2)
                          .map((ctx) => ctx.text)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Points */}
      {points.length > 0 && (
        <div className="space-y-2">
          {points.map((point, index) => (
            <div
              key={point.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {point.label}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {point.address}
                    </p>
                    <p className="text-xs text-gray-500">
                      {point.coordinates[1].toFixed(4)},{" "}
                      {point.coordinates[0].toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
              {mode === "multiple" && (
                <div className="flex items-center space-x-2 ml-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => startAddingPoint(index)}
                    className="text-blue-600"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePoint(point.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

