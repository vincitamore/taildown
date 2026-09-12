/** Print exposes the document's content without changing its screen state. */
export const PRINT_CSS = `
.tab-print-label { display: none; }
@media print {
  @page { margin: 18mm; }
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    text-shadow: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    color: #111 !important;
    background: transparent !important;
  }
  html, body {
    background: #fff !important;
    width: auto !important;
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    font-size: 11pt;
  }
  .dark-mode-toggle, .code-copy-btn, .component-navbar, .tab-list,
  .tabs-list, [role="tablist"], .carousel-prev, .carousel-next,
  .carousel-indicators, .accordion-icon, .modal-backdrop,
  [role="tooltip"] { display: none !important; }
  .component-container, .component-grid, .component-carousel, .carousel-track {
    display: block !important;
    overflow: visible !important;
    max-width: none !important;
  }
  .tab-panel, .tab-panel[hidden], .tab-print-label,
  .animation-paused, .animation-playing,
  .accordion-content, .accordion-content[hidden],
  .carousel-slide, .carousel-slide[hidden] {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: auto !important;
    max-height: none !important;
    min-width: 0 !important;
    overflow: visible !important;
  }
  details::details-content { display: block !important; content-visibility: visible !important; }
  .component-card, .carousel-card, .alert { margin-bottom: 1rem; }
  .carousel-card { min-height: 0 !important; padding: 1rem !important; }
  h1, h2, h3, h4, h5, h6, dt, summary, .accordion-trigger { break-after: avoid; }
  p { orphans: 3; widows: 3; }
  pre, pre code {
    white-space: pre-wrap !important;
    overflow-wrap: anywhere !important;
    word-break: break-word !important;
    overflow: visible !important;
    max-height: none !important;
  }
  .table-container, .table-wrapper { overflow: visible !important; }
  table { min-width: 0 !important; width: 100% !important; }
  th, td, td code { white-space: normal !important; overflow-wrap: anywhere; }
  img, svg { max-width: 100%; }
}
`;
