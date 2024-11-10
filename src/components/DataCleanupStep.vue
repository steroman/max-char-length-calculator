<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import StepNavigation from './StepNavigation.vue';
import HelperText from './ui/HelperText.vue';
import Toggle from './ui/Toggle.vue';
import WarningMessage from './ui/WarningMessage.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();

const handleNext = () => {
  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};

const updateConfig = () => {
  if (!store.useGenericDataset) {
    store.processDataset(store.rawDataset);
  }
};

const isGenericDataset = computed(() => store.useGenericDataset);

// Watch for changes in useGenericDataset and update config accordingly
watch(() => store.useGenericDataset, (isGeneric) => {
  store.datasetConfig.reduceByTenPercent = isGeneric;
  if (isGeneric) {
    // Reset cleanup options when using generic dataset
    store.datasetConfig.ignoreCapitals = false;
    store.datasetConfig.ignoreNumbers = false;
    store.datasetConfig.ignoreSymbols = false;
    store.datasetConfig.ignoreSpaces = false;
  }
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Configure data cleanup</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-4">
        <h3 class="text-lg font-semibold mb-4">Cleanup options</h3>
        <p class="mb-4">
          Turning on all the cleanup options gives more accurate results.
        </p>
        <div class="space-y-6">
          <Toggle
            v-model="store.datasetConfig.ignoreCapitals"
            :disabled="isGenericDataset"
            label="Ignore capital letters"
            helper-text="Capital and lowercase letters are counted together"
            @update:modelValue="updateConfig"
          />
          
          <Toggle
            v-model="store.datasetConfig.ignoreNumbers"
            :disabled="isGenericDataset"
            label="Ignore numbers"
            helper-text="Numbers are removed from the dataset"
            @update:modelValue="updateConfig"
          />
          
          <Toggle
            v-model="store.datasetConfig.ignoreSymbols"
            :disabled="isGenericDataset"
            label="Ignore symbols and punctuation"
            helper-text="Punctuation and symbols are removed from the dataset"
            @update:modelValue="updateConfig"
          />
          
          <Toggle
            v-model="store.datasetConfig.ignoreSpaces"
            :disabled="isGenericDataset"
            label="Ignore spaces"
            helper-text="Whitespace is removed from the dataset"
            @update:modelValue="updateConfig"
          />
          <WarningMessage
          v-if="isGenericDataset"
          message="Cleanup options are unavailable when using a generic dataset because they are not applicable"
        />
          <div class="pt-4 border-t border-gray-200">
            <Toggle
              v-model="store.datasetConfig.reduceByTenPercent"
              label="Reduce the final results by 10%"
              helper-text="To compensate for inaccuracy (Recommended when using the generic dataset)"
              @update:modelValue="updateConfig"
            />
          </div>
        </div>
      </div>

      <StepNavigation
        @next="handleNext"
        @previous="handlePrevious"
      />
    </div>
  </div>
</template>