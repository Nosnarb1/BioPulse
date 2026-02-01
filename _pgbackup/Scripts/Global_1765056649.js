// ------------------------------------------------------
// BioPulse global.js
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

// Tabs component
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
      if (panel) {
        panel.classList.add("active");
      }
    });
  });
}

// Toast notifications
function showToast(message) {
  const toast = document.querySelector(".bp-toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("visible");

  setTimeout(() => {
    toast.classList.remove("visible");
  }, 3000);
}

// Basic form handling example
function initForms() {
  const forms = document.querySelectorAll(".bp-form");
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const emailInput = form.querySelector("#emailInput");
      const errorEl = form.querySelector(".bp-error");

      if (!emailInput || !errorEl) return;

      // Simple email check
      if (!emailInput.value.includes("@")) {
        e.preventDefault();
        errorEl.textContent = "Please enter a valid email.";
        emailInput.classList.add("bp-input-error");
        return;
      }

      // Valid
      errorEl.textContent = "";
      emailInput.classList.remove("bp-input-error");

      // Optional toast
      showToast("Form submitted successfully!");
    });
  });
}

// ORB drift animation (GSAP)
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

// ORB cursor parallax (GSAP)
function initOrbParallax() {
  const orb = document.querySelector(".bp-orb");
  if (!orb || !window.gsap) return;

  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;

    gsap.to(orb, {
      x,
      y,
      duration: 1.2,
      ease: "power2.out",
    });
  });
}

// ------------------------------------------------------
// DOMContentLoaded bootstrap
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveals
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true,
    });
  }

  // Core UI
  initMobileMenu();
  initAccordions();
  initTabs();
  initForms();

  // Orb motion (GSAP required)
  if (window.gsap) {
    initOrbAnimation();
    initOrbParallax();
  }
});
