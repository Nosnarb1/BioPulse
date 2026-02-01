// ------------------------------------------------------
// BioPulse global.js
// Handles animations, nav, accordions, tabs, forms
// ------------------------------------------------------

// Mobile nav toggle
function initMobileMenu() {
  const toggle = document.querySelector(".bp-nav-toggle");
  const mobileNav = document.querySelector(".bp-nav-mobile");

  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    // match CSS: bp-nav-mobile--open + bp-nav-toggle--open
    mobileNav.classList.toggle("bp-nav-mobile--open");
    toggle.classList.toggle("bp-nav-toggle--open");
  });
}

// Auto-highlight active nav link (desktop + mobile)
function initActiveNavLink() {
  const currentPathRaw = window.location.pathname || "/";
  // Normalize "/index.html" → "/"
  const currentPath = currentPathRaw.replace(/\/index\.html$/, "/");

  const links = document.querySelectorAll(
    ".bp-nav a.bp-nav-link, .bp-nav-mobile a.bp-nav-link"
  );

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const normalized = href.replace(/\/index\.html$/, "/");

    if (
      normalized === currentPath ||
      (normalized !== "/" && currentPath.startsWith(normalized))
    ) {
      link.classList.add("bp-nav-link-active");
    }
  });
}

// Shrink header on scroll
function initHeaderScroll() {
  const header = document.querySelector(".bp-header");
  if (!header) return;

  const applyState = () => {
    if (window.scrollY > 24) {
      header.classList.add("bp-header--scrolled");
    } else {
      header.classList.remove("bp-header--scrolled");
    }
  };

  applyState();
  window.addEventListener("scroll", applyState);
}

// Future Solutions dropdown (desktop)
// Safe to run even if dropdown HTML is still commented out
function initSolutionsDropdown() {
  const dropdownItem = document.querySelector(".bp-nav-item-has-dropdown");
  if (!dropdownItem) return;

  const trigger = dropdownItem.querySelector(".bp-nav-link-button");
  const menu = dropdownItem.querySelector(".bp-nav-dropdown");
  if (!trigger || !menu) return;

  let open = false;

  function setOpen(state) {
    open = state;
    dropdownItem.classList.toggle("open", open);
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!open);
  });

  document.addEventListener("click", () => {
    if (open) setOpen(false);
  });
}

// Accordion behavior
function initAccordions() {
  const items = document.querySelectorAll(".bp-accordion-item");

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

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");
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

// AOS (scroll reveal)
function initAOS() {
  if (window.AOS) {
    AOS.init({ duration: 800, once: true });
  }
}

// GSAP orb animation (optional)
function initOrbAnimation() {
  if (!window.gsap) return;

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

// Initialize everything when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initActiveNavLink();
  initHeaderScroll();
  initSolutionsDropdown();

  initAccordions();
  initTabs();
  initAOS();
  initOrbAnimation();
});
