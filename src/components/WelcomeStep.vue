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
          <h1 class="text-2xl font-bold mb-4">👋 Welcome</h1>

    <div class="bg-white rounded-lg shadow-md p-6">
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
          <span>(Optional) A JSON file with existing keys of the UI element. For example, all the keys of a button.</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">✅</span>
          <span>The width of every character in the font that you use for the UI element</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">✅</span>
          <span>(Optional) JSON files for the localization keys in other languages. For example, all the keys of the button in Italian.</span>
        </li>
      </ul>
      <p class="mb-4">Worry not! If you don't have the JSON files of your keys, you can use the available generic dataset.</p>
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