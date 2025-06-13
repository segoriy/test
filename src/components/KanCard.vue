<script setup lang="ts">
import { ref, nextTick } from 'vue';
import ButtonStack from './ButtonStack.vue';
import BaseButton from './BaseButton.vue';
import IconDrag from './icons/IconDrag.vue';
import { useContentEditable } from '@/composables/useContenteditable';

const { focusEndOfElement } = useContentEditable();

const titleModel = defineModel<string>('title');
const contentModel = defineModel<string>('content');

const { canEdit = true } = defineProps<{
  canEdit?: boolean
}>();

const emit = defineEmits<{
  (e: 'delete-card'): void,
}>()

const isButtonsVisible = ref(false);
const isDraggable = ref(false);
const isEditing = ref(false);
const hasChanges = ref(false);

const titleElement = ref<HTMLElement>();
const contentElement = ref<HTMLElement>();
const lastClickTarget = ref<HTMLElement | null>(null);

const originalTitle = ref(titleModel.value || '');
const originalContent = ref(contentModel.value || '');

function handleDoubleClick(event: MouseEvent) {
  if (!canEdit || isEditing.value) return;

  lastClickTarget.value = event.target as HTMLElement;
  startEditing();
}

function startEditing() {
  isEditing.value = true;
  isButtonsVisible.value = true;

  originalTitle.value = titleModel.value || '';
  originalContent.value = contentModel.value || '';

  checkChanges();

  nextTick(() => {
    const target = lastClickTarget.value;
    if (!target) {
      contentElement.value?.focus();
      return;
    }

    const clickedTitle = target.closest('.title');

    if (clickedTitle && titleElement.value) {
      focusEndOfElement(titleElement);
    } else if (contentElement.value) {
      focusEndOfElement(contentElement);
    }
  });
}

function saveChanges() {
  if (!titleElement.value || !contentElement.value) return;

  titleModel.value = titleElement.value.innerText || '';
  contentModel.value = contentElement.value.innerText || '';

  cancelEditing();
}

function cancelEditing() {
  isEditing.value = false;
  isButtonsVisible.value = false;

  if (titleElement.value) titleElement.value.innerText = originalTitle.value || '';
  if (contentElement.value) contentElement.value.innerText = originalContent.value || '';
}

function checkChanges() {
  if (!titleElement.value || !contentElement.value) return;

  hasChanges.value =
    titleElement.value.innerText !== originalTitle.value ||
    contentElement.value.innerText !== originalContent.value;
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    cancelEditing();
    e.preventDefault();
    e.stopPropagation();
  } else if (e.key === 'Enter' && e.shiftKey && e.target === contentElement.value) {
    saveChanges();
    e.preventDefault();
  }
}

function handleContext(event: Event) {
  if (blockEvent(event)) return;
  emit('delete-card');
}

function blockEvent(event: Event) {
  if (canEdit) return false;
  event.preventDefault();
  event.stopPropagation();
  return true;
}
</script>

<template>
  <div :class="{
    card: true,
    'card-disabled': !canEdit,
    'editing-mode': isEditing,
  }" @mousedown="blockEvent" @keydown="handleKeyDown" @contextmenu.prevent.stop="handleContext"
    @dblclick="handleDoubleClick">
    <div :class="{
      title: true,
      'is-draggable': !isDraggable,
    }">
      <div class="title-content" ref="titleElement" :contenteditable="isEditing" @input="checkChanges">
        {{ titleModel }}
      </div>
    </div>
    <div v-if="isDraggable" class="drag-icon">
      <IconDrag />
    </div>
    <div class="content" ref="contentElement" :contenteditable="isEditing" @input="checkChanges">
      {{ contentModel }}
    </div>

    <template v-if="isButtonsVisible">
      <ButtonStack>
        <BaseButton @click="saveChanges" :disabled="!hasChanges">
          Save
        </BaseButton>
        <BaseButton @click="cancelEditing">
          Cancel
        </BaseButton>
      </ButtonStack>
    </template>
  </div>
</template>

<style scoped>
.card {
  background: var(--color-background);
  border-radius: 8px;
  border: none;
  padding: 16px;
  cursor: pointer;
}

.card.editing-mode {
  border: 2px solid var(--k-c-blue);
}

.card.card-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.title {
  display: flex;
  flex-direction: row;
  outline: none;
}

.title-content {
  white-space: pre-wrap;
}

.title:not(.is-draggable) {
  margin-right: 4px;
}

.title-content[contenteditable="true"]:focus,
.content[contenteditable="true"]:focus {
  outline: none;
}

.editing-mode .title,
.editing-mode .content {
  cursor: text;
}

.drag-icon {
  margin-left: auto;
}

.content {
  margin: 8px 0;
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  outline: none;
}
</style>