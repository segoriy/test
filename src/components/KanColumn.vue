<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import BaseButton from './BaseButton.vue';
import ButtonStack from './ButtonStack.vue';
import KanCard from './KanCard.vue';
import NewCardButton from './NewCardButton.vue';
import type { Card, Column } from '@/stores/kanboard';
import { useContentEditable } from '@/composables/useContenteditable';

const { focusEndOfElement } = useContentEditable();

const emit = defineEmits<{
  (e: 'addNewCard', id: Column['id']): void
  (e: 'deleteCard', columnId: Column['id'], cardId: Card['id']): void
  (e: 'sortCards', id: Column['id']): void
  (e: 'clearAllCards', id: Column['id']): void
  (e: 'disableEditing', id: Column['id']): void
  (e: 'deleteColumn'): void
  (e: 'updateColumnTitle', id: Column['id'], title: string): void
}>();

const { cards, id: columnId } = defineProps<{
  cards: Card[],
  id: Column['id'],
}>();

const title = defineModel<string>('title');
const isEditingTitle = ref(false);
const titleElement = ref<HTMLElement>();

const cardsCounter = computed(() => cards.length || '');

function handleTitleDoubleClick() {
  if (isEditingTitle.value) return;

  isEditingTitle.value = true;
  nextTick(() => {
    if (titleElement.value) {
      focusEndOfElement(titleElement);
    }
  });
}

function saveTitle() {
  if (!isEditingTitle.value || !titleElement.value) return;
  const newTitle = titleElement.value.textContent?.trim() || '';
  title.value = newTitle;
  isEditingTitle.value = false;
}

function cancelEditTitle() {
  if (!titleElement.value) return;
  titleElement.value.innerText = title.value || '';
  isEditingTitle.value = false;
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveTitle();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    cancelEditTitle();
  }
}

function handleNewCardClick() {
  emit('addNewCard', columnId);
}

function handleDeleteExistingCard(id: Card['id']) {
  emit('deleteCard', columnId, id);
}

function handleDeleteColumnClick() {
  emit('deleteColumn');
}

function handleClearAllClick() {
  emit('clearAllCards', columnId)
}
</script>

<template>
  <div class="column">
    <div class="header">
      <div class="title">
        <div ref="titleElement" class="title-content" :contenteditable="isEditingTitle"
          @dblclick="handleTitleDoubleClick" @blur="saveTitle" @keydown="handleKeyDown">
          {{ title }}

        </div>
        <div class="card-counter"> {{ cardsCounter }} </div>

      </div>
      <ButtonStack>
        <BaseButton @click="emit('disableEditing', columnId)">Disable Editing</BaseButton>
        <BaseButton @click="handleDeleteColumnClick">Delete Column</BaseButton>
      </ButtonStack>
    </div>
    <div class='body'>
      <KanCard v-for="card in cards" :key="card.id" @delete-card="handleDeleteExistingCard(card.id)"
        v-model:title="card.title" v-model:content="card.content" />
      <div class="new-card-button">
        <NewCardButton @new-click="handleNewCardClick" />
      </div>
    </div>
    <div class="footer">
      <ButtonStack>
        <BaseButton @click="emit('sortCards', columnId)">Sort</BaseButton>
        <BaseButton @click="handleClearAllClick">Clear All</BaseButton>
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
  display: flex;
  flex-direction: row;
}

.title-content {
  color: var(--color-text-secondary);
  text-transform: uppercase;
  cursor: pointer;
}

.title-content[contenteditable="true"] {
  cursor: text;
  outline: none;
}

.card-counter {
  margin-left: 8px;
  color: var(--color-text-counter);
  user-select: none;
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