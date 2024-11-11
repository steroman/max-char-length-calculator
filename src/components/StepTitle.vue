<script setup>
import { computed } from 'vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();
const props = defineProps({
  title: {
    type: String,
    required: true
  }
});

const showStepCount = computed(() => {
  return store.currentStepNumber !== null;
});

const currentStep = computed(() => store.currentStepNumber);
const totalSteps = computed(() => store.totalSteps);
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <div 
      v-if="showStepCount"
      class="text-xs sm:text-sm text-gray-500 sm:ml-4 sm:border-l sm:border-gray-300 sm:pl-4"
    >
      Step {{ currentStep }} of {{ totalSteps }}
    </div>
  </div>
</template>