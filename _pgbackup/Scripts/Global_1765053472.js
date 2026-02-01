// ------------------------------------------------------
// BioPulse global.js
// Handles animations, mobile nav, accordions, tabs, forms
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

  items.forEach((item) => {
    const header = item.querySelector(".bp-accordion-header");

    header.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}

// Tabs component
function initTabs() {
  const tabs = document.querySelectorAll(".bp-tab");
  const panels = document.querySelectorAll(".bp-tab-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(target).classList.add("active");
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

// Initialize everything when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initAccordions();
  initTabs();

  // AOS (scroll reveal)
  if (window.AOS) {
    AOS.init({ duration: 800, once: true });
  }

  // GSAP orb animation (optional)
  if (window.gsap) {
    const orbInner = document.querySelector(".bp-orb-inner");
    if (orbInner) {
      gsap.to(orbInner, {
        duration: 6,
        scale: 1.04,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    const orb = document.querySelector(".bp-orb");
    if (orb) {
      gsap.to(orb, {
        duration: 18,
        rotate: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }
});
