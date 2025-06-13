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

</script>
<template>
  <ButtonStack>
    <BaseButton @click="handleAddNewColumnClick"> New Column </BaseButton>
    <BaseButton :disabled="!kanBoard.columns.length" @click="handleToggleEditingClick"> {{ kanBoard.canEditAll ?
      'Disable' : 'Enable' }} Editing
    </BaseButton>
    <BaseButton> Shuffle Columns</BaseButton>
    <BaseButton> Shuffle Cards</BaseButton>
  </ButtonStack>
</template>
<style scoped></style>