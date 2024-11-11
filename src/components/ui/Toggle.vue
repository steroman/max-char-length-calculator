<script setup>
import HelperText from './HelperText.vue';

defineProps({
  modelValue: Boolean,
  disabled: Boolean,
  label: String,
  helperText: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="inline-flex items-center cursor-pointer" :class="{ 'opacity-50 cursor-not-allowed': disabled }">
      <div class="relative">
        <input
          type="checkbox"
          class="sr-only peer"
          :checked="modelValue"
          :disabled="disabled"
          @change="$emit('update:modelValue', !modelValue)"
        >
        <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </div>
      <span v-if="label" class="ml-3 text-sm font-medium text-gray-700">{{ label }}</span>
    </label>
    <div v-if="helperText" class="ml-[3.75rem]">
      <HelperText :text="helperText" />
    </div>
  </div>
</template>