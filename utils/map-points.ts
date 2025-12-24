import type { LocationLog, SelectLocationType } from "~~/lib/db/schema";
import type { MapPoints } from "~~/lib/types";

export function createMapPointFromLocation(location: SelectLocationType): MapPoints {
  const transformData = {
    ...location,
    url: { name: "dashboard-location-slug", params: { slug: location.slug } },
    toLabel: "View",
  };
  return transformData;
}
export function createMapPointFromLocationLog(locationLog: LocationLog, slug: string): MapPoints {
  const transformData = {
    ...locationLog,
    url: { name: "dashboard-location-slug-id", params: { slug, id: locationLog.id } },
    toLabel: "View",
  };
  return transformData;
}

export function isPointSelected(item: Pick<MapPoints, "id" | "lat" | "long"> | null | undefined, selectedPoint: MapPoints | null | undefined) {
  if (!item || !selectedPoint)
    return false;
  return item.id === selectedPoint.id
    && item.lat === selectedPoint.lat
    && item.long === selectedPoint.long;
}
