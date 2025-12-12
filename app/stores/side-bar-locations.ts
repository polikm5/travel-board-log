import type { LocationType } from "~~/lib/db/schema";
import type { RouteLocationRaw } from "vue-router";

export type SideBarItems = {
  label: string;
  name: string;
  url: string | RouteLocationRaw;
  isShowLabel?: boolean;
  iconColor?: string;
  location?: LocationType | null;
};

export type SideBarItemsWithId = SideBarItems & {
  id: string;
};

export const useSideBarLocationsStore = defineStore("useSideBarLocationsStore", () => {
  const sideBarItems = ref<SideBarItemsWithId[]>([]);
  const loading = ref(false);
  return {
    sideBarItems,
    loading,
  };
});
