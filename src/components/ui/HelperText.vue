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
      <template v-if="text.includes('([Link])')">
        {{ text.split('([Link])')[0] }}<span class="whitespace-nowrap">(<ExternalLink :href="link.url">{{ link.text }}</ExternalLink>)</span>{{ text.split('([Link])')[1] }}
      </template>
      <template v-else>
        {{ text.split('[Link]')[0] }}<ExternalLink :href="link.url">{{ link.text }}</ExternalLink>{{ text.split('[Link]')[1] }}
      </template>
    </template>
    <template v-else>
      {{ text }}
    </template>
  </p>
</template>