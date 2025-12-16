<script setup lang="ts">
import type { MglEvent } from "@indoorequal/vue-maplibre-gl";
import type { LngLat } from "maplibre-gl";

import { MglPopup } from "@indoorequal/vue-maplibre-gl";
import { CENTER_BEIJIN } from "~~/lib/constants";

const colorMode = useColorMode();
const style = computed(() => {
  return colorMode.value === "dark" ? "/styles/dark.json" : "/styles/light.json";
});

const center = CENTER_BEIJIN;
const zoom = 8;
const mapStore = useMapStore();
function updateAddedPoint(event: LngLat) {
  if (mapStore.addPoints) {
    mapStore.addPoints.lat = event.lat;
    mapStore.addPoints.long = event.lng;
  }
}
function dbClick(event: MglEvent<"dblclick">) {
  if (mapStore.addPoints) {
    mapStore.addPoints.lat = event.event.lngLat.lat;
    mapStore.addPoints.long = event.event.lngLat.lng;
  }
}

function dragStart() {
  mapStore.draging = true;
}
function dragEnd() {
  mapStore.draging = false;
}
</script>

<template>
  <div>
    <MglMap
      :map-style="style"
      :center="center"
      :zoom="zoom"
      :double-click-zoom="false"
      @map:dblclick="dbClick"
    >
      <div>
        <MglNavigationControl />
        <div>
          <div>
            <template
              v-for="mapPoint in mapStore.mapItems"
              :key="`mgl1${mapPoint.id}`"
            >
              <MglMarker
                :coordinates="[mapPoint.long, mapPoint.lat]"
                class="cursor-pointer"
              >
                <template #marker>
                  <div>
                    <div
                      class="tooltip"
                      :data-tip="mapPoint.name"
                      :class="{
                        'tooltip-open': mapStore.selectedMapPoint?.id === mapPoint.id,
                      }"
                      @mouseenter="mapStore.selectedMapPointWithoutFly(mapPoint)"
                      @mouseleave="mapStore.selectedMapPointWithoutFly(null)"
                    >
                      <Icon
                        name="tabler:map-pin-filled"
                        size="24"
                        :class="mapStore.selectedMapPoint?.id === mapPoint.id ? 'text-accent' : 'text-secondary'"
                      />
                    </div>
                  </div>
                </template>
                <MglPopup>
                  <div>
                    <h1 class="text-xl">
                      {{ mapPoint.name }}
                    </h1>
                    <p v-if="mapPoint.description">
                      {{ mapPoint.description }}
                    </p>
                    <div v-if="mapPoint.url" class="flex justify-end">
                      <NuxtLink :to="mapPoint.url" class="mt-4 btn btn-primary btn-sm">
                        View
                      </NuxtLink>
                    </div>
                  </div>
                </MglPopup>
              </MglMarker>
            </template>
          </div>
          <div>
            <template
              v-for="mapPoint in mapStore.searchMapItems"
              :key="`mgl2${mapPoint.id}`"
            >
              <MglMarker
                :coordinates="[mapPoint.long, mapPoint.lat]"
                class="cursor-pointer"
              >
                <template #marker>
                  <div>
                    <div
                      class="tooltip"
                      :data-tip="mapPoint.name"
                      :class="{
                        'tooltip-open': mapStore.selectedMapPoint?.id === mapPoint.id,
                      }"
                      @mouseenter="mapStore.searchMapPointWithoutFly(mapPoint)"
                      @mouseleave="mapStore.searchMapPointWithoutFly(null)"
                    >
                      <Icon
                        name="tabler:map-pin-filled"
                        size="24"
                        :class="mapStore.selectedMapPoint?.id === mapPoint.id ? 'text-accent' : 'text-info'"
                      />
                    </div>
                  </div>
                </template>
                <MglPopup>
                  <div>
                    <h1 class="text-xl">
                      {{ mapPoint.name }}
                    </h1>
                    <p v-if="mapPoint.description">
                      {{ mapPoint.description }}
                    </p>
                  </div>
                </MglPopup>
              </MglMarker>
            </template>
          </div>
          <div>
            <MglMarker
              v-if="mapStore.addPoints"
              :coordinates="[mapStore.addPoints.long, mapStore.addPoints.lat]"
              class="cursor-pointer"
              draggable
              class-name="z-50"
              @update:coordinates="updateAddedPoint"
              @dragstart="dragStart"
              @dragend="dragEnd"
            >
              <template #marker>
                <div
                  class="tooltip tooltip-open"
                  data-tip="Drag to your desired location"
                >
                  <Icon
                    name="tabler:map-pin-filled"
                    size="24"
                    class="text-warning"
                  />
                </div>
              </template>
            </MglMarker>
          </div>
        </div>
      </div>
    </MglMap>
  </div>
</template>

<style scoped>
</style>
