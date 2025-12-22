import type { SelectLocationType } from "~~/lib/db/schema";
import type { RouteLocationRaw } from "vue-router";

export type SideBarItems = {
  label: string;
  name: string;
  url: string | RouteLocationRaw;
  isShowLabel?: boolean;
  iconColor?: string;
  location?: SelectLocationType | null;
};

export type SideBarItemsWithId = SideBarItems & {
  id: string;
};

export const useSideBarLocationsStore = defineStore("useSideBarLocationsStore", () => {
  const sideBarItems = ref<SideBarItemsWithId[]>([]);
  const topSideBarItems = ref<SideBarItemsWithId[]>([]);
  const loading = ref(false);
  return {
    sideBarItems,
    topSideBarItems,
    loading,
  };
});
