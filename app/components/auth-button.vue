<script setup lang="ts">
const { loading, signIn } = useAuthStore();
</script>

<template>
  <button
    :disabled="loading"
    class="btn btn-primary"
    @click="signIn"
  >
    Sign in
    <span v-if="loading" class="loading loading-spinner loading-sm" />
    <Icon
      v-else
      name="tabler:brand-github"
      size="1.5em"
    />
  </button>
</template>
