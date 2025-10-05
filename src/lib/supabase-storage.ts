import { createClientComponentClient } from "./supabase-clients";

export interface StoredShapefileInfo {
  id: string;
  name: string;
  type: "runoff" | "iot" | "watershed" | "other";
  uploadedAt: string;
  size: number;
  url: string;
}

export class SupabaseStorageManager {
  private static instance: SupabaseStorageManager;
  private client = createClientComponentClient();
  private bucketName = "floodguard";

  static getInstance(): SupabaseStorageManager {
    if (!SupabaseStorageManager.instance) {
      SupabaseStorageManager.instance = new SupabaseStorageManager();
    }
    return SupabaseStorageManager.instance;
  }

  /**
   * Initialize storage bucket (call this once during app setup)
   */
  async initializeBucket(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets } = await this.client.storage.listBuckets();
      const bucketExists = buckets?.some(
        (bucket) => bucket.name === this.bucketName
      );

      if (!bucketExists) {
        // Create bucket if it doesn't exist
        const { error } = await this.client.storage.createBucket(
          this.bucketName,
          {
            public: true,
            allowedMimeTypes: [
              "application/zip",
              "application/x-zip-compressed",
            ],
            fileSizeLimit: 100 * 1024 * 1024, // 100MB
          }
        );

        if (error) {
          console.error("Error creating storage bucket:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Error initializing storage bucket:", error);
      throw error;
    }
  }

  /**
   * Upload a shapefile ZIP to Supabase Storage
   */
  async uploadShapefile(file: File): Promise<StoredShapefileInfo> {
    try {
      // Generate unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `${timestamp}_${file.name}`;

      // Upload file
      const { data, error } = await this.client.storage
        .from(this.bucketName)
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file:", error);
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = this.client.storage.from(this.bucketName).getPublicUrl(filename);

      // Determine file type based on filename
      const type = this.determineShapefileType(file.name);

      return {
        id: data.path,
        name: file.name,
        type,
        uploadedAt: new Date().toISOString(),
        size: file.size,
        url: publicUrl,
      };
    } catch (error) {
      console.error("Error uploading shapefile:", error);
      throw error;
    }
  }

  /**
   * List all stored shapefiles
   */
  async listShapefiles(): Promise<StoredShapefileInfo[]> {
    try {
      const { data, error } = await this.client.storage
        .from(this.bucketName)
        .list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Error listing files:", error);
        throw error;
      }

      return data.map((file) => {
        const {
          data: { publicUrl },
        } = this.client.storage.from(this.bucketName).getPublicUrl(file.name);

        return {
          id: file.name,
          name: file.name.replace(
            /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z_/,
            ""
          ),
          type: this.determineShapefileType(file.name),
          uploadedAt: file.created_at,
          size: file.metadata?.size || 0,
          url: publicUrl,
        };
      });
    } catch (error) {
      console.error("Error listing shapefiles:", error);
      throw error;
    }
  }

  /**
   * Download a shapefile from storage
   */
  async downloadShapefile(fileId: string): Promise<ArrayBuffer> {
    try {
      const { data, error } = await this.client.storage
        .from(this.bucketName)
        .download(fileId);

      if (error) {
        console.error("Error downloading file:", error);
        throw error;
      }

      return await data.arrayBuffer();
    } catch (error) {
      console.error("Error downloading shapefile:", error);
      throw error;
    }
  }

  /**
   * Delete a shapefile from storage
   */
  async deleteShapefile(fileId: string): Promise<void> {
    try {
      const { error } = await this.client.storage
        .from(this.bucketName)
        .remove([fileId]);

      if (error) {
        console.error("Error deleting file:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error deleting shapefile:", error);
      throw error;
    }
  }

  /**
   * Determine shapefile type based on filename
   */
  private determineShapefileType(
    filename: string
  ): "runoff" | "iot" | "watershed" | "other" {
    const name = filename.toLowerCase();

    if (name.includes("runoff") || name.includes("kelas")) {
      return "runoff";
    } else if (name.includes("iot") || name.includes("perangkat")) {
      return "iot";
    } else if (
      name.includes("das") ||
      name.includes("wilayah") ||
      name.includes("watershed")
    ) {
      return "watershed";
    }

    return "other";
  }

  /**
   * Upload the provided shapefiles to storage
   */
  async uploadProvidedShapefiles(): Promise<StoredShapefileInfo[]> {
    // This would be called to upload your specific shapefiles
    // For now, we'll return an empty array since we need the actual files
    return [];
  }
}

export const storageManager = SupabaseStorageManager.getInstance();
