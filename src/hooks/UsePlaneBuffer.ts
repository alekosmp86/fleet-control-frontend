import { useRef, useState, useEffect } from "react";
import type { PlaneBuffer } from "../models/PlaneBuffer";
import type { PlaneSnapshot } from "../models/PlaneSnapshot";

export function usePlaneBuffer() {
  const [planes, setPlanes] = useState<Map<string, PlaneBuffer>>(new Map());
  const planesRef = useRef<Map<string, PlaneBuffer>>(new Map());
  planesRef.current = planes;

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {
      const updates: PlaneSnapshot[] = JSON.parse(event.data);

      const newPlanes = new Map(planesRef.current);

      updates.forEach((p) => {
        const existing = newPlanes.get(p.id);
        if (existing) {
          existing.snapshots.push(p);
          if (existing.snapshots.length > 3) existing.snapshots.shift();
        } else {
          newPlanes.set(p.id, { id: p.id, snapshots: [p] });
        }
      });

      setPlanes(newPlanes);
    };

    return () => ws.close();
  }, []);

  return planes;
}
