# Forensic Viewer - 360° Panorama Viewer

A professional 360-degree panorama viewer application with interactive hotspots (points of interest). Built with Next.js, React, and Pannellum.

## 🌟 Features

- **360° Panorama Viewing**: Fully interactive equirectangular image viewer
- **Interactive Hotspots**: Clickable points of interest with custom shapes and descriptions
- **✨ Hotspot Editor**: Complete visual editor for creating and editing hotspots
  - Create, edit, and delete hotspots
  - Support for circle, square, rectangle, and polygon shapes
  - Visual polygon point editor with add/remove/edit capabilities
  - Real-time preview and selection
  - Full control over colors, sizes, and positioning
- **Multiple Panoramas**: Gallery system to switch between different scenes
- **Auto-rotate**: Optional automatic camera rotation
- **Mouse/Touch Controls**: Drag to rotate, scroll to zoom
- **Fullscreen Support**: Immersive viewing experience
- **Service Architecture**: Clean separation with API service layer
- **Mock Data**: Built-in mock data for development

## 📁 Project Structure

```
forensic-viewer/
├── doc/
│   ├── BACKEND_API.md                 # Complete API documentation
│   ├── HOTSPOTS_GUIDE.md              # Hotspot usage guide
│   ├── HOTSPOT_EDITOR_GUIDE.md        # Hotspot editor complete guide
│   └── PANORAMA_GUIDE.md              # Panorama viewer guide
├── src/
│   ├── app/
│   │   ├── globals.css                # Global styles (with edit mode styles)
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Main page with edit mode
│   ├── components/
│   │   ├── PanoramaViewerAdvanced.tsx # Advanced panorama viewer
│   │   └── HotspotEditor.tsx          # Complete hotspot editor
│   ├── services/
│   │   └── panorama.service.ts        # Panorama API service
│   ├── types/
│   │   └── api.ts                     # TypeScript API types
│   └── data/
│       └── mock-panoramas.ts          # Mock data for development
├── public/
│   └── img/                           # Panorama images
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Viewing Panoramas

Visit the main page at [http://localhost:3000](http://localhost:3000) to view panoramas with interactive hotspots.

### Editing Hotspots

1. Click the Edit Mode button in the top-right corner
2. Select a hotspot to edit from the panorama or from the list below
3. Use the sidebar editor to modify:
   - Position (Pitch/Yaw)
   - Shape type (Circle, Square, Rectangle, Polygon)
   - Shape properties (size, colors, opacity)
   - Polygon points (add, remove, edit coordinates)
   - Text and description
4. Save changes or create new hotspots
5. Click View Mode to exit edit mode

For detailed instructions, see [`HOTSPOT_EDITOR_GUIDE.md`](./doc/HOTSPOT_EDITOR_GUIDE.md)

### Using Mock Data (Current Setup)

The application currently uses mock data from `/src/data/mock-panoramas.ts`. This is perfect for development and testing.

### Connecting to Backend API

When your backend is ready:

1. **Set environment variable:**

   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=https://your-backend.com/api
   ```

2. **Disable mock data:**

   ```typescript
   // src/services/panorama.service.ts
   const USE_MOCK_DATA = false; // Change to false
   ```

3. **Restart the application**

## 📝 API Integration

### Standard Panorama Endpoints

Your backend should implement these endpoints:

#### 1. Get All Panoramas

```
GET /api/panoramas
```

#### 2. Get Panorama by ID

```
GET /api/panoramas/{id}
```

#### 3. Search Panoramas (Optional)

```
GET /api/panoramas/search?q={query}
```

### Complete Documentation

For complete API specification, see:

- [`BACKEND_API.md`](./doc/BACKEND_API.md) - Complete API documentation

## 🎨 Data Structure

### Panorama Object

```typescript
{
  id: number;
  title: string;
  imageUrl: string;           // URL to equirectangular image
  thumbnailUrl?: string;      // Optional thumbnail
  description?: string;
  createdAt?: string;         // ISO 8601 format
  updatedAt?: string;
  hotspots: Hotspot[];        // Array of interactive points
}
```

### Hotspot Object

```typescript
{
  id: string;
  pitch: number;              // -90 to 90 (vertical angle)
  yaw: number;                // -180 to 180 (horizontal angle)
  type: 'info' | 'scene';
  text: string;               // Title
  description?: string;       // Optional description
  icon?: string;              // Emoji icon (e.g., "🚗", "🔫")
}
```

## 📖 Documentation

- [`BACKEND_API.md`](./doc/BACKEND_API.md) - Complete API specification
- [`HOTSPOTS_GUIDE.md`](./doc/HOTSPOTS_GUIDE.md) - How to use and configure hotspots
- [`PANORAMA_GUIDE.md`](./doc/PANORAMA_GUIDE.md) - Panorama viewer usage guide

## 🖼️ Image Requirements

For panorama images:

- **Format**: JPEG or PNG
- **Type**: Equirectangular (360° × 180°)
- **Aspect Ratio**: 2:1
- **Recommended Resolution**: 4096×2048 or higher
- **File Size**: < 10MB for optimal performance

## 🛠️ Technology Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Panorama Engine**: Pannellum.js
- **State Management**: React Hooks

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# Backend API URL (optional, uses mock data by default)
NEXT_PUBLIC_API_URL=https://your-backend.com/api
```

### Service Configuration

```typescript
// src/services/panorama.service.ts

// Toggle between mock data and real API
const USE_MOCK_DATA = true; // Set to false for production
```

## 🤝 Backend Integration Checklist

### Standard Panoramas

- [ ] Database setup completed
- [ ] Tables created (panoramas, hotspots)
- [ ] Sample images uploaded to CDN
- [ ] Endpoint `/api/panoramas` implemented
- [ ] Endpoint `/api/panoramas/:id` implemented
- [ ] CORS configured

### Testing & Deployment

- [ ] Tested with cURL/Postman
- [ ] API URL shared with frontend team
- [ ] Environment variable set in frontend
- [ ] Mock data disabled in service
- [ ] Integration tested
- [ ] Performance testing completed

## 🐛 Troubleshooting

### Panorama Not Loading

- Check image URL is accessible
- Verify image format (must be equirectangular)
- Check browser console for errors

### Hotspots Not Showing

- Ensure `type: 'info'` (not 'scene')
- Verify pitch (-90 to 90) and yaw (-180 to 180) ranges
- Check each hotspot has unique `id`
- Ensure hotspot has valid `shape` configuration

### API Connection Issues

- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings on backend
- Ensure backend is running and accessible
- Test endpoints with cURL/Postman

## 📄 License

[Add your license here]

---

**Built with ❤️ for crime scene investigation and forensic documentation**
