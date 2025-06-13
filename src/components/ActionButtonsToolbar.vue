<script setup lang="ts">
import { useKanBoardStore, type Card, type Column } from '@/stores/kanboard'
import BaseButton from './BaseButton.vue'
import ButtonStack from './ButtonStack.vue'

const kanBoard = useKanBoardStore();

function handleAddNewColumnClick() {
  kanBoard.addColumn();
};

</script>
<template>
  <ButtonStack>
    <BaseButton> Shuffle Columns</BaseButton>
    <BaseButton @click="handleAddNewColumnClick"> New Column </BaseButton>
    <BaseButton> Shuffle Cards</BaseButton>
    <BaseButton> Disable Editing </BaseButton>
  </ButtonStack>
</template>
<style scoped></style>