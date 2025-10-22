"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Search, X } from "lucide-react";

interface LocationFieldProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange: (name: string, value: string) => void;
  error?: string;
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  context?: Array<{
    id: string;
    text: string;
  }>;
}

export function LocationField({
  name,
  label,
  required = false,
  placeholder = "Search for a location...",
  value = "",
  onChange,
  error,
}: LocationFieldProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: [number, number];
  } | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const isFocusedRef = useRef(false);

  // Mapbox API configuration
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const MAPBOX_API_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

  useEffect(() => {
    if (value && !selectedLocation && value !== searchQuery) {
      setSearchQuery(value);
    }
  }, [value, selectedLocation, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

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
    setSearchQuery(query);

    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (query.trim()) {
      // Debounce the search to avoid too many API calls
      const timer = setTimeout(() => {
        searchLocation(query);
        setShowSuggestions(true);
        // Restore focus after state update
        if (isFocusedRef.current && inputRef.current) {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        }
      }, 300);
      setDebounceTimer(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedLocation(null);
      onChange(name, "");
    }
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
    setShowSuggestions(suggestions.length > 0);
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!isFocusedRef.current) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  const handleSuggestionClick = (feature: MapboxFeature) => {
    const location = {
      address: feature.place_name,
      coordinates: feature.center,
    };

    setSelectedLocation(location);
    setSearchQuery(feature.place_name);
    setShowSuggestions(false);
    onChange(name, feature.place_name);

    // Maintain focus after selection
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedLocation(null);
    setSuggestions([]);
    setShowSuggestions(false);
    onChange(name, "");
    // Maintain focus after clearing
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `${MAPBOX_API_URL}/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.features && data.features.length > 0) {
              const feature = data.features[0];
              handleSuggestionClick(feature);
            }
          }
        } catch (error) {
          console.error("Error getting current location:", error);
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            id={name}
            name={name}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`pl-10 pr-20 ${error ? "border-red-500" : ""}`}
            disabled={isLoading}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Current Location Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
          className="mt-2 w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isLoading ? "Getting location..." : "Use Current Location"}
        </Button>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((feature, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(feature)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {feature.place_name}
                    </p>
                    {feature.context && feature.context.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
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

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                Selected: {selectedLocation.address}
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Coordinates: {selectedLocation.coordinates[1].toFixed(4)},{" "}
              {selectedLocation.coordinates[0].toFixed(4)}
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
