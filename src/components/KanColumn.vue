<script setup lang="ts">
import { ref, nextTick, computed } from 'vue';
import BaseButton from './BaseButton.vue';
import ButtonStack from './ButtonStack.vue';
import KanCard from './KanCard.vue';
import NewCardButton from './NewCardButton.vue';
import type { Card, Column } from '@/stores/kanboard';
import { useContentEditable } from '@/composables/useContenteditable';
import LastEdit from './LastEdit.vue';

const { focusEndOfElement } = useContentEditable();

const emit = defineEmits<{
  (e: 'addNewCard', id: Column['id']): void
  (e: 'deleteCard', columnId: Column['id'], cardId: Card['id']): void
  (e: 'sortCards', id: Column['id']): void
  (e: 'clearAllCards', id: Column['id']): void
  (e: 'disableEditing', id: Column['id']): void
  (e: 'deleteColumn', id: Column['id']): void
  (e: 'cardUpdated', id: Column['id'], cardId: Card['id']): void
}>();

const { cards, id: columnId, canEdit, updated: lastEdited } = defineProps<{
  cards: Card[],
  id: Column['id'],
  canEdit: boolean,
  updated: number,
}>();

const title = defineModel<string>('title');
const isEditingTitle = ref(false);
const titleElement = ref<HTMLElement>();

const cardsCounter = computed(() => cards.filter(card => !card.isNew).length || '');

function handleTitleDoubleClick() {
  if (isEditingTitle.value || !canEdit) return;

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

function handleDisableEditingClick() {
  emit('disableEditing', columnId);
}

function handleDeleteColumnClick() {
  emit('deleteColumn', columnId);
}

function handleClearAllClick() {
  emit('clearAllCards', columnId)
}

function handleCardUpdated(id: Card['id']) {
  emit('cardUpdated', columnId, id);
}
</script>

<template>
  <div class="column">
    <div class="header">
      <div :class="{ 'title': true, 'disabled': !canEdit }">
        <div ref="titleElement" :class="{ 'title-content': true, }" :contenteditable="isEditingTitle"
          @dblclick="handleTitleDoubleClick" @blur="saveTitle" @keydown="handleKeyDown">
          {{ title }}

        </div>
        <div class="card-counter"> {{ cardsCounter }} </div>

      </div>
      <ButtonStack>
        <BaseButton @click="handleDisableEditingClick"> {{ canEdit ? 'Disable' : 'Enable' }} Editing</BaseButton>
        <BaseButton @click="handleDeleteColumnClick" :disabled="!canEdit">Delete Column</BaseButton>
      </ButtonStack>
    </div>
    <div class='body'>
      <KanCard v-for="card in cards" :key="card.id" @delete-card="handleDeleteExistingCard(card.id)"
        v-model:title="card.title" v-model:content="card.content" :can-edit="canEdit"
        @updated="handleCardUpdated(card.id)" />
      <div v-if="canEdit" class="new-card-button">
        <NewCardButton @new-click="handleNewCardClick" />
      </div>
      <LastEdit v-if="cardsCounter" :class="{ 'disabled': !canEdit }" :last-edited="lastEdited"> Last updated ... ago
      </LastEdit>
    </div>
    <div class="footer">
      <ButtonStack>
        <BaseButton :disabled="!canEdit" @click="emit('sortCards', columnId)">Sort</BaseButton>
        <BaseButton :disabled="!canEdit" @click="handleClearAllClick">Clear All</BaseButton>
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

.disabled {
  opacity: 0.6;
  cursor: auto;
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