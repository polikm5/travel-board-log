<script setup lang="ts" generic="T extends LatLongItem">
import type { LatLongItem, SearchData } from "~~/lib/types";
import type { FetchError } from "ofetch";
import type { ZodSchema } from "zod";

import { toTypedSchema } from "@vee-validate/zod";
import { CENTER_BEIJIN } from "~~/lib/constants";
import { useForm } from "vee-validate";

const props = defineProps<{
  initialValues: T;
  schema: ZodSchema;
  onSubmit: (location: T) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom?: number;
}>();
const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);

const router = useRouter();
const { handleSubmit, errors, meta, setErrors, setFieldValue, values } = useForm({
  validationSchema: toTypedSchema(props.schema),
  initialValues: props.initialValues,
});
const mapStore = useMapStore();
const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await props.onSubmit(values as T);
    submitted.value = true;
    props.onSubmitComplete();
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
function applyData(data: SearchData) {
  mapStore.addPoints = {
    id: data.id,
    description: data.address || data.name,
    name: data.name,
    long: data.long,
    lat: data.lat,
  };
}
effect(() => {
  if (mapStore.addPoints) {
    setFieldValue("lat", mapStore.addPoints.lat);
    setFieldValue("long", mapStore.addPoints.long);
    // setFieldValue("name", mapStore.addPoints.name);
    // setFieldValue("description", mapStore.addPoints?.description);
  }
});

watchEffect(() => {
  if (values.lat && values.long && mapStore.addPoints) {
    mapStore.manualFlyTo = true;
    mapStore.addPoints.lat = values.lat;
    mapStore.addPoints.long = values.long;
  }
});

onMounted(() => {
  mapStore.addPoints = {
    id: 1,
    description: "1",
    name: "Add Points",
    long: props.initialValues ? props.initialValues.long : (CENTER_BEIJIN as [number, number])[0],
    lat: props.initialValues ? props.initialValues.lat : (CENTER_BEIJIN as [number, number])[1],
    zoom: props.zoom || 11,
  };
});

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
  mapStore.searchMapItems = [];
  return true;
});
</script>

<template>
  <div class="flex flex-col flex-1  px-4">
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
    <form class="flex flex-col">
      <slot :errors :loading />
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
          返回
        </div>
        <div
          class="btn btn-primary"
          :class="{ 'btn-disabled': loading }"
          @click="onSubmit"
        >
          {{ props.submitLabel }}
          <span v-if="loading" class="loading loading-spinner loading-md" />
          <Icon
            v-else
            :name="props.submitIcon"
            size="1.5em"
            class="hover:cursor-pointer "
          />
        </div>
      </div>
    </form>
    <div class="divider" />
    <AppPlaceSearch @apply-search-data="applyData" />
  </div>
</template>
