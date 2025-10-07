/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  FeatureGroup,
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ChevronLeftOutline } from "heroicons-react";
import { useRouter } from "next/navigation";

import {
  dummyHutanKeringSekunder,
  dummyPemukiman,
  dummyPerkebunan,
  dummyPertanianLahanKering,
  dummyPertanianLahanKering2,
  dummyPertanianLahanKeringBercampurDgnSemak,
  dummySawah,
  dummySemakBelukar,
  dummyTanahTerbuka,
  dummyTubuhAir,
} from "@/dummy/dummyPengunaanLahanFinal";

import { dummyIotMarker } from "@/dummy/dummyIotMarker";
import {
  dummyRunOffTinggi,
  dummyRunOffSedang,
  dummyRunOffRendah,
  dummyRunOffSangatRendah,
  dummyRunOffSangatTinggi,
} from "@/dummy/dummyRunOffFinal";
import { dummyDas } from "@/dummy/dummyDas";

// Fix for leaflet default icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker.svg",
  iconUrl: "/marker.svg",
  shadowUrl: null,
});

const TiffMap = () => {
  const router = useRouter();
  const mapRef = React.useRef<any>();

  // Layer visibility states
  const [showPenggunaanLahan, setShowPenggunaanLahan] = useState(false);
  const [showRunoff, setShowRunoff] = useState(false);
  const [showDas, setShowDas] = useState(true);
  const [showIotMarker, setShowIotMarker] = useState(false);

  // Runoff sub-layer visibility states
  const [showRunoffTinggi, setShowRunoffTinggi] = useState(true);
  const [showRunoffSedang, setShowRunoffSedang] = useState(true);
  const [showRunoffRendah, setShowRunoffRendah] = useState(true);
  const [showRunoffSangatRendah, setShowRunoffSangatRendah] = useState(true);
  const [showRunoffSangatTinggi, setShowRunoffSangatTinggi] = useState(true);

  // PenggunaanLahan sub-layer visibility states
  const [showHutanKeringSekunder, setShowHutanKeringSekunder] = useState(true);
  const [showPemukiman, setShowPemukiman] = useState(true);
  const [showPerkebunan, setShowPerkebunan] = useState(true);
  const [showPertanianLahanKering, setShowPertanianLahanKering] =
    useState(true);
  const [
    showPertanianLahanKeringBercampurDgnSemak,
    setShowPertanianLahanKeringBercampurDgnSemak,
  ] = useState(true);
  const [showSawah, setShowSawah] = useState(true);
  const [showSemakBelukar, setShowSemakBelukar] = useState(true);
  const [showTanahTerbuka, setShowTanahTerbuka] = useState(true);
  const [showTubuhAir, setShowTubuhAir] = useState(true);

  useEffect(() => {
    if (mapRef.current && showDas) {
      const geoJsonLayer = L.geoJSON(dummyDas as any);
      const bounds = geoJsonLayer.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [showDas]);

  const getMergedPertanianLahanKering = () => {
    return {
      type: "FeatureCollection",
      features: [
        ...dummyPertanianLahanKering.features,
        ...dummyPertanianLahanKering2.features,
      ],
    };
  };

  return (
    <div className="relative text-gray-60">
      <div
        className="absolute z-50 p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 overflow-y-auto"
        style={{
          top: "20px",
          left: "20px",
          minWidth: "320px",
          maxWidth: "400px",
          maxHeight: "calc(100vh - 40px)",
        }}>
        <div
          className="flex items-center space-x-3 mb-6 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
          onClick={() => {
            router.replace("/dashboard");
          }}>
          <ChevronLeftOutline
            className={"h-5 w-5 text-gray-600"}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <span className="text-sm font-medium text-gray-700">
            Back to Dashboard
          </span>
        </div>

        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Flood Guard Map
          </h1>
          <p className="text-sm text-gray-600">
            Interactive geospatial analysis
          </p>
        </div>

        {/* Layers Management */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Layer Management
          </h3>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Map Layers
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  DAS ( Daerah Aliran Sungai ){" "}
                </span>
                <button
                  onClick={() => setShowDas(!showDas)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    showDas ? "bg-blue-600" : "bg-gray-300"
                  }`}>
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      showDas ? "translate-x-7" : "translate-x-1"
                    }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  IoT Markers
                </span>
                <button
                  onClick={() => setShowIotMarker(!showIotMarker)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    showIotMarker ? "bg-blue-600" : "bg-gray-300"
                  }`}>
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      showIotMarker ? "translate-x-7" : "translate-x-1"
                    }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Penggunaan Lahan
                </span>
                <button
                  onClick={() => setShowPenggunaanLahan(!showPenggunaanLahan)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    showPenggunaanLahan ? "bg-blue-600" : "bg-gray-300"
                  }`}>
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      showPenggunaanLahan ? "translate-x-7" : "translate-x-1"
                    }`}></div>
                </button>
              </div>

              {showPenggunaanLahan && (
                <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#228B22" }}></div>
                      <span className="text-xs text-gray-700">
                        Hutan Kering Sekunder
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setShowHutanKeringSekunder(!showHutanKeringSekunder)
                      }
                      className="w-8 h-4 rounded-full transition-colors"
                      style={{
                        backgroundColor: showHutanKeringSekunder
                          ? "#228B22"
                          : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showHutanKeringSekunder
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#FFFF00" }}></div>
                      <span className="text-xs text-gray-700">Pemukiman</span>
                    </div>
                    <button
                      onClick={() => setShowPemukiman(!showPemukiman)}
                      className="w-8 h-4 rounded-full transition-colors"
                      style={{
                        backgroundColor: showPemukiman ? "#FFFF00" : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showPemukiman ? "translate-x-4" : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#90EE90" }}></div>
                      <span className="text-xs text-gray-700">Perkebunan</span>
                    </div>
                    <button
                      onClick={() => setShowPerkebunan(!showPerkebunan)}
                      className="w-8 h-4 rounded-full transition-colors"
                      style={{
                        backgroundColor: showPerkebunan ? "#90EE90" : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showPerkebunan ? "translate-x-4" : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#ADFF2F" }}></div>
                      <span className="text-xs text-gray-700">
                        Pertanian Lahan Kering
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setShowPertanianLahanKering(!showPertanianLahanKering)
                      }
                      className="w-8 h-4 rounded-full transition-colors"
                      style={{
                        backgroundColor: showPertanianLahanKering
                          ? "#ADFF2F"
                          : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showPertanianLahanKering
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#E271FC" }}></div>
                      <span className="text-xs text-gray-700">
                        Pertanian Bercampur Semak
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setShowPertanianLahanKeringBercampurDgnSemak(
                          !showPertanianLahanKeringBercampurDgnSemak
                        )
                      }
                      className="w-8 h-4 rounded-full transition-colors"
                      style={{
                        backgroundColor:
                          showPertanianLahanKeringBercampurDgnSemak
                            ? "#E271FC"
                            : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showPertanianLahanKeringBercampurDgnSemak
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#00FFFF" }}></div>
                      <span className="text-xs text-gray-700">Sawah</span>
                    </div>
                    <button
                      onClick={() => setShowSawah(!showSawah)}
                      className="w-8 h-4 rounded-full transition-colors"
                      style={{
                        backgroundColor: showSawah ? "#00FFFF" : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showSawah ? "translate-x-4" : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#FFA500" }}></div>
                      <span className="text-xs text-gray-700">
                        Semak Belukar
                      </span>
                    </div>
                    <button
                      onClick={() => setShowSemakBelukar(!showSemakBelukar)}
                      className="w-8 h-4 rounded-full transition-colors"
                      style={{
                        backgroundColor: showSemakBelukar
                          ? "#FFA500"
                          : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showSemakBelukar ? "translate-x-4" : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#FF4500" }}></div>
                      <span className="text-xs text-gray-700">
                        Tanah Terbuka
                      </span>
                    </div>
                    <button
                      onClick={() => setShowTanahTerbuka(!showTanahTerbuka)}
                      className="w-8 h-4 rounded-full transition-colors"
                      style={{
                        backgroundColor: showTanahTerbuka
                          ? "#FF4500"
                          : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showTanahTerbuka ? "translate-x-4" : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#0000FF" }}></div>
                      <span className="text-xs text-gray-700">Tubuh Air</span>
                    </div>
                    <button
                      onClick={() => setShowTubuhAir(!showTubuhAir)}
                      className="w-8 h-4 rounded-full transition-colors"
                      style={{
                        backgroundColor: showTubuhAir ? "#0000FF" : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showTubuhAir ? "translate-x-4" : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Runoff
                </span>
                <button
                  onClick={() => setShowRunoff(!showRunoff)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    showRunoff ? "bg-blue-600" : "bg-gray-300"
                  }`}>
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      showRunoff ? "translate-x-7" : "translate-x-1"
                    }`}></div>
                </button>
              </div>

              {showRunoff && (
                <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 rounded"></div>
                      <span className="text-xs text-gray-700">
                        Sangat Tinggi (0,89 - 1)
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setShowRunoffSangatTinggi(!showRunoffSangatTinggi)
                      }
                      className={`w-8 h-4 rounded-full transition-colors ${
                        showRunoffSangatTinggi ? "bg-red-600" : "bg-gray-300"
                      }`}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showRunoffSangatTinggi
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  {/* Tinggi */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span className="text-xs text-gray-700">
                        Tinggi (0,78 - 0,89)
                      </span>
                    </div>
                    <button
                      onClick={() => setShowRunoffTinggi(!showRunoffTinggi)}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        showRunoffTinggi ? "bg-orange-500" : "bg-gray-300"
                      }`}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showRunoffTinggi ? "translate-x-4" : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-xs text-gray-700">
                        Sedang (0,67 - 0,78)
                      </span>
                    </div>
                    <button
                      onClick={() => setShowRunoffSedang(!showRunoffSedang)}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        showRunoffSedang ? "bg-yellow-500" : "bg-gray-300"
                      }`}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showRunoffSedang ? "translate-x-4" : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#7ab02a" }}></div>
                      <span className="text-xs text-gray-700">
                        Rendah (0,55 - 0,67)
                      </span>
                    </div>
                    <button
                      onClick={() => setShowRunoffRendah(!showRunoffRendah)}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        showRunoffRendah ? "bg-gray-300" : "bg-gray-300"
                      }`}
                      style={{
                        backgroundColor: showRunoffRendah
                          ? "#7ab02a"
                          : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showRunoffRendah ? "translate-x-4" : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: "#22C55E" }}></div>
                      <span className="text-xs text-gray-700">
                        Sangat Rendah (0,5 - 0,55)
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setShowRunoffSangatRendah(!showRunoffSangatRendah)
                      }
                      className={`w-8 h-4 rounded-full transition-colors ${
                        showRunoffSangatRendah ? "bg-gray-300" : "bg-gray-300"
                      }`}
                      style={{
                        backgroundColor: showRunoffSangatRendah
                          ? "#22C55E"
                          : "#d1d5db",
                      }}>
                      <div
                        className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          showRunoffSangatRendah
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}></div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MapContainer
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        center={[-5.42, 105.25]}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
        ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />
        <LayersControl position="topright">
          {/* Show this per layer that shows the result */}
        </LayersControl>

        {/* IoT Markers Layer */}
        {showIotMarker && <IoTMarkers data={dummyIotMarker} />}

        {/* PenggunaanLahan Layers */}
        {showPenggunaanLahan && showHutanKeringSekunder && (
          <GeoJSON
            data={dummyHutanKeringSekunder as any}
            style={{
              stroke: false,
              fillColor: "#228B22",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showPenggunaanLahan && showPemukiman && (
          <GeoJSON
            data={dummyPemukiman as any}
            style={{
              stroke: false,
              fillColor: "#FFFF00",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showPenggunaanLahan && showPerkebunan && (
          <GeoJSON
            data={dummyPerkebunan as any}
            style={{
              stroke: false,
              fillColor: "#90EE90",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showPenggunaanLahan && showPertanianLahanKering && (
          <GeoJSON
            data={getMergedPertanianLahanKering() as any}
            style={{
              stroke: false,
              fillColor: "#ADFF2F",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showPenggunaanLahan && showPertanianLahanKeringBercampurDgnSemak && (
          <GeoJSON
            data={dummyPertanianLahanKeringBercampurDgnSemak as any}
            style={{
              stroke: false,
              fillColor: "#E271FC",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showPenggunaanLahan && showSawah && (
          <GeoJSON
            data={dummySawah as any}
            style={{
              stroke: false,
              fillColor: "#00FFFF",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showPenggunaanLahan && showSemakBelukar && (
          <GeoJSON
            data={dummySemakBelukar as any}
            style={{
              stroke: false,
              fillColor: "#FFA500",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showPenggunaanLahan && showTanahTerbuka && (
          <GeoJSON
            data={dummyTanahTerbuka as any}
            style={{
              stroke: false,
              fillColor: "#FF4500",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showPenggunaanLahan && showTubuhAir && (
          <GeoJSON
            data={dummyTubuhAir as any}
            style={{
              stroke: false,
              fillColor: "#0000FF",
              fillOpacity: 0.7,
            }}
          />
        )}

        {/* Runoff Layers */}
        {showRunoff && showRunoffSangatTinggi && (
          <GeoJSON
            data={dummyRunOffSangatTinggi as any}
            style={{
              stroke: false,
              fillColor: "#DC2626",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showRunoff && showRunoffTinggi && (
          <GeoJSON
            data={dummyRunOffTinggi as any}
            style={{
              stroke: false,
              fillColor: "#F97316",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showRunoff && showRunoffSedang && (
          <GeoJSON
            data={dummyRunOffSedang as any}
            style={{
              stroke: false,
              fillColor: "#EAB308",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showRunoff && showRunoffRendah && (
          <GeoJSON
            data={dummyRunOffRendah as any}
            style={{
              stroke: false,
              fillColor: "#7ab02a",
              fillOpacity: 0.7,
            }}
          />
        )}

        {showRunoff && showRunoffSangatRendah && (
          <GeoJSON
            data={dummyRunOffSangatRendah as any}
            style={{
              stroke: false,
              fillColor: "#22C55E",
              fillOpacity: 0.7,
            }}
          />
        )}

        {/* Das Layer */}
        {showDas && (
          <GeoJSON
            data={dummyDas as any}
            style={{
              stroke: true,
              color: "#10B981",
              weight: 2,
              opacity: 0.8,
              fill: false,
              fillOpacity: 0,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

const IoTMarkers = ({ data }: any) => {
  const groupRef = React.useRef<any>();

  const createIotIcon = (iotType: string) => {
    let iconColor = "#3B82F6";

    if (iotType === "Automatic Rainfall Recorder") {
      iconColor = "#3B82F6";
    } else if (iotType === "Automatic Water Level") {
      iconColor = "#EF4444";
    }

    const svgIcon = `
      <svg width="25" height="30" viewBox="0 0 25 30" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.5 12.5 30 12.5 30S25 19.5 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${iconColor}"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        <circle cx="12.5" cy="12.5" r="3" fill="${iconColor}"/>
      </svg>
    `;

    return new L.DivIcon({
      html: svgIcon,
      iconSize: [25, 30],
      iconAnchor: [12, 30],
      popupAnchor: [0, -30],
      className: "custom-iot-marker",
    });
  };

  return (
    <FeatureGroup ref={groupRef}>
      {data.features?.map((feature: any, i: number) => {
        const [lng, lat] = feature.geometry.coordinates;
        const iotType = feature.properties.IoT;
        const customIcon = createIotIcon(iotType);

        return (
          <Marker
            key={i}
            position={[lat, lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                console.log("IoT Marker clicked:", feature);
              },
            }}>
            <Popup>
              <div className="border border-solid border-gray-200 w-60 rounded-xl overflow-hidden shadow-lg">
                <div
                  className={`w-full px-4 py-3 text-white ${
                    iotType === "Automatic Rainfall Recorder"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gradient-to-r from-red-500 to-red-600"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg">
                        IoT Device #{feature.properties.Id}
                      </div>
                      <div className="text-sm opacity-90">{iotType}</div>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          iotType === "Automatic Rainfall Recorder"
                            ? "bg-blue-200"
                            : "bg-red-200"
                        }`}></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700 text-sm">
                      Device Type:
                    </span>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded text-white ${
                        iotType === "Automatic Rainfall Recorder"
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}>
                      {iotType === "Automatic Rainfall Recorder"
                        ? "Rainfall"
                        : "Water Level"}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Location Coordinates
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2 rounded border">
                        <div className="text-gray-500 font-medium">
                          Latitude
                        </div>
                        <div className="text-gray-900 font-mono">
                          {lat.toFixed(6)}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <div className="text-gray-500 font-medium">
                          Longitude
                        </div>
                        <div className="text-gray-900 font-mono">
                          {lng.toFixed(6)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center pt-2">
                    <div
                      className={`text-xs flex items-center space-x-1 ${
                        iotType === "Automatic Rainfall Recorder"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          iotType === "Automatic Rainfall Recorder"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}></div>
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </FeatureGroup>
  );
};

export default TiffMap;
