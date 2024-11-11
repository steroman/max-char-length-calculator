<script setup>
import { ref, computed } from 'vue';
import opentype from 'opentype.js';
import { useCalculatorStore } from '../stores/calculator';
import ErrorMessage from './ui/ErrorMessage.vue';
import HelperText from './ui/HelperText.vue';
import WarningMessage from './ui/WarningMessage.vue';
import FileUpload from './ui/FileUpload.vue';
import CharacterTable from './CharacterTable.vue';

const store = useCalculatorStore();
const fontSize = ref(16);
const currentFile = ref(null);
const error = ref('');
const fontInfo = ref(null);
const highlightUpload = ref(false);
const missingChars = ref(new Set());

const tableHeaders = [
  { key: 'displayChar', label: 'Character' },
  { key: 'count', label: 'Count' },
  { key: 'frequency', label: 'Frequency (%)' },
  { key: 'width', label: 'Width (Pixels)' }
];

const characterTableData = computed(() => {
  return store.characterData.map(char => ({
    ...char,
    displayChar: char.char === ' ' ? '(space)' : char.char,
    frequency: char.frequency.toFixed(2),
    isMissing: missingChars.value.has(char.char)
  }));
});

const hasWarning = computed(() => missingChars.value.size > 0);

const warningMessage = computed(() => {
  if (!hasWarning.value) return '';
  const chars = Array.from(missingChars.value).map(c => c === ' ' ? '(space)' : c).join(', ');
  return `The following characters are missing from the font: ${chars}. Their widths might be incorrect.`;
});

const calculateWidth = (font, char, size) => {
  const glyph = font.charToGlyph(char);
  
  // Check if the glyph exists by comparing it with the .notdef glyph
  const notdefGlyph = font.glyphs.get(0);
  if (glyph.index === notdefGlyph.index) {
    missingChars.value.add(char);
  }

  const pixelsPerUnit = size / font.unitsPerEm;
  const width = glyph.advanceWidth;
  const pixelWidth = width * pixelsPerUnit * 1.05;
  return Math.ceil(pixelWidth); // Changed from Math.round to Math.ceil
};

const handleFontLoaded = async (file) => {
  if (!file) {
    error.value = 'Could not load the font file, try a different one';
    highlightUpload.value = true;
    return;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const font = await opentype.parse(arrayBuffer);
    
    // Reset missing characters
    missingChars.value.clear();
    
    fontInfo.value = {
      name: font.names.fontFamily.en,
      weight: font.tables.os2.usWeightClass,
      style: font.tables.os2.fsSelection.italic ? 'italic' : 'normal',
      unitsPerEm: font.unitsPerEm
    };

    // Calculate widths for all characters
    store.characterData.forEach(char => {
      char.width = calculateWidth(font, char.char, fontSize.value);
    });

    currentFile.value = file;
    error.value = '';
    highlightUpload.value = false;
  } catch (e) {
    console.error('Font loading error:', e);
    error.value = 'Could not load the font file, try a different one';
    highlightUpload.value = true;
  }
};

const updateFontSize = () => {
  if (!currentFile.value || !fontInfo.value) return;
  handleFontLoaded(currentFile.value);
};

const formatCount = (count) => {
  return store.useGenericDataset ? '-' : count;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Font Upload and Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FileUpload
        v-model="currentFile"
        :highlight="highlightUpload"
        title="Upload font file"
        helper-text="Supports TTF, OTF, and WOFF formats"
        accept=".ttf,.otf,.woff"
        @file-loaded="handleFontLoaded"
      />

      <!-- Font Info -->
      <div v-if="fontInfo" class="p-4 bg-blue-50 rounded-lg">
        <h4 class="font-medium text-blue-900">Font information</h4>
        <ul class="mt-2 text-sm text-blue-800">
          <li>Name: <strong>{{ fontInfo.name }}</strong></li>
          <li>Weight: <strong>{{ fontInfo.weight }}</strong></li>
          <li>Style: <strong>{{ fontInfo.style }}</strong></li>
          <li>Units per em: <strong>{{ fontInfo.unitsPerEm }}</strong></li>
        </ul>
      </div>
    </div>

    <!-- Font Size Input -->
    <div v-if="currentFile" class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        Font size (in pixels)
      </label>
      <input
        type="number"
        v-model="fontSize"
        @change="updateFontSize"
        min="1"
        step="1"
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
      />
      <HelperText text="Changing the font size makes the width of single character change" />
    </div>

    <!-- Warning for missing characters -->
    <WarningMessage
      v-if="hasWarning"
      :message="warningMessage"
    />

    <!-- Character Width Table -->
    <CharacterTable
      v-if="currentFile"
      :headers="tableHeaders"
      :data="characterTableData"
      max-height="60vh"
    >
      <template #cell-displayChar="{ row }">
        <span :class="{ 'text-yellow-800': row.isMissing }">
          {{ row.displayChar }}
          <span 
            v-if="row.isMissing"
            class="ml-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
          >
            Missing
          </span>
        </span>
      </template>
      <template #cell-count="{ row }">
        {{ formatCount(row.count) }}
      </template>
    </CharacterTable>

    <ErrorMessage :message="error" />
  </div>
</template>