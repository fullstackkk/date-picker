<script lang="ts" setup>
import { computed, ref, watchEffect, watch } from "vue";
import { TabsBtnString } from "@estelink/ui";
import { TransformDate } from "@estelink/lib/helpers";
import {
  getDaysAmountInAMonth,
  getPreviousMonthDays,
  getCurrentMonthDays,
  getNextMonthDays,
  isInRange,
  months,
  week,
  type dayCellItem,
} from "./utils";
interface Props {
  value: Date;
  min?: Date;
  max?: Date;
  range?: "left" | "right" | "bottom" | null;
  inputRef?: HTMLElement;
}

const props = withDefaults(defineProps<Props>(), {
  value: () => new Date(),
  min: () => new Date(1970, 0, 1),
  max: () => new Date(2050, 11, 31),
  range: () => null,
});
const emit = defineEmits<{
  (e: "onChange", value: Date, stringValue: string): void;
  (e: "update:value", value: Date, stringValue: string): void;
  (e: "clickRange", value: boolean): void;
}>();
const panelYear = ref(props.value.getFullYear());
const panelMonth = ref(props.value.getMonth());
const calendarRef = ref<HTMLElement>();

const year = computed(() => props.value.getFullYear());
const month = computed(() => props.value.getMonth());
const day = computed(() => props.value.getDate());

const dateCells = computed(() => {
  const daysInMonth = getDaysAmountInAMonth(panelYear.value, panelMonth.value);
  const cells: dayCellItem[] = [];

  cells.push(...getPreviousMonthDays(panelYear.value, panelMonth.value));
  cells.push(
    ...getCurrentMonthDays(panelYear.value, panelMonth.value, daysInMonth),
  );
  cells.push(...getNextMonthDays(panelYear.value, panelMonth.value));

  return cells;
});

const activeTab = ref(0);
function setActiveTab(value) {
  activeTab.value = value;
}

function onDaySelect(item: dayCellItem) {
  const date = new Date(item.year, item.month, item.date);
  emit("onChange", date, TransformDate.parseDateOfDayMonthYear(date));
  emit("update:value", date, TransformDate.parseDateOfDayMonthYear(date));
}

function nextYear() {
  panelYear.value++;
}
function prevYear() {
  panelYear.value--;
}
function nextMonth() {
  if (panelMonth.value === 11) {
    panelMonth.value = 0;
    panelYear.value++;
  } else {
    panelMonth.value++;
  }
}
function prevMonth() {
  if (panelMonth.value === 0) {
    panelMonth.value = 11;
    panelYear.value--;
  } else {
    panelMonth.value--;
  }
}
function prev() {
  if (activeTab.value === 0) {
    prevMonth();
  } else {
    prevYear();
  }
}
function next() {
  if (activeTab.value === 0) {
    nextMonth();
  } else {
    nextYear();
  }
}

function buttonRangeClickHandler() {
  emit("clickRange", true);
}
watchEffect(() => {
  panelYear.value = props.value.getFullYear();
  panelMonth.value = props.value.getMonth();
});
watch(dateCells.value, () => {
  console.log("dateCells.value", dateCells.value);
});
</script>

<template>
  <div ref="calendarRef">
    <div
      class="drop-menu-bg flex h-[246px] w-[248px] flex-col items-center justify-start rounded-[12px]"
    >
      <div class="flex h-16 w-[208px] items-center justify-center gap-[10px]">
        <button
          class="text-primary-color icon-arrow-left h-[16px] w-[16px]"
          @click="prev"
        ></button>
        <TabsBtnString
          class="lgmin:h-[30px] w-[160px] text-[10px] font-medium"
          :tabs="[months[panelMonth], String(panelYear)]"
          noAdaptive
          @update:modelValue="(value) => setActiveTab(value)"
        >
        </TabsBtnString>
        <button
          class="text-primary-color icon-arrow-right h-[16px] w-[16px]"
          @click="next"
        ></button>
      </div>

      <div class="grid h-[16px] w-[208px] grid-cols-7">
        <div
          class="text-primary-color fonst-medium flex h-[26px] w-[26px] items-center justify-center text-[10px] font-bold"
          :class="{
            'text-accent-color': i == 5 || i == 6,
          }"
          :key="day"
          v-for="(day, i) in week"
        >
          {{ day }}
        </div>
      </div>
      <div
        class="text-primary-color relative mt-2 grid h-[144px] w-[208px] grid-cols-7 grid-rows-6"
      >
        <button
          @focus="item.isCurrentDay = true"
          @blur="item.isCurrentDay = false"
          @click="
            isInRange(item, props.min, props.max) == false
              ? null
              : onDaySelect(item)
          "
          :class="{
            'out-input-color': item.isCurrentMonth == false,
            'text-accent drop-menu-bg-color relative rounded-full':
              item.date === day && item.month == month && item.year == year,
            'text-accent-color': item.isDayOff && item.date !== day,
            'cursor-not-allowed':
              isInRange(item, props.min, props.max) == false,
          }"
          class="flex h-[26px] w-[26px] items-center justify-center text-[12px] hover:border-[1px]"
          v-for="(item, i) in dateCells"
          :key="i"
        >
          {{ item.date }}
        </button>
        <button
          v-if="props.range"
          @click="buttonRangeClickHandler()"
          class="frames icons-1-color icon-more-vertical absolute flex h-[24px] w-[8px] items-center justify-center rounded-[16px] transition-all hover:scale-150"
          :class="{
            'left-[-12px] top-[25px]': props.range == 'left',
            'right-[-12px] top-[25px]': props.range == 'right',
            'bottom-[-16px] left-[47%] rotate-90': props.range == 'bottom',
          }"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
