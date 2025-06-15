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
  <ButtonStack>
    <BaseButton @click="handleAddNewColumnClick"> <IconAdd /> New Column </BaseButton>
    <BaseButton
      :disabled="!kanBoard.columns.length"
      @click="handleToggleEditingClick"
    >
      <IconPause v-if="kanBoard.canEditAll" />
      <IconPlay v-else />
      {{ kanBoard.canEditAll ? 'Disable' : 'Enable' }} Editing
    </BaseButton>
    <BaseButton @click="handleShuffleColumnsClick"> <IconShuffle /> Shuffle Columns</BaseButton>
    <BaseButton @click="handleShuffleCardsClick"> <IconShuffle /> Shuffle Cards</BaseButton>
  </ButtonStack>
</template>
<style scoped></style>
