<script setup lang="ts">
</script>
<template>
  <div class="stack">
    <slot name="default"> </slot>
  </div>
</template>
<style scoped>
.stack {
  display: flex;
  flex-direction: row;
  column-gap: var(--stack-gap);
}
</style>