<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import type { Card, Column, SortType } from '@/stores/kanboard'
import { useContentEditable } from '@/composables/useContenteditable'
import BaseButton from './BaseButton.vue'
import ButtonStack from './ButtonStack.vue'
import KanCard from './KanCard.vue'
import NewCardButton from './NewCardButton.vue'
import LastEdit from './LastEdit.vue'
import IconDelete from './icons/IconDelete.vue'
import IconPlay from './icons/IconPlay.vue'
import IconPause from './icons/IconPause.vue'
import IconSort from './icons/IconSort.vue'

const { focusEndOfElement } = useContentEditable()

const {
  cards,
  id: columnId,
  canEdit,
  updated: lastEdited,
  sortType = 'none',
} = defineProps<{
  cards: Card[]
  id: Column['id']
  canEdit: boolean
  updated: number
  sortType?: SortType
}>()

const emit = defineEmits<{
  (e: 'addNewCard', id: Column['id']): void
  (e: 'deleteCard', columnId: Column['id'], cardId: Card['id'], force: boolean): void
  (e: 'sortCards', id: Column['id']): void
  (e: 'clearAllCards', id: Column['id']): void
  (e: 'disableEditing', id: Column['id']): void
  (e: 'deleteColumn', id: Column['id']): void
  (e: 'cardUpdated', id: Column['id'], cardId: Card['id']): void
  (e: 'sortCards', id: Column['id']): void
  (
    e: 'moveCard',
    payload: {
      fromColumnId: Column['id']
      cardId: Card['id']
      toColumnId: Column['id']
      position: number
    },
  ): void
}>()

const title = defineModel<string>('title')

const isEditingTitle = ref(false)
const titleElement = ref<HTMLElement>()
const columnElement = ref<HTMLElement>()

const cardsCounter = computed(() => cards.filter((card) => !card.isNew).length || '')

function handleTitleDoubleClick() {
  if (isEditingTitle.value || !canEdit) return

  isEditingTitle.value = true
  nextTick(() => {
    if (titleElement.value) {
      focusEndOfElement(titleElement)
    }
  })
}

function saveTitle() {
  if (!isEditingTitle.value || !titleElement.value) return

  const newTitle = titleElement.value.textContent?.trim() || ''
  title.value = newTitle
  isEditingTitle.value = false
}

function cancelEditTitle() {
  if (!titleElement.value) return

  titleElement.value.innerText = title.value || ''
  isEditingTitle.value = false
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    saveTitle()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    cancelEditTitle()
  }
}

function handleNewCardClick() {
  emit('addNewCard', columnId)
}

function handleDeleteExistingCard(id: Card['id'], force: boolean) {
  emit('deleteCard', columnId, id, force)
}

function handleDisableEditingClick() {
  emit('disableEditing', columnId)
}

function handleDeleteColumnClick() {
  emit('deleteColumn', columnId)
}

function handleClearAllClick() {
  emit('clearAllCards', columnId)
}

function handleCardUpdated(id: Card['id']) {
  emit('cardUpdated', columnId, id)
}

function handleSortCardsClick() {
  emit('sortCards', columnId)
}

function handleDragOver(e: DragEvent) {
  if (!canEdit) return
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  if (!canEdit) return

  const data = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}')
  if (!data.cardId || !data.columnId) return

  const rect = columnElement.value?.getBoundingClientRect()
  if (!rect) return

  const mouseY = e.clientY - rect.top
  const cards = Array.from(columnElement.value?.querySelectorAll('.card') || [])

  let targetIndex = -1
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i] as HTMLElement
    const cardRect = card.getBoundingClientRect()
    const cardMiddle = (cardRect.top + cardRect.bottom) / 2 - rect.top

    if (mouseY < cardMiddle) {
      targetIndex = i
      break
    }
  }

  if (targetIndex === -1) {
    targetIndex = cards.length
  }

  emit('moveCard', {
    fromColumnId: data.columnId,
    cardId: data.cardId,
    toColumnId: columnId,
    position: targetIndex,
  })
}
</script>

<template>
  <div
    ref="columnElement"
    class="column"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <div class="header">
      <div :class="{ title: true, disabled: !canEdit }">
        <div
          ref="titleElement"
          :class="{ 'title-content': true }"
          :contenteditable="isEditingTitle"
          @dblclick="handleTitleDoubleClick"
          @blur="cancelEditTitle"
          @keydown="handleKeyDown"
        >
          {{ title }}
        </div>
        <div class="card-counter">{{ cardsCounter }}</div>
      </div>
      <ButtonStack>
        <BaseButton @click="handleDisableEditingClick">
          <IconPause v-if="canEdit" />
          <IconPlay v-else />
          {{ canEdit ? 'Disable' : 'Enable' }} Editing</BaseButton
        >
        <BaseButton
          @click="handleDeleteColumnClick"
          :disabled="!canEdit"
        >
          <IconDelete />
          Delete Column
        </BaseButton>
      </ButtonStack>
    </div>
    <TransitionGroup
      name="kan-card"
      tag="div"
      class="body"
    >
      <KanCard
        v-for="card in cards"
        :key="card.id"
        v-model:title="card.title"
        v-model:content="card.content"
        :can-edit
        :is-new="card.isNew"
        :card-id="card.id"
        :column-id="columnId"
        @updated="handleCardUpdated(card.id)"
        @delete-card="(force) => handleDeleteExistingCard(card.id, force)"
      />
      <div
        v-if="canEdit"
        class="new-card-button"
      >
        <NewCardButton @new-click="handleNewCardClick" />
      </div>
      <LastEdit
        v-if="cardsCounter"
        :class="{ disabled: !canEdit }"
        :last-edited
      />
    </TransitionGroup>
    <div class="footer">
      <ButtonStack>
        <BaseButton
          :disabled="!canEdit || !cards.length"
          @click="handleSortCardsClick"
        >
          <IconSort :sort-type />
          Sort
          <span class="text-secondary">
            {{ sortType === 'asc' ? 'ascending' : sortType === 'desc' ? 'descending' : '' }}
          </span>
        </BaseButton>
        <BaseButton
          :disabled="!canEdit || !cards.length"
          @click="handleClearAllClick"
        >
          <IconDelete />
          Clear All
        </BaseButton>
      </ButtonStack>
    </div>
  </div>
</template>

<style scoped>
.column {
  display: flex;
  min-height: 100px;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: var(--column-width);
  scroll-snap-align: start;
  padding: var(--column-padding);
  background: var(--color-background-1);
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
  align-items: center;
}

.disabled {
  opacity: 0.6;
}

.title-content {
  color: var(--color-text-secondary);
  text-transform: uppercase;
}
.title:not(.disabled) .title-content:hover {
  color: var(--color-text);
  cursor: pointer;
}

.title-content[contenteditable='true'] {
  color: var(--color-text);
  cursor: text;
  outline: none;
}

.card-counter {
  margin: 0 6px;
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
  margin-bottom: 4px;
}

.footer {
  margin-top: auto;
  justify-items: center;
}

.kan-card-move {
  transition: all 0.2s ease;
  will-change: transform;
}

.kan-card-enter-active {
  transition: all 0.1s ease-out;
}

.kan-card-leave-active {
  transition: all 0.1s ease-in;
  transform: translateX(-20px);
}

.kan-card-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.kan-card-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
