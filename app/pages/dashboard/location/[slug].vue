<script setup lang="ts">
// import type { SelectLocationWithLogs } from "~~/lib/db/schema";
import type { FetchError } from "ofetch";

import { formatDate } from "~~/utils/format-date";
import { createMapPointFromLocationLog } from "~~/utils/map-points";

const locationStore = useLocationStore();
const { currentLocationLog: data, currentLocationError: error, currentLocationStatus: status } = storeToRefs(locationStore);
const route = useRoute();
// const locationUrlWithSlug = computed(() => `/api/location/${route.params.slug}`);
// const { data, status, error } = await useFetch<SelectLocationWithLogs>(locationUrlWithSlug, {
//   lazy: true,
// });
// locationStore.currentLocationLog = data.value;
const isOpen = ref(false);
const deleteLoading = ref(false);
const deleteError = ref("");
const loading = computed(() => status.value === "pending" || deleteLoading.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);
function onClose() {
  isOpen.value = false;
}
function openDialog() {
  (document.activeElement as HTMLAnchorElement).blur();
  isOpen.value = true;
}
async function onConfirm() {
  try {
    deleteLoading.value = true;
    isOpen.value = false;
    await $fetch(`/api/location/${route.params.slug}`, {
      method: "delete",
    });
    deleteLoading.value = false;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = error.statusMessage || "An unknown error occurred";
  }
}
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
  <div class="page-content-top">
    <div v-if="loading" class="loading loading-xl" />
    <div v-if="route.name === 'dashboard-location-slug' && !loading && data">
      <div>
        {{ data?.name }}
        <div class="dropdown">
          <div
            tabindex="0"
            role="button"
            class="btn m-1 btn-sm p-0"
          >
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
          <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink
                :to="{
                  name: 'dashboard-location-slug-edit',
                  params: { slug: data?.slug },
                }"
              >
                <Icon
                  name="tabler:pencil"
                  size="16"
                  class="mr-2"
                />
                编辑
              </NuxtLink>
            </li>
            <li>
              <NuxtLink @click="openDialog">
                <Icon
                  name="tabler:trash"
                  size="16"
                  class="mr-2"
                />
                删除
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div>
        {{ data?.description }}
      </div>

      <div v-if=" !data.locationLog.length" class="mt-4">
        <p class="text-sm italic">
          Add Location Log To Start
        </p>
        <NuxtLink
          class="btn btn-primary mt-2"
          :to="{ name: 'dashboard-location-slug-add',
                 params: {
                   slug: route.params.slug,
                 } }"
        >
          Add Location Log
          <Icon name="tabler:map-pin-plus" size="24" />
        </NuxtLink>
      </div>
    </div>
    <div v-if="route.name !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
    <div
      v-if="route.name === 'dashboard-location-slug' && data?.locationLog.length"
      class="location-list"
    >
      <LocationCard
        v-for="log in data.locationLog"
        :key="log.id"
        :map-point="createMapPointFromLocationLog(log)"
      >
        <template #top>
          <p class="text-sm italic text-gray-300">
            <span v-if="log.startedAt !== log.endedAt">
              {{ formatDate(log.startedAt) }} / {{ formatDate(log.endedAt) }}
            </span>
            <span v-if="log.startedAt === log.endedAt">
              {{ formatDate(log.startedAt) }}
            </span>
          </p>
        </template>
      </LocationCard>
    </div>
    <div v-if="!loading && errorMessage" class="alert alert-error">
      {{ errorMessage }}
    </div>

    <AppDialog
      title="删除"
      desc="你确定要删除此项吗?"
      :is-open="isOpen"
      confirm-label="确定"
      confirm-class="btn-primary"
      @on-close="onClose"
      @on-confirm="onConfirm"
    />
  </div>
</template>
