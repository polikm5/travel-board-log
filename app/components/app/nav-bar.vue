<script setup lang="ts">
const colorMode = useColorMode();

const currentTheme = ref(false);
type Theme = {
  light: boolean;
  dark: boolean;
};
const theme: Theme = {
  light: false,
  dark: true,
};
function changeTheme(ev: Event) {
  const target = ev.target as HTMLInputElement;
  const t = findKeyByValue(theme, target.checked);
  console.log(t);
  if (t) {
    colorMode.preference = t;
  }
}
function findKeyByValue<T extends Record<string, any>>(obj: T, value: boolean): keyof T | undefined {
  for (const k in obj) {
    if (obj[k] === value) {
      return k;
    }
  }
  return undefined;
}
</script>

<template>
  <div class="navbar bg-base-300 shadow-sm">
    <div class="navbar-start">
      <div class="text-xl">
        TravelLog
      </div>
    </div>
    <div class="navbar-end">
      <div class="mr-4">
        <label class="flex cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle
              cx="12"
              cy="12"
              r="5"
            />
            <path
              d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            />
          </svg>
          <input
            type="checkbox"
            class="toggle theme-controller"
            :checked="currentTheme"
            @change="changeTheme"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </label>
      </div>
      <a class="btn">Sign in</a>
    </div>
  </div>
</template>
