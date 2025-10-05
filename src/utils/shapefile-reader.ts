import { storageManager } from '../lib/supabase-storage';
import shp from 'shpjs';

// GeoJSON types
interface GeoJSONFeature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: number[] | number[][] | number[][][];
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

/**
 * Utility to read and process shapefiles from Supabase Storage
 */
export class ShapefileReader {
  /**
   * Load and process all FloodGuard shapefiles from Supabase Storage
   */
  static async loadFloodGuardShapefiles(): Promise<{
    runoffData: GeoJSONFeatureCollection;
    iotDevices: GeoJSONFeatureCollection;
    watershedBoundary: GeoJSONFeatureCollection;
  }> {
    try {
      // These should match the file names you uploaded to Supabase Storage
      const shapefileUrls = {
        runoff: 'Kelas_RunoFF_FloodGuard.zip', // or whatever you named it in storage
        iot: 'Perangkat_IoT.zip',
        watershed: 'Wilayah_Daerah_Aliran_Sungai_FloodGuard.zip'
      };

      // Load all shapefiles in parallel
      const [runoffData, iotDevices, watershedBoundary] = await Promise.all([
        this.loadShapefileFromStorage(shapefileUrls.runoff),
        this.loadShapefileFromStorage(shapefileUrls.iot),
        this.loadShapefileFromStorage(shapefileUrls.watershed)
      ]);

      return {
        runoffData,
        iotDevices,
        watershedBoundary
      };
    } catch (error) {
      console.error('Error loading FloodGuard shapefiles:', error);
      throw error;
    }
  }

  /**
   * Load a specific shapefile from Supabase Storage
   */
  static async loadShapefileFromStorage(filename: string): Promise<GeoJSONFeatureCollection> {
    try {
      // Download the ZIP file from Supabase Storage
      const arrayBuffer = await storageManager.downloadShapefile(filename);
      
      // Convert to GeoJSON using shpjs
      const geojson = await shp(arrayBuffer);
      
      return geojson as GeoJSONFeatureCollection;
    } catch (error) {
      console.error(`Error loading shapefile ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Load a shapefile directly from a public URL
   */
  static async loadShapefileFromUrl(url: string): Promise<GeoJSONFeatureCollection> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch shapefile: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const geojson = await shp(arrayBuffer);
      
      return geojson as GeoJSONFeatureCollection;
    } catch (error) {
      console.error(`Error loading shapefile from URL ${url}:`, error);
      throw error;
    }
  }
}

/**
 * React hook for reading shapefiles from Supabase Storage
 */
export function useShapefileReader() {
  const loadAllShapefiles = async () => {
    try {
      return await ShapefileReader.loadFloodGuardShapefiles();
    } catch (error) {
      console.error('Error loading shapefiles:', error);
      throw error;
    }
  };

  const loadShapefileFromStorage = async (filename: string) => {
    try {
      return await ShapefileReader.loadShapefileFromStorage(filename);
    } catch (error) {
      console.error('Error loading shapefile:', error);
      throw error;
    }
  };

  const loadShapefileFromUrl = async (url: string) => {
    try {
      return await ShapefileReader.loadShapefileFromUrl(url);
    } catch (error) {
      console.error('Error loading shapefile from URL:', error);
      throw error;
    }
  };

  const listAvailableShapefiles = async () => {
    try {
      return await storageManager.listShapefiles();
    } catch (error) {
      console.error('Error listing shapefiles:', error);
      throw error;
    }
  };

  return {
    loadAllShapefiles,
    loadShapefileFromStorage,
    loadShapefileFromUrl,
    listAvailableShapefiles
  };
}