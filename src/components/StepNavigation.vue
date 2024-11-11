<script setup>
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();

const emit = defineEmits(['next', 'previous']);

const handleNext = () => {
  emit('next');
};

const handlePrevious = () => {
  emit('previous');
};
</script>

<template>
  <div class="flex justify-between mt-8">
    <button
      v-if="store.currentStep > 1"
      @click="handlePrevious"
      class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
    >
      Previous
    </button>
    <div v-else class="w-20"></div>
    <button
      @click="handleNext"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {{ store.currentStep === 7 ? 'Start again' : 'Next' }}
    </button>
  </div>
</template>