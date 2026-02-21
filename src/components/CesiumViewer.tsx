import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { PlaneBillboards } from "./PlaneBillboards";

export default function CesiumViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<Cesium.Viewer>();

  useEffect(() => {
    let viewerInstance: Cesium.Viewer | undefined;
    let isMounted = true;

    const initialize = async () => {
      if (!containerRef.current) return;

      try {
        // Create terrain provider first
        const terrainProvider = (await Cesium.createWorldTerrainAsync()) as any;

        // Check if unmounted during await
        if (!isMounted) return;

        viewerInstance = new Cesium.Viewer(containerRef.current, {
          terrainProvider,
          timeline: false,
          animation: false,
          baseLayerPicker: true,
        });

        viewerInstance.clock.shouldAnimate = true;
        viewerInstance.scene.screenSpaceCameraController.enableCollisionDetection = true;

        // Double check mount status before setting state
        if (isMounted) {
          setViewer(viewerInstance);
        } else {
          console.warn(
            "CesiumViewer unmounted before state set, destroying viewer.",
          );
          viewerInstance.destroy();
        }
      } catch (e) {
        console.error("Failed to initialize Cesium Viewer", e);
      }
    };

    initialize();

    return () => {
      isMounted = false;
      if (viewerInstance && !viewerInstance.isDestroyed()) {
        viewerInstance.destroy();
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {viewer && <PlaneBillboards viewer={viewer} />}
    </div>
  );
}
