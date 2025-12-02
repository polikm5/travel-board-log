<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  url: string;
  isShowLabel: boolean;
}>();

const route = useRoute();
</script>

<template>
  <div class="hover:cursor-pointer hover:bg-base-300 rounded-xs p-2 flex" :class="{ 'bg-base-200': route.path === props.url }">
    <NuxtLink
      :to="props.url"
      class="flex items-center gap-2 "
    >
      <Icon :name="props.name" size="1.5em" />
      <span v-if="isShowLabel" class="flex-1 whitespace-nowrap">{{ props.label }}</span>
    </NuxtLink>
  </div>
</template>

<style scoped>
</style>
