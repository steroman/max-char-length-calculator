<script setup>
import ExternalLink from './ExternalLink.vue';

defineProps({
  text: String,
  link: Object
});
</script>

<template>
  <p class="mt-1.5 text-xs text-gray-500">
    <template v-if="link">
      {{ text.split('[Link]')[0] }}
      <ExternalLink :href="link.url">{{ link.text }}</ExternalLink>
      {{ text.split('[Link]')[1] }}
    </template>
    <template v-else>
      {{ text }}
    </template>
  </p>
</template>