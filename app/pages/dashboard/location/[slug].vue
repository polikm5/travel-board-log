<script setup lang="ts">
// import type { SelectLocationWithLogs } from "~~/lib/db/schema";

const locationStore = useLocationStore();
const { currentLocationLog: data, currentLocationError: error, currentLocationStatus: status } = storeToRefs(locationStore);
const route = useRoute();
// const locationUrlWithSlug = computed(() => `/api/location/${route.params.slug}`);
// const { data, status, error } = await useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
//   lazy: true,
// });
// locationStore.currentLocationLog = data.value;

onMounted(() => {
  locationStore.refreshLocationLog();
});

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug") {
    locationStore.refreshLocationLog();
  }
});
</script>

<template>
  <div class="h-54">
    <div v-if="status === 'pending'" class="loading loading-xl" />
    <div v-if="route.name === 'dashboard-location-slug' && status !== 'pending' && data">
      <div>
        {{ data?.name }}
      </div>
      <div>
        {{ data?.description }}
      </div>

      <div v-if=" !data.locationLog.length" class="mt-4">
        <p class="text-sm italic">
          Add Location Log To Start
        </p>
        <button class="btn btn-primary mt-2">
          Add Location Log
          <Icon name="tabler:map-pin-plus" size="24" />
        </button>
      </div>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
    <div v-if="status !== 'pending' && error" class="alert alert-error">
      {{ error.statusMessage }}
    </div>
  </div>
</template>
