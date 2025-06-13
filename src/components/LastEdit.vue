<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const { lastEdited } = defineProps<{
  lastEdited: number
}>();

const now = ref(Date.now());
let intervalId: number;

const timeAgo = computed(() => {
  const diffInMs = now.value - lastEdited;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 1) {
    return 'Last edit just now';
  } else if (diffInMinutes < 60) {
    return `Last edit ${diffInMinutes} min ago`;
  } else {
    return `last edit ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
});

onMounted(() => {
  intervalId = window.setInterval(() => {
    now.value = Date.now();
  }, 60000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
<template>
  <div class="last-updated"> {{ timeAgo }}</div>
</template>
<style scoped>
.last-updated {
  color: var(--color-text-secondary);
  margin: 8px auto;
}
</style>