<script setup>
import { computed } from 'vue';
import { useCalculatorStore } from './stores/calculator';
import WelcomeStep from './components/WelcomeStep.vue';
import WidthInputStep from './components/WidthInputStep.vue';
import DatasetSelectionStep from './components/DatasetSelectionStep.vue';
import DataCleanupStep from './components/DataCleanupStep.vue';
import CharacterWidthStep from './components/CharacterWidthStep.vue';
import LocalizationStep from './components/LocalizationStep.vue';
import ResultsStep from './components/ResultsStep.vue';
import Footer from './components/ui/Footer.vue';
import Header from './components/ui/Header.vue';

const store = useCalculatorStore();

const getCurrentStep = computed(() => {
  switch (store.currentStep) {
    case 1:
      return WelcomeStep;
    case 2:
      return WidthInputStep;
    case 3:
      return DatasetSelectionStep;
    case 4:
      return DataCleanupStep;
    case 5:
      return CharacterWidthStep;
    case 6:
      return LocalizationStep;
    case 7:
      return ResultsStep;
    default:
      return WelcomeStep;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Header />
    <main class="pb-20">
      <component :is="getCurrentStep" />
    </main>
    <Footer class="fixed bottom-0 left-0 right-0" />
  </div>
</template>