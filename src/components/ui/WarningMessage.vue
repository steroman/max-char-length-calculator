<script setup>
defineProps({
  message: String
});
</script>

<template>
  <div class="p-4 bg-blue-50 rounded-lg mb-6 border border-blue-200">
    <p class="text-blue-800">{{ message }}</p>
  </div>
</template>