<script setup lang="ts">
import { ref } from 'vue';
import ButtonStack from './ButtonStack.vue';
import BaseButton from './BaseButton.vue';
import IconDrag from './icons/IconDrag.vue';

const isButtonsVisible = ref(true);
const isDraggable = ref(false);

</script>
<template>
  <div class="card">
    <div :class="{
      title: true,
      'is-draggable': !isDraggable,
    }">
      <p>
        Title title title title title title title title title title title title title title title title title title
        title title title title title title title title title title
      </p>
      <div v-if="isDraggable" class="drag-icon">
        <IconDrag />
      </div>
    </div>
    <div class="content">
      Content
    </div>
    <template v-if="isButtonsVisible">
      <ButtonStack>
        <BaseButton> Save </BaseButton>
        <BaseButton> Cancel </BaseButton>
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
}

.title {
  display: flex;
  flex-direction: row;
}

.title:not(.is-draggable) p {
  margin-right: 4px;
}

.drag-icon {
  margin-left: auto;

}

.content {
  margin: 8px 0;
  color: var(--color-text-secondary);
}
</style>