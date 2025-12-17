// import type { SelectLocationWithLogs } from "~~/lib/db/schema";
import type { MapPoints } from "~~/lib/types";

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
  const locationLog = ref();
  // const locationUrlWithSlug = computed(() => `/api/location/${route.params.slug}`);
  // const { data: locationLog, status: locationLogStatus, error: locationLogError, refresh: refreshLocationLog } = useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
  //   lazy: true,
  //   immediate: false,
  // });

  effect(() => {
    if (data.value && listShowLocation.has(route.name?.toString() || "")) {
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
    else if (locationLog.value && listNoShowLocation.has(route.name?.toString() || "")) {
      sideBarItemStore.sideBarItems = [];

      mapStore.mapItems = [locationLog.value];
    }
    sideBarItemStore.loading = status.value === "pending";
  });
  return {
    data,
    status,
    locationLog,

    refresh,

  };
});
