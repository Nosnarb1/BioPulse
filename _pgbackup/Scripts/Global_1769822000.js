// ------------------------------------------------------
// BioPulse global.js (CLEAN + INTRO CURTAIN)
// - Mobile nav
// - Accordion
// - Tabs
// - Forms (simple validation helper)
// - Toast helper
// - Intro curtain (remove overlay after animation)
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

      // Supports either #id or data-panel mapping
      const panelById = document.getElementById(target);
      const panelByData = document.querySelector(`.bp-tab-panel[data-panel="${target}"]`);
      const panel = panelById || panelByData;

      if (panel) panel.classList.add("active");
    });
  });
}

// Toast (optional)
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

// Forms (optional simple email check)
function initForms() {
  const forms = document.querySelectorAll(".bp-form");
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const emailInput = form.querySelector("#emailInput");
      const errorEl = form.querySelector(".bp-error");

      if (!emailInput || !errorEl) return;

      if (!emailInput.value.includes("@")) {
        e.preventDefault();
        errorEl.textContent = "Please enter a valid email.";
        emailInput.classList.add("bp-input-error");
        return;
      }

      errorEl.textContent = "";
      emailInput.classList.remove("bp-input-error");

      // Only show toast if you want it
      if (window.bpToast) window.bpToast("Submitted!");
    });
  });
}

// Intro curtain cleanup – remove overlay after animation ends
function initIntroCurtain() {
  const intro = document.querySelector(".bp-intro");
  if (!intro) return;

  const removeIntro = () => {
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
  };

  // Primary: remove when the CSS animation finishes
  intro.addEventListener("animationend", removeIntro, { once: true });

  // Safety: remove even if animationend never fires (rare but happens)
  window.setTimeout(removeIntro, 2600);
}

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
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

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

  initIntroCurtain(); // keep this
  initMobileMenu();
  initAccordions();
  initTabs();
  initForms();
  initHeroWave();
});
