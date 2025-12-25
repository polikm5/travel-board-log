<script setup lang="ts">
import type { InsertLocationLog } from "~~/lib/db/schema";

const locationStore = useLocationStore();
const route = useRoute();
const { $csrfFetch } = useNuxtApp();
async function onSubmit(values: InsertLocationLog) {
  await $csrfFetch(`/api/location/${route.params.slug}/${route.params.id}`, {
    method: "put",
    body: values,
  });
}

function onSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug-id",
    params: { slug: route.params.slug, id: route.params.id },
  });
}
</script>

<template>
  <LocationLogForm
    :on-submit="onSubmit"
    submit-label="更新地点日志"
    submit-icon="tabler:map-pin-plus"
    :on-submit-complete="onSubmitComplete"
    :initial-values="locationStore.currentLocationLog"
    :zoom="12"
  />
</template>
