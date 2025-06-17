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
  padding-bottom: var(--main-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: var(--kanboard-column-gap);
  height: 100vh;
  background: linear-gradient(to bottom, transparent 0%, var(--color-background-2) 100%);
  background-size: 100% 150px;
  background-repeat: no-repeat;
  background-position: bottom;
}
</style>