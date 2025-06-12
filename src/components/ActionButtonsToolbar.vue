<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import ButtonStack from './ButtonStack.vue'
</script>
<template>
  <ButtonStack>
    <BaseButton> Shuffle Columns</BaseButton>
    <BaseButton> New Column </BaseButton>
    <BaseButton> Shuffle Cards</BaseButton>
    <BaseButton> Disable Editing </BaseButton>
  </ButtonStack>
</template>
<style scoped></style>