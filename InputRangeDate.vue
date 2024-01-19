<script lang="ts" setup>
import DatePicker from "./DatePicker.vue";
import InputBase from "../InputBase.vue";
import RangeDatePicker from "./RangeDatePicker.vue";
import DatePickerLight from "./DatePickerLight.vue";
import { TransformDate } from "@estelink/lib/helpers";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { isValidDateString, isInRange, type dayCellItem } from "./utils";
import { displays } from "../../enum-params";
import { useToggle } from "@vueuse/core";
interface Props {
  min?: Date;
  max?: Date;
  readonly?: boolean;
  startValue?: Date;
  endValue?: Date;
  display?: displays;
}

const props = withDefaults(defineProps<Props>(), {
  min: () => new Date(1970, 0, 1),
  max: () => new Date(2050, 11, 31),
  display: "default",
});
const emits = defineEmits<{
  (e: "update:startValue", value: Date): void;
  (e: "update:endValue", value: Date): void;
  (e: "onChange", value: { start: Date; end: Date }): void;
  (e: "focus", event?: Event): void;
  (e: "blur", event?: Event): void;
}>();
const id = ref("input-date-" + Math.random().toString(36).substr(2, 9));
const showCalendar = ref(false);
const pickCalendar = ref(false);

const [focus, toggleFocus] = useToggle();
const [active, toggleActive] = useToggle();

const currentInput = ref("start" as "start" | "end");
function currentInputHandler(value: "start" | "end") {
  currentInput.value = value;
}

const showRangeCalendar = ref(false);
function showRangeCalendarHandler(value: boolean) {
  showRangeCalendar.value = value;
}

const wrapperInputDisplay = ref("default" as displays);
function wrapperInputDisplayHandler(value: displays) {
  wrapperInputDisplay.value = value;
}

function checkValidDate(event: Event, setter: (date: Date) => void) {
  const value = (event.target as HTMLInputElement).value;
  wrapperInputDisplayHandler("default");
  if (!isValidDateString(value)) {
    return;
  }
  const [date, month, year] = value.split(".").map((v) => parseInt(v, 10));
  const cell = {
    date,
    month: month - 1,
    year,
  } as dayCellItem;
  const isRange = isInRange(cell, props.min, props.max);
  if (!isRange) {
    wrapperInputDisplayHandler("err");
    return;
  }
  setter(new Date(year, month - 1, date));
}

const startInputValue = computed(() =>
  pickCalendar.value || props.startValue
    ? TransformDate.parseDateOfDayMonthYear(startCalendarValue.value)
    : null,
);
function setStartInputValue(value: Event) {
  checkValidDate(value, setStartCalendarValue);
}

const endInputValue = computed(() =>
  pickCalendar.value || props.endValue
    ? TransformDate.parseDateOfDayMonthYear(endCalendarValue.value)
    : null,
);
function setEndInputValue(value: Event) {
  checkValidDate(value, setEndCalendarValue);
}

const startCalendarValue = ref(props.startValue || (new Date() as Date));
function setStartCalendarValue(date: Date) {
  startCalendarValue.value = date;
  emits("onChange", {
    start: startCalendarValue.value,
    end: endCalendarValue.value,
  });
  emits("update:startValue", startCalendarValue.value);
}

const endCalendarValue = ref(props.endValue || (new Date() as Date));
function setEndCalendarValue(date: Date) {
  endCalendarValue.value = date;
  emits("onChange", {
    start: startCalendarValue.value,
    end: endCalendarValue.value,
  });
  emits("update:endValue", endCalendarValue.value);
}

function showCalendarHandler(currentInput: "start" | "end") {
  showCalendar.value = true;
  currentInputHandler(currentInput);
  toggleFocus(true);
}
function hiddenCalendarHandler() {
  showRangeCalendarHandler(false);
  showCalendar.value = false;
}

function calendarOnChengeHandler(value: Date) {
  if (currentInput.value === "start") {
    setStartCalendarValue(value);
  } else {
    setEndCalendarValue(value);
  }
  hiddenCalendarHandler();
}
function onChangeRangeHandler(value: [start: Date, end: Date]) {
  const [start, end] = value;
  setStartCalendarValue(start);
  setEndCalendarValue(end);
  // hiddenCalendarHandler();
}

function clickOutSideHandler(event: MouseEvent) {
  const target = event.target;
  if (event.target instanceof Element) {
    if (!(target as Element).closest(`#${id.value}`)) {
      hiddenCalendarHandler();
    }
  }
}

function focusHandler(e: Event): void {
  emits("focus", e);
  toggleFocus(true);
  pickCalendar.value = true;
  wrapperInputDisplayHandler("focus");
  toggleActive(true);
}
function blurHandler(e: Event): void {
  emits("blur", e);
  toggleFocus(false);
  wrapperInputDisplayHandler("default");
}

onMounted(() => {
  document.addEventListener("click", clickOutSideHandler);
});
onUnmounted(() => {
  document.removeEventListener("click", clickOutSideHandler);
});
</script>

<template>
  <div
    class="field-base relative w-full"
    :id="id"
    tabindex="0"
    :class="{
      'z-[3]': showCalendar,
    }"
  >
    <fieldset placeholder="Дата" class="input-group relative">
      <InputBase
        placeholder="__.__.____"
        @focus="focusHandler($event)"
        @blur="blurHandler($event)"
        @input="setStartInputValue($event)"
        @keydown.enter="hiddenCalendarHandler()"
        :value="startInputValue"
        :readonly="props.readonly"
        v-maska
        mask="AA.AA.AAAA"
        tokens="A:[0-9]"
        type="text"
        iconRight="calendar-rows"
      >
        <template #right>
          <button
            @click="showCalendarHandler('start')"
            class="icons-1-color icon-calendar-rows"
          ></button>
        </template>
      </InputBase>

      <InputBase
        placeholder="__.__.____"
        @focus="focusHandler($event)"
        @blur="blurHandler($event)"
        @input="setEndInputValue($event)"
        @keydown.enter="hiddenCalendarHandler()"
        :value="endInputValue"
        :readonly="props.readonly"
        mask="AA.AA.AAAA"
        tokens="A:[0-9]"
        type="text"
      >
        <template #right>
          <button
            @click="showCalendarHandler('end')"
            class="icons-1-color icon-calendar-rows"
          ></button>
        </template>
      </InputBase>
    </fieldset>

    <div
      v-if="showCalendar"
      class="sm-shadow workspace-bg absolute left-0 top-[110%] z-10 flex rounded-xl"
    >
      <DatePicker
        :value="
          currentInput === 'start' ? startCalendarValue : endCalendarValue
        "
        :max="props.max"
        :min="props.min"
        range="right"
        @onChange="(value) => calendarOnChengeHandler(value)"
        @click-range="showRangeCalendarHandler(!showRangeCalendar)"
        v-if="showCalendar"
      ></DatePicker>
      <RangeDatePicker
        @on-change-range="(value) => onChangeRangeHandler(value)"
        v-if="showRangeCalendar"
      ></RangeDatePicker>
    </div>
  </div>
</template>
