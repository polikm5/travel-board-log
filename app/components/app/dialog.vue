<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  title: string;
  desc: string;
  confirmLabel: string;
  confirmClass: "btn-primary" | "btn-warning" | "btn-error";
}>();
const emit = defineEmits<{
  onClose: [];
  onConfirm: [];
}>();

const dialog = useTemplateRef("dialog");

function onClose() {
  emit("onClose");
}
onMounted(() => {
  dialog.value?.addEventListener("close", onClose);
});
onUnmounted(() => {
  dialog.value?.removeEventListener("close", onClose);
});
</script>

<template>
  <dialog
    ref="dialog"
    class="modal"
    :open="props.isOpen"
  >
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ props.title }}
      </h3>
      <p class="py-4">
        {{ props.desc }}
      </p>
      <div class="flex justify-end gap-2">
        <button class="btn btn-outline" @click="onClose">
          取消
        </button>
        <button
          class="btn"
          :class="confirmClass"
          @click="emit('onConfirm')"
        >
          {{ props.confirmLabel }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
