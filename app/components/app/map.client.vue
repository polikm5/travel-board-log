<script setup lang="ts">
import { CENTER_BEIJIN } from "~~/lib/constants";

const colorMode = useColorMode();
const style = computed(() => {
  return colorMode.value === "dark" ? "/styles/dark.json" : "/styles/light.json";
});
const center = CENTER_BEIJIN;
const zoom = 8;

const mapStore = useMapStore();
onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
    height="600px"
  >
    <MglNavigationControl />
    <MglMarker
      v-for="mapPoint in mapStore.mapItems"
      :key="mapPoint.id"
      :coordinates="[mapPoint.long, mapPoint.lat]"
    >
      <template #marker>
        <div class="tooltip" :data-tip="mapPoint.label">
          <Icon
            name="tabler:map-pin-filled"
            size="24"
            class="text-secondary"
          />
        </div>
      </template>
    </MglMarker>
  </MglMap>
</template>

<style>

</style>
