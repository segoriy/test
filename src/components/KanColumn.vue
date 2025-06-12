<script setup lang="ts">
import BaseButton from './BaseButton.vue';
import ButtonStack from './ButtonStack.vue';
import KanCard from './KanCard.vue';
import NewCardButton from './NewCardButton.vue';

</script>
<template>
  <div class="column">
    <div class="header">
      <div class="title">
        <p>
          <slot name="title">
            TOdO
          </slot>
          <span class="card-counter"> 3 </span>
        </p>
      </div>
      <ButtonStack>
        <BaseButton>Disable Editing</BaseButton>
        <BaseButton>Delete Column</BaseButton>
      </ButtonStack>
    </div>
    <div class='body'>
      <KanCard> Hello </KanCard>
      <KanCard> Hello </KanCard>
      <KanCard> Hello </KanCard>
      <div class="new-card-button">
        <NewCardButton />
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