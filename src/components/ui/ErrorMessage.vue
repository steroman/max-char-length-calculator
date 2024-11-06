<script setup>
defineProps({
  message: String
});
</script>

<template>
  <p v-if="message" class="mt-4 text-sm text-red-600 flex items-center gap-1">
    <span>⚠️</span>
    <span>{{ message }}</span>
  </p>
</template>