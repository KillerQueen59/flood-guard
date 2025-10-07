import dynamic from "next/dynamic";

// Create a simpler dynamic import
const FloodGuardMapComponent = dynamic(() => import("./FloodGuardMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export const MapPicker = FloodGuardMapComponent;
export default FloodGuardMapComponent;
