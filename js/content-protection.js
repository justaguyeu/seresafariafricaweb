
(function () {
  "use strict";


  const style = document.createElement("style");
  style.textContent = `
    body, img, video {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-drag: none;
      -webkit-touch-callout: none;
    }
    .cp-blur {
      filter: blur(10px);
      transition: filter 0.2s ease;
    }
  `;
  document.head.appendChild(style);


  document.addEventListener("contextmenu", (e) => e.preventDefault());


  document.addEventListener("selectstart", (e) => e.preventDefault());


  document.addEventListener("dragstart", (e) => e.preventDefault());


  document.addEventListener("copy", (e) => e.preventDefault());
  document.addEventListener("cut", (e) => e.preventDefault());


  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    const blocked =
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(key)) ||
      (e.ctrlKey && key === "U") ||
      (e.ctrlKey && key === "S") ||
      (e.metaKey && e.altKey && ["I", "J", "C"].includes(key)); // Mac

    if (blocked) {
      e.preventDefault();
      return false;
    }
  });


  const threshold = 160;

  function checkDevTools() {
    const widthGap = window.outerWidth - window.innerWidth;
    const heightGap = window.outerHeight - window.innerHeight;
    const likelyOpen = widthGap > threshold || heightGap > threshold;
    document.documentElement.classList.toggle("cp-blur", likelyOpen);
  }

  setInterval(checkDevTools, 1000);
})();