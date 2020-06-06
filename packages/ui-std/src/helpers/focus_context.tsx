type FocusContext = {
  current: HTMLElement | null;
};

/** Simple storage to mutate the current focused DOM element. */
export const focusContext: FocusContext = {
  current: null,
};
