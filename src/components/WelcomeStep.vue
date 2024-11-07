<script setup lang="ts">
import StepNavigation from './StepNavigation.vue';
import WarningMessage from './ui/WarningMessage.vue';
import ExternalLink from './ui/ExternalLink.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();

const handleNext = () => {
  store.nextStep();
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">📐 Maximum character length calculator 🧮</h1>
    <p class="mb-4">For UI elements, based on real data</p>
    <div class="bg-white rounded-lg shadow-md p-6">
      <p class="mb-4">👋 Welcome,</p>
      <p class="mb-4">
        This tool calculates the maximum character length for a given UI element based on real data.
        You'll need:
      </p>
      <ul class="space-y-2 mb-6">
        <li class="flex items-start">
          <span class="mr-2">✅</span>
          <span>The width of your UI element in pixels</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">✅</span>
          <span>(Optional) A JSON file with existing keys for the UI element (<ExternalLink
              href="https://raw.githubusercontent.com/steroman/max-char-length-calculator/refs/heads/main/src/assets/sample-files/en-us.json">
            example</ExternalLink>). If you don't have it, a generic dataset is available.</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">✅</span>
          <span>The width of every character in the font that you use for the UI element</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">✅</span>
          <span>(Optional) JSON files for the localization keys in other languages (<ExternalLink
              href="https://raw.githubusercontent.com/steroman/max-char-length-calculator/refs/heads/main/src/assets/sample-files/ru-ru.json">
            example</ExternalLink>). If you don't have it, a generic dataset is available.</span>
        </li>
      </ul>
      <p class="mb-4">
        ⏳ Let's get started…
      </p>
      <StepNavigation @next="handleNext" />
    </div>
    <div class="mt-4">
      <WarningMessage message="None of your data is stored—everything runs in your browser." />
    </div>
  </div>
</template>