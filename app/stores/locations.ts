import type { MapPoints } from "~~/lib/types";

import { useMapStore } from "./map";

export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const sideBarItemStore = useSideBarLocationsStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
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
    sideBarItemStore.loading = status.value === "pending";
  });
  return {
    data,
    status,
    refresh,
  };
});
