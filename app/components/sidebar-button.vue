<script setup lang="ts">
import type { SideBarItems } from "../stores/side-bar-locations";

const props = defineProps<SideBarItems>();

const route = useRoute();
</script>

<template>
  <div class="tooltip tooltip-right" :data-tip="isShowLabel ? undefined : props.label">
    <NuxtLink
      :to="props.url"
      class="hover:cursor-pointer hover:bg-base-300 rounded-xs p-2 flex flex-1 truncate"
      :class="{ 'bg-base-200': route.path === props.url }"
    >
      <div

        class="flex items-center gap-2"
      >
        <Icon
          :name="props.name"
          size="1.5em"
          :class="iconColor"
        />
        <span class="flex-1 whitespace-nowrap ">{{ props.label }}</span>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
</style>
