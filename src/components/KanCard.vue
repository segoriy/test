<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import { useContentEditable } from '@/composables/useContenteditable'
import ButtonStack from './ButtonStack.vue'
import BaseButton from './BaseButton.vue'
import IconDrag from './icons/IconDrag.vue'
import IconCancel from './icons/IconCancel.vue'
import IconApply from './icons/IconApply.vue'

const { focusEndOfElement } = useContentEditable()

const {
  canEdit = true,
  isNew = true,
  cardId,
  columnId,
} = defineProps<{
  canEdit?: boolean
  isNew?: boolean
  cardId?: number
  columnId?: number
}>()

const emit = defineEmits<{
  (e: 'delete-card', force: boolean): void
  (e: 'updated'): void
}>()

const titleModel = defineModel<string>('title')
const contentModel = defineModel<string>('content')


const isButtonsVisible = ref(false)
const isDraggable = ref(true)
const isEditing = ref(false)
const hasChanges = ref(false)
const isDragging = ref(false)
const clickOffset = ref({ x: 0, y: 0 });

const titleElement = ref<HTMLElement>()
const contentElement = ref<HTMLElement>()
const lastClickTarget = ref<HTMLElement | null>(null)
const cardElement = ref<HTMLElement>()
const dragIconElement = ref<HTMLElement>()

const originalTitle = computed(() => titleModel.value || '')
const originalContent = computed(() => contentModel.value || '')

watch(
  () => canEdit,
  (newVal, old) => {
    if (newVal === false) {
      cancelEditing()
    }
  },
)

onMounted(() => {
  if (!isNew || !canEdit || isEditing.value) return
  startEditing()
})

function handleDoubleClick(event: MouseEvent) {
  if (!canEdit || isEditing.value) return

  lastClickTarget.value = event.target as HTMLElement
  startEditing()
}

function startEditing() {
  if (!canEdit) return

  isEditing.value = true
  isButtonsVisible.value = true

  checkChanges()

  nextTick(() => {
    const target = lastClickTarget.value
    if (!target) {
      contentElement.value?.focus()
      return
    }

    const clickedTitle = target.closest('.title')

    if (clickedTitle && titleElement.value) {
      focusEndOfElement(titleElement)
    } else if (contentElement.value) {
      focusEndOfElement(contentElement)
    }
  })
}

function handleSaveClick() {
  saveChanges()
}

function saveChanges() {
  if (!titleElement.value || !contentElement.value) return

  titleModel.value = titleElement.value.innerText || ''
  contentModel.value = contentElement.value.innerText || ''

  cancelEditing()
  emit('updated')
}

function handleCancelClick() {
  if (isNew) {
    emit('delete-card', true)
    return
  }
  cancelEditing()
}

function cancelEditing() {
  isEditing.value = false
  isButtonsVisible.value = false

  if (titleElement.value) titleElement.value.innerText = originalTitle.value || ''
  if (contentElement.value) contentElement.value.innerText = originalContent.value || ''
}

function checkChanges() {
  if (!titleElement.value || !contentElement.value) return

  hasChanges.value =
    titleElement.value.innerText !== originalTitle.value ||
    contentElement.value.innerText !== originalContent.value
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (isNew) {
      emit('delete-card', true)
      return
    }
    cancelEditing()
    e.preventDefault()
    e.stopPropagation()
  } else if (e.key === 'Enter' && e.target === contentElement.value) {
    saveChanges()
    e.preventDefault()
  }
}

function handleContext(event: Event) {
  if (blockEvent(event)) return

  emit('updated')
  const force = isNew
  emit('delete-card', force)
}

function blockEvent(event: Event) {
  if (canEdit) return false

  event.preventDefault()
  event.stopPropagation()
  return true
}

function handleDragStart(e: DragEvent) {
  if (!canEdit || !isDraggable.value || e.target !== dragIconElement.value) {
    e.preventDefault()
    return
  }
   const dragImage = cardElement.value?.cloneNode(true) as HTMLElement;
  if (dragImage && cardElement.value && e.target) {
    const cardRect = cardElement.value.getBoundingClientRect();
    
    clickOffset.value = {
      x: e.clientX - cardRect.left,
      y: e.clientY - cardRect.top
    };
    dragImage.style.position = 'fixed';
    dragImage.style.top = '-9999px';
    dragImage.style.width = `${cardRect.width}px`;
    dragImage.style.opacity = '0.9';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    dragImage.style.transform = 'rotate(2deg)';
    dragImage.style.zIndex = '9999';
    document.body.appendChild(dragImage);

    e.dataTransfer?.setDragImage(dragImage, clickOffset.value.x, clickOffset.value.y);
    
    setTimeout(() => document.body.removeChild(dragImage), 0);
  }

  e.dataTransfer?.setData(
    'text/plain',
    JSON.stringify({
      cardId,
      columnId,
    }),
  )
  e.dataTransfer!.effectAllowed = 'move'

  setTimeout(() => {
    isDragging.value = true
  }, 0)
}

function handleDragEnd() {
  isDragging.value = false
}
</script>

<template>
  <div
    ref="cardElement"
    :class="{
      card: true,
      'card-disabled': !canEdit,
      'editing-mode': isEditing,
    }"
    @contextmenu.prevent.stop="handleContext"
    @keydown="handleKeyDown"
    @dblclick="handleDoubleClick"
  >
    <div
      :class="{
        title: true,
        'is-draggable': !isDraggable,
      }"
    >
      <div
        class="title-content"
        ref="titleElement"
        :contenteditable="isEditing"
        @input="checkChanges"
      >
        {{ titleModel }}
      </div>
      <div
        v-if="isDraggable && !isEditing && canEdit"
        ref="dragIconElement"
        class="drag-icon"
        :draggable="canEdit && !isEditing"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
      >
        <IconDrag />
      </div>
    </div>
    <div
      class="content"
      ref="contentElement"
      :contenteditable="isEditing"
      @input="checkChanges"
    >
      {{ contentModel }}
    </div>

    <template v-if="isButtonsVisible">
      <ButtonStack>
        <BaseButton
          @click="handleSaveClick"
          :disabled="!hasChanges && !isNew"
        >
          <IconApply />
          Save
        </BaseButton>
        <BaseButton @click="handleCancelClick">
          <IconCancel />
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
  transition: box-shadow 0.2s ease;
}

.card:hover:not(.card-disabled) {
  box-shadow: var(--shadow-1);
}

.card.editing-mode {
  border: 2px solid var(--k-c-blue);
}

.card.card-disabled {
  opacity: 0.6;
  cursor: auto;
}

.title {
  display: flex;
  flex-direction: row;
  outline: none;
}

.title-content {
  white-space: pre-wrap;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
}

.title-content[contenteditable='true']:focus,
.content[contenteditable='true']:focus {
  outline: none;
}

.editing-mode .title,
.editing-mode .content {
  cursor: text;
  border: 1px solid var(--color-border);
  border-radius: 2px;
}

.drag-icon {
  margin-left: auto;
  user-select: none;
  cursor: grab;
}

.drag-icon:active {
 cursor: grabbing;
}

.content {
  margin: 8px 0;
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  outline: none;
}

.dragging {
  opacity: 0.3;
  transform: scale(0.98);
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}
</style>
