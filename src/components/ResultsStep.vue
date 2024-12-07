<script setup>
import { ref, computed } from 'vue';
import StepNavigation from './StepNavigation.vue';
import StepTitle from './StepTitle.vue';
import { useCalculatorStore } from '../stores/calculator';
import { languages } from '../data/languages';
import CharacterTable from './CharacterTable.vue';

const store = useCalculatorStore();
const isCharacterSummaryOpen = ref(false);

// Calculate results when component is mounted
store.calculateResults();

const tableHeaders = [
  { key: 'displayChar', label: 'Character' },
  { key: 'count', label: 'Count' },
  { key: 'frequency', label: 'Frequency (%)' },
  { key: 'width', label: 'Width (px)' }
];

const characterTableData = computed(() => {
  return store.characterData.map(char => ({
    ...char,
    displayChar: char.char === ' ' ? '(space)' : char.char,
    frequency: char.frequency.toFixed(2)
  }));
});

const handlePrevious = () => {
  store.previousStep();
};

const handleNext = () => {
  store.reset();
  store.currentStep = 1;
};

const formatLength = (roundedValue, exactValue) => {
  const exact = Number(exactValue);
  if (Number.isInteger(exact) || roundedValue === exact) {
    return { value: roundedValue };
  }
  return { 
    value: roundedValue,
    exact: Number(exact).toFixed(2)
  };
};

const getMainResult = computed(() => {
  if (store.adjustedMaxCharLength !== null) {
    const baseLength = store.reducedMaxCharLength || store.maxCharLength;
    const expansionRate = store.localization.useGenericRates 
      ? store.localization.genericExpansionRate 
      : Math.max(...store.localization.languages.map(lang => lang.expansionRate), 1);
    const exactAdjusted = baseLength / expansionRate;
    return formatLength(store.adjustedMaxCharLength, exactAdjusted);
  }
  
  if (store.datasetConfig.reduceByTenPercent && store.reducedMaxCharLength !== null) {
    const exactReduced = store.maxCharLength * 0.9;
    return formatLength(store.reducedMaxCharLength, exactReduced);
  }

  const totalFrequencyWidth = store.characterData.reduce((sum, char) => {
    return sum + (char.frequency / 100) * (char.width || 0);
  }, 0);
  const exactMax = store.elementWidth / totalFrequencyWidth;
  return formatLength(store.maxCharLength, exactMax);
});

const getSecondaryResults = computed(() => {
  const results = [];
  const totalFrequencyWidth = store.characterData.reduce((sum, char) => {
    return sum + (char.frequency / 100) * (char.width || 0);
  }, 0);
  const exactMax = store.elementWidth / totalFrequencyWidth;
  const baseResult = formatLength(store.maxCharLength, exactMax);

  if (store.adjustedMaxCharLength !== null) {
    if (store.datasetConfig.reduceByTenPercent) {
      results.push({
        label: 'generic dataset adjustment (-10%)',
        value: store.maxCharLength,
        exact: Number(exactMax).toFixed(2)
      });
      
      const exactReduced = store.maxCharLength * 0.9;
      const reducedResult = formatLength(store.reducedMaxCharLength, exactReduced);
      
      const expansionRate = store.localization.useGenericRates 
        ? store.localization.genericExpansionRate 
        : Math.max(...store.localization.languages.map(lang => lang.expansionRate), 1);
      results.push({
        label: `localization text expansion (${((expansionRate - 1) * 100).toFixed(0)}%)`,
        value: store.reducedMaxCharLength,
        exact: Number(exactReduced).toFixed(2)
      });
    } else {
      const expansionRate = store.localization.useGenericRates 
        ? store.localization.genericExpansionRate 
        : Math.max(...store.localization.languages.map(lang => lang.expansionRate), 1);
      results.push({
        label: `localization text expansion (${((expansionRate - 1) * 100).toFixed(0)}%)`,
        value: store.maxCharLength,
        exact: Number(exactMax).toFixed(2)
      });
    }
  }
  else if (store.datasetConfig.reduceByTenPercent && store.reducedMaxCharLength !== null) {
    results.push({
      label: 'generic dataset adjustment (-10%)',
      value: store.maxCharLength,
      exact: Number(exactMax).toFixed(2)
    });
  }

  return results;
});

const formatCount = (count) => {
  return store.useGenericDataset ? '-' : count;
};

const getLanguageWithHighestExpansion = computed(() => {
  if (!store.localization.enabled || store.localization.useGenericRates) {
    return null;
  }
  return store.localization.languages.reduce((highest, current) => {
    return !highest || current.expansionRate > highest.expansionRate ? current : highest;
  }, null);
});

const getAverageLength = computed(() => {
  if (store.useGenericDataset) return '-';
  const values = Object.values(store.rawDataset);
  return (values.reduce((sum, str) => sum + str.length, 0) / values.length).toFixed(2);
});

const toggleCharacterSummary = () => {
  isCharacterSummaryOpen.value = !isCharacterSummaryOpen.value;
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <StepTitle title="Results" />
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="space-y-8">
        <!-- Main Result -->
        <div class="text-center p-6 bg-blue-50 rounded-lg">
          <h3 class="text-xl font-semibold text-blue-900 mb-1">Maximum character length</h3>
          <p class="text-sm text-blue-800">for an element of <span class="font-semibold">{{ store.elementWidth }}</span> pixels</p>
          <p class="text-4xl font-bold text-blue-900 mb-1 mt-2">
            {{ getMainResult.value }} characters
          </p>
          <p v-if="getMainResult.exact" class="text-sm text-blue-800">
            adjusted from {{ getMainResult.exact }}
          </p>
          
          <!-- Secondary Results -->
          <div v-if="getSecondaryResults.length > 0" class="mt-6 space-y-2 text-sm text-blue-800">
            <p v-for="(result, index) in getSecondaryResults" :key="index">
              Before {{ result.label }}: <span class="font-semibold">{{ result.value }}</span> characters
              <template v-if="result.exact">
                (adjusted from {{ result.exact }})
              </template>
            </p>
          </div>
        </div>

        <!-- Two-column layout for Main Language and Localization Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Main Language Info -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Main language info</h3>
            <ul class="list-disc ml-6 text-gray-700 text-sm">
              <li>Language: <span class="font-semibold">{{ languages.find(l => l.code === store.selectedLanguageCode)?.name }}</span></li>
              <li>Total unique characters: <span class="font-semibold">{{ store.characterData.length }}</span></li>
              <li>Average character width: <span class="font-semibold">{{ (store.characterData.reduce((sum, char) => sum + (char.width || 0), 0) / store.characterData.length).toFixed(2) }}</span> pixels</li>
              <li>Average string length: <span class="font-semibold">{{ getAverageLength }}</span> characters</li>
            </ul>
          </div>

          <!-- Localization Info -->
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="text-lg font-semibold text-green-900 mb-2">Localization info</h3>
            <div v-if="!store.localization.enabled" class="text-green-800">
              <p>No localization adjustment configured</p>
            </div>
            <div v-else class="space-y-4 text-sm">
              <template v-if="store.localization.useGenericRates">
                <p class="text-green-800">
                  Using generic expansion rate: <span class="font-semibold">{{ ((store.localization.genericExpansionRate - 1) * 100).toFixed(0) }}%</span>
                </p>
              </template>
              <template v-else>
                <!-- Highest Expansion -->
                <div v-if="getLanguageWithHighestExpansion" class="text-green-900 font-medium">
                  Highest expansion: <span class="font-semibold">{{ getLanguageWithHighestExpansion.name }}</span>
                  (<span class="font-semibold">{{ ((getLanguageWithHighestExpansion.expansionRate - 1) * 100).toFixed(2) }}%</span>)
                </div>

                <!-- Language Details -->
                <div class="text-green-800">
                  <p class="font-medium mb-2">Localization data:</p>
                  <div v-for="lang in store.localization.languages" :key="lang.code" class="ml-4 mb-2">
                    <p class="font-medium">{{ lang.name }}:</p>
                    <ul class="list-disc ml-6">
                      <li>Average length: <span class="font-semibold">{{ lang.averageLength.toFixed(2) }}</span></li>
                      <li>Expansion rate: <span class="font-semibold">{{ ((lang.expansionRate - 1) * 100).toFixed(2) }}%</span></li>
                    </ul>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Character Summary Accordion -->
        <div class="border border-gray-200 rounded-lg">
          <button
            @click="toggleCharacterSummary"
            class="w-full px-4 py-2 text-left font-medium flex items-center justify-between hover:bg-gray-50 focus:outline-none"
          >
            <span>Character summary</span>
            <svg
              class="w-5 h-5 transform transition-transform"
              :class="{ 'rotate-180': isCharacterSummaryOpen }"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <div v-show="isCharacterSummaryOpen" class="border-t border-gray-200 p-4">
            <div class="border border-gray-200 rounded-lg">
              <CharacterTable
                :headers="tableHeaders"
                :data="characterTableData"
                max-height="60vh"
              >
                <template #cell-count="{ row }">
                  {{ formatCount(row.count) }}
                </template>
              </CharacterTable>
            </div>
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