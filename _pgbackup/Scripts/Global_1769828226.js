// ------------------------------------------------------
// BioPulse global.js (CLEAN + INTRO CURTAIN + ANIMATIONS)
// - Mobile nav
// - Accordion
// - Tabs
// - Forms (simple validation helper)
// - Toast helper
// - Intro curtain (remove overlay after animation)
// - Hero Wave (canvas)
// - Overview Constellation (stars + float + tilt)
// - How It Works (muscle map: live values)
// ------------------------------------------------------

// Mobile nav
function initMobileMenu() {
  const toggle = document.querySelector(".bp-nav-toggle");
  const mobileNav = document.querySelector(".bp-nav-mobile");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

// Accordions
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

// Tabs
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
// Intro curtain controller (no helix, longer timing, safe remove)
function initIntroCurtain() {
  const intro = document.querySelector(".bp-intro");
  if (!intro) return;

  // --- TUNE THESE ---
  const HOLD_MS = 4200;   // how long the logo spins before curtains open
  const OPEN_MS = 15200;   // curtain open duration
  const FADE_MS = 900;    // fade-out duration
  const TOTAL_MS = HOLD_MS + OPEN_MS + FADE_MS + 150;

  // Prevent scroll while intro is active (optional, feels better)
  document.documentElement.classList.add("bp-lock");
  document.body.classList.add("bp-lock");

  // Start state
  intro.classList.add("bp-intro--on");

  // Open curtains
  window.setTimeout(() => {
    intro.classList.add("bp-intro--open");
  }, HOLD_MS);

  // Fade away
  window.setTimeout(() => {
    intro.classList.add("bp-intro--hide");
  }, HOLD_MS + OPEN_MS);

  // Remove from DOM
  window.setTimeout(() => {
    intro.remove();

    document.documentElement.classList.remove("bp-lock");
    document.body.classList.remove("bp-lock");
  }, TOTAL_MS);
}

  // Primary: remove when the CSS animation finishes
  intro.addEventListener("animationend", removeIntro, { once: true });

  // Safety: remove even if animationend never fires (rare but happens)
  window.setTimeout(removeIntro, 2600);

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

/* ------------------------------------------------------
   OVERVIEW — Constellation (stars + float + gentle tilt)
------------------------------------------------------ */
function initOverviewConstellation() {
  const wrap = document.querySelector("#overview.bp-constellation-wrap");
  const layer = wrap ? wrap.querySelector(".bp-constellation") : null;
  if (!wrap || !layer) return;

  // Build stars once
  if (!layer.dataset.built) {
    layer.dataset.built = "true";
    const starCount = 26;

    for (let i = 0; i < starCount; i++) {
      const s = document.createElement("span");
      s.className = "bp-star" + (Math.random() > 0.7 ? " is-blue" : "");
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.setProperty("--tw", `${3.6 + Math.random() * 4.8}s`);
      s.style.setProperty("--td", `${Math.random() * 4.5}s`);
      layer.appendChild(s);
    }
  }

  const panels = wrap.querySelectorAll(".bp-float-panel");
  if (!panels.length) return;

  // Stagger float phase
  panels.forEach((p, idx) => {
    const delay = (idx * 0.55) + (Math.random() * 0.25);
    p.style.animationDelay = `${delay}s`;
  });

  // Turn on floating when in view
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        panels.forEach((p) => p.classList.add("bp-float-on"));
        io.disconnect();
      }
    });
  }, { threshold: 0.25 });

  io.observe(wrap);

  // Gentle tilt (kept subtle to avoid fighting hover)
  const maxTilt = 4.5; // degrees
  const maxLift = 2;   // px

  function onMove(ev) {
    const r = wrap.getBoundingClientRect();
    const cx = (ev.clientX - r.left) / r.width - 0.5;
    const cy = (ev.clientY - r.top) / r.height - 0.5;

    panels.forEach((p) => {
      const rx = (-cy * maxTilt).toFixed(2);
      const ry = (cx * maxTilt).toFixed(2);
      const lift = (Math.abs(cx) + Math.abs(cy)) * maxLift;

      p.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(0, ${(-lift).toFixed(2)}px, 0)`;
    });
  }

  function onLeave() {
    panels.forEach((p) => {
      p.style.transform = "";
    });
  }

  wrap.addEventListener("mousemove", onMove);
  wrap.addEventListener("mouseleave", onLeave);
}

/* ------------------------------------------------------
   HOW IT WORKS — Muscle map live stats + bars
   Requires the HTML to include:
   .bp-frame, .bp-hz, .bp-asym, .bp-impact
   .bp-muscle-bar-fill[data-base] and .bp-muscle-value .bp-val
------------------------------------------------------ */
function initHowItWorksMuscleMap() {
  const section = document.querySelector("#how-it-works");
  if (!section) return;

  const frameEl = section.querySelector(".bp-frame");
  const hzEl = section.querySelector(".bp-hz");
  const asymEl = section.querySelector(".bp-asym");
  const impactEl = section.querySelector(".bp-impact");

  const fills = Array.from(section.querySelectorAll(".bp-muscle-bar-fill"));
  const vals = Array.from(section.querySelectorAll(".bp-muscle-value .bp-val"));

  // If the upgraded markup isn't present, do nothing (no errors)
  if (!frameEl || !hzEl || fills.length === 0 || vals.length === 0) return;

  let frame = parseInt(frameEl.textContent || "214", 10);
  let hz = parseInt(hzEl.textContent || "120", 10);

  let running = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { running = e.isIntersecting; });
  }, { threshold: 0.25 });

  io.observe(section);

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const jitter = (base, amt) => clamp(base + (Math.random() * amt * 2 - amt), 0, 100);

  setInterval(() => {
    if (!running) return;

    // Frame count
    frame += 1 + Math.floor(Math.random() * 2);
    frameEl.textContent = String(frame);

    // Hz drift
    hz = clamp(hz + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0), 110, 140);
    hzEl.textContent = String(hz);

    // Bar updates
    fills.forEach((f, idx) => {
      const base = parseInt(f.getAttribute("data-base") || "60", 10);
      const next = Math.round(jitter(base, 6));
      f.style.width = `${next}%`;
      if (vals[idx]) vals[idx].textContent = String(next);
    });

    // Footer stats
    if (asymEl) asymEl.textContent = String(clamp(Math.round(jitter(11, 3)), 6, 18));
    if (impactEl) impactEl.textContent = String(clamp(Math.round(jitter(32, 6)), 18, 52));
  }, 900);
}
function initActiveNav() {
  const path = window.location.pathname || "/";
  const isHome = path === "/" || path.endsWith("/index.html");
  const isAbout = path.endsWith("/about.html");
  const isContact = path.endsWith("/contact.html");

  const key = isHome ? "home" : isAbout ? "about" : isContact ? "contact" : null;
  if (!key) return;

  document.querySelectorAll(`[data-nav="${key}"]`).forEach((el) => {
    el.classList.add("is-active");
  });
}
function initFooterYear() {
  const el = document.getElementById("bp-footer-year");
  if (!el) return;
  el.textContent = String(new Date().getFullYear());
}
function waitForEl(selector, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const start = performance.now();
    const t = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) { clearInterval(t); resolve(el); }
      if (performance.now() - start > timeoutMs) { clearInterval(t); resolve(null); }
    }, 50);
  });
}

/* ------------------------------------------------------
   Init
------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  // AOS
 document.addEventListener("DOMContentLoaded", async () => {
  if (window.AOS) window.AOS.init({ duration: 800, once: true });

  initIntroCurtain();
  initHeroWave();
  initOverviewConstellation();
  initHowItWorksMuscleMap();

  // Wait until header/footer are injected, then init nav behaviors
  await waitForEl(".bp-header");
  initMobileMenu();
  initActiveNav();

  await waitForEl(".bp-footer");
  initFooterYear();
});

  // Animated sections (safe if missing)
  initOverviewConstellation();
  initHowItWorksMuscleMap();
});
