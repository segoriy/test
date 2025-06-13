<script setup lang="ts">
import { useKanBoardStore, type Card, type Column } from '@/stores/kanboard'
import BaseButton from './BaseButton.vue'
import ButtonStack from './ButtonStack.vue'

const kanBoard = useKanBoardStore();

function handleAddNewColumnClick() {
  kanBoard.addColumn();
};

function handleToggleEditingClick() {
  kanBoard.toggleEditingAll();
};

function handleShuffleColumnsClick() {
  kanBoard.shuffleColumns();
};

function handleShuffleCardsClick() {
  kanBoard.shuffleCards();
};

</script>
<template>
  <ButtonStack>
    <BaseButton @click="handleAddNewColumnClick"> New Column </BaseButton>
    <BaseButton :disabled="!kanBoard.columns.length" @click="handleToggleEditingClick"> {{ kanBoard.canEditAll ?
      'Disable' : 'Enable' }} Editing
    </BaseButton>
    <BaseButton @click="handleShuffleColumnsClick"> Shuffle Columns</BaseButton>
    <BaseButton @click="handleShuffleCardsClick"> Shuffle Cards</BaseButton>
  </ButtonStack>
</template>
<style scoped></style>