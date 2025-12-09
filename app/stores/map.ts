import type { MapPoints } from "~~/lib/types";
import type { LngLatBounds } from "maplibre-gl";

export const useMapStore = defineStore("useMapStore", () => {
  const mapItems = ref<MapPoints[]>([]);
  const selectedMapPoint = ref<MapPoints | null | undefined>(null);
  const shouldFlyTo = ref(true);
  function selectedMapPointWithoutFly(point: MapPoints | null) {
    shouldFlyTo.value = false;
    selectedMapPoint.value = point;
  }
  let bounds: LngLatBounds;
  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");

    const mapInstance = useMap();
    effect(() => {
      const firstPoint = mapItems.value[0];
      if (!firstPoint) {
        return;
      }
      bounds = mapItems.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds([firstPoint.long, firstPoint.lat], [firstPoint.long, firstPoint.lat]));
      mapInstance.map?.fitBounds(bounds, {
        padding: 60,
      });
    });

    effect(() => {
      if (selectedMapPoint.value) {
        if (shouldFlyTo.value) {
          mapInstance.map?.flyTo({
            center: [selectedMapPoint.value.long, selectedMapPoint.value.lat],
            zoom: 6,
            speed: 3,
          });
        }
        shouldFlyTo.value = true;
      }
      else {
        mapInstance.map?.fitBounds(bounds, {
          padding: 60,
        });
      }
    });
  }
  return {
    mapItems,
    init,
    selectedMapPoint,
    selectedMapPointWithoutFly,
  };
});
