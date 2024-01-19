<script setup lang="ts">
import { ref, Ref, onMounted, watch, computed } from "vue";
import DatePicker from "./DatePicker.vue";
import DatePickerLight from "./DatePickerLight.vue";

const emit = defineEmits<{
  (e: "onChange", value: Date, stringValue: string): void;
  (e: "update:value", value: Date, stringValue: string): void;
}>();
const date = ref(new Date());

function emitHandler(date: Date, stringValue: string) {
  emit("onChange", date, stringValue);
  emit("update:value", date, stringValue);
}

const activePicker = ref(false);
const buttonText = computed(() =>
  activePicker.value ? "Свернуть" : "Развернуть"
);
</script>
<template>
  <div class="flex flex-col items-center">
    <transition name="max-height">
      <DatePickerLight
        @on-change="(value, stringValue) => emitHandler(value, stringValue)"
        @update:value="(value, stringValue) => emitHandler(value, stringValue)"
        :value="date"
        v-if="!activePicker"
      />
    </transition>
    <transition name="max-height">
      <DatePicker
        @on-change="(value, stringValue) => emitHandler(value, stringValue)"
        @update:value="(value, stringValue) => emitHandler(value, stringValue)"
        :value="date"
        v-if="activePicker"
      />
    </transition>

    <button
      @click="activePicker = !activePicker"
      class="2xl:min:w-[12px] workspace-bg sm-shadow relative top-[-10px] flex h-[36px] items-center justify-center gap-[8px] rounded-[12px] px-[16px] text-[10px] font-medium text-[#212121] transition-all 2xlmin:h-[40px]"
    >
      <p
        class="icon-arrow-down"
        :class="{
          'rotate-180 transform': activePicker,
        }"
      ></p>
      <p>{{ buttonText }}</p>
    </button>
  </div>
</template>

<style module scoped></style>
