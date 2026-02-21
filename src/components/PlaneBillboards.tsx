import * as Cesium from "cesium";
import { usePlaneBuffer } from "../hooks/UsePlaneBuffer";
import { useEffect, useRef, useState } from "react";

interface PlaneBillboardsProps {
  viewer: Cesium.Viewer;
}

function getHeading(lat1: number, lon1: number, lat2: number, lon2: number) {
  const lat1Rad = Cesium.Math.toRadians(lat1);
  const lat2Rad = Cesium.Math.toRadians(lat2);
  const lonDiff = Cesium.Math.toRadians(lon2 - lon1);
  const y = Math.sin(lonDiff) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lonDiff);
  const bearing = Math.atan2(y, x);
  return -bearing; // Negate because Cesium rotation is CCW, bearing is CW
}

export function PlaneBillboards({ viewer }: PlaneBillboardsProps) {
  const planes = usePlaneBuffer();
  const [dataSource, setDataSource] = useState<Cesium.CustomDataSource | null>(
    null,
  );
  const entitiesMap = useRef<Map<string, Cesium.Entity>>(new Map());

  // Manage DataSource lifecycle: add to viewer on mount, remove on unmount
  useEffect(() => {
    if (!viewer) return;

    const ds = new Cesium.CustomDataSource("aircraft");

    // Configure clustering
    ds.clustering.enabled = true;
    ds.clustering.pixelRange = 40;
    ds.clustering.minimumClusterSize = 3;

    viewer.dataSources.add(ds);
    setDataSource(ds);

    return () => {
      // Properly clean up entities and remove the data source
      ds.entities.removeAll();
      viewer.dataSources.remove(ds, true);
      setDataSource(null);
      entitiesMap.current.clear();
    };
  }, [viewer]);

  // Handle plane updates: create or update entities
  useEffect(() => {
    if (!dataSource) return;

    planes.forEach((planeBuffer) => {
      if (planeBuffer.snapshots.length === 0) return;
      let entity = entitiesMap.current.get(planeBuffer.id);

      if (!entity) {
        const position = new Cesium.SampledPositionProperty();
        position.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
        position.backwardExtrapolationType = Cesium.ExtrapolationType.HOLD;

        const rotation = new Cesium.SampledProperty(Number);
        rotation.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;
        rotation.backwardExtrapolationType = Cesium.ExtrapolationType.HOLD;

        for (let i = 0; i < planeBuffer.snapshots.length; i++) {
          const s = planeBuffer.snapshots[i];
          const time = Cesium.JulianDate.fromDate(new Date(s.timestamp));
          const cartesian = Cesium.Cartesian3.fromDegrees(
            s.lon,
            s.lat,
            s.altitude,
          );
          position.addSample(time, cartesian);

          if (i > 0) {
            const prev = planeBuffer.snapshots[i - 1];
            const heading = getHeading(prev.lat, prev.lon, s.lat, s.lon);
            rotation.addSample(time, heading);
          } else {
            // For the first point, default to 0
            rotation.addSample(time, 0);
          }
        }

        entity = dataSource.entities.add({
          id: planeBuffer.id,
          position,
          billboard: {
            image: "/plane.png",
            scale: 0.1,
            scaleByDistance: new Cesium.NearFarScalar(
              1_000_000,
              1.2, // near
              20_000_000,
              0.1, // far
            ),
            translucencyByDistance: new Cesium.NearFarScalar(
              2_000_000,
              1.0,
              25_000_000,
              0.0,
            ),
            heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
            rotation: rotation,
            alignedAxis: Cesium.Cartesian3.UNIT_Z,
          },
        });

        if (entity) {
          entitiesMap.current.set(planeBuffer.id, entity);
        }
      } else {
        // Update existing entity
        const position = entity.position as Cesium.SampledPositionProperty;
        const rotation = entity.billboard!.rotation as Cesium.SampledProperty;

        planeBuffer.snapshots.forEach((s, idx) => {
          const time = Cesium.JulianDate.fromDate(new Date(s.timestamp));
          const cartesian = Cesium.Cartesian3.fromDegrees(
            s.lon,
            s.lat,
            s.altitude,
          );
          position.addSample(time, cartesian);

          if (idx > 0) {
            const prev = planeBuffer.snapshots[idx - 1];
            const heading = getHeading(prev.lat, prev.lon, s.lat, s.lon);
            rotation.addSample(time, heading);
          }
        });
      }
    });

    // Note: We deliberately do not return a cleanup function here.
    // Entities should persist across `planes` updates to allow smoothing/sampling to continue working.
    // Cleanup is handled by the viewer lifecycle effect above.
  }, [planes, dataSource]);

  return null;
}
