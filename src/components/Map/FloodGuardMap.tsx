/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useShapefileReader } from "../../utils/shapefile-reader";

// Component to add GeoJSON layers to the map
function GeoJSONLayers({
  geoJsonData,
  layerName,
}: {
  geoJsonData: any;
  layerName: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (!geoJsonData || !map) return;

    // Style function for different shapefile types
    const getShapefileStyle = (feature: any) => {
      const name = layerName.toLowerCase();

      if (name.includes("runoff") || name.includes("kelas")) {
        // Runoff classification styling
        return {
          fillColor: getRunoffColor(feature.properties),
          weight: 2,
          opacity: 1,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.7,
        };
      } else if (name.includes("iot") || name.includes("perangkat")) {
        // IoT device styling - will be handled by pointToLayer
        return {
          radius: 8,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        };
      } else if (
        name.includes("das") ||
        name.includes("wilayah") ||
        name.includes("watershed")
      ) {
        // Watershed boundary styling
        return {
          fillColor: "transparent",
          weight: 3,
          opacity: 1,
          color: "#0066cc",
          dashArray: "5,5",
          fillOpacity: 0.1,
        };
      }

      // Default styling
      return {
        fillColor: "#3388ff",
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.5,
      };
    };

    // Color function for runoff classification
    const getRunoffColor = (properties: any) => {
      if (!properties) return "#999";

      // You might need to adjust these based on your actual data properties
      const runoffClass =
        properties.KELAS || properties.CLASS || properties.runoff;

      switch (runoffClass) {
        case "Very Low":
        case "Sangat Rendah":
        case 1:
          return "#00ff00";
        case "Low":
        case "Rendah":
        case 2:
          return "#90ee90";
        case "Medium":
        case "Sedang":
        case 3:
          return "#ffff00";
        case "High":
        case "Tinggi":
        case 4:
          return "#ffa500";
        case "Very High":
        case "Sangat Tinggi":
        case 5:
          return "#ff0000";
        default:
          return "#999";
      }
    };

    // Create GeoJSON layer
    const geoJsonLayer = L.geoJSON(geoJsonData, {
      style: getShapefileStyle,
      pointToLayer: (feature, latlng) => {
        const name = layerName.toLowerCase();
        if (name.includes("iot") || name.includes("perangkat")) {
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        }
        // Default point marker
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: "#3388ff",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
        });
      },
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          const popupContent = Object.entries(feature.properties)
            .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
            .join("<br>");
          layer.bindPopup(popupContent);
        }
      },
    });

    // Add layer to map
    geoJsonLayer.addTo(map);

    // Fit bounds to layer
    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds);
    }

    // Cleanup function
    return () => {
      map.removeLayer(geoJsonLayer);
    };
  }, [geoJsonData, layerName, map]);

  return null;
}

const FloodGuardMap = () => {
  const router = useRouter();
  const { loadAllShapefiles, loadShapefileFromUrl } = useShapefileReader();
  const [mounted, setMounted] = useState(false);
  const [shapefileData, setShapefileData] = useState<{
    runoffData?: any;
    iotDevices?: any;
    watershedBoundary?: any;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState<string>(
    "Loading FloodGuard data..."
  );
  const [error, setError] = useState<string | null>(null);

  // Ensure component only renders on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const loadFloodGuardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadingStatus("Loading FloodGuard shapefiles from Supabase...");

      // Option 1: Load from Supabase Storage (if files are there)
      try {
        const data = await loadAllShapefiles();
        setShapefileData(data);
        setLoadingStatus("✅ FloodGuard data loaded successfully!");
      } catch (storageError) {
        console.log("Storage load failed, trying public URLs...", storageError);

        // Option 2: Load from public URLs (fallback)
        setLoadingStatus("Loading from public URLs...");

        // You'll need to provide the actual public URLs where you stored the files
        const publicUrls = {
          runoff:
            "https://your-supabase-project.supabase.co/storage/v1/object/public/shapefiles/Kelas_RunoFF_FloodGuard.zip",
          iot: "https://your-supabase-project.supabase.co/storage/v1/object/public/shapefiles/Perangkat_IoT.zip",
          watershed:
            "https://your-supabase-project.supabase.co/storage/v1/object/public/shapefiles/Wilayah_Daerah_Aliran_Sungai_FloodGuard.zip",
        };

        const [runoffData, iotDevices, watershedBoundary] = await Promise.all([
          loadShapefileFromUrl(publicUrls.runoff),
          loadShapefileFromUrl(publicUrls.iot),
          loadShapefileFromUrl(publicUrls.watershed),
        ]);

        setShapefileData({
          runoffData,
          iotDevices,
          watershedBoundary,
        });
        setLoadingStatus("✅ FloodGuard data loaded from public URLs!");
      }

      setTimeout(() => setLoadingStatus(""), 3000);
    } catch (error) {
      console.error("Error loading FloodGuard data:", error);
      setError(
        "Failed to load FloodGuard shapefile data. Please check your Supabase configuration."
      );
      setLoadingStatus("❌ Failed to load FloodGuard data");
    } finally {
      setIsLoading(false);
    }
  }, [loadAllShapefiles, loadShapefileFromUrl]);

  useEffect(() => {
    loadFloodGuardData();
  }, [loadFloodGuardData]);

  // Prevent SSR issues by only rendering on client
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FloodGuard Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      {/* Header */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Go back">
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div className="bg-white px-4 py-2 rounded-lg shadow-md">
          <h1 className="text-lg font-semibold text-gray-800">
            FloodGuard Map
          </h1>
        </div>
      </div>

      {/* Loading Status */}
      {(isLoading || loadingStatus) && (
        <div className="absolute top-20 left-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-md max-w-md">
          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
            <span className="text-sm text-gray-700">{loadingStatus}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-20 left-4 z-[1000] bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-md max-w-md">
          <p className="text-sm">{error}</p>
          <button
            onClick={loadFloodGuardData}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
            Retry
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-md max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-2">Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Very High Runoff</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>High Runoff</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Medium Runoff</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <span>Low Runoff</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Very Low Runoff</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
            <span>IoT Devices</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 border-2 border-blue-600 border-dashed"></div>
            <span>Watershed Boundary</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[-6.2, 106.8]} // Default to Jakarta, adjust based on your data
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render shapefile layers */}
        {shapefileData.watershedBoundary && (
          <GeoJSONLayers
            geoJsonData={shapefileData.watershedBoundary}
            layerName="watershed"
          />
        )}
        {shapefileData.runoffData && (
          <GeoJSONLayers
            geoJsonData={shapefileData.runoffData}
            layerName="runoff"
          />
        )}
        {shapefileData.iotDevices && (
          <GeoJSONLayers
            geoJsonData={shapefileData.iotDevices}
            layerName="iot"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default FloodGuardMap;
