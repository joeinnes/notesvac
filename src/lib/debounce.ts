/* Josh W Comeau */

export const debounce = (callback: (...args: unknown[]) => void, wait: number): () => void => {
  let timeoutId = null;
  return (...args: unknown[]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      // eslint-disable-next-line prefer-spread
      callback.apply(null, args);
    }, wait);
  };
};