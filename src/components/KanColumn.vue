<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from './BaseButton.vue';
import ButtonStack from './ButtonStack.vue';
import KanCard from './KanCard.vue';
import NewCardButton from './NewCardButton.vue';
import type { Card, Column } from '@/stores/kanboard';

const emit = defineEmits<{
  (e: 'addNewCard', id: Column['id']): void
  (e: 'deleteCard', columnId: Column['id'], cardId: Card['id']): void
  (e: 'sortCards', id: Column['id']): void
  (e: 'clearAllCards', id: Column['id']): void
  (e: 'disableEditing', id: Column['id']): void
  (e: 'deleteColumn', id: Column['id']): void
}>();

const { cards, id: columnId } = defineProps<{
  cards: Card[],
  id: Column['id'],
}>();

const cardsCounter = computed(() => cards.length);

function handleNewCardClick(event) {
  emit('addNewCard', columnId);
}

function handleDeleteExistingCard(id: Card['id']) {
  emit('deleteCard', columnId, id);
}

</script>
<template>
  <div class="column">
    <div class="header">
      <div class="title">
        <p>
          <slot name="title">
            TOdO
          </slot>
          <span class="card-counter"> {{ cardsCounter }} </span>
        </p>
      </div>
      <ButtonStack>
        <BaseButton>Disable Editing</BaseButton>
        <BaseButton>Delete Column</BaseButton>
      </ButtonStack>
    </div>
    <div class='body'>
      <KanCard v-for="card in cards" :key="card.id" @delete-card="handleDeleteExistingCard(card.id)"
        v-model:title="card.title" v-model:content="card.content"> {{ card.title }}
      </KanCard>
      <div class="new-card-button">
        <NewCardButton @new-click="handleNewCardClick" />
      </div>
      <div class="last-updated">

      </div>
    </div>
    <div class="footer">
      <ButtonStack>
        <BaseButton> Sort </BaseButton>
        <BaseButton> Clear All </BaseButton>
      </ButtonStack>
    </div>
  </div>
</template>
<style scoped>
.column {
  display: flex;
  height: 100%;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: var(--column-width);
  scroll-snap-align: start;
  padding: var(--column-padding);
  background: var(--color-background-column);
  border-radius: 12px;
}

.header {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  margin-bottom: 16px;
}

.title {
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.card-counter {
  margin-left: 8px;
  color: var(--color-text-counter)
}

.body {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  row-gap: 8px;
}

.footer {
  margin-top: auto;
  justify-items: center;
}
</style>