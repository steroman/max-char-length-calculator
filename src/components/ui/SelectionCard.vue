<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Boolean, Number],
    required: true
  },
  value: {
    type: [String, Boolean, Number],
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const isSelected = computed(() => props.modelValue === props.value);

const handleClick = () => {
  if (!props.disabled) {
    emit('update:modelValue', props.value);
  }
};
</script>

<template>
  <div
    class="relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200"
    :class="[
      isSelected
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50',
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    @click="handleClick"
  >
    <input
      type="radio"
      :value="value"
      :checked="isSelected"
      :disabled="disabled"
      class="sr-only"
    />
    
    <div class="flex flex-col">
      <div class="flex items-start mb-2 min-h-[3rem]">
        <div
          class="w-4 h-4 rounded-full border-2 mr-2 flex-shrink-0 flex items-center justify-center mt-0.5"
          :class="[
            isSelected
              ? 'border-blue-500 bg-white'
              : 'border-gray-300'
          ]"
        >
          <div
            v-if="isSelected"
            class="w-2 h-2 rounded-full bg-blue-500"
          ></div>
        </div>
        <div class="flex items-center">
          <span class="font-medium">{{ title }}</span>
          <slot name="title-extra"></slot>
        </div>
      </div>
      
      <div class="ml-6 text-sm text-gray-600">
        <slot />
      </div>
    </div>
  </div>
</template>