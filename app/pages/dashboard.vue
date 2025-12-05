<script setup lang="ts">
const isSideBarOpen = ref(true);
const sideBarLocationStore = useSideBarLocationsStore();
const locationStore = useLocationStore();
const route = useRoute();

onMounted(() => {
  isSideBarOpen.value = localStorage.getItem("isSideBarOpen") === "true";
  if (route.path !== "dashboard") {
    locationStore.refresh();
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
          name="tabler:arrow-narrow-left"
          size="2.5em"
          class="hover:cursor-pointer "
        />
        <Icon
          v-else
          name="tabler:arrow-narrow-right"
          size="2.5em"
          class="hover:cursor-pointer "
        />
      </div>
      <div class="flex flex-col">
        <SidebarButton
          label="locations"
          name="tabler:map"
          url="/dashboard"
          :is-show-label="isSideBarOpen"
        />
        <SidebarButton
          label="Add Location"
          name="tabler:map-plus"
          url="/dashboard/add"
          :is-show-label="isSideBarOpen"
        />

        <div v-if="sideBarLocationStore.loading || sideBarLocationStore.sideBarItems.length > 0" class="divider" />
        <div v-if="sideBarLocationStore.loading" class="skeleton h-16 w-full" />
        <div
          v-for="item in sideBarLocationStore.sideBarItems"
          v-else
          :key="item.id"
          class="flex flex-col"
        >
          <SidebarButton
            :label="item.label"
            :name="item.name"
            :url="item.url"
            :is-show-label="isSideBarOpen"
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
    <div class="flex flex-1 p-8 flex-col">
      <NuxtPage class="mb-6" />
      <app-map class="flex-1" />
    </div>
  </div>
</template>
