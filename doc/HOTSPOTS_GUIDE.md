# Hotspots Usage Guide (Points of Interest)

## What is a Hotspot?

A hotspot is a clickable point on a panoramic image that displays specific information. Using hotspots, you can highlight objects, people, or important points in the image.

## Hotspot Structure

```typescript
interface Hotspot {
  id: string;           // Unique identifier (e.g., 'car', 'person1', 'weapon')
  pitch: number;        // Vertical angle: -90 (down) to 90 (up)
  yaw: number;          // Horizontal angle: -180 (left) to 180 (right)
  type: 'info';         // Hotspot type (currently only 'info' is supported)
  text: string;         // Hotspot title
  description?: string; // Description (optional)
  shape: HotspotShapeConfig; // Visual shape configuration (required)
}

interface HotspotShapeConfig {
  type: 'circle' | 'rectangle' | 'square' | 'polygon'; // Shape type
  width?: number;       // Width in pixels (for rectangle/square)
  height?: number;      // Height in pixels (for rectangle)
  radius?: number;      // Radius in pixels (for circle)
  points?: Array<{ x: number; y: number }>; // Points for polygon (relative to center)
  color?: string;       // Fill color (CSS color)
  borderColor?: string; // Border color (CSS color)
  borderWidth?: number; // Border width in pixels
  opacity?: number;     // Opacity 0-1
}
```

## Practical Examples

### Example 1: Displaying Objects in a Crime Scene (Using Shapes)

```tsx
hotspots: [
  {
    id: 'weapon',
    pitch: 5,
    yaw: 45,
    type: 'info',
    text: 'Weapon',
    description: '12-gauge hunting rifle',
    shape: {
      type: 'rectangle',
      width: 80,
      height: 50,
      color: 'rgba(255, 0, 0, 0.3)',
      borderColor: '#ef4444',
      borderWidth: 3,
    },
  },
  {
    id: 'evidence1',
    pitch: -10,
    yaw: -30,
    type: 'info',
    text: 'Evidence #1',
    description: 'Cigarette butt near the table',
    shape: {
      type: 'circle',
      radius: 30,
      color: 'rgba(255, 165, 0, 0.3)',
      borderColor: '#f59e0b',
      borderWidth: 3,
    },
  },
]
```

### Example 2: Displaying People at a Gathering

```tsx
hotspots: [
  {
    id: 'person1',
    pitch: 0,
    yaw: 0,
    type: 'info',
    text: 'Mr. Smith',
    description: 'Company Manager - Speaking',
    shape: {
      type: 'circle',
      radius: 35,
      color: 'rgba(59, 130, 246, 0.3)',
      borderColor: '#3b82f6',
      borderWidth: 3,
    },
  },
  {
    id: 'person2',
    pitch: -5,
    yaw: 90,
    type: 'info',
    text: 'Ms. Johnson',
    description: 'Sales Manager - Presenting',
    shape: {
      type: 'circle',
      radius: 35,
      color: 'rgba(236, 72, 153, 0.3)',
      borderColor: '#ec4899',
      borderWidth: 3,
    },
  },
]
```

### Example 3: Displaying Important Points in a Building

```tsx
hotspots: [
  {
    id: 'entrance',
    pitch: 0,
    yaw: 0,
    type: 'info',
    text: 'Main Entrance',
    description: 'Building entrance door',
    shape: {
      type: 'rectangle',
      width: 70,
      height: 100,
      color: 'rgba(34, 197, 94, 0.3)',
      borderColor: '#22c55e',
      borderWidth: 3,
    },
  },
  {
    id: 'exit',
    pitch: 0,
    yaw: 180,
    type: 'info',
    text: 'Emergency Exit',
    description: 'Exit route in emergency situations',
    shape: {
      type: 'square',
      width: 70,
      color: 'rgba(239, 68, 68, 0.3)',
      borderColor: '#ef4444',
      borderWidth: 4,
    },
  },
  {
    id: 'camera',
    pitch: 30,
    yaw: 45,
    type: 'info',
    text: 'Security Camera',
    description: 'CCTV camera #3',
    shape: {
      type: 'circle',
      radius: 25,
      color: 'rgba(59, 130, 246, 0.3)',
      borderColor: '#3b82f6',
      borderWidth: 3,
    },
  },
]
```

## How to Find Pitch and Yaw Coordinates

### Method 1: Using the Panorama Viewer

1. Open the panorama page in your browser
2. Rotate the camera (using mouse or touch) to the desired point
3. View the current **Pitch** and **Yaw** values displayed at the bottom of the viewer
4. Note down these values

**Example:**
```
Pitch: -15°
Yaw: 67°
```

Use these values in your hotspot definition:
```tsx
{
  id: 'my-hotspot',
  pitch: -15,
  yaw: 67,
  type: 'info',
  text: 'My Point',
}
```

### Method 2: Estimation Based on Direction

- **Pitch (Vertical)**:
  - `90`: Overhead (ceiling)
  - `0`: Straight ahead (horizon)
  - `-90`: Below (floor)

- **Yaw (Horizontal)**:
  - `0`: Forward (center)
  - `90`: Right
  - `-90`: Left
  - `180` or `-180`: Behind

## Recommended Colors for Different Types

Use appropriate colors based on the type of evidence or point of interest:

### Evidence Types
- **Blood/Violence**: Red shades - `rgba(220, 38, 38, 0.3)`, `#dc2626`
- **Weapons**: Red/Orange - `rgba(239, 68, 68, 0.3)`, `#ef4444`
- **General Evidence**: Orange/Yellow - `rgba(255, 165, 0, 0.3)`, `#f59e0b`
- **Documents**: Blue - `rgba(59, 130, 246, 0.3)`, `#3b82f6`

### Locations
- **Entrances/Exits**: Green - `rgba(34, 197, 94, 0.3)`, `#22c55e`
- **Emergency**: Red - `rgba(239, 68, 68, 0.3)`, `#ef4444`
- **Security**: Blue - `rgba(59, 130, 246, 0.3)`, `#3b82f6`
- **Restricted Areas**: Yellow - `rgba(234, 179, 8, 0.3)`, `#eab308`

### People
- **Victims**: Dark red - `rgba(220, 38, 38, 0.3)`, `#dc2626`
- **Witnesses**: Blue - `rgba(59, 130, 246, 0.3)`, `#3b82f6`
- **Suspects**: Orange - `rgba(249, 115, 22, 0.3)`, `#f97316`
- **Officials**: Purple - `rgba(147, 51, 234, 0.3)`, `#9333ea`

### Objects
- **Vehicles**: Gray - `rgba(100, 116, 139, 0.3)`, `#64748b`
- **Electronics**: Blue - `rgba(59, 130, 246, 0.3)`, `#3b82f6`
- **Furniture**: Purple - `rgba(147, 51, 234, 0.3)`, `#9333ea`
- **Other Items**: Custom colors based on context

## Hotspot Shapes

Hotspots can now display custom shapes instead of just icons. You can choose from circles, rectangles, squares, or custom polygons.

### Shape Types

#### 1. Circle
Perfect for highlighting objects, people, or points of interest.

```tsx
{
  id: 'evidence',
  pitch: -10,
  yaw: -30,
  type: 'info',
  text: 'Evidence',
  description: 'Important evidence',
  shape: {
    type: 'circle',
    radius: 30,
    color: 'rgba(255, 165, 0, 0.3)',
    borderColor: '#f59e0b',
    borderWidth: 3,
    opacity: 0.7,
  },
}
```

#### 2. Rectangle
Ideal for highlighting larger areas or objects with specific dimensions.

```tsx
{
  id: 'weapon',
  pitch: 1,
  yaw: 5,
  type: 'info',
  text: 'Weapon',
  description: 'Hunting rifle',
  shape: {
    type: 'rectangle',
    width: 80,
    height: 50,
    color: 'rgba(255, 0, 0, 0.3)',
    borderColor: '#ef4444',
    borderWidth: 3,
  },
}
```

#### 3. Square
Good for marking square areas or objects.

```tsx
{
  id: 'victim',
  pitch: -20,
  yaw: 0,
  type: 'info',
  text: 'Victim',
  description: 'Body near the couch',
  shape: {
    type: 'square',
    width: 60,
    color: 'rgba(220, 38, 38, 0.3)',
    borderColor: '#dc2626',
    borderWidth: 4,
  },
}
```

#### 4. Polygon
For irregular shapes or custom areas. Specify points as coordinates relative to the center.

```tsx
{
  id: 'blood_stain',
  pitch: -30,
  yaw: 0,
  type: 'info',
  text: 'Blood Stain',
  description: 'Blood on the floor',
  shape: {
    type: 'polygon',
    points: [
      { x: 20, y: 0 },
      { x: 40, y: 10 },
      { x: 50, y: 30 },
      { x: 30, y: 50 },
      { x: 10, y: 40 },
      { x: 0, y: 20 },
    ],
    color: 'rgba(220, 38, 38, 0.4)',
    borderColor: '#dc2626',
    borderWidth: 2,
  },
}
```

### Shape Properties

- **type**: The shape type (`circle`, `rectangle`, `square`, `polygon`)
- **width**: Width in pixels (for rectangle/square)
- **height**: Height in pixels (for rectangle)
- **radius**: Radius in pixels (for circle)
- **points**: Array of `{x, y}` coordinates for polygon (minimum 3 points)
- **color**: Fill color using CSS color format (e.g., `'rgba(255, 0, 0, 0.3)'`, `'#ff0000'`)
- **borderColor**: Border color using CSS color format
- **borderWidth**: Border thickness in pixels (default: 3)
- **opacity**: Transparency from 0 (invisible) to 1 (fully opaque) (default: 0.7)

### Shape Configuration Example

Every hotspot must have a `shape` configuration:

```tsx
{
  id: 'phone',
  pitch: 0,
  yaw: 90,
  type: 'info',
  text: 'Mobile Phone',
  description: 'Victim\'s phone on the table',
  shape: {
    type: 'rectangle',
    width: 40,
    height: 60,
    color: 'rgba(59, 130, 246, 0.3)',
    borderColor: '#3b82f6',
    borderWidth: 3,
  },
}
```

The `shape` field is required for all hotspots. Choose the appropriate shape type based on what you want to highlight.

## Important Notes

1. **Unique ID**: Each hotspot must have a unique `id`
2. **Correct Values**: Pitch should be between -90 to 90 and Yaw between -180 to 180
3. **Clear Text**: Use short and clear texts
4. **Shape Required**: Every hotspot must have a `shape` configuration
5. **Optional Description**: Use the `description` field for more information
6. **Multiple Hotspots Close Together**: You can have multiple hotspots with nearby coordinates (e.g., in one area)
7. **Type Must Be info**: Always use `type: 'info'` (not 'scene')
8. **Polygon Points**: For polygon shapes, provide at least 3 points; coordinates are relative to the center
9. **Shape Properties**: Make sure to specify appropriate dimensions (radius for circle, width/height for rectangle, etc.)

## Common Issues and Solutions

### ❌ Hotspot Not Displaying

**Cause**: Missing shape configuration or incorrect coordinates

**Solution**:
```tsx
// ❌ Wrong - missing shape
{
  id: 'evidence',
  pitch: 0,
  yaw: 0,
  type: 'info',
  text: 'Evidence',
}

// ✅ Correct - has shape
{
  id: 'evidence',
  pitch: 0,
  yaw: 0,
  type: 'info',
  text: 'Evidence',
  shape: {
    type: 'circle',
    radius: 30,
    color: 'rgba(255, 165, 0, 0.3)',
    borderColor: '#f59e0b',
  },
}
```

### ❌ Hotspot Shaking/Moving

**Cause**: Issue in pannellum library code - fixed with code update

**Solution**: Use the latest version of the code

### ❌ Only One Hotspot Displays

**Cause**: All hotspots have the same id or missing shape configuration

**Solution**: 
- Ensure each hotspot has a unique `id`
- Use `type: 'info'`
- Make sure all hotspots have valid `shape` configuration
- Check each hotspot's coordinates

### ✅ Multiple Hotspots in One Area

You can have multiple hotspots with small distances:

```tsx
hotspots: [
      {
        id: 'person1',
        pitch: 0,
        yaw: 0,
        type: 'info',
        text: 'Person 1',
        shape: {
          type: 'circle',
          radius: 30,
          color: 'rgba(59, 130, 246, 0.3)',
          borderColor: '#3b82f6',
        },
      },
      {
        id: 'person2',
        pitch: 0,
        yaw: 10,  // Only 10 degrees apart
        type: 'info',
        text: 'Person 2',
        shape: {
          type: 'circle',
          radius: 30,
          color: 'rgba(236, 72, 153, 0.3)',
          borderColor: '#ec4899',
        },
      },
      {
        id: 'object',
        pitch: 5,
        yaw: 5,   // Between two people
        type: 'info',
        text: 'Object',
        shape: {
          type: 'square',
          width: 40,
          color: 'rgba(249, 115, 22, 0.3)',
          borderColor: '#f97316',
        },
      },
]
```

## How Hotspots Work

- **Hover**: When you hover over a hotspot, a tooltip with information is displayed and the shape becomes more visible
- **Click**: Clicking on a hotspot triggers the configured click handler
- **Animation**: Hotspots have a subtle pulse animation to draw attention
- **Shape Rendering**: Shapes are rendered dynamically based on the configuration from the API
- **3D Fixed**: Hotspots are placed in 3D space on the panorama and move with it when you rotate the camera (like stickers on a ball)
- **Responsive**: Shapes scale and respond to user interactions

## Customizing Styles

To change the hotspot appearance globally, edit the `src/app/globals.css` file:

```css
.hotspot-shape {
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.hotspot-shape-circle {
  border-radius: 50%;
}

.hotspot-shape-square,
.hotspot-shape-rectangle {
  border-radius: 4px;
}

/* Pulse animation */
@keyframes shape-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
```

However, most styling should be done through the `shape` configuration in each hotspot, not globally.

## Complete Example

```tsx
const panoramas: PanoramaItem[] = [
  {
    id: 1,
    title: 'Crime Scene - Living Room',
    imageUrl: '/img/crime-scene.jpg',
    hotspots: [
      {
        id: 'weapon',
        pitch: 5,
        yaw: 45,
        type: 'info',
        text: 'Murder Weapon',
        description: 'Kitchen knife with bloody edges',
        shape: {
          type: 'rectangle',
          width: 100,
          height: 30,
          color: 'rgba(239, 68, 68, 0.3)',
          borderColor: '#ef4444',
          borderWidth: 3,
        },
      },
      {
        id: 'victim',
        pitch: -20,
        yaw: 0,
        type: 'info',
        text: 'Victim',
        description: 'Body next to the sofa',
        shape: {
          type: 'square',
          width: 80,
          color: 'rgba(220, 38, 38, 0.4)',
          borderColor: '#dc2626',
          borderWidth: 4,
        },
      },
      {
        id: 'phone',
        pitch: 0,
        yaw: 90,
        type: 'info',
        text: 'Mobile Phone',
        description: "Victim's phone on the table",
        shape: {
          type: 'rectangle',
          width: 40,
          height: 70,
          color: 'rgba(59, 130, 246, 0.3)',
          borderColor: '#3b82f6',
          borderWidth: 3,
        },
      },
      {
        id: 'door',
        pitch: 10,
        yaw: 180,
        type: 'info',
        text: 'Entrance Door',
        description: 'Open door - signs of forced entry',
        shape: {
          type: 'rectangle',
          width: 70,
          height: 110,
          color: 'rgba(34, 197, 94, 0.3)',
          borderColor: '#22c55e',
          borderWidth: 3,
        },
      },
    ],
  },
];
```

## Support

For further questions or technical issues, refer to the following files:
- `README.md` - Main project documentation
- `PANORAMA_GUIDE.md` - Complete panorama viewer guide
- `src/components/PanoramaViewerAdvanced.tsx` - Component source code

