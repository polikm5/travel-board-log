<script setup lang="ts">
import type { InsertLocation } from "~~/lib/db/schema";

const locationStore = useLocationStore();
const { $csrfFetch } = useNuxtApp();
const route = useRoute();
async function onSubmit(values: InsertLocation) {
  await $csrfFetch(`/api/location/${route.params.slug}`, {
    method: "put",
    body: values,
  });
}

function onSubmitComplete() {
  navigateTo({
    name: "dashboard-location-slug",
    params: { slug: route.params.slug },
  });
}
</script>

<template>
  <LocationForm
    :on-submit
    :initial-values="locationStore.currentLocationLog"
    submit-label="更新"
    submit-icon="tabler:map-pin-up"
    :on-submit-complete="onSubmitComplete"
    :zoom="6"
  />
</template>
