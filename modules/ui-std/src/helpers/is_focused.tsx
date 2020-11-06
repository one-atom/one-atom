export const isFocused = (event: Event): boolean => {
  let origin_is_focused = false;

  if (event.target && event.target instanceof Element && event.target !== document.body) {
    origin_is_focused = document.activeElement === event.target;
  }

  return origin_is_focused;
};
