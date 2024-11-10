<script setup>
import { useCalculatorStore } from '../../stores/calculator';

const store = useCalculatorStore();

const handleTitleClick = () => {
  store.reset();
  store.currentStep = 1;
};
</script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-3">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <button
          @click="handleTitleClick"
          class="text-left text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors"
        >
          <span class="inline-flex items-center gap-1 break-words">
            <span>📐</span>
            <span>Max character length calculator</span>
          </span>
        </button>
        <div class="text-sm text-gray-500 whitespace-nowrap">
          Step {{ store.currentStep }} of 7
        </div>
      </div>
    </div>
  </header>
</template>