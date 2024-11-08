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
    This app calculated max length {{ count }} times  ♥️
  </div>
</template>