'use client';

import { useEffect, useRef, useState } from 'react';
import { HotspotDTO, HotspotShapeConfig } from '@/types/api';

// Re-export for convenience
export type Hotspot = HotspotDTO;

/**
 * Helper function to render different hotspot shapes
 */
const renderHotspotShape = (container: HTMLElement, shape: HotspotShapeConfig) => {
  const shapeElement = document.createElement('div');
  shapeElement.className = `hotspot-shape hotspot-shape-${shape.type}`;
  
  // Default values
  const color = shape.color || 'rgba(59, 130, 246, 0.3)'; // Blue with transparency
  const borderColor = shape.borderColor || '#3b82f6';
  const borderWidth = shape.borderWidth || 3;
  const opacity = shape.opacity !== undefined ? shape.opacity : 0.7;
  
  // Common styles
  shapeElement.style.position = 'absolute';
  shapeElement.style.top = '50%';
  shapeElement.style.left = '50%';
  shapeElement.style.backgroundColor = color;
  shapeElement.style.border = `${borderWidth}px solid ${borderColor}`;
  shapeElement.style.opacity = opacity.toString();
  shapeElement.style.pointerEvents = 'auto';
  shapeElement.style.cursor = 'pointer';
  shapeElement.style.transition = 'all 0.3s ease';
  
  // Shape-specific rendering
  switch (shape.type) {
    case 'circle': {
      const radius = shape.radius || 25;
      shapeElement.style.width = `${radius * 2}px`;
      shapeElement.style.height = `${radius * 2}px`;
      shapeElement.style.borderRadius = '50%';
      shapeElement.style.transform = 'translate(-50%, -50%)';
      break;
    }
    
    case 'square': {
      const size = shape.width || 50;
      shapeElement.style.width = `${size}px`;
      shapeElement.style.height = `${size}px`;
      shapeElement.style.transform = 'translate(-50%, -50%)';
      break;
    }
    
    case 'rectangle': {
      const width = shape.width || 60;
      const height = shape.height || 40;
      shapeElement.style.width = `${width}px`;
      shapeElement.style.height = `${height}px`;
      shapeElement.style.transform = 'translate(-50%, -50%)';
      break;
    }
    
    case 'polygon': {
      if (shape.points && shape.points.length >= 3) {
        // Use SVG for polygon
        const svgNS = 'http://www.w3.org/2000/svg';
        
        // Calculate bounding box
        const xs = shape.points.map(p => p.x);
        const ys = shape.points.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const width = maxX - minX;
        const height = maxY - minY;
        
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', `${width + borderWidth * 2}`);
        svg.setAttribute('height', `${height + borderWidth * 2}`);
        svg.style.position = 'absolute';
        svg.style.top = '50%';
        svg.style.left = '50%';
        svg.style.transform = 'translate(-50%, -50%)';
        
        const polygon = document.createElementNS(svgNS, 'polygon');
        const pointsStr = shape.points
          .map(p => `${p.x - minX + borderWidth},${p.y - minY + borderWidth}`)
          .join(' ');
        polygon.setAttribute('points', pointsStr);
        polygon.setAttribute('fill', color);
        polygon.setAttribute('stroke', borderColor);
        polygon.setAttribute('stroke-width', borderWidth.toString());
        polygon.style.opacity = opacity.toString();
        
        svg.appendChild(polygon);
        container.appendChild(svg);
        
        // Add hover effect
        container.addEventListener('mouseenter', () => {
          polygon.style.opacity = '1';
        });
        container.addEventListener('mouseleave', () => {
          polygon.style.opacity = opacity.toString();
        });
        
        return; // Early return for polygon (SVG-based)
      }
      // Fallback to circle if invalid polygon
      const radius = 25;
      shapeElement.style.width = `${radius * 2}px`;
      shapeElement.style.height = `${radius * 2}px`;
      shapeElement.style.borderRadius = '50%';
      shapeElement.style.transform = 'translate(-50%, -50%)';
      break;
    }
  }
  
  // Add hover effect for non-polygon shapes
  shapeElement.addEventListener('mouseenter', () => {
    shapeElement.style.opacity = '1';
    shapeElement.style.transform = shapeElement.style.transform.replace('scale(1)', 'scale(1.1)');
    if (!shapeElement.style.transform.includes('scale')) {
      shapeElement.style.transform += ' scale(1.1)';
    }
  });
  
  shapeElement.addEventListener('mouseleave', () => {
    shapeElement.style.opacity = opacity.toString();
    shapeElement.style.transform = shapeElement.style.transform.replace(/scale\([^)]+\)/, 'scale(1)');
  });
  
  container.appendChild(shapeElement);
};

// Declare global window.pannellum interface
declare global {
  interface Window {
    pannellum: {
      viewer(container: HTMLElement, config: Record<string, unknown>): {
        destroy(): void;
        getPitch(): number;
        setPitch(pitch: number, animated?: boolean): void;
        getYaw(): number;
        setYaw(yaw: number, animated?: boolean): void;
        getHfov(): number;
        setHfov(hfov: number, animated?: boolean): void;
        startAutoRotate(speed: number): void;
        stopAutoRotate(): void;
        toggleFullscreen(): void;
        on(event: string, callback: (...args: unknown[]) => void): void;
      };
    };
  }
}

interface PanoramaViewerAdvancedProps {
  imageUrl: string;
  autoLoad?: boolean;
  initialAutoRotate?: boolean;
  showControls?: boolean;
  mouseZoom?: boolean;
  hotspots?: Hotspot[];
  onLoad?: () => void;
  onError?: (error: string) => void;
  onHotspotClick?: (hotspot: Hotspot) => void;
  editMode?: boolean;
  selectedHotspotId?: string;
}

const PanoramaViewerAdvanced: React.FC<PanoramaViewerAdvancedProps> = ({
  imageUrl,
  autoLoad = true,
  initialAutoRotate = false,
  showControls = true,
  mouseZoom = true,
  hotspots = [],
  onLoad,
  onError,
  onHotspotClick,
  editMode = false,
  selectedHotspotId,
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pannellumInstanceRef = useRef<ReturnType<typeof window.pannellum.viewer> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [currentPitch, setCurrentPitch] = useState(0);
  const [currentYaw, setCurrentYaw] = useState(0);
  const [currentHfov, setCurrentHfov] = useState(100);
  
  // Base HFOV to calculate zoom compensation
  const baseHfov = useRef(100);

  // Function to update hotspot sizes based on current zoom level
  const updateHotspotSizes = (hfov: number) => {
    if (!viewerRef.current) return;
    
    // Calculate scale factor to compensate for zoom
    // When zooming in (HFOV decreases), we want hotspots to scale up
    const scaleFactor = baseHfov.current / hfov;
    
    // Update all hotspot markers
    const hotspotMarkers = viewerRef.current.querySelectorAll('.hotspot-marker');
    hotspotMarkers.forEach((marker) => {
      const htmlMarker = marker as HTMLElement;
      htmlMarker.style.transform = `scale(${scaleFactor})`;
      htmlMarker.style.transformOrigin = 'center center';
    });
  };

  useEffect(() => {
    if (!viewerRef.current || typeof window === 'undefined' || !window.pannellum) return;

    setIsLoading(true);
    setError(null);

    if (pannellumInstanceRef.current) {
      pannellumInstanceRef.current.destroy();
    }

    try {
      // Convert hotspots to pannellum format
      const pannellumHotspots = hotspots.map((hotspot) => ({
        id: hotspot.id,
        pitch: hotspot.pitch,
        yaw: hotspot.yaw,
        type: 'info',
        text: hotspot.text,
        cssClass: 'custom-hotspot',
        clickHandlerFunc: () => {
          if (onHotspotClick) {
            onHotspotClick(hotspot);
          }
        },
        createTooltipFunc: (hotSpotDiv: HTMLElement) => {
          console.log('Creating hotspot:', hotspot.id, 'at pitch:', hotspot.pitch, 'yaw:', hotspot.yaw);
          
          const isSelected = selectedHotspotId === hotspot.id;
          
          // Create marker container
          const marker = document.createElement('div');
          marker.className = `hotspot-marker ${editMode ? 'hotspot-marker-edit' : ''} ${isSelected ? 'hotspot-marker-selected' : ''}`;
          marker.setAttribute('data-hotspot-id', hotspot.id);
          
          // Render shape (required)
          if (hotspot.shape) {
            renderHotspotShape(marker, hotspot.shape);
          } else {
            console.warn('Hotspot', hotspot.id, 'is missing shape configuration');
          }
          
          // Add selection indicator in edit mode
          if (editMode) {
            const editIndicator = document.createElement('div');
            editIndicator.className = 'hotspot-edit-indicator';
            editIndicator.textContent = '✏️';
            editIndicator.style.position = 'absolute';
            editIndicator.style.top = '-10px';
            editIndicator.style.right = '-10px';
            editIndicator.style.fontSize = '16px';
            editIndicator.style.background = 'white';
            editIndicator.style.borderRadius = '50%';
            editIndicator.style.width = '24px';
            editIndicator.style.height = '24px';
            editIndicator.style.display = 'flex';
            editIndicator.style.alignItems = 'center';
            editIndicator.style.justifyContent = 'center';
            editIndicator.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            editIndicator.style.pointerEvents = 'none';
            marker.appendChild(editIndicator);
          }
          
          // Add selection ring if selected
          if (isSelected) {
            const selectionRing = document.createElement('div');
            selectionRing.className = 'hotspot-selection-ring';
            selectionRing.style.position = 'absolute';
            selectionRing.style.top = '-8px';
            selectionRing.style.left = '-8px';
            selectionRing.style.right = '-8px';
            selectionRing.style.bottom = '-8px';
            selectionRing.style.border = '3px solid #3b82f6';
            selectionRing.style.borderRadius = '8px';
            selectionRing.style.pointerEvents = 'none';
            selectionRing.style.animation = 'pulse 2s ease-in-out infinite';
            marker.appendChild(selectionRing);
          }
          
          hotSpotDiv.appendChild(marker);
          
          // Create tooltip (hidden by default, shown on hover) - only in view mode
          const tooltip = document.createElement('div');
          tooltip.className = 'custom-tooltip';
          
          if (!editMode) {
            const textDiv = document.createElement('div');
            textDiv.className = 'hotspot-text';
            
            const title = document.createElement('div');
            title.className = 'hotspot-title';
            title.textContent = hotspot.text;
            textDiv.appendChild(title);
            
            if (hotspot.description) {
              const desc = document.createElement('div');
              desc.className = 'hotspot-description';
              desc.textContent = hotspot.description;
              textDiv.appendChild(desc);
            }
            
            tooltip.appendChild(textDiv);
          } else {
            // In edit mode, show minimal tooltip
            const editText = document.createElement('div');
            editText.className = 'hotspot-text';
            editText.textContent = `${hotspot.text} - کلیک برای ویرایش`;
            editText.style.fontSize = '12px';
            editText.style.padding = '4px 8px';
            tooltip.appendChild(editText);
          }
          
          hotSpotDiv.appendChild(tooltip);
          
          // Return tooltip element (required by pannellum)
          return tooltip;
        },
      }));
      
      console.log('Total hotspots to create:', pannellumHotspots.length);

      const viewerConfig: Record<string, unknown> = {
        type: 'equirectangular',
        panorama: imageUrl,
        autoLoad,
        autoRotate: autoRotate ? -8 : 0,
        showControls,
        mouseZoom,
        showFullscreenCtrl: true,
        showZoomCtrl: true,
        keyboardZoom: true,
        draggable: true,
        friction: 0.15,
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
        pitch: 0,
        yaw: 0,
        hotSpotDebug: false,
      };

      if (pannellumHotspots.length > 0) {
        viewerConfig.hotSpots = pannellumHotspots;
      }

      pannellumInstanceRef.current = window.pannellum.viewer(viewerRef.current, viewerConfig);

      // Add event listeners
      pannellumInstanceRef.current.on('load', () => {
        setIsLoading(false);
        onLoad?.();
        
        // Initialize hotspot sizes after load
        if (pannellumInstanceRef.current) {
          const initialHfov = pannellumInstanceRef.current.getHfov();
          updateHotspotSizes(initialHfov);
        }
      });

      pannellumInstanceRef.current.on('error', (err: unknown) => {
        const errorMsg = typeof err === 'string' ? err : 'Unknown error';
        setError(errorMsg);
        setIsLoading(false);
        onError?.(errorMsg);
      });

      // Update current view parameters
      const updateViewParams = () => {
        if (pannellumInstanceRef.current) {
          setCurrentPitch(pannellumInstanceRef.current.getPitch());
          setCurrentYaw(pannellumInstanceRef.current.getYaw());
          const newHfov = pannellumInstanceRef.current.getHfov();
          setCurrentHfov(newHfov);
          
          // Update hotspot sizes to compensate for zoom
          updateHotspotSizes(newHfov);
        }
      };

      pannellumInstanceRef.current.on('mouseup', updateViewParams);
      pannellumInstanceRef.current.on('touchend', updateViewParams);
      pannellumInstanceRef.current.on('zoomchange', updateViewParams);
      
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize viewer';
      setError(errorMessage);
      setIsLoading(false);
      onError?.(errorMessage);
    }

    return () => {
      if (pannellumInstanceRef.current) {
        pannellumInstanceRef.current.destroy();
        pannellumInstanceRef.current = null;
      }
    };
  }, [imageUrl, autoLoad, showControls, mouseZoom, autoRotate, hotspots, onLoad, onError, onHotspotClick, editMode, selectedHotspotId]);

  // Handle auto-rotation toggle
  useEffect(() => {
    if (!pannellumInstanceRef.current) return;

    if (autoRotate) {
      pannellumInstanceRef.current.startAutoRotate(-8);
    } else {
      pannellumInstanceRef.current.stopAutoRotate();
    }
  }, [autoRotate]);

  const handleResetView = () => {
    if (pannellumInstanceRef.current) {
      pannellumInstanceRef.current.setPitch(0, true);
      pannellumInstanceRef.current.setYaw(0, true);
      pannellumInstanceRef.current.setHfov(100, true);
    }
  };

  const handleToggleFullscreen = () => {
    if (pannellumInstanceRef.current) {
      pannellumInstanceRef.current.toggleFullscreen();
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            <p className="text-sm text-foreground/70">در حال بارگذاری پانارومای...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 z-10 rounded-lg">
          <div className="text-center p-6 bg-background rounded-lg shadow-lg">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-red-600 font-semibold mb-1">خطا در بارگذاری</p>
            <p className="text-sm text-foreground/70">{error}</p>
          </div>
        </div>
      )}

      {/* Panorama viewer */}
      <div
        ref={viewerRef}
        className="w-full h-full min-h-[400px] rounded-lg overflow-hidden" dir="ltr"
        style={{ touchAction: 'none' }}
      />

      {/* Custom controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
        {/* View info */}
        <div className="bg-black/70 text-white px-4 py-2 rounded-lg text-xs flex gap-4 backdrop-blur-sm">
          <span>Pitch: {Math.round(currentPitch)}°</span>
          <span>Yaw: {Math.round(currentYaw)}°</span>
          <span>FOV: {Math.round(currentHfov)}°</span>
        </div>

        {/* Control buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all backdrop-blur-sm
              ${
                autoRotate
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-black/70 text-white hover:bg-black/80'
              }
            `}
          >
            {autoRotate ? '⏸️ توقف چرخش' : '▶️ چرخش خودکار'}
          </button>
          <button
            onClick={handleResetView}
            className="px-4 py-2 bg-black/70 text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-all backdrop-blur-sm"
          >
            🔄 بازنشانی نما
          </button>
          <button
            onClick={handleToggleFullscreen}
            className="px-4 py-2 bg-black/70 text-white rounded-lg text-sm font-medium hover:bg-black/80 transition-all backdrop-blur-sm"
          >
            ⛶ تمام صفحه
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanoramaViewerAdvanced;

