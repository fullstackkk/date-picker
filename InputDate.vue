<script lang="ts" setup>
import DatePicker from "./DatePicker.vue";
import InputBase from "../InputBase.vue";
import {TransformDate} from "@estelink/lib/helpers";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {isValidDateString, isInRange, type dayCellItem} from "./utils";
import {displays} from "../../enum-params";
import {useToggle, useElementBounding} from "@vueuse/core";
import {useInSight} from "@estelink/lib";

interface Props {
  value?: Date;
  min?: Date | null;
  max?: Date | null;
  readonly?: boolean;
  display?: displays;
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  min: () => new Date(1970, 0, 1),
  max: () => new Date(2050, 11, 31),
  display: "default",
  placeholder: 'Дата'
});
const emits = defineEmits<{
  (e: "update:value", value: Date): void;
  (e: "onChange", value: Date): void;
  (e: "focus", event?: Event): void;
  (e: "blur", event?: Event): void;
}>();
const id = ref("input-date-" + Math.random().toString(36).substr(2, 9));
const showCalendar = ref(false);
const pickCalendar = ref(false);
const wrapperRef = ref<HTMLElement>()
const {width} = useElementBounding(wrapperRef)
const {MenuWrapper} = useInSight(wrapperRef, {
  parent: {
    height: 44,
    width: width.value
  }
})


const [focus, toggleFocus] = useToggle();
const [active, toggleActive] = useToggle();

const inputDisplay = ref("default" as displays);

function inputDisplayHandler(value: displays) {
  inputDisplay.value = value;
}

const inputValue = computed({
  get: () =>
          pickCalendar.value || props.value !== undefined
                  ? TransformDate.parseDateOfDayMonthYear(calendarValue.value)
                  : null,
  set: (value) => {
    inputDisplayHandler("default");
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
      inputDisplayHandler("err");
      return;
    }

    setDate(new Date(year, month - 1, date));
  },
});

const calendarValue = ref(props.value || (new Date() as Date));

function setDate(date: Date) {
  calendarValue.value = date;
  emits("onChange", date);
  emits("update:value", date);
}

function showCalendarHandler() {
  showCalendar.value = true;
  pickCalendar.value = true;
}

function hiddenCalendarHandler() {
  showCalendar.value = false;
}

function calendarOnChengeHandler(value: Date) {
  setDate(value);
  hiddenCalendarHandler();
}

function clickOutSideHandler(event: MouseEvent) {
  const target = event.target;
  if (event.target instanceof Element) {
    if (!(target as Element).closest(`#${id.value}`)) {
      hiddenCalendarHandler();
    }
  }
}

onMounted(() => {
  document.addEventListener("click", clickOutSideHandler);
  console.log(props.value);
});
onUnmounted(() => {
  document.removeEventListener("click", clickOutSideHandler);
});
</script>

<template>
  <div class="field-base relative isolate w-full" :id="id" tabindex="0" :class="{
    'z-[1]': showCalendar,
  }">
    <InputBase ref="wrapperRef" @click="showCalendarHandler()" @focus="toggleFocus(true)" @focusout="toggleFocus(false)"
               @active="toggleActive(true)" v-model:value="inputValue" :placeholder="props.placeholder"
               iconRight="icon-calendar-rows" mask="AA.AA.AAAA " tokens="A:[0-9]" class="relative" tabindex="0"
               :display="inputDisplay" :readonly="props.readonly" @keydown.enter="hiddenCalendarHandler()">
    </InputBase>
    <transition name="dropdown-fade">
      <MenuWrapper>
        <DatePicker :value="calendarValue" :max="props.max" :min="props.min" range="right"
                    @onChange="(value) => calendarOnChengeHandler(value)" v-if="showCalendar">
        </DatePicker>
      </MenuWrapper>
    </transition>
    <transition name="dropdown-fade">
      <MenuWrapper>
        <DatePicker
          :value="calendarValue"
          :max="props.max"
          :min="props.min"
          range="right"
          @onChange="(value) => calendarOnChengeHandler(value)"
          v-if="showCalendar"
        >
        </DatePicker>
      </MenuWrapper>
    </transition>
  </div>
</template>
