<script setup lang="ts">
import { CENTER_BEIJIN } from "~~/lib/constants";
import { InsertLocationLog } from "~~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertLocationLog;
  onSubmit: (location: InsertLocationLog) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
  zoom?: number;
}>();

const initialValues = props.initialValues || {
  description: "",
  name: "",
  long: (CENTER_BEIJIN as [number, number])[0],
  lat: (CENTER_BEIJIN as [number, number])[1],
  startedAt: Date.now() - 24 * 60 * 60 * 1000,
  endedAt: Date.now(),
};
</script>

<template>
  <LocationBaseForm
    v-slot="{ errors, loading }"
    :initial-values="props.initialValues || initialValues"
    :schema="InsertLocationLog"
    :on-submit
    :on-submit-complete
    :submit-icon
    :submit-label
    :zoom="props.zoom"
  >
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
    <AppDateFormFiled
      :value="initialValues.startedAt"
      name="startedAt"
      label="started At"
      :error="errors.startedAt"
      :disabled="loading"
    />
    <AppDateFormFiled
      :value="initialValues.endedAt"
      name="endedAt"
      label="ended At"
      :error="errors.endedAt"
      :disabled="loading"
    />
  </LocationBaseForm>
</template>
