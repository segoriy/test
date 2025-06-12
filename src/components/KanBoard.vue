<script setup lang="ts">
import { useKanBoardStore } from '@/stores/kanboard'
import KanColumn from './KanColumn.vue';

const kanBoard = useKanBoardStore();

</script>
<template>
  <div class="kanboard">
    <KanColumn v-for="column in kanBoard.columns" :key="column.id" class="column">
    </KanColumn>
  </div>
</template>
<style scoped>
.kanboard {
  width: 100%;
  overflow-x: auto;
  flex-grow: 1;
  scroll-snap-type: x proximity;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: var(--kanboard-column-gap);
  align-items: flex-start;
  justify-content: flex-start;
}
</style>