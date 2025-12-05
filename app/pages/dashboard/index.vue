<script setup lang="ts">
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
  <div class="flex flex-1 h-full">
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
      class="flex gap-6 overflow-auto"
    >
      <div
        v-for="location in data"
        :key="location.id"
        class="card bg-base-100 w-72 h-54 shadow-sm shrink-0"
      >
        <div class="card-body">
          <h2 class="card-title text-2xl">
            {{ location.description }}
          </h2>
          <p class="pt-6">
            {{ location.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
