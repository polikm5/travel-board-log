<script setup lang="ts">
import type { FetchError } from "ofetch";

import { formatDate } from "~~/utils/format-date";

const route = useRoute();
const locationStore = useLocationStore();
const { currentLocationLog: data, currentLocationLogError: error, currentLocationLogStatus: status } = storeToRefs(locationStore);
const errorMessage = computed(() => error.value?.statusMessage || "");
const isOpen = ref(false);
const deleteLoading = ref(false);
const deleteError = ref("");
const loading = computed(() => status.value === "pending" || deleteLoading.value);
onMounted(() => {
  locationStore.refreshCurrentLocationLog();
});

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-location-slug-id") {
    locationStore.refreshCurrentLocationLog();
  }
});

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
    await $fetch(`/api/location/${route.params.slug}/${route.params.id}`, {
      method: "delete",
    });
    deleteLoading.value = false;
    navigateTo({
      name: "dashboard-location-slug",
      params: { slug: route.params.slug },
    });
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = error.statusMessage || "An unknown error occurred";
  }
}
</script>

<template>
  <div class="page-content-top">
    <div v-if="!loading && errorMessage" class="alert alert-error">
      {{ errorMessage }}
    </div>
    <div v-if="loading" class="loading loading-xl" />
    <div v-if="route.name === 'dashboard-location-slug-id' && !loading && data">
      <p class="text-sm italic text-gray-300">
        <span v-if="data.startedAt !== data.endedAt">
          {{ formatDate(data.startedAt) }} / {{ formatDate(data.endedAt) }}
        </span>
        <span v-if="data.startedAt === data.endedAt">
          {{ formatDate(data.startedAt) }}
        </span>
      </p>
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
                  name: 'dashboard-location-slug-id-edit',
                  params: {
                    id: route.params.id,
                  },
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
    </div>
    <div v-else>
      <NuxtPage />
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
