<script setup>
import { ref, computed } from 'vue';
import StepNavigation from './StepNavigation.vue';
import ErrorMessage from './ui/ErrorMessage.vue';
import SelectionCard from './ui/SelectionCard.vue';
import HelperText from './ui/HelperText.vue';
import AutomaticWidthInput from './AutomaticWidthInput.vue';
import ManualWidthInput from './ManualWidthInput.vue';
import WarningMessage from './ui/WarningMessage.vue';
import ExternalLink from './ui/ExternalLink.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();
const error = ref('');
const inputMethod = ref('manual'); // 'manual' or 'automatic'

const allWidthsEntered = computed(() => {
  return store.characterData.every(char => char.width !== undefined && char.width > 0);
});

const handleNext = () => {
  if (!allWidthsEntered.value) {
    error.value = 'All characters must have a valid width before continuing';
    return;
  }
  
  error.value = '';
  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Enter character widths</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-6">
        <!-- Input Method Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectionCard
            v-model="inputMethod"
            value="automatic"
            title="Calculate automatically"
          >
            <template #title-extra>
              <span class="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Beta
              </span>
            </template>
            <HelperText 
              text="Upload a font file and calculate character widths automatically"
            />
          </SelectionCard>

          <SelectionCard
            v-model="inputMethod"
            value="manual"
            title="Input manually"
          >
            <HelperText 
              text="Enter the width of each character manually"
            />
          </SelectionCard>
        </div>

        <WarningMessage>
          <p class="text-blue-800">
            Widths may differ between your design tool and the automatic calculation (
            <ExternalLink
              href="https://github.com/steroman/max-char-length-calculator?tab=readme-ov-file#automatic-character-width-calculation"
              class="text-blue-600 hover:text-blue-800"
            >More info</ExternalLink>
            )
          </p>
        </WarningMessage>

        <!-- Width Input Section -->
        <AutomaticWidthInput v-if="inputMethod === 'automatic'" />
        <ManualWidthInput v-else />
      </div>

      <ErrorMessage :message="error" />
      <StepNavigation
        @next="handleNext"
        @previous="handlePrevious"
      />
    </div>
  </div>
</template>