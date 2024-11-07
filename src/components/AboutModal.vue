<script setup>
import Modal from './ui/Modal.vue';
import ExternalLink from './ui/ExternalLink.vue';

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);
</script>

<template>
  <Modal
    :is-open="isOpen"
    title="About Me"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <p class="text-gray-600">
        Hi! I'm Stefano Romanelli, a UX Content Designer with a passion for creating clear, inclusive, and effective user experiences.
      </p>
      
      <p class="text-gray-600">
        With over 10 years of experience in content design and technical writing, I specialize in creating content systems and tools that help teams work more efficiently while maintaining consistency across products.
      </p>

      <div class="pt-2">
        <ExternalLink
          href="https://www.linkedin.com/in/stefanoromanelli/"
          class="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          Connect with me on LinkedIn
        </ExternalLink>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        @click="emit('close')"
      >
        Close
      </button>
    </template>
  </Modal>
</template>