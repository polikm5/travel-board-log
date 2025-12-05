export const useLocationStore = defineStore("useLocationStore", () => {
  const { data, status, refresh } = useFetch("/api/locations", {
    lazy: true,
  });
  const sideBarItemStore = useSideBarLocationsStore();

  watchEffect(() => {
    if (data.value) {
      sideBarItemStore.sideBarItems = data.value.map((item) => {
        return {
          id: `location-${item.id}`,
          label: item.name,
          name: "tabler:map-pin-filled",
          url: "#",
          isShowLabel: false,
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
