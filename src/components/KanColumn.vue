<script setup lang="ts">
</script>
<template>
  <div class="column">
    Column
  </div>
</template>
<style scoped>
.column {
  box-sizing: border-box;
  display: flex;
  height: 100%;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: var(--column-width);
  scroll-snap-align: start;
  padding: var(--column-padding);
  background: var(--color-background-column);
  border-radius: 12px;
}
</style>