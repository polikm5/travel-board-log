<script setup lang="ts">
import type { MapPoints } from "~~/lib/types";

defineProps<{
  mapPoint: MapPoints;
}>();

const mapStore = useMapStore();
</script>

<template>
  <NuxtLink
    class="card bg-base-100 w-72 h-54 shadow-sm shrink-0 border-2 mb-2 cursor-pointer"
    :class="{
      'border-accent': mapPoint.id === mapStore.selectedMapPoint?.id,
      'border-transparent': mapPoint.id !== mapStore.selectedMapPoint?.id,
    }"
    :to="mapPoint.url"
    @mouseenter="mapStore.selectedMapPoint = mapPoint"
    @mouseleave="mapStore.selectedMapPoint = null"
  >
    <div class="card-body">
      <slot name="top" />
      <h2 class="card-title text-2xl">
        {{ mapPoint.name }}
      </h2>
      <p class="pt-6">
        {{ mapPoint.description }}
      </p>
    </div>
  </NuxtLink>
</template>
