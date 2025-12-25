import type { LocationLog } from "~~/lib/db/schema";
import type { MapPoints } from "~~/lib/types";
import type { RouteLocationRaw } from "vue-router";

export type SideBarItems = {
  label: string;
  name: string;
  url: string | RouteLocationRaw;
  isShowLabel?: boolean;
  iconColor?: string;
  location?: MapPoints | null | LocationLog;
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
