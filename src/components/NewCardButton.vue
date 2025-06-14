<script setup lang="ts">
</script>
<template>
  <button @click="$emit('newClick')">
    New Card
  </button>
</template>
<style scoped>
button {
  width: 100%;
  background: var(--color-background-3);
  height: 32px;
  border-radius: 8px;
  border: none;
  font: var(--base-font);
}

button:hover {
  background: var(--color-background-4);
}

button:active {
  transform: scale(0.99);
  background: var(--color-background-4);
  border-color: var(--color-border-active);
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>