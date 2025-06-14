import { ref, computed } from 'vue'
import { defineStore } from 'pinia';

import { useKanBoardStore } from './kanboard';

export const useAppStore = defineStore('app', () => {
  const kanBoard = useKanBoardStore();

  const isDataRestored = ref(false);

  function saveData() {
    const data = kanBoard.getData();
    if (data) localStorage.setItem('kanboardData', JSON.stringify(data));
  }

  function restoreData() {
    const data = localStorage.getItem('kanboardData');
    if (!data) {
      kanBoard.restoreData();
      return;
    }

    try {
      kanBoard.restoreData(JSON.parse(data));
    } catch (e) {
      kanBoard.restoreData();
    }
    isDataRestored.value = true;
  }

  return { saveData, restoreData, isDataRestored }
})