<script setup lang="ts">
import { formatDate } from "~~/utils/format-date";

const props = defineProps<{
  label: string;
  name: string;
  value: number;
  error?: string;
  disabled?: boolean;
}>();

const { handleBlur, value: inputValue, handleChange } = useField<number>(props.name, {
  initialValue: props.value,
});
function dateChanged(event: Event) {
  const target = event.target as HTMLInputElement;
  const dateValue = target.value;
  const timestamp = new Date(dateValue).getTime();
  handleChange(timestamp);
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <input
      :name="props.name"
      type="date"
      class="input w-full"
      :class="{
        'input-error': props.error,
      }"
      :disabled="props.disabled"
      :value="formatDate(inputValue)"
      @blur="handleBlur"
      @change="dateChanged"
    >
    <ErrorMessage :name="props.name" class="text-error" />
  </fieldset>
</template>
