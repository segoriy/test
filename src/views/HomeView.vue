<script setup lang="ts">
import KanBoard from '../components/KanBoard.vue';
import ActionButtonsToolbar from '../components/ActionButtonsToolbar.vue';
</script>

<template>
  <main class="wrapper">
    <KanBoard></KanBoard>
    <ActionButtonsToolbar></ActionButtonsToolbar>
  </main>
</template>

<style scoped>
.wrapper {
  padding: var(--main-padding);
  padding-bottom: calc(var(--main-padding) + 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: var(--kanboard-column-gap);
  height: 100vh;
}
</style>