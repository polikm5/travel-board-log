<script setup lang="ts">
const colorMode = useColorMode();
const isLight = computed({
  get() {
    return colorMode.value === "light";
  },
  set(value) {
    colorMode.preference = value ? "light" : "dark";
  },
});
</script>

<template>
  <div>
    <label class="swap swap-rotate">
      <!-- this hidden checkbox controls the state -->
      <input v-model="isLight" type="checkbox">

      <!-- sun icon -->
      <Icon
        name="tabler:sun-filled"
        class="swap-on"
        size="24"
      />
      <!-- moon icon -->
      <Icon
        name="tabler:moon-filled"
        class="swap-off"
        size="24"
      />
    </label>
  </div>
</template>
