import { useMapStore } from "./map";

export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const sideBarItemStore = useSideBarLocationsStore();
  const mapStore = useMapStore();

  effect(() => {
    if (data.value) {
      sideBarItemStore.sideBarItems = data.value.map((item) => {
        return {
          id: `location-${item.id}`,
          label: item.name,
          name: "tabler:map-pin-filled",
          url: { name: "dashboard-location-slug", params: { slug: item.slug } },
          isShowLabel: false,
          location: item,
        };
      });

      mapStore.mapItems = data.value.map((item) => {
        return {
          id: item.id,
          name: item.name,
          lat: item.lat,
          long: item.long,
          description: item.description,
        };
      });
    }
    sideBarItemStore.loading = status.value === "pending";
  });
  return {
    data,
    status,
    refresh,
  };
});
