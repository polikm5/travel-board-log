import type { SelectLocationLogWithImages, SelectLocationWithLogs } from "~~/lib/db/schema";
// import type { SelectLocationWithLogs } from "~~/lib/db/schema";
import type { MapPoints } from "~~/lib/types";

import { CURRENT_LOCATION_LOG_PAGES, CURRENT_LOCATION_PAGES, LOCATION_PAGES } from "~~/lib/constants";
import { createMapPointFromLocation, createMapPointFromLocationLog } from "~~/utils/map-points";

import { useMapStore } from "./map";

export const useLocationStore = defineStore("useLocationStore", () => {
  const route = useRoute();
  const router = useRouter();
  const mapStore = useMapStore();
  const sideBarItemStore = useSideBarLocationsStore();
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const locationUrlWithSlug = computed(() => {
    return `/api/location/${router.currentRoute.value.params.slug}`;
  });
  const locationLogUrlWithSlugAndId = computed(() => `/api/location/${router.currentRoute.value.params.slug}/${router.currentRoute.value.params.id}`);
  const { data: currentLocation, status: currentLocationStatus, error: currentLocationError, refresh: refreshCurrentLocation } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  const {
    data: currentLocationLog,
    status: currentLocationLogStatus,
    error: currentLocationLogError,
    refresh: refreshCurrentLocationLog,
  } = useFetch<SelectLocationLogWithImages>(locationLogUrlWithSlugAndId, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  effect(() => {
    if (data.value && LOCATION_PAGES.has(route.name?.toString() || "")) {
      const sideBarItems: SideBarItemsWithId[] = [];
      const mapItems: MapPoints[] = [];

      data.value.forEach((item) => {
        const mapPoint = createMapPointFromLocation(item);
        sideBarItems.push({
          id: `location-${item.id}`,
          label: item.name,
          name: "tabler:map-pin-filled",
          url: { name: "dashboard-location-slug", params: { slug: item.slug } },
          isShowLabel: false,
          location: mapPoint,
        });

        mapItems.push(mapPoint);
      });
      sideBarItemStore.sideBarItems = sideBarItems;

      mapStore.mapItems = mapItems;
    }
    else if (currentLocation.value && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
      const sideBarItems: SideBarItemsWithId[] = [];
      const mapItems: MapPoints[] = [];

      currentLocation.value.locationLog.forEach((item) => {
        const mapPoint = createMapPointFromLocationLog(item, currentLocation.value?.slug || "");
        sideBarItems.push({
          id: `location-log-${item.id}`,
          label: item.name,
          name: "tabler:map-pin-filled",
          url: { name: "dashboard-location-slug-id", params: { slug: currentLocation.value?.slug, id: item.id } },
          isShowLabel: false,
          location: item,
        });

        mapItems.push(mapPoint);
      });
      sideBarItemStore.sideBarItems = sideBarItems;
      if (mapItems.length) {
        mapStore.mapItems = mapItems;
      }
      else {
        mapStore.mapItems = [currentLocation.value];
      }
    }
    else if (currentLocationLog.value && CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || "")) {
      sideBarItemStore.sideBarItems = [];
      mapStore.mapItems = [currentLocationLog.value];
    }
    sideBarItemStore.loading = status.value === "pending" || currentLocationStatus.value === "pending";
    if (sideBarItemStore.loading) {
      mapStore.mapItems = [];
    }
  });
  return {
    data,
    status,
    currentLocation,
    currentLocationStatus,
    currentLocationError,
    currentLocationLog,
    currentLocationLogStatus,
    currentLocationLogError,
    refreshCurrentLocation,
    refresh,
    refreshCurrentLocationLog,

  };
});
