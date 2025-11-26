<script setup lang="ts">
const route = useRoute();
const error = route.query.error || "Unknown error occured";
</script>

<template>
  <div class="card container min-h-72 bg-base-300 flex mt-4 flex-col items-center justify-center mx-auto gap-4">
    <div role="alert" class="alert alert-error min-w-1/2">
      <span>Error! Task failed successfully. {{ error }}</span>
    </div>
    <NuxtLink to="/" class="btn btn-primary">
      Home
      <Icon name="tabler:arrow-narrow-left" size="32" />
    </NuxtLink>
  </div>
</template>
