<script setup>
import HelperText from './HelperText.vue';

const props = defineProps({
  modelValue: {
    type: File,
    default: null
  },
  highlight: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'file-loaded']);

const handleFileChange = async (event) => {
  const input = event.target;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    emit('update:modelValue', file);
    
    try {
      const text = await file.text();
      const dataset = JSON.parse(text);
      emit('file-loaded', dataset);
    } catch (e) {
      emit('file-loaded', null);
      if (input.value) input.value = '';
    }
  }
};
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Upload JSON file
    </label>
    <HelperText text="Supports flat and structured JSON" />

    <div class="mt-3" :class="{ 'p-2 rounded bg-red-50': highlight }">
      <input
        type="file"
        accept=".json"
        @change="handleFileChange"
        :class="[
          'block w-full text-sm text-gray-500',
          'file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0',
          'file:text-sm file:font-semibold',
          highlight 
            ? 'file:bg-red-50 file:text-red-700 hover:file:bg-red-100'
            : 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
        ]"
      />
    </div>
    <p v-if="modelValue" class="mt-2 text-sm text-green-600">
      Selected file: {{ modelValue.name }}
    </p>
  </div>
</template>