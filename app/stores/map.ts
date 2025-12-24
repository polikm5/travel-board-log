import type { MapPoints } from "~~/lib/types";
import type { LngLatBounds } from "maplibre-gl";

export const useMapStore = defineStore("useMapStore", () => {
  // const route = useRoute();
  const router = useRouter();
  const mapItems = ref<MapPoints[]>([]);
  const searchMapItems = ref<MapPoints[]>([]);
  let searchBounds: LngLatBounds;
  const selectedMapPoint = ref<MapPoints | null | undefined>(null);
  const shouldFlyTo = ref(true);
  const searchShouldFlyTo = ref(true);
  // 当手动输入表单时 zoom跟随坐标
  const manualFlyTo = ref(false);
  const addPoints = ref<MapPoints & { zoom?: number } | null>(null);
  const draging = ref(false);
  function selectedMapPointWithoutFly(point: MapPoints | null) {
    shouldFlyTo.value = false;
    searchShouldFlyTo.value = false;
    selectedMapPoint.value = point;
  }
  function searchMapPointWithoutFly(point: MapPoints | null) {
    searchShouldFlyTo.value = false;
    shouldFlyTo.value = false;
    selectedMapPoint.value = point;
  }

  async function init() {
    const { useMap } = await import("@indoorequal/vue-maplibre-gl");
    const { LngLatBounds } = await import("maplibre-gl");
    let bounds: LngLatBounds;
    const padding = 60;
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
        padding,
        maxZoom: 10,
      });
    });
    effect(() => {
      const firstPoint = searchMapItems.value[0];
      if (!firstPoint) {
        return;
      }
      searchBounds = searchMapItems.value.reduce((bounds, point) => {
        return bounds.extend([point.long, point.lat]);
      }, new LngLatBounds([firstPoint.long, firstPoint.lat], [firstPoint.long, firstPoint.lat]));
      mapInstance.map?.fitBounds(searchBounds, {
        padding,
        maxZoom: 10,
      });
    });

    watch(() => selectedMapPoint.value, () => {
      if (selectedMapPoint.value) {
        if ((shouldFlyTo.value && !addPoints.value && router.currentRoute.value.path === "/dashboard") || (searchShouldFlyTo.value && addPoints.value)) {
          mapInstance.map?.flyTo({
            center: [selectedMapPoint.value.long, selectedMapPoint.value.lat],
            zoom: 8,
            speed: 1,
          });
        }
      }
      else {
        if (shouldFlyTo.value && !addPoints.value && router.currentRoute.value.path === "/dashboard") {
          mapInstance.map?.fitBounds(bounds, {
            padding,
            maxZoom: 10,
          });
        }
        if (searchShouldFlyTo.value && addPoints.value) {
          mapInstance.map?.fitBounds(searchBounds, {
            padding,
            maxZoom: 10,
          });
        }
      }
      shouldFlyTo.value = true;
      searchShouldFlyTo.value = true;
    });

    watch(addPoints, (newV, oldV) => {
      if ((newV && !oldV)) {
        mapInstance.map?.flyTo({
          center: [newV.long, newV.lat],
          zoom: newV.zoom || 8,
          speed: 1,
        });
        manualFlyTo.value = false;
      }
    }, {
      immediate: true,
    });

    watchEffect(() => {
      if (manualFlyTo.value && addPoints.value && !draging.value) {
        mapInstance.map?.flyTo({
          center: [addPoints.value.long, addPoints.value.lat],
          zoom: 8,
          speed: 1,
        });
      }
      manualFlyTo.value = false;
    });
  }
  return {
    mapItems,
    searchMapItems,
    selectedMapPoint,
    addPoints,
    manualFlyTo,
    draging,
    init,
    selectedMapPointWithoutFly,
    searchMapPointWithoutFly,
  };
});
