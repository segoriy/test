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
  id: number;
}

const genId = () => Date.now() + Math.random();


export const useKanBoardStore = defineStore('kanBoard', () => {
  const columns = ref<Column[]>([
    {
      title: 'Todo',
      id: genId(),
      cards: [],
      updated: 0,
      canEdit: true,
    },
    {
      title: 'in progress',
      id: genId(),
      cards: [],
      updated: 0,
      canEdit: true,
    },
    {
      title: 'done',
      id: genId(),
      cards: [],
      updated: 0,
      canEdit: true,
    },
    {
      title: 'done',
      id: genId(),
      cards: [],
      updated: 0,
      canEdit: true,
    }
  ]);

  const getColumnById = computed(() => (id: Column["id"]) => {
    return columns.value.find(item => item.id === id);
  });

  function addColumn() {

  }

  function addNewCard(id: Column["id"]) {
    const column = getColumnById.value(id);

    if (!column) return;

    column.cards.push({
      title: `test title ${genId()}`,
      content: 'Add content...',
      canEdit: true,
      id: genId(),
    })
  }

  function deleteCard(columnId: Column['id'], cardId: Card['id']) {
    const column = getColumnById.value(columnId);
    if (!column) return;

    column.cards = column.cards.filter((el) => el.id !== cardId);
  }

  function shuffleColumns() {

  }


  function deleteColumn(column: Column) {

  }

  function disableEditing() {

  }

  function shuffleCards(column: Column) {

  }

  return { columns, shuffleColumns, addColumn, shuffleCards, disableEditing, deleteColumn, addNewCard, deleteCard }
});

export type { Column, Card };
