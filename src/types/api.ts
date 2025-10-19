// API response types for panorama service

/**
 * Shape types for hotspot visualization
 */
export type HotspotShapeType = 'circle' | 'rectangle' | 'square' | 'polygon';

/**
 * Shape configuration for hotspot
 */
export interface HotspotShapeConfig {
  type: HotspotShapeType;
  width?: number;  // Width in pixels (for rectangle/square)
  height?: number; // Height in pixels (for rectangle)
  radius?: number; // Radius in pixels (for circle)
  points?: Array<{ x: number; y: number }>; // Points for polygon (relative to center)
  color?: string;  // Fill color (CSS color)
  borderColor?: string; // Border color (CSS color)
  borderWidth?: number; // Border width in pixels
  opacity?: number; // Opacity 0-1
}

/**
 * Hotspot (Point of Interest) on a panoramic image
 */
export interface HotspotDTO {
  id: string;
  pitch: number;
  yaw: number;
  type: 'info' | 'scene';
  text: string;
  description?: string;
  shape: HotspotShapeConfig; // Visual shape configuration (required)
}

/**
 * Panorama item with image and hotspots
 */
export interface PanoramaDTO {
  id: number;
  title: string;
  imageUrl: string;
  thumbnailUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  hotspots: HotspotDTO[];
}

/**
 * API response for list of panoramas
 */
export interface PanoramasListResponse {
  success: boolean;
  data: PanoramaDTO[];
  total: number;
  message?: string;
}

/**
 * API response for single panorama detail
 */
export interface PanoramaDetailResponse {
  success: boolean;
  data: PanoramaDTO;
  message?: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

