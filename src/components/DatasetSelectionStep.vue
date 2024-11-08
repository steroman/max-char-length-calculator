<script setup>
import { ref, watch } from 'vue';
import StepNavigation from './StepNavigation.vue';
import HelperText from './ui/HelperText.vue';
import ErrorMessage from './ui/ErrorMessage.vue';
import SelectionCard from './ui/SelectionCard.vue';
import { useCalculatorStore } from '../stores/calculator';
import { languages } from '../data/languages';
import { genericDataset } from '../data/genericDataset';

const store = useCalculatorStore();
const currentFile = ref(null);
const error = ref('');
const highlightLanguage = ref(false);
const highlightDataset = ref(false);

watch(() => store.useGenericDataset, (newValue) => {
  store.datasetConfig.reduceByTenPercent = newValue;

  if (newValue) {
    store.selectedLanguageCode = 'en';
    const dataset = Object.entries(genericDataset.frequencies).reduce((acc, [char, freq]) => {
      const count = Math.round(freq * 1000);
      acc[char] = char.repeat(count);
      return acc;
    }, {});
    store.processDataset(dataset);
    highlightDataset.value = false;
    highlightLanguage.value = false;
  } else {
    store.selectedLanguageCode = '';
    currentFile.value = null;
  }
});

const handleFileChange = async (event) => {
  const input = event.target;
  if (input.files && input.files[0] && store.selectedLanguageCode) {
    currentFile.value = input.files[0];
    error.value = '';
    highlightDataset.value = false;
    
    try {
      const text = await currentFile.value.text();
      const dataset = JSON.parse(text);
      store.processDataset(dataset);
      store.datasetConfig.reduceByTenPercent = false;
    } catch (e) {
      error.value = 'Couldn\'t read the JSON file, try with a different format';
      highlightDataset.value = true;
      if (input.value) input.value = '';
      currentFile.value = null;
    }
  }
};

const handleNext = () => {
  highlightDataset.value = false;
  highlightLanguage.value = false;

  if (!store.selectedLanguageCode) {
    error.value = 'Select a language';
    highlightLanguage.value = true;
    return;
  }

  if (!store.useGenericDataset && !currentFile.value) {
    error.value = 'Upload a JSON file';
    highlightDataset.value = true;
    return;
  }

  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Select a dataset</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-6">
        <div class="space-y-6">
          <!-- Dataset Type Selection Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectionCard
              v-model="store.useGenericDataset"
              :value="true"
              title="Use generic data (English)"
            >
              <HelperText 
                text="Based on letter frequency data from [Link]"
                :link="{
                  url: 'https://en.wikipedia.org/wiki/Letter_frequency',
                  text: 'Wikipedia'
                }"
              />
            </SelectionCard>

            <SelectionCard
              v-model="store.useGenericDataset"
              :value="false"
              title="Upload custom data"
            >
              <HelperText 
                text="A JSON file with the localization keys ([Link])"
                :link="{
                  url: 'https://raw.githubusercontent.com/steroman/max-char-length-calculator/refs/heads/main/src/assets/sample-files/en-en.json',
                  text: 'example'
                }"
              />
            </SelectionCard>
          </div>

          <!-- Language Selection -->
          <div class="mt-6">
            <label for="language" class="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              id="language"
              v-model="store.selectedLanguageCode"
              :disabled="store.useGenericDataset"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
                highlightLanguage 
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500'
              ]"
            >
              <option value="">Select a language</option>
              <option
                v-for="lang in languages"
                :key="lang.code"
                :value="lang.code"
              >
                {{ lang.name }}
              </option>
            </select>
          </div>

          <div v-if="!store.useGenericDataset && store.selectedLanguageCode" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Upload JSON file
            </label>
            <div :class="{ 'p-2 rounded bg-red-50': highlightDataset }">
              <input
                type="file"
                accept=".json"
                @change="handleFileChange"
                :class="[
                  'block w-full text-sm text-gray-500',
                  'file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0',
                  'file:text-sm file:font-semibold',
                  highlightDataset 
                    ? 'file:bg-red-50 file:text-red-700 hover:file:bg-red-100'
                    : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                ]"
              />
            </div>
            <p v-if="currentFile" class="mt-2 text-sm text-green-600">
              Selected file: {{ currentFile.name }}
            </p>
          </div>
        </div>
      </div>

      <ErrorMessage :message="error" />
      <StepNavigation
        @next="handleNext"
        @previous="handlePrevious"
      />
    </div>
  </div>
</template>