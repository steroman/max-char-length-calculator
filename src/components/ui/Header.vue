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
      <button
        @click="handleTitleClick"
        class="text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors"
      >
        <span class="inline-flex items-center gap-2">
          <span>📐</span>
          <span>Max char length calculator</span>
        </span>
      </button>
    </div>
  </header>
</template>