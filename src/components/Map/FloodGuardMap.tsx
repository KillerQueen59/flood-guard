/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import shp from "shpjs";
import { log } from "util";

// Color function for runoff classification
const getRunoffColor = (properties: any) => {
  if (!properties) return "#6b7280";

  const runoffClass = properties.KELAS || properties.CLASS || properties.runoff;

  switch (runoffClass) {
    case "Very Low":
    case "Sangat Rendah":
    case 1:
      return "#10b981"; // Emerald green
    case "Low":
    case "Rendah":
    case 2:
      return "#84cc16"; // Lime green
    case "Medium":
    case "Sedang":
    case 3:
      return "#eab308"; // Yellow
    case "High":
    case "Tinggi":
    case 4:
      return "#f97316"; // Orange
    case "Very High":
    case "Sangat Tinggi":
    case 5:
      return "#ef4444"; // Red
    default:
      return "#6b7280"; // Gray
  }
};

// Helper function to get display name for layers
const getDisplayName = (layerName: string) => {
  if (layerName.includes("runoff") || layerName.includes("kelas")) {
    return "Runoff Classification";
  } else if (layerName.includes("iot") || layerName.includes("perangkat")) {
    return "IoT Devices";
  } else if (
    layerName.includes("wilayah") ||
    layerName.includes("das") ||
    layerName.includes("watershed")
  ) {
    return "Watershed Boundary";
  }
  return layerName;
};

const FloodGuardMap = () => {
  const router = useRouter();
  const mapRef = React.useRef<any>();
  const [mounted, setMounted] = useState(false);
  const [shpLayers, setShpLayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [floodGuardLoaded, setFloodGuardLoaded] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState<{
    [key: string]: boolean;
  }>({});

  // Ensure component only renders on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const processShapefileData = useCallback(
    async (geojson: any, fileName: string) => {
      return new Promise((resolve) => {
        try {
          const layerName = fileName.toLowerCase();

          // Determine layer type for specialized styling
          let layerConfig: any = {};

          if (
            layerName.includes("daerah_aliran_sungai") ||
            layerName.includes("wilayah")
          ) {
            // Watershed boundaries - blue outline with transparent fill
            layerConfig = {
              style: {
                color: "#2563eb",
                weight: 3,
                opacity: 0.9,
                fillColor: "transparent",
                fillOpacity: 0.05,
                dashArray: "8,4",
              },
            };
          } else if (
            layerName.includes("iot") ||
            layerName.includes("perangkat")
          ) {
            // IoT devices - orange circles
            layerConfig = {
              style: {
                color: "#ffffff",
                weight: 2,
                opacity: 1,
                fillColor: "#ff6b35",
                fillOpacity: 0.9,
              },
              pointStyle: {
                radius: 10,
                fillColor: "#ff6b35",
                color: "#ffffff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9,
              },
            };
          } else if (
            layerName.includes("runoff") ||
            layerName.includes("kelas")
          ) {
            // Runoff classification with improved colors
            layerConfig = {
              style: (feature: any) => ({
                color: "#ffffff",
                weight: 1,
                opacity: 0.8,
                fillColor: getRunoffColor(feature.properties),
                fillOpacity: 0.7,
              }),
            };
          } else {
            // Default styling
            layerConfig = {
              style: {
                color: "#ffffff",
                weight: 2,
                opacity: 0.8,
                fillColor: "#3b82f6",
                fillOpacity: 0.4,
              },
            };
          }

          const geoJsonLayer = L.geoJSON(geojson, {
            style: (feature) => {
              // For runoff layers, use dynamic styling
              if (typeof layerConfig.style === "function") {
                return layerConfig.style(feature);
              }
              return layerConfig.style;
            },
            pointToLayer: (feature, latlng) => {
              if (layerConfig.pointStyle) {
                return L.circleMarker(latlng, layerConfig.pointStyle);
              }
              // Default point marker
              return L.circleMarker(latlng, {
                radius: 8,
                fillColor: "#3b82f6",
                color: "#ffffff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
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

          if (mapRef.current) {
            const bounds = geoJsonLayer.getBounds();

            // Update state with the new layer - replace existing layer if it exists
            setShpLayers((prevLayers) => {
              // Check if layer with same name already exists
              const existingLayerIndex = prevLayers.findIndex(
                (layer) => layer.id === layerName
              );

              if (existingLayerIndex !== -1) {
                // Remove existing layer from map before replacing
                const existingLayer = prevLayers[existingLayerIndex];
                if (mapRef.current && existingLayer.layer) {
                  mapRef.current.removeLayer(existingLayer.layer);
                }

                // Replace the existing layer
                const newLayers = [...prevLayers];
                newLayers[existingLayerIndex] = {
                  id: layerName,
                  layer: geoJsonLayer,
                  bounds,
                  type: "shp",
                  originalName: layerName,
                  displayName: getDisplayName(layerName),
                };
                return newLayers;
              }

              // Add new layer if it doesn't exist
              return [
                ...prevLayers,
                {
                  id: layerName,
                  layer: geoJsonLayer,
                  bounds,
                  type: "shp",
                  originalName: layerName,
                  displayName: getDisplayName(layerName),
                },
              ];
            });

            // Add layer to map after state update
            geoJsonLayer.addTo(mapRef.current);

            // Initialize layer visibility to true only if it's a new layer
            setLayerVisibility((prev) => {
              return { ...prev, [layerName]: true };
            });

            if (bounds.isValid() && shpLayers.length === 0) {
              mapRef.current.fitBounds(bounds);
            }

            resolve({
              id: fileName,
              layer: geoJsonLayer,
              bounds,
              type: "shp",
            });
          }
        } catch (error) {
          console.error("Error processing shapefile data:", error);
          resolve(null);
        }
      });
    },
    [shpLayers.length]
  );

  // Helper function to process shapefile data (array or object)
  const processShapefileArrayOrObject = useCallback(
    async (geojsonData: any) => {
      // Check if geojsonData is an array of layers or a single FeatureCollection
      if (Array.isArray(geojsonData)) {
        // Multiple shapefiles in the ZIP
        setUploadProgress(`Processing ${geojsonData.length} shapefiles...`);

        for (let i = 0; i < geojsonData.length; i++) {
          const layer = geojsonData[i];
          // Use the fileName property or create a name based on index
          const layerName = (layer as any).fileName || `Layer_${i + 1}`;
          await processShapefileData(layer, layerName);
        }
      } else if (geojsonData && typeof geojsonData === "object") {
        // Check if it's an object with multiple named layers
        const layerNames = Object.keys(geojsonData as any);

        if (layerNames.length > 1) {
          setUploadProgress(`Processing ${layerNames.length} shapefiles...`);

          for (const layerName of layerNames) {
            const layerData = (geojsonData as any)[layerName];
            if (layerData && layerData.type === "FeatureCollection") {
              await processShapefileData(layerData, layerName);
            }
          }
        } else {
          // Single FeatureCollection
          await processShapefileData(geojsonData, "FloodGuard Data");
        }
      }
    },
    [processShapefileData]
  );

  // Load FloodGuard shapefile on component mount
  const loadFloodGuardShapefile = useCallback(async () => {
    try {
      setIsLoading(true);
      setUploadProgress("Loading FloodGuard data from Supabase...");

      // Clear existing layers completely - both from map and state
      setShpLayers((prevLayers) => {
        // Remove all existing layers from map
        prevLayers.forEach((layer) => {
          if (mapRef.current && layer.layer) {
            mapRef.current.removeLayer(layer.layer);
          }
        });
        return [];
      });
      setLayerVisibility({});
      setFloodGuardLoaded(false);

      let dataLoaded = false;

      // Try loading from Supabase first
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
          "https://",
          ""
        );
        const publicUrl = `https://${supabaseUrl}storage/v1/object/public/floodguard/SHP Pemetaan_FloodGuard.zip`;

        const response = await fetch(publicUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch from Supabase: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const geojsonData = await shp(arrayBuffer);

        // Process Supabase data
        await processShapefileArrayOrObject(geojsonData);
        dataLoaded = true;
        setUploadProgress("✅ FloodGuard data loaded from Supabase!");
      } catch (supabaseError) {
        console.log(
          "Supabase load failed, trying dummy data...",
          supabaseError
        );

        // Fallback to dummy data
        try {
          setUploadProgress("Loading from local dummy data...");

          const dummyUrl = "/SHP Pemetaan_FloodGuard.zip";
          const response = await fetch(dummyUrl);

          if (!response.ok) {
            throw new Error(`Failed to fetch dummy data: ${response.status}`);
          }

          const arrayBuffer = await response.arrayBuffer();
          const geojsonData = await shp(arrayBuffer);

          // Process dummy data
          await processShapefileArrayOrObject(geojsonData);
          dataLoaded = true;
          setUploadProgress("✅ FloodGuard data loaded from dummy!");
        } catch (dummyError) {
          console.error("Dummy data load failed:", dummyError);
          throw new Error("Failed to load from both Supabase and dummy data");
        }
      }

      if (dataLoaded) {
        setFloodGuardLoaded(true);
        setTimeout(() => setUploadProgress(""), 3000);
      }
    } catch (error) {
      console.error("Error loading FloodGuard shapefile:", error);
      setUploadProgress("❌ Failed to load FloodGuard data");
      setTimeout(() => setUploadProgress(""), 5000);
    } finally {
      setIsLoading(false);
    }
  }, [processShapefileArrayOrObject]);
  useEffect(() => {
    loadFloodGuardShapefile();
  }, [loadFloodGuardShapefile]);

  const toggleLayerVisibility = (layerId: string) => {
    setLayerVisibility((prev) => {
      const newVisibility = { ...prev, [layerId]: !prev[layerId] };

      // Find the layer and toggle its visibility on the map
      const layer = shpLayers.find((l) => l.id === layerId);
      if (layer && mapRef.current) {
        if (newVisibility[layerId]) {
          // Show layer - make sure it's not already on the map
          if (!mapRef.current.hasLayer(layer.layer)) {
            layer.layer.addTo(mapRef.current);
          }
        } else {
          // Hide layer - make sure it's on the map before removing
          if (mapRef.current.hasLayer(layer.layer)) {
            mapRef.current.removeLayer(layer.layer);
          }
        }
      }

      console.log("Layer visibility updated:", newVisibility);

      return newVisibility;
    });
  };

  // Function to clear all layers from map and state
  const clearAllLayers = useCallback(() => {
    setShpLayers((prevLayers) => {
      // Remove all existing layers from map
      prevLayers.forEach((layer) => {
        if (
          mapRef.current &&
          layer.layer &&
          mapRef.current.hasLayer(layer.layer)
        ) {
          mapRef.current.removeLayer(layer.layer);
        }
      });
      return [];
    });
    setLayerVisibility({});
    setFloodGuardLoaded(false);
  }, []);

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
    <div className="relative text-gray-60">
      {/* FloodGuard Panel */}
      <div
        className="absolute z-50 p-6 bg-white rounded-lg shadow-lg flex flex-col"
        style={{ top: "10px", left: "10px", minWidth: "320px" }}>
        <div
          className="flex space-x-4 mb-4 hover:underline cursor-pointer"
          onClick={() => {
            router.replace("/dashboard");
          }}>
          <ChevronLeftIcon className="h-[20px] w-[20px] text-gray-600" />
          <div className="text-sm h-[20px]"> Back to Dashboard</div>
        </div>

        <h1 className="text-xl font-bold mb-4 text-gray-800">FloodGuard Map</h1>

        {/* FloodGuard Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              FloodGuard Data
            </span>
            <div
              className={`w-3 h-3 rounded-full ${
                floodGuardLoaded
                  ? "bg-green-500"
                  : isLoading
                  ? "bg-yellow-500"
                  : "bg-gray-300"
              }`}></div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">
                Loading FloodGuard data...
              </span>
            </div>
          )}

          {/* Reload Button */}
          <button
            onClick={() => {
              clearAllLayers();
              loadFloodGuardShapefile();
            }}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
            {isLoading
              ? "Loading..."
              : floodGuardLoaded
              ? "Reload FloodGuard Data"
              : "Load FloodGuard Data"}
          </button>
        </div>

        {/* Progress Indicator */}
        {uploadProgress && (
          <div
            className={`mt-3 p-3 rounded-lg text-sm flex items-center space-x-2 ${
              uploadProgress.includes("❌")
                ? "bg-red-50 border border-red-200 text-red-700"
                : uploadProgress.includes("⚠️")
                ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                : uploadProgress.includes("✅")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-blue-50 border border-blue-200 text-blue-700"
            }`}>
            {isLoading && <span className="inline-block animate-spin">⏳</span>}
            <span>{uploadProgress}</span>
          </div>
        )}

        {/* Layers Panel */}
        {shpLayers.length > 0 && (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h3 className="text-sm font-semibold text-gray-800">Layers</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                title="Toggle all layers">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              </button>
            </div>

            {/* Layer List */}
            <div className="divide-y divide-gray-200">
              {shpLayers.map((layer) => {
                const isVisible = layerVisibility[layer.id] !== false; // default to true
                const displayName = getDisplayName(layer.id);
                const featureCount = layer.layer?.getLayers?.()?.length || 0;

                return (
                  <div key={layer.id} className="p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      {/* Layer Name and Info */}
                      <div className="flex-grow">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                            {displayName}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {featureCount > 0
                            ? `${featureCount} ${
                                featureCount === 1 ? "feature" : "features"
                              }`
                            : layer.id}
                        </div>
                      </div>

                      {/* Eye Icon Toggle */}
                      <button
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                          isVisible ? "text-gray-700" : "text-gray-400"
                        }`}
                        title={isVisible ? "Hide layer" : "Show layer"}>
                        {isVisible ? (
                          // Eye open icon
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        ) : (
                          // Eye closed icon
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Layer Legend */}
        {shpLayers.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <div className="text-sm font-medium mb-2 text-gray-700">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-6 h-2 border-2 border-blue-600 border-dashed bg-transparent mr-2"></div>
                <span>Watershed Boundary</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full border-2 border-white mr-2"
                  style={{ backgroundColor: "#ff6b35" }}></div>
                <span>IoT Devices</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 mr-2"></div>
                <span>Very Low Runoff</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-lime-500 mr-2"></div>
                <span>Low Runoff</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 mr-2"></div>
                <span>Medium Runoff</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 mr-2"></div>
                <span>High Runoff</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 mr-2"></div>
                <span>Very High Runoff</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <MapContainer
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        center={[-6.2, 106.8]}
        zoom={10}
        scrollWheelZoom={true}
        ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
};

export { FloodGuardMap };
export default FloodGuardMap;
