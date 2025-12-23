<script setup lang="ts">
import { CURRENT_LOCATION_PAGES, EDIT_PAGES, LOCATION_PAGES } from "~~/lib/constants";

const isSideBarOpen = ref(true);
const sideBarLocationStore = useSideBarLocationsStore();
const locationStore = useLocationStore();
const route = useRoute();
const mapStore = useMapStore();
const { currentLocationLog, currentLocationStatus } = storeToRefs(locationStore);
if (LOCATION_PAGES.has(route.name?.toString() || "")) {
  await locationStore.refresh();
}
onMounted(() => {
  isSideBarOpen.value = localStorage.getItem("isSideBarOpen") === "true";
});
effect(() => {
  if (LOCATION_PAGES.has(route.name?.toString() || "")) {
    sideBarLocationStore.topSideBarItems = [
      {
        id: "link-dashboard",
        label: "locations",
        name: "tabler:map",
        url: "/dashboard",
      },
      {
        id: "link-add-location",
        label: "Add Location",
        name: "tabler:map-plus",
        url: "/dashboard/add",
      },
    ];
  }
  else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || "")) {
    sideBarLocationStore.topSideBarItems = [
      {
        id: "link-dashboard",
        label: "Back to locations",
        name: "tabler:arrow-left",
        url: "/dashboard",
      },

    ];

    if (currentLocationLog.value && currentLocationStatus.value !== "pending") {
      sideBarLocationStore.topSideBarItems.push({
        id: "link-view-location-log",
        label: "View Location-Log",
        name: "tabler:map-plus",
        url: { name: "dashboard-location-slug", params: { slug: locationStore.currentLocationLog?.slug } },
      }, {
        id: "link-add-location-log",
        label: "Add Location-Log",
        name: "tabler:circle-plus-filled",
        url: { name: "dashboard-location-slug-add", params: { slug: locationStore.currentLocationLog?.slug } },
      }, {
        id: "link-edit-location",
        label: "Edit Location",
        name: "tabler:pencil-cog",
        url: { name: "dashboard-location-slug-edit", params: { slug: locationStore.currentLocationLog?.slug } },
      });
    }
  }
});
function sideBarState() {
  isSideBarOpen.value = !isSideBarOpen.value;
  localStorage.setItem("isSideBarOpen", isSideBarOpen.value.toString());
}
</script>

<template>
  <div class="flex flex-1">
    <div class="side-bar bg-base-100 p-2 transition-all duration-300" :class="isSideBarOpen ? 'w-52' : 'w-14'">
      <div class="justify-self-end hover:bg-base-300" @click="sideBarState">
        <Icon
          v-if="isSideBarOpen"
          name="tabler:layout-sidebar-left-collapse"
          size="2em"
          class="hover:cursor-pointer "
        />
        <Icon
          v-else
          name="tabler:layout-sidebar-right-collapse"
          size="2em"
          class="hover:cursor-pointer "
        />
      </div>
      <div class="flex flex-col">
        <SidebarButton
          v-for="topSideBarItems in sideBarLocationStore.topSideBarItems"
          :key="topSideBarItems.id"
          :label="topSideBarItems.label"
          :name="topSideBarItems.name"
          :url="topSideBarItems.url"
          :is-show-label="isSideBarOpen"
        />
        <div v-if="currentLocationStatus === 'pending'" class="flex justify-center my-2">
          <span class="loading" />
        </div>
        <div v-if="sideBarLocationStore.loading || sideBarLocationStore.sideBarItems.length > 0" class="divider" />
        <div v-if="sideBarLocationStore.loading" class="skeleton h-16 w-full" />

        <div
          v-for="item in sideBarLocationStore.sideBarItems"
          v-else
          :key="item.id"
          class="flex flex-col"
          @mouseenter="mapStore.selectedMapPoint = item.location"
          @mouseleave="mapStore.selectedMapPoint = null"
        >
          <SidebarButton
            :label="item.label"
            :name="item.name"
            :url="item.url"
            :is-show-label="isSideBarOpen"
            :icon-color="mapStore.selectedMapPoint?.id === item.location?.id ? 'text-accent' : ''"
          />
        </div>
        <div class="divider" />
        <SidebarButton
          label="Log out"
          name="tabler:logout-2"
          url="/log-out"
          :is-show-label="isSideBarOpen"
        />
      </div>
    </div>
    <div class="flex-1 overflow-auto">
      <div class="flex size-full p-6" :class="{ 'flex-col': !EDIT_PAGES.has(route.name?.toString() || '') }">
        <NuxtPage class="mb-6" />
        <app-map class="flex-1" />
      </div>
    </div>
  </div>
</template>
