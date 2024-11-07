<script setup lang="ts">
import StepNavigation from './StepNavigation.vue';
import WarningMessage from './ui/WarningMessage.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();

const handleNext = () => {
  store.nextStep();
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Max character length calculator for UI elements</h1>
    <div class="bg-white rounded-lg shadow-md p-6">
      <p class="mb-4">Welcome,</p>
      <p class="mb-4">
        This tool will help you calculate the maximum character length for your UI elements.
        You'll need:
      </p>
      <ul class="list-disc ml-6 mb-6">
        <li>The width of your UI element in pixels</li>
        <li>A dataset of text content (or use our generic dataset)</li>
        <li>Character width measurements for your font</li>
      </ul>
      <p class="mb-4">
        The calculator will guide you through the process step by step.
      </p>
      <StepNavigation @next="handleNext" />
    </div>
    <div class="mt-4">
      <WarningMessage message="None of your data is stored—everything runs in your browser." />
    </div>
  </div>
</template>