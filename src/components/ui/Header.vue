<script setup>
import { useCalculatorStore } from '../../stores/calculator';

const store = useCalculatorStore();
</script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <span class="text-lg font-semibold text-gray-800">📐 Maximum character length calculator</span>
      </div>
      <div class="text-sm text-gray-500">
        Step {{ store.currentStep }} of 7
      </div>
    </div>
  </header>
</template>
