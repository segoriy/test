<script setup lang="ts">
import { useKanBoardStore, type Card, type Column } from '@/stores/kanboard'
import BaseButton from './BaseButton.vue'
import ButtonStack from './ButtonStack.vue'
import IconAdd from './icons/IconAdd.vue'
import IconShuffle from './icons/IconShuffle.vue'
import IconPlay from './icons/IconPlay.vue'
import IconPause from './icons/IconPause.vue'

const kanBoard = useKanBoardStore()

function handleAddNewColumnClick() {
  kanBoard.addColumn()
}

function handleToggleEditingClick() {
  kanBoard.toggleEditingAll()
}

function handleShuffleColumnsClick() {
  kanBoard.shuffleColumns()
}

function handleShuffleCardsClick() {
  kanBoard.shuffleCards()
}
</script>
<template>
  <div class="actions">
    <ButtonStack>
      <BaseButton @click="handleShuffleColumnsClick">
        <IconShuffle /> Shuffle Columns</BaseButton>
      <BaseButton @click="handleAddNewColumnClick"> <IconAdd /> New Column </BaseButton>
      <BaseButton @click="handleShuffleCardsClick"> <IconShuffle /> Shuffle Cards</BaseButton>
      <BaseButton :disabled="!kanBoard.columns.length" @click="handleToggleEditingClick">
        <IconPause />
        Disable Editing
      </BaseButton>
    </ButtonStack>
    <span class="text-secondary">Board Actions</span>
  </div>
</template>
<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  align-items: center;
}
</style>
