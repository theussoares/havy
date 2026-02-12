<script setup lang="ts">
import { ref, onMounted } from 'vue';

const items = ref<number[]>([]);
const loading = ref(true);

onMounted(() => {
  // Simulate heavy computation/loading
  setTimeout(() => {
    items.value = Array.from({ length: 1000 }, (_, i) => i);
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <div class="heavy-widget">
    <h3 class="text-xl font-bold mb-4">Heavy Widget (Remote)</h3>
    <div v-if="loading" class="p-4 bg-yellow-100 rounded">
      Loading massive data...
    </div>
    <div v-else class="h-64 overflow-y-auto border p-2">
      <div v-for="item in items" :key="item" class="p-1 border-b">
        Item #{{ item }} (Rendered from Remote)
      </div>
    </div>
  </div>
</template>

<style scoped>
.heavy-widget {
  padding: 1rem;
  background: #fdfdfd;
  border: 1px dashed #ccc;
}
</style>
