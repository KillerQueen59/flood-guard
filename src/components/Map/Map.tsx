/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import georaster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import L from "leaflet";
import { ChevronLeftOutline } from "heroicons-react";
import { useRouter } from "next/navigation";
import shp from "shpjs";

const TiffMap = () => {
  const router = useRouter();
  const mapRef = React.useRef<any>();
  const [tiffLayers, setTiffLayers] = useState<any[]>([]);
  const [shpLayers, setShpLayers] = useState<any[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;

    // Validate file types and sizes
    const invalidFiles = files.filter((file) => {
      const name = file.name.toLowerCase();
      const validExtensions = [".tif", ".tiff", ".zip", ".shp"];
      const hasValidExtension = validExtensions.some((ext) =>
        name.endsWith(ext)
      );
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit

      if (!hasValidExtension) {
        setUploadProgress(`Invalid file type: ${file.name}`);
        return true;
      }
      if (!isValidSize) {
        setUploadProgress(`File too large (max 100MB): ${file.name}`);
        return true;
      }
      return false;
    });

    if (invalidFiles.length > 0) {
      setTimeout(() => setUploadProgress(""), 5000);
      return;
    }

    setIsUploading(true);
    setUploadProgress("Processing files...");

    const tiffFiles = files.filter(
      (file) =>
        file.name.toLowerCase().endsWith(".tif") ||
        file.name.toLowerCase().endsWith(".tiff")
    );
    const shpFiles = files.filter(
      (file) =>
        file.name.toLowerCase().endsWith(".zip") ||
        file.name.toLowerCase().endsWith(".shp")
    );

    try {
      if (tiffFiles.length > 0) {
        setUploadProgress(`Processing ${tiffFiles.length} TIFF file(s)...`);
        await processTiffFiles(tiffFiles);
      }
      if (shpFiles.length > 0) {
        setUploadProgress(`Processing ${shpFiles.length} shapefile(s)...`);
        await processShpFiles(shpFiles);
      }
      setUploadProgress(`✅ ${files.length} file(s) loaded successfully!`);
      setTimeout(() => setUploadProgress(""), 3000);
    } catch (error) {
      console.error("Error processing files:", error);
      setUploadProgress("❌ Error processing files. Please check file format.");
      setTimeout(() => setUploadProgress(""), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const processTiffFiles = async (files: File[]) => {
    const layers = await Promise.all(
      files.map((file) => {
        return new Promise(async (resolve) => {
          const reader = new FileReader();
          reader.onload = async (e: any) => {
            const arrayBuffer = e.target.result;
            try {
              const raster = await georaster(arrayBuffer);
              const geoRasterLayer = new GeoRasterLayer({
                georaster: raster,
                opacity: 0.7,
                resolution: 256,
              });

              // Add layer to map if it exists
              if (mapRef.current) {
                geoRasterLayer.addTo(mapRef.current);
                const bounds = geoRasterLayer.getBounds();
                resolve({ id: file.name, layer: geoRasterLayer, bounds });
              }
            } catch (error) {
              console.error("Error processing TIFF:", error);
              setUploadProgress(`❌ Failed to load TIFF: ${file.name}`);
              resolve(null); // Resolve with null on error
            }
          };
          reader.readAsArrayBuffer(file);
        });
      })
    );

    // Filter out any null layers
    const validLayers = layers.filter((layer) => layer !== null) as any[];

    // Update state with valid layers
    setTiffLayers((prevLayers) => [...prevLayers, ...validLayers]);

    if (mapRef.current && validLayers.length > 0) {
      const boundsList = validLayers.map((layer) => layer.bounds);
      const combinedBounds = L.latLngBounds(boundsList);
      mapRef.current.fitBounds(combinedBounds); // Fit to the combined bounds of all layers
    }
  };

  const processShpFiles = async (files: File[]) => {
    const layers = await Promise.all(
      files.map((file) => {
        return new Promise(async (resolve) => {
          try {
            let arrayBuffer: ArrayBuffer;

            if (file.name.toLowerCase().endsWith(".zip")) {
              // Handle ZIP files containing shapefile components
              const reader = new FileReader();
              reader.onload = async (e: any) => {
                arrayBuffer = e.target.result;
                try {
                  const geojson = await shp(arrayBuffer);
                  const geoJsonLayer = L.geoJSON(geojson, {
                    style: (feature) => getShapefileStyle(feature, file.name),
                    pointToLayer: (feature, latlng) => {
                      const name = file.name.toLowerCase();
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
                          .map(
                            ([key, value]) =>
                              `<strong>${key}:</strong> ${value}`
                          )
                          .join("<br>");
                        layer.bindPopup(popupContent);
                      }
                    },
                  });

                  if (mapRef.current) {
                    geoJsonLayer.addTo(mapRef.current);
                    const bounds = geoJsonLayer.getBounds();
                    resolve({
                      id: file.name,
                      layer: geoJsonLayer,
                      bounds,
                      type: "shp",
                    });
                  }
                } catch (error) {
                  console.error("Error processing SHP:", error);
                  setUploadProgress(
                    `❌ Failed to load shapefile: ${file.name}`
                  );
                  resolve(null);
                }
              };
              reader.readAsArrayBuffer(file);
            } else {
              setUploadProgress(
                "⚠️ Please upload ZIP files containing shapefiles"
              );
              resolve(null);
            }
          } catch (error) {
            console.error("Error processing shapefile:", error);
            resolve(null);
          }
        });
      })
    );

    // Filter out any null layers
    const validLayers = layers.filter((layer) => layer !== null) as any[];

    // Update state with valid SHP layers
    setShpLayers((prevLayers) => [...prevLayers, ...validLayers]);

    if (mapRef.current && validLayers.length > 0) {
      const boundsList = validLayers.map((layer) => layer.bounds);
      const combinedBounds = L.latLngBounds(boundsList);
      mapRef.current.fitBounds(combinedBounds);
    }
  };

  // Style function for different shapefile types
  const getShapefileStyle = (feature: any, filename: string) => {
    const name = filename.toLowerCase();

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
      // IoT device styling
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
    // Adjust these based on your actual runoff classification values
    const value = properties.KELAS || properties.CLASS || properties.VALUE;

    if (!value) return "#cccccc";

    if (typeof value === "string") {
      const val = value.toLowerCase();
      if (val.includes("tinggi") || val.includes("high")) return "#d73027";
      if (val.includes("sedang") || val.includes("medium")) return "#fc8d59";
      if (val.includes("rendah") || val.includes("low")) return "#91d1c2";
    } else if (typeof value === "number") {
      if (value >= 3) return "#d73027";
      if (value >= 2) return "#fc8d59";
      if (value >= 1) return "#91d1c2";
    }

    return "#cccccc";
  };

  const removeLayer = (id: string) => {
    // Check both TIFF and SHP layers
    setTiffLayers((prevLayers) => {
      const layerToRemove = prevLayers.find((layer) => layer.id === id);
      if (layerToRemove && mapRef.current) {
        mapRef.current.removeLayer(layerToRemove.layer);
      }
      return prevLayers.filter((layer) => layer.id !== id);
    });

    setShpLayers((prevLayers) => {
      const layerToRemove = prevLayers.find((layer) => layer.id === id);
      if (layerToRemove && mapRef.current) {
        mapRef.current.removeLayer(layerToRemove.layer);
      }
      return prevLayers.filter((layer) => layer.id !== id);
    });
  };

  return (
    <div className="relative text-gray-60">
      {/* File Upload Panel */}
      <div
        className="absolute z-50 p-6 bg-white rounded-lg shadow-lg flex flex-col"
        style={{ top: "10px", left: "10px", minWidth: "320px" }}>
        <div
          className="flex space-x-4 mb-4 hover:underline cursor-pointer"
          onClick={() => {
            router.replace("/dashboard");
          }}>
          <ChevronLeftOutline
            className={"h-[20px] w-[20px] text-gray-100"}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div className="text-sm h-[20px]"> Back to Dashboard</div>
        </div>

        <h1 className="text-xl font-bold mb-4 text-gray-800">Map Viewer</h1>

        {/* Drag and Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${
              isDragOver
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}>
          <div className="space-y-3">
            <div className="text-2xl">📁</div>
            <div className="text-sm text-gray-600">
              <strong>Drag & drop files here</strong> or click to browse
            </div>

            <input
              type="file"
              accept=".tiff,.tif,.zip,.shp"
              onChange={handleFileChange}
              multiple
              className="hidden"
              id="file-upload"
            />

            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded cursor-pointer hover:bg-blue-600 transition-colors">
              Choose Files
            </label>
          </div>
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
            {isUploading && (
              <span className="inline-block animate-spin">⏳</span>
            )}
            <span>{uploadProgress}</span>
          </div>
        )}

        {/* File Format Info */}
        <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <div className="font-semibold mb-1">Supported formats:</div>
          <div>
            • <strong>GeoTIFF:</strong> .tif, .tiff files
          </div>
          <div>
            • <strong>Shapefiles:</strong> .zip files containing .shp, .shx,
            .dbf, .prj
          </div>
        </div>
      </div>
      {/* Layers Panel */}
      <div
        className="absolute z-50 p-4 bg-white rounded-lg shadow-lg"
        style={{ top: "10px", right: "10px", minWidth: "280px" }}>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <h2 className="text-lg font-bold mb-3 text-gray-800">Map Layers</h2>

          {/* TIFF Layers Section */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="text-sm font-semibold text-gray-700">
                GeoTIFF Layers
              </h3>
              <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                {tiffLayers.length}
              </span>
            </div>
            {tiffLayers.map((layer) => (
              <div
                key={layer.id}
                className="flex items-center mb-2 p-2 bg-green-50 rounded border-l-3 border-green-500">
                <div
                  className="flex-grow text-xs font-mono truncate"
                  title={layer.id}>
                  {layer.id}
                </div>
                <button
                  onClick={() => removeLayer(layer.id)}
                  className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                  title="Remove layer">
                  ✕
                </button>
              </div>
            ))}
            {tiffLayers.length === 0 && (
              <div className="text-xs text-gray-400 italic pl-5">
                No TIFF layers loaded
              </div>
            )}
          </div>

          {/* Shapefile Layers Section */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <h3 className="text-sm font-semibold text-gray-700">
                Shapefile Layers
              </h3>
              <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                {shpLayers.length}
              </span>
            </div>
            {shpLayers.map((layer) => (
              <div
                key={layer.id}
                className="flex items-center mb-2 p-2 bg-blue-50 rounded border-l-3 border-blue-500">
                <div
                  className="flex-grow text-xs font-mono truncate"
                  title={layer.id}>
                  {layer.id}
                </div>
                <button
                  onClick={() => removeLayer(layer.id)}
                  className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                  title="Remove layer">
                  ✕
                </button>
              </div>
            ))}
            {shpLayers.length === 0 && (
              <div className="text-xs text-gray-400 italic pl-5">
                No shapefile layers loaded
              </div>
            )}
          </div>

          {/* Total layers summary */}
          {(tiffLayers.length > 0 || shpLayers.length > 0) && (
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-600 text-center">
                Total: {tiffLayers.length + shpLayers.length} layer(s) loaded
              </div>
            </div>
          )}
        </div>
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
        center={[-6.5597191, 106.7255352]}
        zoom={5}
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

export default TiffMap;
