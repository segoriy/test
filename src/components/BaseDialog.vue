<template>
  <div
    class="dialog-mask"
    v-if="isVisible"
  >
    <div class="dialog-wrapper">
      <div class="dialog-container">
        <div class="dialog-header">
          <h3>{{ title }}</h3>
        </div>
        <div class="dialog-content">
          <slot name="content">
            {{ content }}
          </slot>
        </div>
        <div class="dialog-footer">
          <BaseButton @click="handleCancel">
            <IconCancel />
            Cancel
          </BaseButton>
          <BaseButton @click="handleApply">
            <IconApply />
            Ok
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import IconCancel from './icons/IconCancel.vue'
import IconApply from './icons/IconApply.vue'

const { title, content } = defineProps<{
  title: String
  content: String
}>()

const emit = defineEmits(['onApply', 'onCancel'])

const isVisible = defineModel<boolean>()

const handleApply = () => {
  emit('onApply')
  closeDialog()
}

const handleCancel = () => {
  emit('onCancel')
  closeDialog()
}

const closeDialog = () => {
  isVisible.value = false
}

watch(isVisible, (newVal) => {
  isVisible.value = newVal
})
</script>

<style scoped>
.dialog-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  pointer-events: none;
}

.dialog-container {
  width: 400px;
  max-width: 90vw;
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  pointer-events: auto;
  padding: 20px;
}

.dialog-header {
  margin-bottom: 16px;
}

.dialog-header h3 {
  margin: 0;
  color: var(--color-text);
}

.dialog-content {
  margin: 20px 0;
  color: var(--color-text)
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
