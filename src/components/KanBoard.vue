<script setup lang="ts">
import { useKanBoardStore, type Card, type Column } from '@/stores/kanboard'
import KanColumn from './KanColumn.vue';

const kanBoard = useKanBoardStore();

function handleAddNewCard(id: Column['id']) {
  kanBoard.addNewCard(id);
}

function handleDeleteCard(id: Column['id'], cardId: Card['id']) {
  kanBoard.deleteCard(id, cardId);
}

</script>
<template>
  <div class="kanboard">
    <KanColumn v-for="{ id, cards } in kanBoard.columns" :key="id" :id="id" :cards="cards"
      @add-new-card="handleAddNewCard" @delete-card="handleDeleteCard" class="column">
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