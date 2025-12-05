<script setup lang="ts">
const colorMode = useColorMode();
const style = computed(() => {
  return colorMode.value === "dark" ? "/styles/dark.json" : "/styles/light.json";
});
const center = [-1.559482, 47.21322];
const zoom = 8;
</script>

<template>
  <MglMap
    :map-style="style"
    :center="center"
    :zoom="zoom"
  >
    <MglNavigationControl />
  </MglMap>
</template>

<style>

</style>
