interface DragState {
  id: number;
  stacked: boolean;
  size: number;
  start: number;
  percent: number;
  pointerEvents: string;
  userSelect: string;
  cursor: string;
}
interface DividerOptions {
  window: Pick<Window, 'innerWidth' | 'addEventListener'>;
  document: Document;
  paneContainer: HTMLElement;
  divider: HTMLElement;
  editorPane: HTMLElement;
  previewFrame: HTMLIFrameElement;
}
/** Install pointer and keyboard resizing for the editor's responsive split view. */
export function initializeDivider({
  window,
  document,
  paneContainer,
  divider,
  editorPane,
  previewFrame,
}: DividerOptions): void {
  // Draggable divider
  let activeDrag: DragState | null = null;
  const stackedPanes = () => window.innerWidth <= 768;
  const editorPercent = () => {
    const axis = stackedPanes() ? 'height' : 'width';
    const size = paneContainer.getBoundingClientRect()[axis];
    return size ? (editorPane.getBoundingClientRect()[axis] / size) * 100 : 50;
  };
  const resizeEditor = (value: number) => {
    const percent = Math.min(85, Math.max(15, value));
    editorPane.style.flex = `0 0 ${percent}%`;
    divider.setAttribute('aria-valuenow', String(Math.round(percent)));
    divider.setAttribute('aria-valuetext', `${Math.round(percent)}% editor`);
  };
  const finishResize = () => {
    if (!activeDrag) return;
    const previous = activeDrag;
    activeDrag = null;
    divider.classList.remove('dragging');
    previewFrame.style.pointerEvents = previous.pointerEvents;
    document.body.style.userSelect = previous.userSelect;
    document.body.style.cursor = previous.cursor;
    if (divider.hasPointerCapture(previous.id)) divider.releasePointerCapture(previous.id);
  };
  const updateDivider = () => {
    finishResize();
    divider.setAttribute('aria-orientation', stackedPanes() ? 'horizontal' : 'vertical');
    divider.setAttribute('aria-valuenow', String(Math.round(editorPercent())));
    divider.setAttribute('aria-valuetext', `${Math.round(editorPercent())}% editor`);
  };
  divider.addEventListener('pointerdown', (e) => {
    if (activeDrag || !e.isPrimary || e.button !== 0) return;
    const stacked = stackedPanes();
    const size = paneContainer.getBoundingClientRect()[stacked ? 'height' : 'width'];
    if (!size) return;
    activeDrag = {
      id: e.pointerId,
      stacked,
      size,
      start: stacked ? e.clientY : e.clientX,
      percent: editorPercent(),
      pointerEvents: previewFrame.style.pointerEvents,
      userSelect: document.body.style.userSelect,
      cursor: document.body.style.cursor,
    };
    divider.setPointerCapture(e.pointerId);
    divider.classList.add('dragging');
    divider.focus();
    previewFrame.style.pointerEvents = 'none';
    document.body.style.userSelect = 'none';
    document.body.style.cursor = stacked ? 'row-resize' : 'col-resize';
    e.preventDefault();
  });
  document.addEventListener('pointermove', (e) => {
    if (!activeDrag || e.pointerId !== activeDrag.id) return;
    const position = activeDrag.stacked ? e.clientY : e.clientX;
    resizeEditor(activeDrag.percent + ((position - activeDrag.start) / activeDrag.size) * 100);
    e.preventDefault();
  });
  for (const event of ['pointerup', 'pointercancel'] as const)
    document.addEventListener(event, (e) => {
      if (activeDrag?.id === e.pointerId) finishResize();
    });
  divider.addEventListener('lostpointercapture', finishResize);
  window.addEventListener('blur', finishResize);
  window.addEventListener('resize', updateDivider);
  divider.addEventListener('keydown', (e) => {
    const backward = stackedPanes() ? 'ArrowUp' : 'ArrowLeft';
    const forward = stackedPanes() ? 'ArrowDown' : 'ArrowRight';
    if (![backward, forward, 'Home', 'End'].includes(e.key)) return;
    finishResize();
    const step = e.shiftKey ? 10 : 2;
    resizeEditor(
      e.key === 'Home'
        ? 15
        : e.key === 'End'
          ? 85
          : editorPercent() + (e.key === forward ? step : -step)
    );
    e.preventDefault();
  });
  updateDivider();
}
