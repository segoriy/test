import type { Ref } from 'vue';

export function useContentEditable() {
  const focusEndOfElement = (el: Ref<HTMLElement | undefined>) => {
    if (!el.value) return;

    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(el.value);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
    el.value.focus();
  }
  return {
    focusEndOfElement
  };
}