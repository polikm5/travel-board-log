<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
  <div v-if="!authStore.loading && authStore.data?.user" class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn m-1"
    >
      <div class="avatar">
        <div v-if="authStore.data.user.image" class="w-6 rounded-full">
          <img :src="authStore.data.user.image" :alt="authStore.data.user.name">
        </div>
      </div>
      {{ authStore.data.user.name }}
    </div>
    <ul tabindex="-1" class="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
      <li>
        <NuxtLink to="/log-out">
          Log Out
        </NuxtLink>
      </li>
    </ul>
  </div>
  <button
    v-else
    :disabled="authStore.loading"
    class="btn btn-primary"
    @click="authStore.signIn"
  >
    Sign in
    <span v-if="authStore.loading" class="loading loading-spinner loading-sm" />
    <Icon
      v-else
      name="tabler:brand-github"
      size="1.5em"
    />
  </button>
</template>
