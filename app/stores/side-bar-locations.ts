import type { MapPoints } from "~~/lib/types";

export type SideBarItems = {
  label: string;
  name: string;
  url: string;
  isShowLabel?: boolean;
  iconColor?: string;
  location?: MapPoints | null;
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
