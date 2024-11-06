<script setup>
defineProps({
  text: String,
  link: Object
});
</script>

<template>
  <p class="mt-1.5 text-xs text-gray-500">
    <template v-if="link">
      {{ text.split('[Link]')[0] }}
      <a 
        :href="link.url" 
        target="_blank" 
        rel="noopener noreferrer"
        class="text-blue-600 hover:text-blue-800 hover:underline"
      >{{ link.text }}</a>
      {{ text.split('[Link]')[1] }}
    </template>
    <template v-else>
      {{ text }}
    </template>
  </p>
</template>