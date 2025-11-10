<script setup>
const colorMode = useColorMode();

console.log(colorMode.preference);
</script>

<template>
  <div>
    <div class="navbar bg-base-100 shadow-sm">
      <div class="navbar-start">
        <div class="text-xl">
          TravelLog
        </div>
      </div>
      <div class="navbar-end">
        <a class="btn">Sign in</a>
      </div>
    </div>
    <div class="hero bg-base-200 min-h-120 container mx-auto mt-4">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">
            Travel Log
          </h1>
          <p class="py-6">
            Keep track of your travels and adventures.Add locations,photos,and notes to create a digital journal of your journeys.
          </p>
          <button class="btn btn-primary">
            Sign in
            <Icon name="tabler:brand-github" size="1.5em" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.8);
}
.dark-mode body {
  background-color: #091a28;
  color: #ebf4f1;
}
.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}
</style>
