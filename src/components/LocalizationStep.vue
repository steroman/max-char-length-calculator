<script setup>
import { ref, computed } from 'vue';
import StepNavigation from './StepNavigation.vue';
import Toggle from './ui/Toggle.vue';
import ErrorMessage from './ui/ErrorMessage.vue';
import WarningMessage from './ui/WarningMessage.vue';
import { useCalculatorStore } from '../stores/calculator';
import { languages } from '../data/languages';

const store = useCalculatorStore();
const selectedLanguageCode = ref('');
const currentFile = ref(null);
const error = ref('');
const highlightLanguage = ref(false);
const highlightDataset = ref(false);
const highlightConfig = ref(false);
const isAddingLanguage = ref(false);

const genericRates = [
  { label: '+15% (to Russian)', value: 1.15 },
  { label: '+20% (to French)', value: 1.20 },
  { label: '+25% (to Arabic or Italian)', value: 1.25 },
  { label: '+30% (to Spanish or Portuguese)', value: 1.30 },
  { label: '+35% (to German)', value: 1.35 },
  { label: '+40% (Extra safe)', value: 1.40 },
];

if (store.localization.genericExpansionRate === 1.3) {
  store.setGenericExpansionRate(1.40);
}

const availableLanguages = computed(() => {
  return languages.filter(lang => 
    lang.code !== store.selectedLanguageCode && 
    !store.localization.languages.some(l => l.code === lang.code)
  );
});

const startAddingLanguage = () => {
  isAddingLanguage.value = true;
  selectedLanguageCode.value = '';
  currentFile.value = null;
  error.value = '';
  highlightLanguage.value = false;
  highlightDataset.value = false;
};

const cancelAddingLanguage = () => {
  isAddingLanguage.value = false;
  selectedLanguageCode.value = '';
  currentFile.value = null;
  error.value = '';
  highlightLanguage.value = false;
  highlightDataset.value = false;
};

const handleNext = () => {
  highlightConfig.value = false;
  highlightLanguage.value = false;
  highlightDataset.value = false;
  error.value = '';
  
  if (store.localization.enabled) {
    if (store.localization.useGenericRates && !store.localization.genericExpansionRate) {
      error.value = 'Please select an expansion rate';
      highlightConfig.value = true;
      return;
    }
    
    if (!store.localization.useGenericRates) {
      if (isAddingLanguage.value) {
        if (!selectedLanguageCode.value) {
          error.value = 'Please select a language';
          highlightLanguage.value = true;
          return;
        }
        if (!currentFile.value) {
          error.value = 'Please complete adding the current language by uploading a JSON file';
          highlightDataset.value = true;
          return;
        }
      }
      
      if (store.localization.languages.length === 0) {
        error.value = 'Please add at least one language';
        return;
      }
    }
  }
  
  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};

const handleFileChange = async (event) => {
  const input = event.target;
  if (input.files && input.files[0] && selectedLanguageCode.value) {
    currentFile.value = input.files[0];
    error.value = '';
    highlightDataset.value = false;
    
    try {
      const text = await currentFile.value.text();
      const dataset = JSON.parse(text);
      
      const language = {
        code: selectedLanguageCode.value,
        name: languages.find(l => l.code === selectedLanguageCode.value)?.name || '',
        dataset,
        averageLength: 0,
        expansionRate: 0,
        characterData: [],
      };
      
      store.processDataset(dataset, language);
      store.addLocalizationLanguage(language);
      
      isAddingLanguage.value = false;
      selectedLanguageCode.value = '';
      currentFile.value = null;
      if (input.value) input.value = '';
    } catch (e) {
      error.value = 'Invalid JSON file. Please check the file format';
      highlightDataset.value = true;
      if (input.value) input.value = '';
      currentFile.value = null;
    }
  }
};

const isGenericDataset = computed(() => store.useGenericDataset);
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Localization Settings</h2>
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-6">
        <div>
          <Toggle
            v-model="store.localization.enabled"
            label="Account for text expansion in other languages"
          />
        </div>

        <template v-if="store.localization.enabled">
          <WarningMessage
            v-if="isGenericDataset"
            message="Custom language datasets are disabled when using a generic dataset. Please use the generic expansion rates instead."
          />

          <div class="space-y-4">
            <div>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="store.localization.useGenericRates"
                  :value="true"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm">Use generic expansion rates</span>
              </label>
            </div>
            <div>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="store.localization.useGenericRates"
                  :value="false"
                  :disabled="isGenericDataset"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm" :class="{ 'opacity-50': isGenericDataset }">
                  Use custom language datasets
                </span>
              </label>
            </div>
          </div>

          <div v-if="store.localization.useGenericRates" class="space-y-4">
            <h3 class="text-lg font-semibold">Select Expansion Rate</h3>
            <p class="text-sm text-gray-600 mb-4">
              Expansion rates from English. If you don't know, choose the extra safe option.
            </p>
            <div :class="{ 'p-2 rounded bg-red-50': highlightConfig }" class="space-y-2">
              <div v-for="rate in genericRates" :key="rate.value" class="flex items-center">
                <label class="flex items-center space-x-2">
                  <input
                    type="radio"
                    v-model="store.localization.genericExpansionRate"
                    :value="rate.value"
                    class="text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm">{{ rate.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <div v-else-if="!isGenericDataset" class="space-y-4">
            <h3 class="text-lg font-semibold">Language Datasets</h3>
            
            <div v-if="store.localization.languages.length > 0" class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Added Languages:</h4>
              <div class="space-y-2">
                <div 
                  v-for="lang in store.localization.languages" 
                  :key="lang.code"
                  class="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span>{{ lang.name }}</span>
                  <button
                    @click="store.removeLocalizationLanguage(lang.code)"
                    class="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div v-if="!isAddingLanguage" class="flex justify-start">
              <button
                @click="startAddingLanguage"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="mr-1">+</span> Add language
              </button>
            </div>

            <div v-else class="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center mb-4">
                <h4 class="text-sm font-medium text-gray-700">Add New Language</h4>
                <button
                  @click="cancelAddingLanguage"
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Language
                </label>
                <select
                  v-model="selectedLanguageCode"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
                    highlightLanguage 
                      ? 'border-red-300 focus:ring-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500'
                  ]"
                >
                  <option value="">Select a language</option>
                  <option
                    v-for="lang in availableLanguages"
                    :key="lang.code"
                    :value="lang.code"
                  >
                    {{ lang.name }}
                  </option>
                </select>
              </div>

              <div v-if="selectedLanguageCode">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Upload JSON Dataset
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
              </div>
            </div>
          </div>
        </template>
      </div>

      <ErrorMessage :message="error" />
      <StepNavigation
        @next="handleNext"
        @previous="handlePrevious"
      />
    </div>
  </div>
</template>