// ------------------------------------------------------
// BioPulse global.js (light, intro curtain + orb)
// ------------------------------------------------------

// Mobile nav toggle
function initMobileMenu() {
  const toggle = document.querySelector(".bp-nav-toggle");
  const mobileNav = document.querySelector(".bp-nav-mobile");

  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });
}

// Accordion behavior
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
      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");
    });
  });
}

// Toast
function showToast(message) {
  const toast = document.querySelector(".bp-toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("visible");

  setTimeout(() => {
    toast.classList.remove("visible");
  }, 3000);
}

// Forms
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
      showToast("Form submitted successfully!");
    });
  });
}

// Orb breathing (no mouse parallax)
function initOrbAnimation() {
  const orb = document.querySelector(".bp-orb");
  if (!orb || !window.gsap) return;

  gsap.to(orb, {
    duration: 18,
    rotate: 4,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
}

// Intro curtain cleanup – remove overlay after animation ends
function initIntroCurtain() {
  const intro = document.querySelector(".bp-intro");
  if (!intro) return;

  const handleEnd = () => {
    if (intro.parentNode) {
      intro.parentNode.removeChild(intro);
    }
  };

  intro.addEventListener("animationend", handleEnd, { once: true });
}

// ------------------------------------------------------
// DOMContentLoaded
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) {
    AOS.init({ duration: 800, once: true });
  }

  initMobileMenu();
  initAccordions();
  initTabs();
  initForms();
  initIntroCurtain();

  if (window.gsap) {
    initOrbAnimation();
  }
});
