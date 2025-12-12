<script setup lang="ts">
const route = useRoute();
const { slug } = route.params;
const { data, status, error } = useFetch(`/api/location/${slug}`, {
  lazy: true,
});
const mapStore = useMapStore();
effect(() => {
  if (data.value) {
    mapStore.mapItems = [data.value];
  }
});
</script>

<template>
  <div class="h-54">
    <div v-if="status === 'pending'" class="loading loading-xl" />
    <div v-if="status !== 'pending' && data">
      <div>
        {{ data?.name }}
      </div>

      <div v-if="!data.locationLog.length" class="mt-4">
        <p class="text-sm italic">
          Add Location Log To Start
        </p>
        <button class="btn btn-primary mt-2">
          Add Location Log
          <Icon name="tabler:map-pin-plus" size="24" />
        </button>
      </div>
    </div>
    <div v-if="status !== 'pending' && error" class="alert alert-error">
      {{ error.statusMessage }}
    </div>
  </div>
</template>
