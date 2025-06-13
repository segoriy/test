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
      canEdit: false,
    },
    {
      title: 'done',
      id: genId(),
      cards: [],
      updated: 0,
      canEdit: true,
    },
  ]);

  const getColumnById = computed(() => (id: Column["id"]) => {
    return columns.value.find(item => item.id === id);
  });

  const canEditSame = computed(() => {
    if (!columns.value.length) return false;
    return columns.value.every((el) => el.canEdit == columns.value[0].canEdit);
  })

  const canEditAll = computed(() => {
    return canEditSame.value ? columns.value[0].canEdit : true;
  })

  function addColumn() {
    columns.value.push({
      title: ' ',
      id: genId(),
      cards: [],
      updated: 0,
      canEdit: true,
    })
  }

  function deleteColumn(id: Column['id']) {
    columns.value = columns.value.filter((el) => el.id !== id);
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

  function clearAllCards(id: Column['id']) {
    const column = getColumnById.value(id);

    if (!column) return;

    column.cards = [];
  }

  function shuffleColumns() {

  }

  function toggleEditing(id: Column['id']) {
    const column = getColumnById.value(id);

    if (!column) return;

    column.canEdit = !column.canEdit;
  }

  function toggleEditingAll() {
    if (columns.value.find((el) => el.canEdit)) {
      columns.value.forEach((el) => el.canEdit = false);
    } else {
      columns.value.forEach((el) => el.canEdit = !el.canEdit);
    }
  }

  function shuffleCards(column: Column) {

  }

  return { columns, shuffleColumns, addColumn, shuffleCards, toggleEditing, deleteColumn, addNewCard, deleteCard, clearAllCards, toggleEditingAll, canEditAll }
});

export type { Column, Card };
