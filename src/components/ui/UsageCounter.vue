<script setup>
defineProps({
  count: {
    type: Number,
    required: true
  }
});
</script>

<template>
  <div class="text-center text-sm">
    Max length was calculated {{ count }} times with this app ♥️
  </div>
</template>