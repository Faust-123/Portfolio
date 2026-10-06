/* ==========================================================================
   Portfolio — ABI Gnim-gong Faustin
   Interactions : navigation, animations, galerie, formulaire
   ========================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     1. En-tête : ombre au défilement, barre de progression, bouton haut
     --------------------------------------------------------------------- */
  const header = $("#header");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("is-visible", y > 520);
  }

  let ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });

  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
     2. Menu mobile
     --------------------------------------------------------------------- */
  const navToggle = $("#navToggle");
  const nav = $("#primaryNav");

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Ouvrir le menu");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });

    $$("a", nav).forEach((a) => a.addEventListener("click", closeNav));

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || navToggle.contains(e.target)) return;
      closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ---------------------------------------------------------------------
     3. Lien de navigation actif selon la section visible
     --------------------------------------------------------------------- */
  const navLinks = $$(".nav__link");
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") && id.length > 1 ? $(id) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const visible = new Map();

    const navObserver = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      let bestId = null;
      let bestRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      if (bestId) setActive(bestId);
    }, {
      rootMargin: "-" + 90 + "px 0px -55% 0px",
      threshold: [0, 0.15, 0.35, 0.6, 0.9]
    });

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------------------------------------------------------------------
     4. Animations d'apparition
     --------------------------------------------------------------------- */
  const revealItems = $$(".reveal");
  revealItems.forEach((el) => {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty("--delay", delay + "ms");
  });

  function showAll() {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    const revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealItems.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------------------
     5. Barres de compétences
     --------------------------------------------------------------------- */
  const skills = $$(".skill");

  function fillSkill(el) {
    const bar = $(".skill__bar i", el);
    if (!bar) return;
    const level = parseFloat(getComputedStyle(el).getPropertyValue("--level")) || 0;
    bar.style.width = Math.max(0, Math.min(100, level)) + "%";
  }

  if (skills.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      skills.forEach(fillSkill);
    } else {
      const skillObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          fillSkill(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.4 });

      skills.forEach((el) => skillObserver.observe(el));
    }
  }

  /* ---------------------------------------------------------------------
     6. Lightbox de la galerie
     --------------------------------------------------------------------- */
  const lightbox = $("#lightbox");
  const lbImage = $("#lbImage");
  const lbCaption = $("#lbCaption");
  const triggers = $$("[data-src]");
  let current = -1;
  let lastFocus = null;

  function render(index) {
    if (!triggers.length) return;
    current = (index + triggers.length) % triggers.length;
    const trigger = triggers[current];
    const caption = trigger.dataset.caption || "";
    const alt = $("img", trigger);

    lbImage.src = trigger.dataset.src;
    lbImage.alt = alt ? alt.alt : caption;
    lbCaption.textContent = caption;

    // Préchargement des voisins pour une navigation fluide
    [1, -1].forEach((offset) => {
      const next = triggers[(current + offset + triggers.length) % triggers.length];
      if (next && next.dataset.src) new Image().src = next.dataset.src;
    });
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lastFocus = document.activeElement;
    render(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = $("#lbClose");
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  if (lightbox && triggers.length) {
    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", function (e) {
        // Sans JavaScript, le lien ouvrirait simplement l'image : ici on l'évite
        e.preventDefault();
        openLightbox(index);
      });
    });

    $("#lbClose").addEventListener("click", closeLightbox);
    $("#lbPrev").addEventListener("click", () => render(current - 1));
    $("#lbNext").addEventListener("click", () => render(current + 1));

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") render(current + 1);
      if (e.key === "ArrowLeft") render(current - 1);
      if (e.key === "Tab") {
        // Piège le focus à l'intérieur de la visionneuse
        const focusables = $$("button", lightbox);
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------------------------------------------------------------------
     7. Formulaire de contact → ouverture du client de messagerie
     --------------------------------------------------------------------- */
  const form = $("#contactForm");
  const note = $("#formNote");

  function setNote(message, state) {
    if (!note) return;
    note.textContent = message;
    note.classList.remove("is-ok", "is-error");
    if (state) note.classList.add(state);
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameField = $("#name");
      const emailField = $("#email");
      const messageField = $("#message");
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailField.value.trim());

      nameField.setAttribute("aria-invalid", String(!nameField.value.trim()));
      emailField.setAttribute("aria-invalid", String(!emailOk));
      messageField.setAttribute("aria-invalid", String(!messageField.value.trim()));

      if (!nameField.value.trim()) {
        setNote("Merci d'indiquer votre nom.", "is-error");
        nameField.focus();
        return;
      }
      if (!emailOk) {
        setNote("Merci d'indiquer une adresse e-mail valide.", "is-error");
        emailField.focus();
        return;
      }
      if (!messageField.value.trim()) {
        setNote("Merci d'écrire votre message.", "is-error");
        messageField.focus();
        return;
      }

      const subject = "Message depuis le portfolio — " + nameField.value.trim();
      const body =
        messageField.value.trim() +
        "\n\n—\n" +
        nameField.value.trim() +
        "\n" + emailField.value.trim();

      const link =
        "mailto:abignimgong@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      setNote("Ouverture de votre logiciel de messagerie…", "is-ok");
      window.location.href = link;
    });

    form.addEventListener("reset", function () {
      ["#name", "#email", "#message"].forEach((sel) => {
        const el = $(sel);
        if (el) el.removeAttribute("aria-invalid");
      });
      setNote("Le message s'ouvrira dans votre application d'e-mail, prêt à être envoyé.");
    });
  }
})();
