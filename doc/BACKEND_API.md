# Backend API Documentation

## Panorama API

### Base URL
```
/api/panoramas
```

### Endpoints

#### GET /api/panoramas
Get list of all panoramas

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Crime Scene - Living Room",
      "imageUrl": "/img/pano.jpg",
      "thumbnailUrl": "/img/thumbnail.jpg",
      "description": "360-degree panoramic image of crime scene in living room",
      "createdAt": "2025-10-14T10:30:00Z",
      "updatedAt": "2025-10-14T10:30:00Z",
      "hotspots": [...]
    }
  ],
  "total": 7,
  "message": "Success"
}
```

#### GET /api/panoramas/:id
Get single panorama details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Crime Scene - Living Room",
    "imageUrl": "/img/pano.jpg",
    "thumbnailUrl": "/img/thumbnail.jpg",
    "description": "360-degree panoramic image",
    "createdAt": "2025-10-14T10:30:00Z",
    "updatedAt": "2025-10-14T10:30:00Z",
    "hotspots": [
      {
        "id": "weapon",
        "pitch": 1,
        "yaw": 5,
        "type": "info",
        "text": "Weapon",
        "description": "12-gauge hunting rifle",
        "shape": {
          "type": "rectangle",
          "width": 80,
          "height": 50,
          "color": "rgba(255, 0, 0, 0.3)",
          "borderColor": "#ef4444",
          "borderWidth": 3,
          "opacity": 0.7
        }
      }
    ]
  },
  "message": "Success"
}
```

## Hotspot Structure

### Basic Hotspot Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for hotspot |
| `pitch` | number | Yes | Vertical angle: -90 (down) to 90 (up) |
| `yaw` | number | Yes | Horizontal angle: -180 (left) to 180 (right) |
| `type` | string | Yes | Hotspot type (currently only `'info'` is supported) |
| `text` | string | Yes | Hotspot title/label |
| `description` | string | No | Additional description shown in tooltip |
| `shape` | object | Yes | Visual shape configuration (see below) |

### Hotspot Shape Configuration

All hotspots must include a `shape` configuration that defines how the hotspot will be visually represented on the panorama.

**Shape Types:**
- `circle` - Circular shape
- `rectangle` - Rectangular shape with custom width/height
- `square` - Square shape with equal width/height
- `polygon` - Custom polygon defined by points

#### Shape Object Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Shape type: `'circle'`, `'rectangle'`, `'square'`, or `'polygon'` |
| `width` | number | Conditional | Width in pixels (required for `rectangle`/`square`) |
| `height` | number | Conditional | Height in pixels (required for `rectangle`) |
| `radius` | number | Conditional | Radius in pixels (required for `circle`) |
| `points` | array | Conditional | Array of `{x, y}` coordinates (required for `polygon`, minimum 3 points) |
| `color` | string | No | Fill color (CSS color format, default: `'rgba(59, 130, 246, 0.3)'`) |
| `borderColor` | string | No | Border color (CSS color format, default: `'#3b82f6'`) |
| `borderWidth` | number | No | Border width in pixels (default: 3) |
| `opacity` | number | No | Opacity from 0 to 1 (default: 0.7) |

### Examples

#### Circle Shape
```json
{
  "id": "evidence1",
  "pitch": -10,
  "yaw": -30,
  "type": "info",
  "text": "Evidence #1",
  "description": "Cigarette butt near the table",
  "shape": {
    "type": "circle",
    "radius": 30,
    "color": "rgba(255, 165, 0, 0.3)",
    "borderColor": "#f59e0b",
    "borderWidth": 3
  }
}
```

#### Rectangle Shape
```json
{
  "id": "weapon",
  "pitch": 1,
  "yaw": 5,
  "type": "info",
  "text": "Weapon",
  "description": "Hunting rifle",
  "shape": {
    "type": "rectangle",
    "width": 80,
    "height": 50,
    "color": "rgba(255, 0, 0, 0.3)",
    "borderColor": "#ef4444",
    "borderWidth": 3,
    "opacity": 0.7
  }
}
```

#### Square Shape
```json
{
  "id": "victim",
  "pitch": -20,
  "yaw": 0,
  "type": "info",
  "text": "Victim",
  "description": "Body near the couch",
  "shape": {
    "type": "square",
    "width": 60,
    "color": "rgba(220, 38, 38, 0.3)",
    "borderColor": "#dc2626",
    "borderWidth": 4
  }
}
```

#### Polygon Shape
```json
{
  "id": "blood_stain",
  "pitch": -30,
  "yaw": 0,
  "type": "info",
  "text": "Blood Stain",
  "description": "Blood on the floor",
  "shape": {
    "type": "polygon",
    "points": [
      { "x": 20, "y": 0 },
      { "x": 40, "y": 10 },
      { "x": 50, "y": 30 },
      { "x": 30, "y": 50 },
      { "x": 10, "y": 40 },
      { "x": 0, "y": 20 }
    ],
    "color": "rgba(220, 38, 38, 0.4)",
    "borderColor": "#dc2626",
    "borderWidth": 2
  }
}
```


## TypeScript Interfaces

```typescript
// Shape types
export type HotspotShapeType = 'circle' | 'rectangle' | 'square' | 'polygon';

// Shape configuration
export interface HotspotShapeConfig {
  type: HotspotShapeType;
  width?: number;
  height?: number;
  radius?: number;
  points?: Array<{ x: number; y: number }>;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  opacity?: number;
}

// Hotspot DTO
export interface HotspotDTO {
  id: string;
  pitch: number;
  yaw: number;
  type: 'info' | 'scene';
  text: string;
  description?: string;
  shape: HotspotShapeConfig;
}

// Panorama DTO
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
```

## Error Responses

```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Error description",
  "statusCode": 404
}
```

## Notes

1. **Shape Required**: All hotspots must include a valid `shape` configuration.

2. **Color Formats**: Colors can be specified in any CSS-compatible format:
   - Hex: `"#ff0000"`
   - RGB: `"rgb(255, 0, 0)"`
   - RGBA: `"rgba(255, 0, 0, 0.3)"`
   - Named: `"red"`

3. **Polygon Points**: For polygon shapes, points are specified relative to the center of the hotspot. The coordinate system has the origin at the top-left of the bounding box.

4. **Performance**: Shapes are rendered efficiently using CSS transforms and SVG for polygons. Hover effects and animations are applied automatically.

5. **Accessibility**: All hotspots should include meaningful `text` and `description` fields for accessibility purposes.

6. **Shape Validation**: Backend should validate that:
   - Circle shapes include `radius` property
   - Rectangle shapes include `width` and `height` properties
   - Square shapes include `width` property
   - Polygon shapes include `points` array with at least 3 points

