<script setup lang="tsx">
import type { Area, Pois, SearchData } from "~~/lib/types";

import { SearchSchema } from "~~/lib/zod-schema";

const emit = defineEmits<{
  applySearchData: [data: SearchData];
}>();
const searchData = ref<SearchData[]>([]);
const mapStore = useMapStore();
const loading = ref(false);
function transformData(data: Pois | Area): SearchData[] {
  let result = [];
  if (Array.isArray(data)) {
    result = data.map((item) => {
      const [long, lat] = item.lonlat.split(",").map(Number) as [number, number];
      return {
        id: item.hotPointID,
        name: item.name,
        lat,
        long,
        address: item.address,
      };
    });
  }
  else {
    const [long, lat] = data.lonlat.split(",").map(Number) as [number, number];
    result = [
      {
        id: String(data.adminCode),
        name: data.name,
        lat,
        long,
      },
    ];
  }
  return result;
}
async function onSubmit(query: Record<string, string>) {
  try {
    loading.value = true;
    const result = await $fetch("/api/search", {
      query,
    });
    if (result.pois) {
      searchData.value = transformData(result.pois);
    }
    else {
      searchData.value = transformData(result.area);
    }
    mapStore.searchMapItems = searchData.value.map((item) => {
      return {
        id: item.id,
        name: item.name,
        lat: item.lat,
        long: item.long,
        description: item.address || item.name,
      };
    });
  }
  catch (e) {
    console.error(e);
  }

  loading.value = false;
}

const searchForm = useTemplateRef("searchForm");
function apply(data: SearchData) {
  emit("applySearchData", data);
}

function clearData() {
  mapStore.searchMapItems = [];
  searchData.value = [];
  searchForm.value?.resetForm();
}
</script>

<template>
  <Form
    v-slot="{ errors }"
    ref="searchForm"
    class="join w-full mt-6 flex flex-col flex-1"
    :validation-schema="toTypedSchema(SearchSchema)"
    @submit="onSubmit"
  >
    <div class="flex mb-4">
      <div class="w-full flex-1">
        <label class="input validator join-item w-full">
          <Icon name="tabler:search" />
          <Field
            type="text"
            placeholder="搜索"
            required
            name="q"
            :class="{
              'input-error': errors.q,
            }"
          /></label>
        <div v-if="errors.q" class="validator-hint">
          请输入搜索内容
        </div>
      </div>
      <button class="btn btn-primary join-item">
        搜索
      </button>
      <button class="btn btn-outline join-item ml-2" @click="clearData">
        清空
      </button>
    </div>
    <div class="overflow-auto flex flex-col w-full flex-1 h-0" style="flex: 1 1 auto">
      <div class="flex flex-col w-full gap-4  flex-1">
        <div v-if="loading" class="flex justify-center">
          <span class="loading loading-xl" />
        </div>
        <div
          v-for="data in searchData"
          :key="data.id"
          class="card card-border bg-base-100 w-full cursor-pointer hover:bg-base-300 "
          :class="{
            'border-accent': data.id === mapStore.selectedMapPoint?.id,
            'border-transparent': data.id !== mapStore.selectedMapPoint?.id,
          }"
          @mouseenter="mapStore.selectedMapPoint = data"
          @mouseleave="mapStore.selectedMapPoint = null"
        >
          <div class="card-body flex flex-row items-center">
            <div class="min-h-20 flex items-center">
              <Icon
                name="tabler:map-pin-filled"
                size="24"
                :class="data.id === mapStore.selectedMapPoint?.id ? 'text-accent' : 'text-info'"
              />
            </div>
            <div
              class="
                  flex-1"
            >
              <h2 class="card-title">
                {{ data.name }}
              </h2>
              <p v-if="data.address">
                {{ data.address }}
              </p>
            </div>
            <div class="card-actions justify-end">
              <button class="btn btn-primary" @click="apply(data)">
                应用
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Form>
</template>
