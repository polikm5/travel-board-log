<script setup lang="ts">
import { formatDate } from "~~/utils/format-date";

const route = useRoute();
const locationStore = useLocationStore();
const { currentLocationLog: data, currentLocationLogError: error, currentLocationLogStatus: status } = storeToRefs(locationStore);
const loading = computed(() => status.value === "pending");
const errorMessage = computed(() => error.value?.statusMessage || "");
onMounted(() => {
  locationStore.refreshCurrentLocationLog();
});
</script>

<template>
  <div class="page-content-top">
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
              <NuxtLink>
                <Icon
                  name="tabler:pencil"
                  size="16"
                  class="mr-2"
                />
                编辑
              </NuxtLink>
            </li>
            <li>
              <NuxtLink>
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
    <div v-if="!loading && errorMessage" class="alert alert-error">
      {{ errorMessage }}
    </div>
  </div>
</template>
