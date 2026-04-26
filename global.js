// ------------------------------------------------------
// BioPulse global.js
// ------------------------------------------------------

// Toast
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

// Header partner dropdown
function initPartnerMenu() {
  const wraps = document.querySelectorAll(".bp-header-menuWrap");
  if (!wraps.length) return;

  wraps.forEach((wrap) => {
    const trigger = wrap.querySelector(".bp-partner-trigger");
    const menu = wrap.querySelector(".bp-partner-menu");
    if (!trigger || !menu) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      wraps.forEach((otherWrap) => {
        if (otherWrap !== wrap) {
          otherWrap.classList.remove("open");
          const otherTrigger = otherWrap.querySelector(".bp-partner-trigger");
          const otherMenu = otherWrap.querySelector(".bp-partner-menu");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          if (otherMenu) otherMenu.setAttribute("aria-hidden", "true");
        }
      });

      const isOpen = wrap.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      menu.setAttribute("aria-hidden", String(!isOpen));
    });
  });

  document.addEventListener("click", () => {
    wraps.forEach((wrap) => {
      wrap.classList.remove("open");
      const trigger = wrap.querySelector(".bp-partner-trigger");
      const menu = wrap.querySelector(".bp-partner-menu");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
      if (menu) menu.setAttribute("aria-hidden", "true");
    });
  });
}

// Talk modal
function initTalkModal() {
  const modal = document.getElementById("bp-talk-modal");
  if (!modal) return;

  const openers = document.querySelectorAll("[data-modal-open]");
  const closeBtn = modal.querySelector(".bp-modal-close");
  const backdrop = modal.querySelector(".bp-modal-backdrop");

  function openModal() {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const firstInput = modal.querySelector('input:not([type="hidden"]), textarea, button');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openers.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".bp-header-menuWrap").forEach((wrap) => {
        wrap.classList.remove("open");

        const trigger = wrap.querySelector(".bp-partner-trigger");
        const menu = wrap.querySelector(".bp-partner-menu");

        if (trigger) trigger.setAttribute("aria-expanded", "false");
        if (menu) menu.setAttribute("aria-hidden", "true");
      });

      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

// Formspree routing
function initPartnerFormspree() {
  const form = document.getElementById("bp-talk-form");
  const interestInput = document.getElementById("bp-interest-type");
  const title = document.getElementById("bp-talk-title");
  const copy = document.getElementById("bp-talk-copy");

  const labFields = document.getElementById("bp-lab-fields");
  const investorFields = document.getElementById("bp-investor-fields");
  const generalFields = document.getElementById("bp-general-fields");

  if (!form || !interestInput || !labFields || !investorFields || !generalFields) return;

  const endpoints = {
    lab: "https://formspree.io/f/xjgjdgjv",
    investor: "https://formspree.io/f/mdayvayk",
    general: "https://formspree.io/f/xjgjdgjv",
  };

  function clearRequirements() {
    form.querySelectorAll("input, textarea").forEach((el) => {
      if (el.type !== "hidden") el.required = false;
    });

    const firstName = form.querySelector('input[name="firstName"]');
    const lastName = form.querySelector('input[name="lastName"]');

    if (firstName) firstName.required = true;
    if (lastName) lastName.required = true;
  }

  function switchForm(type = "general") {
    labFields.hidden = type !== "lab";
    investorFields.hidden = type !== "investor";
    generalFields.hidden = type !== "general";

    interestInput.value = type;
    form.action = endpoints[type] || endpoints.general;
    form.method = "POST";

    clearRequirements();

    if (type === "lab") {
      if (title) title.textContent = "Partner With BioPulse — Labs";
      if (copy) {
        copy.textContent =
            "Tell us who you are, where you work, and how you’d want to use BioPulse in your biomechanics lab.";
      }

      const org = form.querySelector('input[name="labOrganization"]');
      const role = form.querySelector('input[name="labRole"]');
      const email = form.querySelector('input[name="labEmail"]');

      if (org) org.required = true;
      if (role) role.required = true;
      if (email) email.required = true;
    } else if (type === "investor") {
      if (title) title.textContent = "Partner With BioPulse — Investors";
      if (copy) copy.textContent = "Share your contact information and our team will follow up with you.";

      const name = form.querySelector('input[name="investorName"]');
      const email = form.querySelector('input[name="investorEmail"]');

      if (name) name.required = true;
      if (email) email.required = true;
    } else {
      if (title) title.textContent = "Partner With BioPulse";
      if (copy) copy.textContent = "Tell us a bit about your interest and our team will reach out shortly.";

      const email = form.querySelector('input[name="generalEmail"]');
      if (email) email.required = true;
    }
  }

  document.querySelectorAll("[data-interest]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchForm(btn.dataset.interest || "general");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const type = interestInput.value || "general";
    const endpoint = endpoints[type] || endpoints.general;

    const formData = new FormData(form);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        // SUCCESS UI
        if (window.bpToast) {
          window.bpToast("We’ll reach out to you shortly.");
        }

        form.reset();

        // reset to default state
        switchForm("general");

        // close modal
        const modal = document.getElementById("bp-talk-modal");
        if (modal) {
          modal.classList.remove("active");
          modal.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
        }
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      if (window.bpToast) {
        window.bpToast("Something went wrong. Please try again.");
      }
    }
  });

  switchForm("general");
}

// BioPulse Application tabs
function initBioPulseAppTabs() {
  const section = document.querySelector("#application");
  if (!section) return;

  const tabs = section.querySelectorAll(".bp-app-tab");
  const panels = section.querySelectorAll(".bp-app-panel");

  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      if (!target) return;

      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");

      const activePanel = section.querySelector(`[data-panel="${target}"]`);
      if (activePanel) activePanel.classList.add("active");
    });
  });
}

// Intro curtain
function initIntroCurtain() {
  const intro = document.querySelector(".bp-intro");
  if (!intro) return;

  const removeIntro = () => {
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
  };

  intro.addEventListener("animationend", removeIntro, { once: true });
  window.setTimeout(removeIntro, 2600);
}

// Hero video autoplay
function initHeroVideoAutoplay() {
  const videos = document.querySelectorAll(".bp-hero-video");
  if (!videos.length) return;

  videos.forEach((v) => {
    v.removeAttribute("controls");

    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;

    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("autoplay", "");
    v.setAttribute("loop", "");

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();
    v.addEventListener("loadedmetadata", tryPlay, { once: true });
    v.addEventListener("canplay", tryPlay, { once: true });
  });
}

// Applications section tabs / rail
function initApplicationsRail() {
  const root = document.querySelector(".bp-apps2");
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll(".bp-apps2-tab"));
  const panes = Array.from(root.querySelectorAll(".bp-apps2-pane"));
  const panel = root.querySelector(".bp-apps2-panel");

  if (!tabs.length || !panes.length) return;

  function setActive(key) {
    tabs.forEach((t) => {
      const on = t.dataset.app === key;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });

    panes.forEach((p) => {
      p.classList.toggle("is-active", p.dataset.pane === key);
    });

    if (panel) {
      panel.style.transform = "translateY(-1px)";
      setTimeout(() => {
        panel.style.transform = "";
      }, 120);
    }
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => setActive(t.dataset.app));
  });

  let idx = 0;
  let timer = null;
  const keys = tabs.map((t) => t.dataset.app);

  function start() {
    if (timer || !keys.length) return;

    timer = setInterval(() => {
      idx = (idx + 1) % keys.length;
      setActive(keys[idx]);
    }, 5200);
  }

  function stop() {
    if (!timer) return;

    clearInterval(timer);
    timer = null;
  }

  const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      },
      { threshold: 0.35 }
  );

  io.observe(root);

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
}

// Basic accordions
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

// Basic tabs, if used elsewhere
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

      const panelById = document.getElementById(target);
      const panelByData = document.querySelector(`.bp-tab-panel[data-panel="${target}"]`);
      const panel = panelById || panelByData;

      if (panel) panel.classList.add("active");
    });
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) window.AOS.init({ duration: 800, once: true });

  initIntroCurtain();
  initPartnerMenu();
  initTalkModal();
  initPartnerFormspree();
  initBioPulseAppTabs();
  initHeroVideoAutoplay();
  initApplicationsRail();
  initAccordions();
  initTabs();
});