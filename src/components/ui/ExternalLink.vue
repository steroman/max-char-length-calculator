<script setup>
defineProps({
  href: {
    type: String,
    required: true
  },
  class: {
    type: String,
    default: 'text-blue-500 hover:text-blue-800'
  }
});
</script>

<template>
  <a 
    :href="href" 
    target="_blank" 
    rel="noopener noreferrer"
    :class="class"
    class="inline-flex items-center gap-1"
  >
    <slot />
    <svg 
      class="w-3.5 h-3.5" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  </a>
</template>