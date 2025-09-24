import dynamic from "next/dynamic";

export const MapPicker = dynamic(() => import("./Map").then((m) => m.default), {
  ssr: false,
  loading: () => <div style={{ height: 420 }}>Loading map...</div>,
});

export default MapPicker;
