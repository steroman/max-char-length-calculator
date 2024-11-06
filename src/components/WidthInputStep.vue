<script setup>
import { ref } from 'vue';
import StepNavigation from './StepNavigation.vue';
import HelperText from './ui/HelperText.vue';
import ErrorMessage from './ui/ErrorMessage.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();
const width = ref('');
const error = ref('');

const handleNext = () => {
  if (!width.value) {
    error.value = 'Please enter a width value';
    return;
  }

  const numWidth = Number(width.value);
  if (numWidth <= 0) {
    error.value = 'Width must be greater than 0';
    return;
  }

  error.value = '';
  store.setElementWidth(numWidth);
  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Enter UI Element Width</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6">
        <label for="width" class="block text-sm font-medium text-gray-700 mb-2">
          Width in pixels
        </label>
        <input
          id="width"
          type="number"
          v-model="width"
          min="1"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
            error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          ]"
        />
        <HelperText text="Remember to subtract any margins and paddings" />
      </div>
      
      <ErrorMessage :message="error" />
      <StepNavigation
        @next="handleNext"
        @previous="handlePrevious"
      />
    </div>
  </div>
</template>