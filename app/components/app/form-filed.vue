<script setup lang="ts">
const props = defineProps<{
  name: string;
  error?: string;
  label: string;
  type?: "text" | "textarea" | "number";
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :as="props.type === 'textarea' ? props.type : undefined"
      :name="props.name"
      :type="type || 'text'"
      class=" w-full"
      :class="{
        'input-error': props.error,
        'input': props.type !== 'textarea',
        'textarea': props.type === 'textarea',
      }"
      :disabled="props.disabled"
    />
    <ErrorMessage :name="props.name" class="text-error" />
  </fieldset>
</template>
