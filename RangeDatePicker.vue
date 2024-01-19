<script setup lang="ts">
import { OutlineToFilledButton } from "@estelink/ui";
import { computed, Ref, ref, watchEffect } from "vue";
import {
  type SelectorRange,
  Tabs,
  TabsTitle,
  selectors,
} from "./range-selectors";

const emits = defineEmits<{
  (e: "onChangeRange", value: [Date, Date]): void;
}>();

const activeTab = ref() as Ref<Tabs>;
function setActiveTab(value: Tabs) {
  activeTab.value = value;
}

const activeList = ref() as Ref<SelectorRange[Tabs]>;
watchEffect(() => {
  activeList.value = selectors[activeTab.value];
});

function onChangeRange(handler: () => [Date, Date]) {
  const [start, end] = handler();
  emits("onChangeRange", [start, end]);
}
</script>
<template>
  <div class="flex h-auto items-center gap-[12px]">
    <div class="flex h-[246px] w-auto flex-col gap-[12px] pb-[10px] pl-4 pt-4">
      <OutlineToFilledButton
        v-for="tab in Tabs"
        :key="tab"
        size="sm"
        @click="setActiveTab(tab)"
        :class="{
          '!icons-1-color !frames': activeTab == tab,
        }"
        class="w-[160px]"
        >{{ TabsTitle[tab] }}</OutlineToFilledButton
      ><button class="text-primary-color h-[12px] text-[10px] font-normal">
        Очистить период
      </button>
    </div>

    <div
      class="flex h-full w-auto flex-col items-start justify-start pr-3 pt-4"
    >
      <button
        class="text-primary-color hover:input-bg h-[28px] w-[208px] p-[2px] text-left text-[12px] hover:rounded-[4px]"
        v-for="{ title, handler } in activeList"
        :key="title"
        @click="onChangeRange(handler)"
      >
        {{ title }}
      </button>
    </div>
  </div>
</template>
