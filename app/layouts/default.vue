<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavBar />
    <main class="flex-1 flex flex-col bg-color">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.bg-color {
  background-image: linear-gradient(120deg, #f0f8fd 0%, #f6fcff 100%);
}
</style>
