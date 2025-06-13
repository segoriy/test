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

function handleDeleteColumn(id: Column['id']) {
  kanBoard.deleteColumn(id);
}

function handleClearAllCards(id: Column['id']) {
  kanBoard.clearAllCards(id);
}

function handleDisableEditingColumn(id: Column['id']) {
  kanBoard.toggleEditing(id);
}

</script>
<template>
  <div class="kanboard">
    <KanColumn v-for="column in kanBoard.columns" :key="column.id" :id="column.id" :cards="column.cards"
      :can-edit="column.canEdit" v-model:title="column.title" @add-new-card="handleAddNewCard"
      @delete-card="handleDeleteCard" @delete-column="handleDeleteColumn" @clear-all-cards="handleClearAllCards"
      @disable-editing="handleDisableEditingColumn" class="column">
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