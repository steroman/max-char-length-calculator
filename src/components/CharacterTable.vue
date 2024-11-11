<script setup>
defineProps({
  headers: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  maxHeight: {
    type: String,
    default: '80vh'
  }
});
</script>

<template>
  <div class="border border-gray-200 rounded-lg">
    <div class="overflow-x-auto px-0.5 py-0.5">
      <div class="align-middle">
        <div class="overflow-hidden">
          <div :style="{ maxHeight }" class="overflow-y-auto pr-0.5">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th
                    v-for="header in headers"
                    :key="header.key"
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                    :class="header.class"
                  >
                    {{ header.label }}
                    <slot :name="`header-${header.key}`"></slot>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="(row, index) in data" :key="index">
                  <td
                    v-for="header in headers"
                    :key="header.key"
                    class="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500"
                    :class="header.class"
                  >
                    <slot :name="`cell-${header.key}`" :row="row">
                      {{ row[header.key] }}
                    </slot>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>