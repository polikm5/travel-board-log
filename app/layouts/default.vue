<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
// const { data: sessionData } = await useAsyncData("auth-session", () => authStore.init());
// console.log(sessionData);
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavBar />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>
