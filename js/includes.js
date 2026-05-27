/* ============================================================
   includes.js — Nav & Footer Loader
   Save this file at:  js/includes.js

   HOW IT WORKS:
   1. Detects how many folder-levels deep the current page is
   2. Fetches /nav.html and /footer.html from the root
   3. Replaces all {ROOT} tokens with the correct relative path
   4. Injects nav before <body>'s first child, footer before </body>
   5. Sets the active nav link based on current URL
   6. Re-initialises your existing main.js behaviours (ham, scroll, etc.)

   USAGE IN EVERY HTML PAGE:
   ─────────────────────────
   1. Remove the existing <nav>, <nav class="mob-menu">,
      <div id="cursor">, <div id="cursor-ring">,
      <button id="back-top">, <footer>, and <a class="wa-btn"> elements.

   2. Add ONE placeholder div at the very top of <body>:
         <div id="site-nav"></div>

   3. Add ONE placeholder div at the very bottom of <body>,
      just before your <script> tags:
         <div id="site-footer"></div>

   4. Load this script BEFORE main.js:
         <script src="{CORRECT_RELATIVE_PATH}/js/includes.js"></script>
         <script src="{CORRECT_RELATIVE_PATH}/js/main.js"></script>

   DEPTH REFERENCE:
   ─────────────────────────
   Root pages  (index.html, about.html, community.html)
     → script src="js/includes.js"
     → ROOT = ""   (no prefix)

   pages/      (kilimanjaro.html, tours.html, zanzibar.html, etc.)
     → script src="../js/includes.js"
     → ROOT = "../"

   pages/tour-packages/   (classic-safari.html, etc.)
     → script src="../../js/includes.js"
     → ROOT = "../../"

   pages/kili-routes/     (machame-route.html, etc.)
     → script src="../../js/includes.js"
     → ROOT = "../../"
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. DETECT ROOT PATH ──────────────────────────────────── */
  // Count how many directory levels deep we are from the root.
  // e.g. "pages/kilimanjaro.html"      → 1 level → "../"
  //      "pages/tour-packages/foo.html"→ 2 levels → "../../"
  function getRootPath() {
    var path = window.location.pathname;
    // Normalise: remove leading slash, remove filename
    var parts = path.replace(/^\//, '').split('/');
    // Remove the filename (last segment)
    parts.pop();
    // Filter empty strings
    parts = parts.filter(function (p) { return p.length > 0; });
    var depth = parts.length;
    if (depth === 0) return '';
    return new Array(depth + 1).join('../');
  }

  var ROOT = getRootPath();

  /* ── 2. REPLACE {ROOT} TOKENS ─────────────────────────────── */
  function applyRoot(html) {
    return html.replace(/\{ROOT\}/g, ROOT);
  }

  /* ── 3. FETCH & INJECT ─────────────────────────────────────── */
  function fetchAndInject(url, targetId, position) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Could not load ' + url);
        return res.text();
      })
      .then(function (html) {
        var processed = applyRoot(html);
        var target = document.getElementById(targetId);
        if (!target) {
          console.warn('includes.js: placeholder #' + targetId + ' not found in this page.');
          return;
        }
        target.outerHTML = processed;
      })
      .catch(function (err) {
        console.error('includes.js error:', err);
      });
  }

  /* ── 4. SET ACTIVE NAV LINK ────────────────────────────────── */
  function setActiveLink() {
    var path = window.location.pathname.toLowerCase();

    // Map URL segments to data-navkey values
    var keyMap = {
      'about':        'about',
      'destinations': 'destinations',
      'tours':        'tours',
      'kilimanjaro':  'kilimanjaro',
      'kili-routes':  'kilimanjaro',
      'zanzibar':     'zanzibar',
      'gallery':      'gallery',
      'contact':      'contact',
      'community':    'about',        // community sits under About
      'tour-packages':'tours'         // tour detail pages sit under Tours
    };

    var activeKey = null;
    Object.keys(keyMap).forEach(function (segment) {
      if (path.indexOf(segment) !== -1) {
        activeKey = keyMap[segment];
      }
    });

    if (!activeKey) return; // root / index — no active link

    document.querySelectorAll('[data-navkey]').forEach(function (el) {
      if (el.getAttribute('data-navkey') === activeKey) {
        el.classList.add('active');
      }
    });
  }

  /* ── 5. RE-INIT MAIN.JS BEHAVIOURS ─────────────────────────── */
  // main.js sets up ham, scroll, cursor, FAQ, etc. on DOMContentLoaded.
  // Since we inject nav/footer after that event fires, we re-run the
  // parts that depend on injected elements.
  function reinitNav() {
    /* Hamburger */
    var ham    = document.getElementById('ham');
    var mobMenu = document.getElementById('mob-menu');
    if (ham && mobMenu) {
      ham.addEventListener('click', function () {
        ham.classList.toggle('open');
        mobMenu.classList.toggle('open');
      });
      // Close on link click
      mobMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          ham.classList.remove('open');
          mobMenu.classList.remove('open');
        });
      });
    }

    /* Scrolled nav */
    var nav = document.getElementById('nav');
    if (nav) {
      function handleNavScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 60);
      }
      window.addEventListener('scroll', handleNavScroll, { passive: true });
      handleNavScroll(); // run once on inject
    }

    /* Back-to-top */
    var backTop = document.getElementById('back-top');
    if (backTop) {
      window.addEventListener('scroll', function () {
        backTop.style.opacity = window.scrollY > 400 ? '1' : '0';
        backTop.style.pointerEvents = window.scrollY > 400 ? 'all' : 'none';
      }, { passive: true });
      backTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* Custom cursor (desktop only) */
    var cursor     = document.getElementById('cursor');
    var cursorRing = document.getElementById('cursor-ring');
    if (cursor && cursorRing && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.addEventListener('mousemove', function (e) {
        cursor.style.left     = e.clientX + 'px';
        cursor.style.top      = e.clientY + 'px';
        cursorRing.style.left = e.clientX + 'px';
        cursorRing.style.top  = e.clientY + 'px';
      });
      document.querySelectorAll('a, button, .dest-card, .tour-card, .gal-item').forEach(function (el) {
        el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-lg'); });
        el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-lg'); });
      });
    }
  }

  /* ── 6. ORCHESTRATE ─────────────────────────────────────────── */
  // Fetch both includes in parallel, then init once both are done.
  Promise.all([
    fetchAndInject(ROOT + 'nav.html',    'site-nav'),
    fetchAndInject(ROOT + 'footer.html', 'site-footer')
  ]).then(function () {
    setActiveLink();
    reinitNav();
  });

})();
