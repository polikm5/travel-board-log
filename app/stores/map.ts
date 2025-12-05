import type { MapPoints } from "~~/lib/types";

export const useMapStore = defineStore("useMapStore", () => {
  const mapItems = ref<MapPoints[]>([]);

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const mapInstance = useMap();

    effect(() => {
      const firstPoint = mapItems.value[0];
      if (!firstPoint) {
        return;
      }
      const bounds = mapItems.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds([firstPoint.long, firstPoint.lat], [firstPoint.long, firstPoint.lat]));
      mapInstance.map?.fitBounds(bounds, {
        padding: 60,
      });
    });
  }
  return {
    mapItems,
    init,
  };
});
