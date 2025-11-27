<script setup lang="ts">
const authStore = useAuthStore();

onMounted(() => {
  authStore.signOut();
});
</script>

<template>
  <div class="card container min-h-72 bg-base-300 flex mt-4 flex-col items-center justify-center mx-auto gap-4">
    <span class="loading loading-spinner loading-xl" />
  </div>
</template>
