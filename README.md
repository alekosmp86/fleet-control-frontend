# React + CesiumJS Architecture

This project is a minimal setup for integrating CesiumJS into a React application using Vite.

## Architecture Overview

### 1. Build System & Tooling

- **Vite**: Used for fast development and building.
- **vite-plugin-cesium**: Handles the complex asset copying required by Cesium (Workers, Widgets, Imagery) to the public directory automatically.

### 2. Component Structure

- **`App.tsx`**: The root component. It sets up a full-screen container (`100vw`, `100vh`) to host the map.
- **`CesiumViewer.tsx`**: A wrapper component that initializes the `Cesium.Viewer` instance.
  - Usage of `useRef` to target the DOM element.
  - `useEffect` for lifecycle management (initializing on mount, destroying on unmount which is critical for WebGL contexts).

### 3. Dependencies

- `cesium`: The core library.
- `vite-plugin-cesium`: Integration plugin.

## Usage

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Building for Production

```bash
npm run build
```

## Customization

To add more features, modify `src/components/CesiumViewer.tsx`. You can access the `viewer` instance inside the `useEffect` hook to add data sources, primitives, or event handlers.
