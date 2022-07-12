function addLongtapListener(
  element: HTMLElement,
  listener: () => void,
  startListener?: () => void,
  endListener?: () => void
) {
  let timeout: any = null;

  element.addEventListener('touchstart', () => {
    timeout = setTimeout(listener, 1000);
    if (startListener) startListener();
  });

  element.addEventListener('touchend', () => {
    clearTimeout(timeout);
    if (endListener) endListener();
  });
}

export { addLongtapListener };
