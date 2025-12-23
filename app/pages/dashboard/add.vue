<script setup lang="ts">
import type { InsertLocation } from "~~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertLocation) {
  await $csrfFetch("/api/locations", {
    method: "post",
    body: values,
  });
}

function onSubmitComplete() {
  navigateTo("/dashboard");
}
</script>

<template>
  <div class="container max-w-md mx-auto flex flex-col">
    <p class="text-2xl">
      Add Location
    </p>
    <p class="text-sm my-2 ">
      A location is a place you have traveled or will travel to.It can be a city,country,state or point of interest.You can add specific times you visited this location after adding it.
    </p>

    <LocationForm
      :on-submit
      submit-label="提交"
      submit-icon="tabler:circle-plus"
      :on-submit-complete="onSubmitComplete"
    />
  </div>
</template>
