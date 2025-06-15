<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { useAppStore } from './stores/app';

const appStore = useAppStore();

onMounted(() => {
  appStore.restoreData();
});

</script>

<template>
  <RouterView />
</template>

<style scoped></style>
