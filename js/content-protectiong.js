(function () {
  "use strict";

  /* ── Block right-click everywhere ── */
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  /* ── Block drag to desktop/folder ── */
  document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") e.preventDefault();
  });

  /* ── Block long-press save on mobile ── */
  const style = document.createElement("style");
  style.textContent = `
    img {
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      user-select: none;
      -webkit-user-drag: none;
    }
  `;
  document.head.appendChild(style);

  /* ── Block common keyboard shortcuts ── */
  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    const blocked =
      (e.ctrlKey && key === "S") ||                          // Save page
      (e.ctrlKey && key === "U") ||                          // View source
      (e.ctrlKey && e.shiftKey && key === "I") ||            // DevTools
      (e.ctrlKey && e.shiftKey && key === "J") ||            // Console
      (e.ctrlKey && e.shiftKey && key === "C") ||            // Inspector
      (e.metaKey && key === "S") ||                          // Mac Save
      (e.metaKey && key === "U") ||                          // Mac Source
      (e.metaKey && e.altKey && key === "I") ||              // Mac DevTools
      e.key === "F12";                                        // F12

    if (blocked) e.preventDefault();
  });

})();