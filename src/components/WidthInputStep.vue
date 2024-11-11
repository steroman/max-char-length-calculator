<script setup>
import { ref } from 'vue';
import StepNavigation from './StepNavigation.vue';
import StepTitle from './StepTitle.vue';
import HelperText from './ui/HelperText.vue';
import ErrorMessage from './ui/ErrorMessage.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();
const width = ref('');
const error = ref('');
const touched = ref(false);

const validateWidth = (value) => {
  if (value === '') {
    return 'Enter a width value';
  }
  
  const numWidth = Number(value);
  if (isNaN(numWidth)) {
    return 'Enter a valid number';
  }

  if (!Number.isInteger(numWidth)) {
    return 'The width must be a whole number';
  }
  
  if (numWidth <= 0) {
    return numWidth === 0 ? 'The width cannot be zero' : 'The width must be greater than 0';
  }
  
  return '';
};

const handleNext = () => {
  const validationError = validateWidth(width.value);
  if (validationError) {
    error.value = validationError;
    return;
  }
  
  store.setElementWidth(Number(width.value));
  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};

const handleInput = (event) => {
  const value = event.target.value;
  width.value = value;
  if (touched.value) {
    error.value = validateWidth(value);
  }
};

const handleBlur = () => {
  touched.value = true;
  error.value = validateWidth(width.value);
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <StepTitle title="Enter the UI element's width" />
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6">
        <label for="width" class="block text-sm font-medium text-gray-700 mb-2">
          Width in pixels
        </label>
        <input
          id="width"
          type="number"
          :value="width"
          @input="handleInput"
          @blur="handleBlur"
          min="1"
          step="1"
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