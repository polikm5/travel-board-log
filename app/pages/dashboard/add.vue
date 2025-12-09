<script setup lang="ts">
import type { FetchError } from "ofetch";

import { CENTER_BEIJIN } from "~~/lib/constants";
import { InsertLocation } from "~~/lib/db/schema";
import { useForm } from "vee-validate";

const { handleSubmit, errors, meta, setErrors, setFieldValue, values } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    description: "",
    name: "",
    long: (CENTER_BEIJIN as [number, number])[0],
    lat: (CENTER_BEIJIN as [number, number])[1],
  },
});
const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);
const mapStore = useMapStore();
const { $csrfFetch } = useNuxtApp();

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "post",
      body: values,
    });
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    submitError.value = error.statusMessage || "An unknown error occurred";
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
  }
  loading.value = false;
});
effect(() => {
  if (mapStore.addPoints) {
    setFieldValue("lat", mapStore.addPoints.lat);
    setFieldValue("long", mapStore.addPoints.long);
  }
});
const router = useRouter();
onBeforeRouteLeave(() => {
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const answer = window.confirm(
      "Do you really want to leave? you have unsaved changes!",
    );
    if (!answer) {
      return false;
    }
  }
  mapStore.addPoints = null;
  return true;
});

onMounted(() => {
  mapStore.addPoints = {
    id: 1,
    description: "",
    name: "add Points",
    long: (CENTER_BEIJIN as [number, number])[0],
    lat: (CENTER_BEIJIN as [number, number])[1],
  };
});
watchEffect(() => {
  if (values.lat && values.long && mapStore.addPoints) {
    mapStore.manualFlyTo = true;
    mapStore.addPoints.lat = values.lat;
    mapStore.addPoints.long = values.long;
  }
});
</script>

<template>
  <div class="container max-w-md mx-auto p-2">
    <p class="text-2xl">
      Add Location
    </p>
    <p class="text-sm my-2 ">
      A location is a place you have traveled or will travel to.It can be a city,country,state or point of interest.You can add specific times you visited this location after adding it.
    </p>
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-1 flex-col">
      <AppFormFiled
        name="name"
        label="Name"
        :error="errors.name"
        :disabled="loading"
      />
      <AppFormFiled
        name="description"
        label="Description"
        type="textarea"
        :error="errors.description"
        :disabled="loading"
      />
      <AppFormFiled
        name="lat"
        label="Latitude"
        :error="errors.lat"
        type="number"
        :disabled="loading"
      />
      <AppFormFiled
        name="long"
        label="Longitude"
        :error="errors.long"
        type="number"
        :disabled="loading"
      />
      <div class="flex footer-button justify-end gap-2 mt-2">
        <div
          class="btn btn-outline"
          :class="{ 'btn-disabled': loading }"
          @click="router.back()"
        >
          <Icon
            name="tabler:arrow-narrow-left"
            size="1.5em"
            class="hover:cursor-pointer "
          />
          Cancel
        </div>
        <div
          class="btn btn-primary"
          :class="{ 'btn-disabled': loading }"
          @click="onSubmit"
        >
          ADD
          <span v-if="loading" class="loading loading-spinner loading-md" />
          <Icon
            v-else
            name="tabler:circle-plus"
            size="1.5em"
            class="hover:cursor-pointer "
          />
        </div>
      </div>
    </form>
  </div>
</template>
