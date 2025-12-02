<script setup lang="ts">
const isSideBarOpen = ref(true);
onMounted(() => {
  isSideBarOpen.value = localStorage.getItem("isSideBarOpen") === "true";
});
function sideBarState() {
  isSideBarOpen.value = !isSideBarOpen.value;
  localStorage.setItem("isSideBarOpen", isSideBarOpen.value.toString());
}
</script>

<template>
  <div class="flex flex-1">
    <div class="side-bar bg-base-100 p-2 transition-all duration-300" :class="isSideBarOpen ? 'w-52' : 'w-16'">
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
          url="/dashboard/add-locations"
          :is-show-label="isSideBarOpen"
        />
        <div class="divider" />
        <SidebarButton
          label="Log out"
          name="tabler:logout-2"
          url="/log-out"
          :is-show-label="isSideBarOpen"
        />
      </div>
    </div>
    <div class="flex-1 bg-amber-400" />
  </div>
</template>
