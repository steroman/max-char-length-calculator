<script setup>
import StepNavigation from './StepNavigation.vue';
import StepTitle from './StepTitle.vue';
import WarningMessage from './ui/WarningMessage.vue';
import ExternalLink from './ui/ExternalLink.vue';
import UsageCounter from './ui/UsageCounter.vue';
import { useCalculatorStore } from '../stores/calculator';
import { subscribeToUsageCount } from '../firebase';
import { onMounted } from 'vue';

const store = useCalculatorStore();

onMounted(() => {
  subscribeToUsageCount((count) => {
    store.usageCount = count;
  });
});

const handleNext = () => {
  store.nextStep();
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <StepTitle title="👋 Welcome" />
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
          <span>A JSON file with existing keys of the UI element</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">✅</span>
          <span>The width of every character in the font that you use for the UI element</span>
        </li>
        <li class="flex items-start">
          <span class="mr-2">✅</span>
          <span>JSON files for the localization keys in other languages</span>
        </li>
      </ul>
      <p class="mb-4">No JSON files available? No problem, you can use our generic dataset.</p>
      <p class="mb-4">
        ⏳ Let's get started…
      </p>
      <StepNavigation @next="handleNext" />
    </div>
    <div class="mt-4">
      <WarningMessage message="🛡️ None of your data is stored" class="text-center"/>
    </div>
    <UsageCounter :count="store.usageCount" class="mb-4" />
  </div>
</template>