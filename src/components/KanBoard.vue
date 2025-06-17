<script setup lang="ts">
import { useKanBoardStore, type Card, type Column } from '@/stores/kanboard'
import KanColumn from './KanColumn.vue'
import BaseDialog from './BaseDialog.vue'
import { ref } from 'vue'


const kanBoard = useKanBoardStore()

const isDialogVisible = ref(false)

let callback: Function = () => {};

function handleAddNewCard(id: Column['id']) {
  kanBoard.addNewCard(id)
}

function handleDeleteCard(id: Column['id'], cardId: Card['id'], force: boolean) {
  callback = () => kanBoard.deleteCard(id, cardId)
  if (force) {
    callback();
  } else {
    isDialogVisible.value = true;
  }
}

function handleDeleteColumn(id: Column['id']) {
  isDialogVisible.value = true;
  callback = () => kanBoard.deleteColumn(id);
}

function handleClearAllCards(id: Column['id']) {
  isDialogVisible.value = true;
  callback = () => kanBoard.clearAllCards(id);
}

function handleDisableEditingColumn(id: Column['id']) {
  kanBoard.toggleEditing(id)
}

function handleCardUpdated(id: Column['id'], cardId: Card['id']) {
  kanBoard.handleCardUpdated(id, cardId)
}

function handleDialogApply() {
  if (callback) callback();
}

function handleMoveCard({ fromColumnId, cardId, toColumnId, position }: { 
  fromColumnId: number, 
  cardId: number, 
  toColumnId: number, 
  position: number 
}) {
 kanBoard.moveCard({ fromColumnId, cardId, toColumnId, position });
}
</script>
<template>
  <BaseDialog
      v-model="isDialogVisible"
      title="Warning"
      content="Are you sure you want to perform this action?"
      @onApply="handleDialogApply"
    />
  <TransitionGroup
    name="column"
    tag="div"
    class="kanboard"
  >
    <KanColumn
      v-for="column in kanBoard.columns"
      :key="column.id"
      :id="column.id"
      :cards="column.cards"
      :updated="column.updated"
      :can-edit="column.canEdit"
      v-model:title="column.title"
      @add-new-card="handleAddNewCard"
      @delete-card="handleDeleteCard"
      @delete-column="handleDeleteColumn"
      @clear-all-cards="handleClearAllCards"
      @disable-editing="handleDisableEditingColumn"
      @card-updated="handleCardUpdated"
      @move-card="handleMoveCard"
      class="column"
    >
    </KanColumn>
  </TransitionGroup>
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

.column-move {
  transition: transform 0.3s ease;
}

.column-enter-active,
.column-leave-active {
  transition: all 0.2s ease;
}

.column-enter-from,
.column-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.column-leave-active {
  transform: translateY(-20px);
}
</style>
