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
export function createMapPointFromLocationLog(locationLog: LocationLog): MapPoints {
  const transformData = {
    ...locationLog,
    url: { name: "dashboard-location-slug-id", params: { id: locationLog.id } },
    toLabel: "View",
  };
  return transformData;
}
