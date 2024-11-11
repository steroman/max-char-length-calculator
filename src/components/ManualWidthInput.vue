<script setup>
import { ref, computed } from 'vue';
import { useCalculatorStore } from '../stores/calculator';
import CharacterTable from './CharacterTable.vue';

const store = useCalculatorStore();
const sortField = ref('char');
const sortDirection = ref('asc');
const invalidWidths = ref(new Set());

const characterSummary = computed(() => {
  return store.characterData.map(char => ({
    ...char,
    frequency: char.frequency.toFixed(2),
    displayChar: char.char === ' ' ? '(space)' : char.char
  }));
});

const tableHeaders = [
  { key: 'displayChar', label: 'Character' },
  { key: 'count', label: 'Count' },
  { key: 'frequency', label: 'Frequency (%)' },
  { key: 'width', label: 'Width (pixels)', class: 'w-32' }
];

const handleSort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  store.sortCharacterData(store.characterData, field, sortDirection.value);
};

const getSortIcon = (field) => {
  if (sortField.value !== field) return '↕️';
  return sortDirection.value === 'asc' ? '↑' : '↓';
};

const updateCharacterWidth = (char, width) => {
  const numWidth = parseFloat(width);
  if (!isNaN(numWidth)) {
    const charData = store.characterData.find(c => c.char === char);
    if (charData) {
      charData.width = numWidth;
      invalidWidths.value.delete(char);
    }
  }
};

const formatCount = (count) => {
  return store.useGenericDataset ? '-' : count;
};
</script>

<template>
  <CharacterTable
    :headers="tableHeaders"
    :data="characterSummary"
    max-height="80vh"
  >
    <template #cell-count="{ row }">
      {{ formatCount(row.count) }}
    </template>
    <template #cell-width="{ row }">
      <input
        type="number"
        step="0.1"
        :value="row.width"
        @input="(e) => updateCharacterWidth(row.char, e.target.value)"
        :class="[
          'w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2',
          invalidWidths.has(row.char)
            ? 'border-red-300 focus:ring-red-500 bg-red-50'
            : 'border-gray-300 focus:ring-blue-500'
        ]"
      />
    </template>
  </CharacterTable>
</template>