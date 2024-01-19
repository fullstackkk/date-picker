<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { getDateLitePicker, weekFull, type dayCellItem, months } from "./utils";
import { useWindowSize } from "@vueuse/core";
import { TransformDate } from "@estelink/lib/helpers";
import { TabsBtnString } from "@estelink/ui";
interface Props {
  value: Date;
}
const props = withDefaults(defineProps<Props>(), {
  value: () => new Date(),
});
const emit = defineEmits<{
  (e: "onChange", value: Date, stringValue: string): void;
  (e: "update:value", value: Date, stringValue: string): void;
}>();
const panelYear = ref(props.value.getFullYear());
const panelMonth = ref(props.value.getMonth());

// const activeTab = ref(0);
function setActiveTab(value) {
  // это работаешь , но не понятно надо ли оно )
  //   activeTab.value = value;
}

function onDaySelect(item: dayCellItem) {
  const date = new Date(item.year, item.month, item.date);
  emit("onChange", date, TransformDate.parseDateOfDayMonthYear(date));
  emit("update:value", date, TransformDate.parseDateOfDayMonthYear(date));
  console.log(TransformDate.parseDateOfDayMonthYear(date));
}
const { width } = useWindowSize();
const dateCells = computed(() => getDateLitePicker(props.value));

const slyderPosition = ref(0);
const pickerSetting = computed(() => {
  const setting = {
    cellWidth: width.value < 768 ? 38 : 41,
    cellHeight: width.value < 768 ? 59 : 65,
    countCells: width.value < 768 ? 5 : 7,
    countAllCells: dateCells.value.length,
  };

  return {
    cellWidth: `${setting.cellWidth}px`,
    cellHeight: `${setting.cellHeight}px`,
    sliderWrapperWidth: `${setting.countCells * setting.cellWidth}px`,
    sliderWidth: `${setting.countAllCells * setting.cellWidth}px`,
    sliderTranslate: `-${
      (width.value < 768 ? 3 : 4) * setting.cellWidth +
      slyderPosition.value * setting.cellWidth
    }px`,
  };
});

function prev() {
  if (slyderPosition.value > -7)
    slyderPosition.value = slyderPosition.value - 1;
}
function next() {
  if (slyderPosition.value < 5) slyderPosition.value = slyderPosition.value + 1;
}
</script>
<template>
  <div
    :class="$style.picker"
    class="sm-shadow flex h-[141px] flex-col items-center gap-[18px] rounded-[16px] p-4"
  >
    <div class="flex h-fit w-full items-center justify-center gap-[10px]">
      <TabsBtnString
        class="lgmin:h-[30px] pointer-events-none w-[160px] text-[10px] font-medium"
        :tabs="[months[panelMonth], String(panelYear)]"
        noAdaptive
        @update:modelValue="(value) => setActiveTab(value)"
      >
      </TabsBtnString>
    </div>
    <div
      class="flex h-fit w-full items-center justify-center gap-[10px] px-[16px]"
    >
      <button
        class="text-input-color icon-arrow-left h-[16px] w-[16px]"
        @click="prev"
      ></button>
      <div :class="$style.slider__wrapper">
        <div ref="slyder" :class="$style.slyder">
          <button
            @click="onDaySelect(item)"
            v-for="item in dateCells"
            :key="item.date"
            class="group/picker-item"
            :class="[$style.cell, item.isCurrentDay ? $style.cell__active : '']"
          >
            <p
              :class="{
                'workspace-bg-color': item.isCurrentDay,
              }"
              class="text-input-color group-hover/picker-item:workspace-bg-color"
            >
              {{ weekFull[item.dayOffTheWeek] }}
            </p>
            <p
              :class="{
                'workspace-bg-color': item.isCurrentDay,
              }"
              class="text-primary-color group-hover/picker-item:workspace-bg-color"
            >
              {{ item.date }}
            </p>
          </button>
        </div>
      </div>
      <button
        class="text-input-color icon-arrow-right h-[16px] w-[16px]"
        @click="next"
      ></button>
    </div>
  </div>
</template>
<style scoped module>
.picker {
  box-shadow: 0px, 4px rgba(42, 79, 124, 0.12);
}
.slider__wrapper {
  width: v-bind("pickerSetting.sliderWrapperWidth");
  min-width: v-bind("pickerSetting.sliderWrapperWidth");
  max-width: v-bind("pickerSetting.sliderWrapperWidth");
  height: v-bind("pickerSetting.cellHeight");
  overflow: scroll;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}
.slider__wrapper::-webkit-scrollbar {
  display: none;
}
.slyder {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  overflow: visible;
  position: relative;
  left: v-bind("pickerSetting.sliderTranslate");
  width: v-bind("pickerSetting.sliderWidth");
  min-width: v-bind("pickerSetting.sliderWidth");
  max-width: v-bind("pickerSetting.sliderWidth");
}
.cell {
  width: v-bind("pickerSetting.cellWidth");
  min-width: v-bind("pickerSetting.cellWidth");
  height: v-bind("pickerSetting.cellHeight");
  background-color: var(--workspace-bg);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
}
.cell:hover {
  background-color: var(--icons-3);
  color: var(--workspace-bg);
}
.cell__active {
  background-color: var(--icons-3);
  color: var(--workspace-bg);
}
</style>
