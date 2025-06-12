<script setup lang="ts">
</script>
<template>
  <button>
    <slot name="default"> Base Button </slot>
  </button>
</template>
<style scoped>
button {
  padding: 4px;
  padding-right: 8px;
  overflow: hidden;
  color: var(--color-text);
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 50px;
  font: 600 13px/13px Inter, sans-serif;
}

button[data-v-2d3a2488]:active {
  transform: scale(0.99);
  background: var(--k-c-grey);
  border-color: var(--color-border-active);
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>