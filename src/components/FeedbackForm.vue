<script setup>
import { ref } from 'vue';
import emailjs from '@emailjs/browser';
import Modal from './ui/Modal.vue';
import ExternalLink from './ui/ExternalLink.vue';
import ErrorMessage from './ui/ErrorMessage.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const feedbackType = ref('');
const message = ref('');
const name = ref('');
const email = ref('');
const error = ref('');
const isSubmitting = ref(false);
const success = ref(false);
const highlightType = ref(false);
const highlightMessage = ref(false);

const feedbackTypes = [
  { value: 'bug', label: 'Report a bug' },
  { value: 'suggestion', label: 'Make a suggestion' },
  { value: 'kudos', label: 'Give kudos' },
  { value: 'hi', label: "Just say 'hi'" }
];

const handleSubmit = async () => {
  highlightType.value = !feedbackType.value;
  highlightMessage.value = !message.value;

  if (!feedbackType.value || !message.value) {
    error.value = 'Fill in all required fields';
    return;
  }

  isSubmitting.value = true;
  error.value = '';

  try {
    const templateParams = {
      feedback_type: feedbackType.value,
      message: message.value,
      from_name: name.value || 'Anonymous',
      from_email: email.value || 'Not provided'
    };

    await emailjs.send(
      'service_4wa1mlr',
      'template_zolqgvk',
      templateParams,
      'wDRAXj5G6LhnaXLr3'
    );

    success.value = true;
    setTimeout(() => {
      emit('close');
      // Reset form
      feedbackType.value = '';
      message.value = '';
      name.value = '';
      email.value = '';
      success.value = false;
      highlightType.value = false;
      highlightMessage.value = false;
    }, 2000);
  } catch (e) {
    console.error('Feedback submission error:', e);
    error.value = 'Failed to send feedback, please try again later.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Modal
    :is-open="isOpen"
    title="Give feedback"
    @close="emit('close')"
  >
    <p class="text-sm text-gray-600 mb-6">
      If you prefer, you can leave feedback directly on 
      <ExternalLink href="https://github.com/steroman/max-char-length-calculator/issues/new">GitHub</ExternalLink>.
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Feedback Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Feedback is to <span class="text-red-500">*</span>
        </label>
        <select
          v-model="feedbackType"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
          :class="highlightType ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
          required
        >
          <option value="">Select a type</option>
          <option
            v-for="type in feedbackTypes"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </option>
        </select>
      </div>

      <!-- Message -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Your message <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="message"
          rows="4"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
          :class="highlightMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'"
          required
        ></textarea>
      </div>

      <!-- Contact Information -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-700">Contact info (optional)</h4>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            v-model="name"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            v-model="email"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Error Message -->
      <ErrorMessage :message="error" />

      <!-- Success Message -->
      <p v-if="success" class="text-sm text-green-600">
        Thank you for stopping by!
      </p>
    </form>

    <template #footer>
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 w-full">
        <button
          type="button"
          class="w-full sm:w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full sm:w-auto justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleSubmit"
        >
          {{ isSubmitting ? 'Sending...' : 'Send feedback' }}
        </button>
      </div>
    </template>
  </Modal>
</template>