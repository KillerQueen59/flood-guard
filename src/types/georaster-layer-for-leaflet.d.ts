// types/georaster-layer-for-leaflet.d.ts
declare module "georaster-layer-for-leaflet" {
  import { GridLayer, LatLngBoundsExpression } from "leaflet";

  interface GeoRasterLayerOptions {
    georaster: any;
    opacity?: number;
    pixelValuesToColorFn?: (values: number[]) => string;
    resolution?: number;
  }

  class GeoRasterLayer extends GridLayer {
    constructor(options: GeoRasterLayerOptions);
    getBounds(): LatLngBounds;
  }

  export default GeoRasterLayer;
}
