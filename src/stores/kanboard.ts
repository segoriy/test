import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type Column = {
  title: string;
  id: number;
  cards: Card[];
  updated: number;
  canEdit: boolean;
}

type Card = {
  title: string;
  content: string;
  canEdit: boolean;
}


export const useKanBoardStore = defineStore('kanBoard', () => {
  const columns = ref<Column[]>([
    {
      title: 'Todo',
      id: Date.now() + Math.random(),
      cards: [],
      updated: 0,
      canEdit: true,
    },
    {
      title: 'in progress',
      id: Date.now() + Math.random(),
      cards: [],
      updated: 0,
      canEdit: true,
    },
    {
      title: 'done',
      id: Date.now() + Math.random(),
      cards: [],
      updated: 0,
      canEdit: true,
    },
    {
      title: 'done',
      id: Date.now() + Math.random(),
      cards: [],
      updated: 0,
      canEdit: true,
    }
  ]);

  function shuffleColumns() {

  }

  function addColumn() {

  }

  function deleteColumn(column: Column) {

  }

  function disableEditing() {

  }

  function shuffleCards(column: Column) {

  }

  return { columns, shuffleColumns, addColumn, shuffleCards, disableEditing, deleteColumn }
})
