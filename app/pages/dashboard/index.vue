<script setup lang="ts">
import { createMapPointFromLocation } from "~~/utils/map-points";

import { useLocationStore } from "~/stores/locations";

const locations = useLocationStore();
const { data, status } = storeToRefs(locations);
function ToAddPage() {
  navigateTo("/dashboard/add");
}

onMounted(() => {
  locations.refresh();
});
</script>

<template>
  <div class="page-content-top">
    <div v-if="status === 'pending'" class="flex flex-1 h-full justify-center items-center">
      <span class="loading loading-spinner loading-lg" />
    </div>
    <div v-else-if="data && data.length === 0" class="flex flex-1 h-full justify-center items-center">
      <div class="text-center">
        <p class="text-3xl">
          Locations
        </p>
        <div class="mt-2">
          <button class="btn btn-primary" @click="ToAddPage">
            Add Locations To Start
          </button>
        </div>
      </div>
    </div>
    <div
      v-else
      class="location-list"
    >
      <LocationCard
        v-for="location in data"
        :key="location.id"
        :map-point="createMapPointFromLocation(location)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
