<script setup lang="ts">
import { ref, computed } from 'vue';
import StepNavigation from './StepNavigation.vue';
import HelperText from './ui/HelperText.vue';
import Toggle from './ui/Toggle.vue';
import { useCalculatorStore } from '../stores/calculator';

const store = useCalculatorStore();

const handleNext = () => {
  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};

const updateConfig = () => {
  store.processDataset(store.rawDataset);
};

const isGenericDataset = computed(() => store.useGenericDataset);
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Configure Data Cleanup</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-4">
        <div v-if="isGenericDataset" class="p-4 bg-blue-50 rounded-lg mb-6">
          <p class="text-blue-800">
            Cleanup options are disabled when using a generic dataset as the data is pre-processed.
          </p>
        </div>

        <h3 class="text-lg font-semibold mb-4">Cleanup Options</h3>
        <div class="space-y-6">
          <div>
            <Toggle
              v-model="store.datasetConfig.ignoreCapitals"
              :disabled="isGenericDataset"
              label="Ignore capital letters"
              @update:modelValue="updateConfig"
            />
          </div>
          <div>
            <Toggle
              v-model="store.datasetConfig.ignoreNumbers"
              :disabled="isGenericDataset"
              label="Ignore numbers"
              @update:modelValue="updateConfig"
            />
          </div>
          <div>
            <Toggle
              v-model="store.datasetConfig.ignoreSymbols"
              :disabled="isGenericDataset"
              label="Ignore symbols and punctuation"
              @update:modelValue="updateConfig"
            />
          </div>
          <div>
            <Toggle
              v-model="store.datasetConfig.ignoreSpaces"
              :disabled="isGenericDataset"
              label="Ignore spaces"
              @update:modelValue="updateConfig"
            />
          </div>

          <div class="pt-4 border-t border-gray-200">
            <Toggle
              v-model="store.datasetConfig.reduceByTenPercent"
              label="Reduce the final results by 10%"
              @update:modelValue="updateConfig"
            />
            <HelperText text="Recommended when you use a generic dataset" />
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