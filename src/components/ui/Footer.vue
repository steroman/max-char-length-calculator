<script setup>
import { ref } from 'vue';
import ExternalLink from './ExternalLink.vue';
import FeedbackForm from '../FeedbackForm.vue';

const isFeedbackOpen = ref(false);
const isAboutOpen = ref(false);

const openFeedbackDialog = () => {
  isFeedbackOpen.value = true;
};

const openAboutDialog = () => {
  isAboutOpen.value = true;
};
</script>

<template>
  <footer class="mt-8 py-4 bg-gray-50">
    <div class="max-w-4xl mx-auto px-6">
      <div class="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
        <ExternalLink
          href="https://uxcontent.com/a-formula-for-defining-maximum-character-lengths/"
          class="text-gray-500 hover:text-gray-700"
        >
          How's this calculated?
        </ExternalLink>
        <span class="text-gray-300">•</span>
        <button
          @click="openFeedbackDialog"
          class="text-gray-500 hover:text-gray-700"
        >
          Give feedback
        </button>
        <span class="text-gray-300">•</span>
        <ExternalLink
          href="https://github.com/steroman/max-char-length-calculator"
          class="text-gray-500 hover:text-gray-700"
        >
          Source code
        </ExternalLink>
        <span class="text-gray-300">•</span>
        <button
          @click="openAboutDialog"
          class="text-gray-500 hover:text-gray-700"
        >
          About me
        </button>
      </div>
    </div>

    <FeedbackForm
      :is-open="isFeedbackOpen"
      @close="isFeedbackOpen = false"
    />
  </footer>
</template>