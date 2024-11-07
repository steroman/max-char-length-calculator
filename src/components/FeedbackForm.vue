<script setup>
import { ref } from 'vue';
import emailjs from '@emailjs/browser';
import Modal from './ui/Modal.vue';
import ExternalLink from './ui/ExternalLink.vue';

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

const feedbackTypes = [
  { value: 'bug', label: 'Report a bug' },
  { value: 'suggestion', label: 'Make a suggestion' },
  { value: 'kudos', label: 'Give kudos' },
  { value: 'hi', label: 'Just want to say hi' }
];

const handleSubmit = async () => {
  if (!feedbackType.value || !message.value) {
    error.value = 'Please fill in all required fields';
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
      'service_4wa1mlr', // Service ID
      'template_zolqgvk', // Template ID
      templateParams,
      'wDRAXj5G6LhnaXLr3' // Public Key
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
    }, 2000);
  } catch (e) {
    console.error('Feedback submission error:', e);
    error.value = 'Failed to send feedback. Please try again later.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Modal
    :is-open="isOpen"
    title="Give Feedback"
    @close="emit('close')"
  >
    <p class="text-sm text-gray-600 mb-6">
      If you prefer, you can leave feedback directly
      <ExternalLink href="https://github.com/steroman/max-char-length-calculator/issues/new">on GitHub</ExternalLink>
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Feedback Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Type of feedback <span class="text-red-500">*</span>
        </label>
        <select
          v-model="feedbackType"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
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
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
          required
        ></textarea>
      </div>

      <!-- Contact Information -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-700">Contact Information (optional)</h4>
        
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
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <!-- Success Message -->
      <p v-if="success" class="text-sm text-green-600">
        Thank you for your feedback!
      </p>
    </form>

    <template #footer>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleSubmit"
      >
        {{ isSubmitting ? 'Sending...' : 'Send Feedback' }}
      </button>
      <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        @click="emit('close')"
      >
        Cancel
      </button>
    </template>
  </Modal>
</template>