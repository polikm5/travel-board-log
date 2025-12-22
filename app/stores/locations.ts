import type { SelectLocationWithLogs } from "~~/lib/db/schema";
// import type { SelectLocationWithLogs } from "~~/lib/db/schema";
import type { MapPoints } from "~~/lib/types";

import { CURRENT_LOCATION_PAGES, LOCATION_PAGES } from "~~/lib/constants";

import { useMapStore } from "./map";

const listShowLocation = new Set(["dashboard", "dashboard-add"]);
const listNoShowLocation = new Set(["dashboard-location-slug", "dashboard-location-add", "dashboard-location-edit"]);
export const useLocationStore = defineStore("useLocationStore", () => {
  const route = useRoute();
  const mapStore = useMapStore();
  const sideBarItemStore = useSideBarLocationsStore();
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const locationUrlWithSlug = computed(() => {
    return `/api/location/${route.params.slug}`;
  });
  const { data: currentLocationLog, status: currentLocationStatus, error: currentLocationError, refresh: refreshLocationLog } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  effect(() => {
    if (data.value && LOCATION_PAGES.has(route.name?.toString() || "")) {
      const sideBarItems: SideBarItemsWithId[] = [];
      const mapItems: MapPoints[] = [];

      data.value.forEach((item) => {
        sideBarItems.push({
          id: `location-${item.id}`,
          label: item.name,
          name: "tabler:map-pin-filled",
          url: { name: "dashboard-location-slug", params: { slug: item.slug } },
          isShowLabel: false,
          location: item,
        });

        mapItems.push({ ...item, url: { name: "dashboard-location-slug", params: { slug: item.slug } } });
      });
      sideBarItemStore.sideBarItems = sideBarItems;

      mapStore.mapItems = mapItems;
    }
    else if (currentLocationLog.value && CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
      sideBarItemStore.sideBarItems = [];

      mapStore.mapItems = [currentLocationLog.value];
    }
    sideBarItemStore.loading = status.value === "pending";
  });
  return {
    data,
    status,
    currentLocationLog,
    currentLocationStatus,
    currentLocationError,
    refreshLocationLog,
    refresh,

  };
});
