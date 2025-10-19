import {
  PanoramasListResponse,
  PanoramaDetailResponse,
  ApiErrorResponse,
} from '@/types/api';
import { mockPanoramas } from '@/data/mock-panoramas';

/**
 * Base API URL - Change this to your backend URL
 * For now, using mock data
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Flag to use mock data or real API
 * Set to false once backend is ready
 */
const USE_MOCK_DATA = true;

/**
 * Panorama Service
 * Handles all API calls related to panoramas and hotspots
 */
class PanoramaService {
  /**
   * Fetch all panoramas with their hotspots
   * @returns Promise with list of panoramas
   */
  async getAllPanoramas(): Promise<PanoramasListResponse> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await this.delay(2000);
      return {
        success: true,
        data: mockPanoramas,
        total: mockPanoramas.length,
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/panoramas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PanoramasListResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching panoramas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Fetch a single panorama by ID
   * @param id - Panorama ID
   * @returns Promise with panorama detail
   */
  async getPanoramaById(id: number): Promise<PanoramaDetailResponse> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await this.delay(300);
      const panorama = mockPanoramas.find((p) => p.id === id);

      if (!panorama) {
        throw {
          success: false,
          error: 'NOT_FOUND',
          message: `Panorama with ID ${id} not found`,
          statusCode: 404,
        } as ApiErrorResponse;
      }

      return {
        success: true,
        data: panorama,
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/panoramas/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PanoramaDetailResponse = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching panorama ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Search panoramas by title or description
   * @param query - Search query
   * @returns Promise with filtered panoramas
   */
  async searchPanoramas(query: string): Promise<PanoramasListResponse> {
    if (USE_MOCK_DATA) {
      await this.delay(400);
      const filtered = mockPanoramas.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description?.toLowerCase().includes(query.toLowerCase())
      );

      return {
        success: true,
        data: filtered,
        total: filtered.length,
      };
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/panoramas/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PanoramasListResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching panoramas:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Simulate network delay for mock data
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Handle and format errors
   */
  private handleError(error: unknown): ApiErrorResponse {
    if (typeof error === 'object' && error !== null && 'success' in error) {
      return error as ApiErrorResponse;
    }

    return {
      success: false,
      error: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      statusCode: 500,
    };
  }
}

// Export singleton instance
export const panoramaService = new PanoramaService();

// Also export the class for testing purposes
export default PanoramaService;

