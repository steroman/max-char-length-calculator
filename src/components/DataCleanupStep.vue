<script setup>
import { ref, computed, watch } from 'vue';
import StepNavigation from './StepNavigation.vue';
import StepTitle from './StepTitle.vue';
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
    <StepTitle title="Configure character cleanup" />
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
            helperText="When on, capital and lowercase letters are counted together"
            @update:modelValue="updateConfig"
          />
          
          <Toggle
            v-model="store.datasetConfig.ignoreNumbers"
            :disabled="isGenericDataset"
            label="Ignore numbers"
            @update:modelValue="updateConfig"
          />
          
          <Toggle
            v-model="store.datasetConfig.ignoreSymbols"
            :disabled="isGenericDataset"
            label="Ignore symbols and punctuation"
            @update:modelValue="updateConfig"
          />
          
          <Toggle
            v-model="store.datasetConfig.ignoreSpaces"
            :disabled="isGenericDataset"
            label="Ignore spaces"
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
              helperText="To compensate for inaccuracy (Recommended when using the generic dataset)"
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