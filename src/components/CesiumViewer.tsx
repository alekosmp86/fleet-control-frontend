import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

const CesiumViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let viewer: Cesium.Viewer | undefined;

    const initializeCesiumViewer = async () => {
      if (!containerRef.current) return;

      try {
        // Initialize the Cesium Viewer with standard settings
        viewer = new Cesium.Viewer(containerRef.current, {
          terrainProvider: (await Cesium.createWorldTerrainAsync()) as any,
          timeline: false,
          animation: false,
          baseLayerPicker: true,
        });

        // Improve camera handling for better UX
        viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
      } catch (error) {
        console.error("Failed to initialize Cesium Viewer:", error);
      }
    };

    initializeCesiumViewer();

    // Cleanup
    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default CesiumViewer;
