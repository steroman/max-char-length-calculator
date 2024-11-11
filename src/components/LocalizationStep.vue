<script setup>
import { ref, computed } from 'vue';
import FileUpload from './ui/FileUpload.vue';
import StepNavigation from './StepNavigation.vue';
import StepTitle from './StepTitle.vue';
import Toggle from './ui/Toggle.vue';
import ErrorMessage from './ui/ErrorMessage.vue';
import WarningMessage from './ui/WarningMessage.vue';
import ExternalLink from './ui/ExternalLink.vue';
import HelperText from './ui/HelperText.vue';
import SelectionCard from './ui/SelectionCard.vue';
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

const handleFileLoaded = (dataset) => {
  if (dataset === null) {
    error.value = 'Invalid JSON file. Please check the file format';
    highlightDataset.value = true;
    currentFile.value = null;
    return;
  }

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
  error.value = '';
  highlightDataset.value = false;
};

const handleNext = () => {
  highlightConfig.value = false;
  highlightLanguage.value = false;
  highlightDataset.value = false;
  error.value = '';
  
  if (store.localization.enabled) {
    if (store.localization.useGenericRates && !store.localization.genericExpansionRate) {
      error.value = 'Select an expansion rate';
      highlightConfig.value = true;
      return;
    }
    
    if (!store.localization.useGenericRates) {
      if (isAddingLanguage.value) {
        if (!selectedLanguageCode.value) {
          error.value = 'Select a language';
          highlightLanguage.value = true;
          return;
        }
        if (!currentFile.value) {
          error.value = 'Upload a JSON file';
          highlightDataset.value = true;
          return;
        }
      }
      
      if (store.localization.languages.length === 0) {
        error.value = 'Add at least one language';
        return;
      }
    }
  }
  
  store.nextStep();
};

const handlePrevious = () => {
  store.previousStep();
};

const isGenericDataset = computed(() => store.useGenericDataset);
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <StepTitle title="Set text expansion (Localization)" />
    <div class="bg-white rounded-lg shadow-md p-6">
      <p class="mb-4">The expansion rate determines how much the final character limit is adjusted to account for text expansion caused by localizing to other languages.</p>
      <div class="space-y-6">
        <div>
          <Toggle
            v-model="store.localization.enabled"
            label="Adjust for text expansion in other languages"
          />
        </div>

        <template v-if="store.localization.enabled">
          <WarningMessage
            v-if="isGenericDataset"
            message="Only generic expansion rates are available when using the generic dataset."
          />

          <!-- Dataset Type Selection Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Generic Rates Card -->
            <SelectionCard
              v-model="store.localization.useGenericRates"
              :value="true"
              :selected="store.localization.useGenericRates"
              :disabled="isGenericDataset"
              title="Use generic expansion rates"
            >
              <HelperText text="Rates are estimated ([Link])" :link="{
                url: 'https://www.andiamo.co.uk/resources/expansion-and-contraction-factors',
                text: 'source'
              }" />
            </SelectionCard>

            <!-- Custom Datasets Card -->
            <SelectionCard
              v-model="store.localization.useGenericRates"
              :value="false"
              :selected="!store.localization.useGenericRates"
              :disabled="isGenericDataset"
              title="Upload custom data"
            >
              <HelperText text="JSON files with the localization keys ([Link])" :link="{
                url: 'https://raw.githubusercontent.com/steroman/max-char-length-calculator/refs/heads/main/src/assets/sample-files/it-it.json',
                text: 'example'
              }" />
            </SelectionCard>
          </div>

          <div v-if="store.localization.useGenericRates" class="space-y-4">
            <h3 class="text-lg font-semibold">Set expansion rate</h3>
            <HelperText text="If you're unsure, go with the extra safe option." />
            <div :class="{ 'p-2 rounded bg-red-50': highlightConfig }">
              <select
                v-model="store.localization.genericExpansionRate"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
              >
                <option value="">Select an expansion rate</option>
                <option
                  v-for="rate in genericRates"
                  :key="rate.value"
                  :value="rate.value"
                >
                  {{ rate.label }}
                </option>
              </select>
            </div>
          </div>

          <div v-else-if="!isGenericDataset" class="space-y-4">
            <h3 class="text-lg font-semibold">Languages</h3>
            <HelperText text="The expansion rate used is that of the most expanding language." />
            
            <div v-if="store.localization.languages.length > 0" class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Added languages:</h4>
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
                <h4 class="text-sm font-medium text-gray-700">New language</h4>
                <button
                  @click="cancelAddingLanguage"
                  class="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Language
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
                <FileUpload
                  v-model="currentFile"
                  :highlight="highlightDataset"
                  title="Upload JSON file"
                  helperText="Supports flat and structured JSON"
                  accept=".json"
                  @file-loaded="handleFileLoaded"
                />
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