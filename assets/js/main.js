/* =========================================================
   All Nine Services — site behaviour
   ========================================================= */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const CFG = window.ALLNINE_CONFIG || {};
  const RESOURCES = window.ALLNINE_RESOURCES || [];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Header ---------- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  if (toggle) toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$(".has-dropdown > .nav__link").forEach((btn) => btn.addEventListener("click", (e) => {
    const li = btn.parentElement;
    const open = li.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open);
    e.stopPropagation();
  }));
  document.addEventListener("click", (e) => {
    $$(".has-dropdown.is-open").forEach((li) => { if (!li.contains(e.target)) li.classList.remove("is-open"); });
  });

  /* ---------- Reveal on scroll ---------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 }) : null;
  const observe = (root = document) => {
    // stagger siblings that reveal together (cards in a grid, etc.)
    $$(".reveal:not(.is-in)", root).forEach((el) => {
      const sibs = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
      if (sibs.length > 1) el.style.setProperty("--stagger", (sibs.indexOf(el) % 6) * 0.09 + "s");
      io ? io.observe(el) : el.classList.add("is-in");
    });
  };
  observe();

  /* ---------- Process line draws with scroll ---------- */
  const proc = $("[data-process]");
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (proc && !reduce) {
    const upd = () => {
      const r = proc.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.6)));
      proc.style.setProperty("--p", p.toFixed(3));
    };
    window.addEventListener("scroll", upd, { passive: true }); upd();
  }

  /* ---------- Gentle parallax on hero image ---------- */
  const heroImg = $(".hero__media");
  if (heroImg && !reduce && window.innerWidth > 920) {
    window.addEventListener("scroll", () => {
      const y = Math.min(window.scrollY, 700);
      heroImg.style.transform = `translateY(${y * -0.06}px)`;
    }, { passive: true });
  }

  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* =========================================================
     Resources listing (from assets/js/resources.js)
     ========================================================= */
  const ICON_PDF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>';
  const ICON_DL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16"/></svg>';

  const card = (r) => `<article class="res-card reveal">
      <div class="res-card__cover" data-cat="${esc(r.category)}">
        <span class="res-card__tag">${esc(r.category || "Insight")}</span>
        <span class="res-card__pdf">${ICON_PDF} Free PDF guide</span>
      </div>
      <div class="res-card__body">
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.description || "")}</p>
        <button class="btn btn--dark btn--sm" data-download="${esc(r.id)}">${ICON_DL} Download PDF</button>
      </div>
    </article>`;

  $$("[data-resources]").forEach((g) => {
    const draw = (cat) => {
      const limit = parseInt(g.dataset.limit || "0", 10);
      let list = RESOURCES.filter((r) => !cat || cat === "All" || r.category === cat);
      if (limit) list = list.slice(0, limit);
      g.innerHTML = list.length ? list.map(card).join("") : '<div class="res-empty">New guides are on the way. Check back soon.</div>';
      observe(g);
    };
    draw(g.dataset.category || "");
    const filters = g.dataset.filters ? $(g.dataset.filters) : null;
    if (filters) filters.addEventListener("click", (e) => {
      const b = e.target.closest(".res-filter"); if (!b) return;
      $$(".res-filter", filters).forEach((x) => x.classList.toggle("is-active", x === b));
      draw(b.dataset.cat);
    });
  });
  // hide "download guide" buttons for categories without a PDF
  $$("[data-download][data-category]").forEach((b) => {
    if (!RESOURCES.some((r) => r.category === b.dataset.category)) {
      const wrap = b.closest(".dl-callout"); (wrap || b).style.display = "none";
    }
  });

  /* =========================================================
     Form helpers
     ========================================================= */
  function validate(form) {
    let ok = true;
    $$(".field", form).forEach((f) => f.classList.remove("has-error"));
    $$("[required]", form).forEach((inp) => {
      const field = inp.closest(".field");
      let bad = inp.type === "checkbox" ? !inp.checked : !inp.value.trim();
      if (!bad && inp.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim());
      if (!bad && inp.type === "tel") bad = inp.value.replace(/\D/g, "").length < 7;
      if (bad) { ok = false; if (field) field.classList.add("has-error"); }
    });
    if (!ok) { const first = $(".has-error input, .has-error select, .has-error textarea", form); first && first.focus(); }
    return ok;
  }
  const status = (form, msg, type) => { const el = $(".form-status", form); if (!el) return; el.className = "form-status" + (type ? " is-" + type : ""); el.textContent = msg || ""; };

  // Send a lead: Netlify Forms by default, or a custom endpoint from config.js
  async function sendLead(form) {
    const fd = new FormData(form);
    if (CFG.FORM_ENDPOINT) {
      const res = await fetch(CFG.FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: fd });
      if (!res.ok) throw new Error("Form service error " + res.status);
      return;
    }
    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fd).toString()
    });
    if (!res.ok) throw new Error("Form error " + res.status);
  }

  /* =========================================================
     Contact form
     ========================================================= */
  $$("form[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (form["bot-field"] && form["bot-field"].value) return;
      if (!validate(form)) return;
      const btn = $("button[type=submit]", form); btn.disabled = true; const label = btn.innerHTML; btn.textContent = "Sending…";
      try {
        await sendLead(form);
        form.reset();
        status(form, "Thank you — your message has reached us. Our team will get back to you within one business day.", "ok");
      } catch (err) {
        console.error(err);
        status(form, "Sorry, something went wrong. Please email us directly at " + (CFG.CONTACT_EMAIL || "") + ".", "err");
      } finally { btn.disabled = false; btn.innerHTML = label; }
    });
  });

  /* =========================================================
     Download gate (modal)
     ========================================================= */
  const modal = $("#dl-modal");
  const dlForm = $("#dl-form");
  let current = null;
  const PROFILE_KEY = "allnine-profile";
  const getProfile = () => { try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null"); } catch (e) { return null; } };
  const setProfile = (p) => { try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch (e) {} };

  function openModal(r) {
    current = r;
    $("#dl-title").textContent = r.title;
    dlForm.hidden = false; $("#dl-success").hidden = true; status(dlForm, "");
    dlForm.resource.value = r.title;
    const p = getProfile();
    if (p) ["name", "email", "phone", "company", "country"].forEach((k) => { if (dlForm[k] && p[k]) dlForm[k].value = p[k]; });
    modal.classList.add("is-open"); document.body.classList.add("modal-open");
    setTimeout(() => (dlForm.name.value ? $("button[type=submit]", dlForm) : dlForm.name).focus(), 50);
  }
  function closeModal() { modal.classList.remove("is-open"); document.body.classList.remove("modal-open"); }
  if (modal) {
    $$("[data-close]", modal).forEach((b) => b.addEventListener("click", closeModal));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-download]");
    if (!b || !modal) return;
    e.preventDefault();
    const id = b.dataset.download;
    const r = id ? RESOURCES.find((x) => x.id === id) : RESOURCES.find((x) => x.category === b.dataset.category);
    if (!r) { location.href = "resources.html"; return; }
    openModal(r);
  });

  function download(r) {
    const a = document.createElement("a");
    a.href = r.file; a.download = r.file.split("/").pop(); a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
  }

  if (dlForm) dlForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (dlForm["bot-field"] && dlForm["bot-field"].value) return;
    if (!validate(dlForm)) return;
    const btn = $("button[type=submit]", dlForm); btn.disabled = true; const label = btn.innerHTML; btn.textContent = "Preparing your PDF…";
    try {
      await sendLead(dlForm);
    } catch (err) {
      // Never block the visitor from their PDF if the form service hiccups
      console.error(err);
    }
    setProfile(Object.fromEntries(["name", "email", "phone", "company", "country"].map((k) => [k, dlForm[k] ? dlForm[k].value : ""])));
    dlForm.hidden = true; $("#dl-success").hidden = false;
    $("#dl-success-title").textContent = current.title;
    $("#dl-again").href = current.file;
    download(current);
    btn.disabled = false; btn.innerHTML = label;
  });
})();
