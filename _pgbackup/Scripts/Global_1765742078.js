// ------------------------------------------------------
// BioPulse global.js (CLEAN)
// - Mobile nav
// - Accordion
// - Tabs
// - Hero Wave (canvas)
// ------------------------------------------------------

function initMobileMenu() {
  const toggle = document.querySelector(".bp-nav-toggle");
  const mobileNav = document.querySelector(".bp-nav-mobile");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });
}

function initAccordions() {
  const items = document.querySelectorAll(".bp-accordion-item");
  if (!items.length) return;

  items.forEach((item) => {
    const header = item.querySelector(".bp-accordion-header");
    if (!header) return;

    header.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}

function initTabs() {
  const tabs = document.querySelectorAll(".bp-tab");
  const panels = document.querySelectorAll(".bp-tab-panel");
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      if (!target) return;

      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const panel = document.querySelector(`.bp-tab-panel[data-panel="${target}"]`);
      if (panel) panel.classList.add("active");
    });
  });
}

// Optional toast helper if your pages use it
window.bpToast = function bpToast(message, duration = 2600) {
  const toast = document.querySelector(".bp-toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("visible");

  window.clearTimeout(window.__bpToastTimer);
  window.__bpToastTimer = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, duration);
};

// HERO WAVE (Canvas)
function initHeroWave() {
  const canvas = document.getElementById("bp-hero-wave");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  let width = 0;
  let height = 0;
  let centerY = 0;

  function resize() {
    // Wave sizing is controlled via CSS. We render to that exact size.
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    // Draw in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    centerY = height / 2;
  }

  resize();
  window.addEventListener("resize", resize);

  let t = 0;

  function draw() {
    t += 0.02;
    ctx.clearRect(0, 0, width, height);

    const lines = 14;
    const breath = 1 + 0.16 * Math.sin(t * 0.35);

    for (let i = 0; i < lines; i++) {
      const p = i / (lines - 1);
      const amp = (58 + p * 42) * breath;
      const freq = 10 + p * 4;
      const phase = t * (1.2 + p * 0.6);

      ctx.beginPath();

      for (let x = 0; x <= width; x += 4) {
        const u = x / width;
        const envelope = Math.exp(-Math.pow(u - 0.5, 2) / 0.024);

        const y =
          centerY +
          Math.sin(u * freq * Math.PI * 2 + phase) * amp * envelope +
          Math.sin(u * 80 * Math.PI * 2 + t * 3 + i) * 3 * envelope;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `rgba(255,255,255,${0.12 + p * 0.14})`;
      ctx.lineWidth = 0.6 + p * 0.45;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) window.AOS.init({ duration: 800, once: true });

  initMobileMenu();
  initAccordions();
  initTabs();
  initHeroWave();
});
