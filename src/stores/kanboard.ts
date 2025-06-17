import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useAppStore } from './app';

type Column = {
  title: string;
  id: number;
  cards: Card[];
  updated: number;
  canEdit: boolean;
  sortType: SortType;
}

type Card = {
  title: string;
  content: string;
  canEdit: boolean;
  id: number;
  isNew: boolean;
  updated: number;
}

type SortType = 'none' | 'asc' | 'desc';

const genId = () => Date.now() + Math.random();

const shuffle = (array: any[]) => array.sort((el) => Math.random() <= 0.5 ? 1 : -1);

function shuffleOverall(arrays: any[]) {
  const allElements = arrays.flat();

  for (let i = allElements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allElements[i], allElements[j]] = [allElements[j], allElements[i]];
  }

  const result = Array(arrays.length).fill([]).map(() => []) as any[];

  allElements.forEach(element => {
    const randomArrayIndex = Math.floor(Math.random() * arrays.length);
    result[randomArrayIndex].push(element);
  });

  return result;
}

const nextSort = {
  asc: 'desc',
  desc: 'none',
  none: 'asc',
}

const getNextSort = (currentSort: SortType): SortType => {
  return nextSort[currentSort] as SortType;
}

export const useKanBoardStore = defineStore('kanBoard', () => {

  const columns = ref<Column[]>([]);

  const appStore = useAppStore();
  watch(columns, () => appStore.saveData(), { deep: true });

  const getColumnById = computed(() => (id: Column["id"]) => {
    return columns.value.find(item => item.id === id);
  });

  const getCardById = computed(() => (column: Column, cardId: Card['id']) => {
    return column.cards.find(item => item.id === cardId);
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
      sortType: 'none',
    })
  }

  function deleteColumn(id: Column['id']) {
    columns.value = columns.value.filter((el) => el.id !== id);
  }


  function addNewCard(id: Column["id"]) {
    const column = getColumnById.value(id);

    if (!column) return;

    column.sortType = 'none';

    column.cards.push({
      title: ``,
      content: 'Add description...',
      canEdit: column.canEdit,
      id: genId(),
      isNew: true,
      updated: Date.now(),
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

  function toggleEditing(id: Column['id'], value?: boolean) {
    const column = getColumnById.value(id);

    if (!column) return;

    column.canEdit = value ?? !column.canEdit;

    const newCards = column.cards
      .filter((card) => !card.isNew)

    newCards.forEach((card) => card.canEdit = column.canEdit);

    column.cards = newCards;
  }

  function toggleEditingAll() {
    columns.value.forEach((col) => toggleEditing(col.id, false));

  }

  function shuffleColumns() {
    columns.value = shuffle(columns.value);
  }

  function shuffleCards() {
    const overall = Math.random() <= 0.1;

    if (overall) {
      const newCards = shuffleOverall(
        columns.value.filter((col) => col.canEdit)
          .map((col) => col.cards)
      );
      for (let i = 0, j = 0; i < columns.value.length; i++) {
        const col = columns.value[i];
        if (!col.canEdit) continue;
        col.cards = newCards[j++];
        col.updated = Date.now();
        col.sortType = 'none';
      }
    } else {
      columns.value.forEach((col) => {
        if (!col.canEdit) return;
        col.cards = shuffle(col.cards);
        col.updated = Date.now();
        col.sortType = 'none';
      })
    }
  }

  function handleCardUpdated(id: Column['id'], cardId: Card['id']) {
    const column = getColumnById.value(id);

    if (!column) return;

    column.updated = Date.now();
    const card = getCardById.value(column, cardId);
    if (!card) return;
    if (card.isNew) card.isNew = false;
    card.updated = column.updated;
  }

  function getData() {
    return JSON.parse(JSON.stringify(columns.value));
  }

  function restoreData(data?: Column[] | undefined) {
    if (data && data.length) {
      columns.value = data;
    } else {

      columns.value = [{
        title: 'Todo',
        id: genId(),
        cards: [],
        updated: 0,
        canEdit: true,
        sortType: 'none',
      },
      {
        title: 'in progress',
        id: genId(),
        cards: [],
        updated: 0,
        canEdit: true,
        sortType: 'none',
      },
      {
        title: 'done',
        id: genId(),
        cards: [],
        updated: 0,
        canEdit: true,
        sortType: 'none',
      },]
    }
  }

  function moveCard({ fromColumnId, cardId, toColumnId, position }: {
    fromColumnId: number,
    cardId: number,
    toColumnId: number,
    position: number
  }) {
    const fromColumn = columns.value.find(c => c.id === fromColumnId);
    if (!fromColumn) return;

    const cardIndex = fromColumn.cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const card = fromColumn.cards[cardIndex];

    fromColumn.cards.splice(cardIndex, 1);

    const toColumn = columns.value.find(c => c.id === toColumnId);
    if (!toColumn) return;

    toColumn.sortType = 'none';

    if (position >= toColumn.cards.length) {
      toColumn.cards.push(card);
    } else {
      toColumn.cards.splice(position, 0, card);
    }

  }

  function sortCards(columnId: Column['id']) {
    const column = getColumnById.value(columnId);
    if (!column) return;

    const { sortType } = column;

    column.sortType = getNextSort(sortType);

    if (column.sortType == 'none') return;

    column.cards = [...column.cards].sort((a, b) => {
      return sortType === 'asc' ? a.updated - b.updated : b.updated - a.updated
    })


  }

  return {
    columns,
    canEditAll,
    shuffleColumns,
    addColumn,
    shuffleCards,
    toggleEditing,
    deleteColumn,
    addNewCard,
    deleteCard,
    clearAllCards,
    toggleEditingAll,
    handleCardUpdated,
    getData,
    restoreData,
    moveCard,
    sortCards,
  }
});

export type { Column, Card, SortType };
