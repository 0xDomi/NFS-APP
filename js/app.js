/* ============ NFS Lernapp – Core (Router, State, Daten) ============ */

const App = (() => {
  const APP_VERSION = "0.1.1"; // Release-Version; bei jedem Release erhöhen (auch CACHE in sw.js)
  const DATA_FILES = [
    "data/meds_herz.json",
    "data/meds_acs_rr.json",
    "data/meds_atemwege.json",
    "data/meds_analgesie.json",
    "data/meds_narkose_weitere.json"
  ];
  const LS_KEY = "nfs-app-v1";

  const state = {
    meds: [],
    grundlagen: [],
    favs: new Set(),
    history: [],       // Medikamenten-IDs, zuletzt zuerst
    searchHistory: [], // Suchbegriffe
    cardsBox: {},      // cardKey -> 0..3
    quizErrors: {}     // questionKey -> true
  };

  /* ---------- Persistenz ---------- */
  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        favs: [...state.favs],
        history: state.history,
        searchHistory: state.searchHistory,
        cardsBox: state.cardsBox,
        quizErrors: state.quizErrors
      }));
    } catch (e) { /* Speicher voll o.ä. – App bleibt nutzbar */ }
  }
  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      state.favs = new Set(d.favs || []);
      state.history = d.history || [];
      state.searchHistory = d.searchHistory || [];
      state.cardsBox = d.cardsBox || {};
      state.quizErrors = d.quizErrors || {};
    } catch (e) { /* korrupte Daten ignorieren */ }
  }

  function pushHistory(id) {
    state.history = [id, ...state.history.filter(x => x !== id)].slice(0, 20);
    save();
  }

  /* ---------- Lernkarten-Generierung (nur aus Unterlagen-Daten) ---------- */
  let _cards = null;
  function allCards() {
    if (_cards) return _cards;
    const cards = [];
    const plain = v => Array.isArray(v) ? v.filter(x => !/^nicht in Unterlagen/.test(x)) : v;
    const esc = NFSSearch.esc;
    const ul = arr => "<ul>" + arr.map(x => `<li>${esc(x)}</li>`).join("") + "</ul>";

    for (const m of state.meds) {
      const add = (suffix, label, q, aHtml) => cards.push({
        key: m.id + ":" + suffix, medId: m.id, gruppe: m.gruppe, label, q, aHtml
      });
      if (m.handelsname) add("hn", "Handelsname", `Handelsname & Konzentration von ${m.name}?`, esc(m.handelsname));
      const ind = plain(m.indikation);
      if (ind && ind.length) add("ind", "Indikation", `Indikationen von ${m.name}?`, ul(ind));
      if (m.dosierung && m.dosierung.length) add("dos", "Dosierung", `Dosierung von ${m.name}?`,
        m.dosierung.map(d => `<div class="dose-row"><span class="dose-ctx">${esc(d.kontext)}</span><span>${esc(d.wert)}</span></div>`).join(""));
      if (m.wirkung && !/^nicht in Unterlagen/.test(m.wirkung)) add("wir", "Wirkung", `Wirkung von ${m.name}?`, esc(m.wirkung));
      const ki = plain(m.kontraindikation);
      if (ki && ki.length) add("ki", "Kontraindikation", `Kontraindikationen von ${m.name}?`, ul(ki));
      const nw = plain(m.nebenwirkungen);
      if (nw && nw.length) add("nw", "Nebenwirkungen", `Nebenwirkungen von ${m.name}?`, ul(nw));
      if (m.achtung) add("cave", "CAVE", `Worauf ist bei ${m.name} besonders zu achten?`, esc(m.achtung));
    }
    for (const g of state.grundlagen) {
      cards.push({ key: "g:" + g.id, medId: null, gruppe: "Pharma-Grundlagen", label: "Grundlagen", q: g.titel + "?", aHtml: NFSSearch.esc(g.inhalt).replace(/\n/g, "<br>") });
    }
    _cards = cards;
    return cards;
  }

  /* ---------- Quiz-Generierung ---------- */
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function buildQuiz(n) {
    const qs = [];
    const meds = state.meds;
    const distinct = (getter, self) => shuffle(meds.filter(m => m !== self && getter(m)).map(getter)).slice(0, 3);

    for (const m of meds) {
      // 1) Handelsname → Medikament
      const hn = (m.handelsname || "").split(/[,|]| oder /)[0].trim();
      if (hn && hn.toLowerCase() !== m.name.toLowerCase()) {
        const opts = shuffle([m.name, ...shuffle(meds.filter(x => x !== m).map(x => x.name)).slice(0, 3)]);
        qs.push({ key: "q-hn:" + m.id, medId: m.id, q: `Zu welchem Medikament gehört der Handelsname „${hn}“?`, options: opts, answer: opts.indexOf(m.name) });
      }
      // 2) Gruppe/Untergruppe
      if (m.untergruppe) {
        const others = [...new Set(meds.filter(x => x.untergruppe && x.untergruppe !== m.untergruppe).map(x => x.untergruppe))];
        const opts = shuffle([m.untergruppe, ...shuffle(others).slice(0, 3)]);
        qs.push({ key: "q-gr:" + m.id, medId: m.id, q: `Zu welcher Wirkstoffgruppe gehört ${m.name}?`, options: opts, answer: opts.indexOf(m.untergruppe) });
      }
      // 3) Indikation → Medikament
      const ind = (m.indikation || []).filter(x => !/^nicht in Unterlagen/.test(x));
      if (ind.length) {
        const i0 = ind[0];
        const others = meds.filter(x => x !== m && !(x.indikation || []).some(y => y.toLowerCase().includes(i0.slice(0, 12).toLowerCase())));
        const opts = shuffle([m.name, ...shuffle(others.map(x => x.name)).slice(0, 3)]);
        qs.push({ key: "q-ind:" + m.id, medId: m.id, q: `Welches Medikament ist laut Unterlagen indiziert bei: „${i0}“?`, options: opts, answer: opts.indexOf(m.name) });
      }
      // 4) Kontraindikation wahr/falsch-artig als MC
      const ki = (m.kontraindikation || []).filter(x => !/^nicht in Unterlagen/.test(x));
      if (ki.length >= 1) {
        const fake = shuffle((m.indikation || []).filter(x => !/^nicht in Unterlagen/.test(x)))[0];
        if (fake) {
          const opts = shuffle([ki[0], fake]);
          qs.push({ key: "q-ki:" + m.id, medId: m.id, q: `Welche der folgenden ist eine KONTRAindikation von ${m.name}?`, options: opts, answer: opts.indexOf(ki[0]) });
        }
      }
    }
    return shuffle(qs).slice(0, n);
  }

  /* ---------- Router ---------- */
  const viewEl = () => document.getElementById("view");
  const titleEl = () => document.getElementById("topbar-title");

  function parseHash() {
    const h = location.hash || "#/";
    const [path, qstr] = h.split("?");
    const params = {};
    if (qstr) for (const kv of qstr.split("&")) {
      const [k, v] = kv.split("=");
      params[decodeURIComponent(k)] = decodeURIComponent(v || "");
    }
    return { path, params };
  }

  function route() {
    const { path, params } = parseHash();
    const el = viewEl();
    el.scrollTop = 0; window.scrollTo(0, 0);
    // Re-Animation
    el.style.animation = "none"; void el.offsetHeight; el.style.animation = "";

    const seg = path.replace(/^#\//, "").split("/");
    let tab = "home", title = "NFS Lernapp";

    if (!seg[0]) { Views.dashboard(el); }
    else if (seg[0] === "meds") { Views.medsList(el, params); tab = "meds"; title = "Medikamente"; }
    else if (seg[0] === "med") { Views.medDetail(el, seg[1]); tab = "meds"; title = "Medikament"; }
    else if (seg[0] === "aml") { Views.aml(el); tab = "aml"; title = "AML OÖ V5.1"; }
    else if (seg[0] === "grundlagen" && seg[1]) { Views.grundlagenDetail(el, seg[1]); title = "Grundlagen"; }
    else if (seg[0] === "grundlagen") { Views.grundlagenList(el); title = "Grundlagen"; }
    else if (seg[0] === "karten") { Views.karten(el, params); tab = "karten"; title = "Lernkarten"; }
    else if (seg[0] === "quiz") { Views.quiz(el, params); tab = "quiz"; title = "Quiz"; }
    else if (seg[0] === "modul") { Views.modul(el, seg[1]); title = "Modul"; }
    else if (seg[0] === "settings") { Views.settings(el); title = "Einstellungen"; }
    else { Views.dashboard(el); }

    titleEl().textContent = title;
    document.querySelectorAll(".tabbar a").forEach(a => a.classList.toggle("active", a.dataset.tab === tab));
  }

  function go(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  }

  /* ---------- Globale Suche ---------- */
  const overlay = () => document.getElementById("search-overlay");
  const sInput = () => document.getElementById("search-input");
  const sResults = () => document.getElementById("search-results");

  function openSearch() {
    overlay().hidden = false;
    sInput().value = "";
    renderSearchIdle();
    setTimeout(() => sInput().focus(), 60);
  }
  function closeSearch() { overlay().hidden = true; }

  function renderSearchIdle() {
    const favs = state.meds.filter(m => state.favs.has(m.id)).slice(0, 5);
    let html = "";
    if (state.searchHistory.length) {
      html += `<div class="sr-group-head">Suchhistorie</div>` + state.searchHistory.slice(0, 6).map(t =>
        `<button class="sr-item" data-q="${NFSSearch.esc(t)}"><span>🕘</span><span class="sr-title">${NFSSearch.esc(t)}</span></button>`).join("");
    }
    if (favs.length) {
      html += `<div class="sr-group-head">Favoriten</div>` + favs.map(m =>
        `<button class="sr-item" data-route="#/med/${m.id}"><span>★</span><div><div class="sr-title">${NFSSearch.esc(m.name)}</div><div class="sr-sub">${NFSSearch.esc(m.untergruppe || m.gruppe)}</div></div></button>`).join("");
    }
    if (!html) html = `<div class="sr-empty">Tippe, um Medikamente, Gruppen und Grundlagen zu durchsuchen.<br>Fehlertolerant & mit Teilwortsuche.</div>`;
    sResults().innerHTML = html;
    bindSearchResults();
  }

  function renderSearchResults(q) {
    const res = NFSSearch.query(q);
    if (!res.length) { sResults().innerHTML = `<div class="sr-empty">Keine Treffer für „${NFSSearch.esc(q)}“.<br><span style="font-size:12.5px">Hinweis: Es werden nur Inhalte aus den Unterlagen durchsucht.</span></div>`; return; }
    const byType = {};
    for (const r of res) (byType[r.type] = byType[r.type] || []).push(r);
    sResults().innerHTML = Object.entries(byType).map(([type, items]) =>
      `<div class="sr-group-head">${type === "Medikament" ? "Medikamente" : type}</div>` +
      items.map(r => `<button class="sr-item" data-route="${r.route}" data-save="${NFSSearch.esc(q)}">
        <span>${type === "Medikament" ? "💊" : "🧠"}</span>
        <div><div class="sr-title">${NFSSearch.highlight(r.title, q)}</div><div class="sr-sub">${NFSSearch.esc(r.sub)}</div></div>
      </button>`).join("")
    ).join("");
    bindSearchResults();
  }

  function bindSearchResults() {
    sResults().querySelectorAll(".sr-item").forEach(b => b.onclick = () => {
      if (b.dataset.q) { sInput().value = b.dataset.q; renderSearchResults(b.dataset.q); return; }
      if (b.dataset.save) {
        const q = b.dataset.save;
        state.searchHistory = [q, ...state.searchHistory.filter(x => x !== q)].slice(0, 10);
        save();
      }
      closeSearch();
      go(b.dataset.route);
    });
  }

  /* ---------- Favoriten (global delegiert) ---------- */
  document.addEventListener("click", e => {
    const fb = e.target.closest("[data-fav]");
    if (fb) {
      e.preventDefault(); e.stopPropagation();
      const id = fb.dataset.fav;
      if (state.favs.has(id)) state.favs.delete(id); else state.favs.add(id);
      save();
      route(); // neu rendern
    }
  }, true);

  /* ---------- Init ---------- */
  async function init() {
    load();
    try {
      const payloads = await Promise.all(
        [...DATA_FILES, "data/grundlagen.json"].map(f => fetch(f).then(r => {
          if (!r.ok) throw new Error(f);
          return r.json();
        }))
      );
      state.grundlagen = payloads.pop();
      state.meds = payloads.flat();
    } catch (err) {
      viewEl().innerHTML = `<div class="placeholder-box card">Daten konnten nicht geladen werden.<br><small>${NFSSearch.esc(String(err))}</small></div>`;
      return;
    }
    NFSSearch.build(state.meds, state.grundlagen);

    window.addEventListener("hashchange", route);
    document.getElementById("btn-home").onclick = () => go("#/");
    document.getElementById("btn-search").onclick = openSearch;
    document.getElementById("search-close").onclick = closeSearch;
    overlay().addEventListener("click", e => { if (e.target === overlay()) closeSearch(); });

    let debounce;
    sInput().addEventListener("input", () => {
      clearTimeout(debounce);
      const q = sInput().value.trim();
      debounce = setTimeout(() => q ? renderSearchResults(q) : renderSearchIdle(), 90);
    });
    document.addEventListener("keydown", e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
      if (e.key === "Escape" && !overlay().hidden) closeSearch();
    });

    route();
    initServiceWorker();
  }

  /* ---------- Service Worker / Updates ---------- */
  let swReg = null;
  let updateWaiting = null; // wartender (neuer) Service Worker

  function initServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("sw.js").then(reg => {
      swReg = reg;
      if (reg.waiting && navigator.serviceWorker.controller) { updateWaiting = reg.waiting; onUpdateAvailable(); }
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", () => {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            updateWaiting = nw; onUpdateAvailable();
          }
        });
      });
    }).catch(() => {});
    let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloaded) return; reloaded = true; window.location.reload();
    });
  }

  function onUpdateAvailable() {
    if (location.hash === "#/settings") route();
  }

  async function checkForUpdates() {
    if (!("serviceWorker" in navigator)) return "unsupported";
    if (!swReg) swReg = await navigator.serviceWorker.getRegistration() || null;
    if (!swReg) return "unsupported";
    try { await swReg.update(); } catch (e) { return "offline"; }
    await new Promise(r => setTimeout(r, 800));
    const waiting = updateWaiting || swReg.waiting;
    if (waiting) { waiting.postMessage("SKIP_WAITING"); return "updating"; }
    return "current";
  }

  async function forceReinstall() {
    try {
      if ("caches" in window) { const keys = await caches.keys(); await Promise.all(keys.map(k => caches.delete(k))); }
      if ("serviceWorker" in navigator) { const regs = await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map(r => r.unregister())); }
    } catch (e) {}
    window.location.reload(true);
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    state, save, go, openSearch, pushHistory, allCards, buildQuiz,
    APP_VERSION, checkForUpdates, forceReinstall,
    hasWaitingUpdate: () => !!(updateWaiting || (swReg && swReg.waiting))
  };
})();
