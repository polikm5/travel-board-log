<script setup lang="ts">
const authStore = useAuthStore();

const mapStore = useMapStore();
await authStore.init();
onMounted(() => {
  mapStore.init();
});
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavBar />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>

<style scoped>
</style>
