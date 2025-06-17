# KanbanBoard

Vue 3 app with kаnbаn bоard.

## Functionality Overview

### Column Management

- Add/Remove columns (removal requires confirmation)
- Shuffle/reorder columns
- Edit column titles
- Sort cards within a column (persistent state) by modification date
- Clear all cards from a column (with confirmation)
- Disable column editing (locks all card modifications and movements including sorting/shuffling). Unconfirmed cards are deleted when editing is disabled
- Drag-and-drop cards within and between columns (blocked for locked columns)
- Last-modified timer resets on column changes (position, card count, or card modifications)

### Card Management

- Create cards (new cards are confirmed via Enter or save action)
- Delete cards:
  - New cards: Delete via Esc, Right-click, or Cancel button (no confirmation)
  - Existing cards: Delete via Right-click (requires confirmation)
- Editable titles and descriptions:
  - Shift+Enter for line breaks
  - Save via Enter or Save button (only saves if changes were made)
  - Cancel/Esc exits edit mode and discards changes

### Additional Features

- Global edit lock for all columns
- Column shuffling/reordering
- Card shuffling (only affects editable columns; 10% chance of cross-column shuffling)
- Browser theme support (Dark/Light modes)
- Confirmation prompts for destructive actions
- Automatic state persistence to localStorage on content changes

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
