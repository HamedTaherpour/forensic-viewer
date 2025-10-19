# 360-Degree Panorama Viewer Usage Guide

## Installation

The `pannellum` library is already installed:

```bash
npm install pannellum
```

## Using the PanoramaViewer Component

### Import

```tsx
import PanoramaViewer from '@/components/PanoramaViewer';
```

### Simple Usage

```tsx
<PanoramaViewer imageUrl="/img/pano.jpg" />
```

### Full Configuration Usage

```tsx
<PanoramaViewer
  imageUrl="/img/pano.jpg"
  autoLoad={true}          // Auto-load image on mount (default: true)
  autoRotate={false}       // Auto-rotate image (default: false)
  showControls={true}      // Show zoom and fullscreen controls (default: true)
  mouseZoom={true}         // Mouse scroll zoom (default: true)
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imageUrl` | `string` | *required* | URL of the equirectangular panorama image |
| `autoLoad` | `boolean` | `true` | Auto-load image when component mounts |
| `autoRotate` | `boolean` | `false` | Auto-rotate image (negative for RTL) |
| `showControls` | `boolean` | `true` | Show zoom and fullscreen controls |
| `mouseZoom` | `boolean` | `true` | Enable/disable mouse scroll zoom |

## Viewer Features

### Desktop
- **Rotation**: Click and drag to rotate in all directions
- **Zoom**: Use mouse scroll or +/- buttons
- **Fullscreen**: Click fullscreen icon
- **Keyboard**: Use arrow keys and +/- for control

### Mobile
- **Rotation**: Touch and drag with one finger
- **Zoom**: Pinch zoom with two fingers
- **Fullscreen**: Tap fullscreen icon

## Image Format

Images must be **Equirectangular** format (2:1 panorama ratio).

### Recommended Dimensions:
- Minimum: 4096x2048 pixels
- Optimal: 8192x4096 pixels
- Maximum: 16384x8192 pixels (depending on device performance)

## Style Customization

Default styles are defined in `globals.css`:

```css
/* Panorama viewer custom styles */
.pnlm-container {
  font-family: inherit !important;
}

.pnlm-ui {
  direction: ltr !important;
}

.pnlm-about-msg {
  display: none !important;
}
```

## More Code Examples

### Viewer with Custom Height

```tsx
<div className="w-full h-[800px]">
  <PanoramaViewer imageUrl="/img/pano.jpg" />
</div>
```

### Viewer with Auto-Rotation

```tsx
<PanoramaViewer
  imageUrl="/img/pano.jpg"
  autoRotate={true}
/>
```

### Multiple Panorama Gallery

```tsx
const panoramas = [
  { id: 1, url: '/img/pano1.jpg', title: 'Panorama 1' },
  { id: 2, url: '/img/pano2.jpg', title: 'Panorama 2' },
  { id: 3, url: '/img/pano3.jpg', title: 'Panorama 3' },
];

return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {panoramas.map((pano) => (
      <div key={pano.id} className="h-[400px]">
        <h3>{pano.title}</h3>
        <PanoramaViewer imageUrl={pano.url} />
      </div>
    ))}
  </div>
);
```

## Performance and Optimization

1. **Image Size**: Optimize images with appropriate quality and JPEG format
2. **Lazy Loading**: For multiple panoramas on one page, use `autoLoad={false}`
3. **Responsive**: Use containers with specified height

## Common Issues

### Image Not Displaying
- Check that the image path is correct
- Make sure the image is in the `public` folder
- Image format must be Equirectangular

### Slow Performance on Mobile
- Reduce image size
- Use optimized formats (WebP)

### Touch Controls Not Working
- Make sure `touchAction: 'none'` is set on the container
- Avoid interference with other event listeners

## Additional Resources

- [Pannellum Documentation](https://pannellum.org/documentation/overview/)
- [Equirectangular Projection](https://en.wikipedia.org/wiki/Equirectangular_projection)
- [Creating 360 Photos](https://www.google.com/streetview/how-it-works/)