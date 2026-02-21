import type { PlaneSnapshot } from "./PlaneSnapshot";

export interface PlaneBuffer {
  id: string;
  snapshots: PlaneSnapshot[]; // keep last 2–3 snapshots
}
