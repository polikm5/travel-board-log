<script setup lang="ts">
import type { InsertLocationLog } from "~~/lib/db/schema";

import { CENTER_BEIJIN } from "~~/lib/constants";

const locationStore = useLocationStore();
const startedAt = 1766378673526;
const endedAt = 1766465075089;
const route = useRoute();
const { $csrfFetch } = useNuxtApp();
async function onSubmit(values: InsertLocationLog) {
  await $csrfFetch(`/api/location/${route.params.slug}/add`, {
    method: "post",
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
  <LocationLogForm
    :on-submit="onSubmit"
    submit-label="添加 Location-Log"
    submit-icon="tabler:map-pin-plus"
    :on-submit-complete="onSubmitComplete"
    :initial-values="{
      description: '',
      name: '',
      long: locationStore.currentLocationLog?.long || (CENTER_BEIJIN as [number, number])[0],
      lat: locationStore.currentLocationLog?.lat || (CENTER_BEIJIN as [number, number])[1],
      startedAt,
      endedAt,
    }"
    :zoom="12"
  />
</template>
