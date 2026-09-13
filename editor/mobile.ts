/** Mobile navigation owns presentation only; the editor and preview retain their state. */
export function initializeMobileEditor({
  window,
  document,
  focusEditor,
  openDesign,
  setMobile,
  undo,
  redo,
  find,
}: {
  window: Window;
  document: Document;
  focusEditor: () => void;
  openDesign: () => void;
  setMobile: (mobile: boolean) => void;
  undo: () => void;
  redo: () => void;
  find: () => void;
}): void {
  const media = window.matchMedia('(max-width: 768px)');
  const menu = document.getElementById('file-actions')!;
  const menuButton = document.getElementById('file-menu-toggle')!;
  const edit = document.getElementById('mobile-edit')!;
  const preview = document.getElementById('mobile-preview')!;
  const editorPane = document.getElementById('editor-pane')!;
  const previewPane = document.getElementById('preview-pane')!;
  let active: 'edit' | 'preview' = 'edit';
  function closeMenu() {
    menu.hidden = media.matches;
    menuButton.setAttribute('aria-expanded', 'false');
  }
  function render() {
    document.body.dataset.mobileView = active;
    edit.setAttribute('aria-pressed', String(active === 'edit'));
    preview.setAttribute('aria-pressed', String(active === 'preview'));
    editorPane.inert = media.matches && active !== 'edit';
    previewPane.inert = media.matches && active !== 'preview';
    const viewport = window.visualViewport;
    document.documentElement.style.setProperty(
      '--mobile-viewport-height',
      // Pinch zoom magnifies the layout; only keyboard/browser chrome should shrink it.
      `${viewport ? viewport.height * viewport.scale : window.innerHeight}px`
    );
  }
  edit.addEventListener('click', () => {
    active = 'edit';
    render();
    focusEditor();
  });
  preview.addEventListener('click', () => {
    (document.activeElement as HTMLElement | null)?.blur();
    active = 'preview';
    closeMenu();
    render();
    preview.focus();
  });
  menuButton.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuButton.setAttribute('aria-expanded', String(!menu.hidden));
  });
  menu.addEventListener('click', (event) => {
    if ((event.target as Element).closest('button')) closeMenu();
  });
  document.addEventListener('pointerdown', (event) => {
    const target = event.target as Node;
    if (!menu.contains(target) && !menuButton.contains(target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && media.matches && !menu.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.getElementById('mobile-design')!.addEventListener('click', openDesign);
  document.getElementById('commands-btn')!.addEventListener('click', () => {
    active = 'edit';
    render();
  });
  document.getElementById('diagnostics')?.addEventListener(
    'click',
    (event) => {
      if ((event.target as Element).closest('button')) {
        active = 'edit';
        render();
      }
    },
    true
  );
  media.addEventListener('change', () => {
    closeMenu();
    render();
    setMobile(media.matches);
  });
  document.getElementById('mobile-undo')!.addEventListener('click', undo);
  document.getElementById('mobile-redo')!.addEventListener('click', redo);
  document.getElementById('mobile-find')!.addEventListener('click', find);
  window.visualViewport?.addEventListener('resize', render);
  window.addEventListener('resize', render);
  closeMenu();
  render();
}
