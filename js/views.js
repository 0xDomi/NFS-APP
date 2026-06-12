/* ============ NFS Lernapp – Views ============ */
/* Alle Render-Funktionen. Benötigt: App (app.js), NFSSearch (search.js) */

const Views = (() => {
  const esc = NFSSearch.esc;

  const ICONS = {
    star: f => `<svg viewBox="0 0 24 24" width="20" height="20" fill="${f ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z"/></svg>`,
    chev: `<svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`
  };

  /* ---------- Hilfsfunktionen ---------- */
  function favBtn(id) {
    const faved = App.state.favs.has(id);
    return `<button class="fav-btn ${faved ? "faved" : ""}" data-fav="${id}" aria-label="Favorit">${ICONS.star(faved)}</button>`;
  }

  function listVal(v) {
    if (!v || (Array.isArray(v) && !v.length)) return `<span class="missing">nicht in Unterlagen vorhanden</span>`;
    if (Array.isArray(v)) {
      if (v.length === 1 && /^nicht in Unterlagen/.test(v[0])) return `<span class="missing">${esc(v[0])}</span>`;
      return "<ul>" + v.map(x => `<li>${esc(x)}</li>`).join("") + "</ul>";
    }
    if (/^nicht in Unterlagen/.test(v)) return `<span class="missing">${esc(v)}</span>`;
    return esc(v);
  }

  function section(title, icon, color, body, open = false) {
    return `<details class="detail-section" ${open ? "open" : ""}>
      <summary><span class="ds-icon" style="background:${color}22;color:${color}">${icon}</span>${esc(title)}${ICONS.chev}</summary>
      <div class="ds-body">${body}</div>
    </details>`;
  }

  /* ---------- Dashboard ---------- */
  function dashboard(el) {
    const s = App.state;
    const favMeds = s.meds.filter(m => s.favs.has(m.id)).slice(0, 6);
    const recent = s.history
      .map(id => s.meds.find(m => m.id === id)).filter(Boolean).slice(0, 5);
    const learned = Object.values(s.cardsBox).filter(b => b >= 2).length;
    const totalCards = App.allCards().length;
    const pct = totalCards ? Math.round((learned / totalCards) * 100) : 0;

    el.innerHTML = `
      <h1 class="page-title">NFS Lernapp</h1>
      <p class="page-sub">Dein Nachschlagewerk für die Notfallsanitäter-Ausbildung</p>

      <button class="hero-search" id="dash-search">
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        Medikament, Gruppe, Begriff suchen …
      </button>

      <div class="section-title">Schnellzugriff</div>
      <div class="grid-2">
        <a class="card tappable quick-card" href="#/meds">
          <span class="qc-icon" style="background:var(--accent-soft);color:var(--accent)">💊</span>
          <span class="qc-title">Medikamente</span><span class="qc-sub">${s.meds.length} Einträge</span>
        </a>
        <a class="card tappable quick-card" href="#/aml">
          <span class="qc-icon" style="background:var(--red-soft);color:var(--red)">📕</span>
          <span class="qc-title">AML OÖ V5.1</span><span class="qc-sub">Original-Dokument</span>
        </a>
        <a class="card tappable quick-card" href="#/karten">
          <span class="qc-icon" style="background:var(--teal-soft);color:var(--teal)">🗂️</span>
          <span class="qc-title">Lernkarten</span><span class="qc-sub">${totalCards} Karten</span>
        </a>
        <a class="card tappable quick-card" href="#/quiz">
          <span class="qc-icon" style="background:var(--violet-soft);color:var(--violet)">🧪</span>
          <span class="qc-title">Quiz</span><span class="qc-sub">Prüfungsmodus</span>
        </a>
      </div>

      <div class="section-title">Lernfortschritt</div>
      <div class="card">
        <div class="row"><strong>Karten sicher beherrscht</strong><span class="spacer"></span><span style="color:var(--text-dim)">${learned} / ${totalCards}</span></div>
        <div class="progress-bar"><div style="width:${pct}%"></div></div>
      </div>

      ${recent.length ? `<div class="section-title">Zuletzt angesehen</div>
      <div class="med-list">${recent.map(medRow).join("")}</div>` : ""}

      ${favMeds.length ? `<div class="section-title">Favoriten</div>
      <div class="med-list">${favMeds.map(medRow).join("")}</div>` : ""}

      <div class="section-title">Weitere Module</div>
      <div class="grid-2">
        ${[["Grundlagen", "#/grundlagen", "🧠", "Pharma-Basics", ""],
           ["Anatomie", "#/modul/anatomie", "🫀", "in Vorbereitung", "dim"],
           ["Notfälle", "#/modul/notfaelle", "🚑", "in Vorbereitung", "dim"],
           ["EKG", "#/modul/ekg", "📈", "in Vorbereitung", "dim"]]
          .map(([t, h, ic, sub]) => `<a class="card tappable quick-card" href="${h}">
            <span class="qc-icon" style="background:var(--surface-3)">${ic}</span>
            <span class="qc-title">${t}</span><span class="qc-sub">${sub}</span></a>`).join("")}
      </div>`;
    el.querySelector("#dash-search").onclick = () => App.openSearch();
  }

  function medRow(m) {
    return `<a class="med-item" href="#/med/${m.id}">
      <div class="mi-main">
        <div class="mi-name">${esc(m.name)}</div>
        <div class="mi-sub">${esc((m.handelsname || "").split(/[,|]/)[0])} · ${esc(m.untergruppe || m.gruppe)}</div>
      </div>
      ${favBtn(m.id)}
    </a>`;
  }

  /* ---------- Medikamentenliste ---------- */
  function medsList(el, params) {
    const s = App.state;
    const groups = [...new Set(s.meds.map(m => m.gruppe))];
    const active = params.gruppe || "";
    const showFavs = params.filter === "favoriten";

    let meds = s.meds.slice().sort((a, b) => a.name.localeCompare(b.name, "de"));
    if (active) meds = meds.filter(m => m.gruppe === active);
    if (showFavs) meds = meds.filter(m => s.favs.has(m.id));

    // alphabetische Gruppierung
    let lastLetter = "", rows = "";
    for (const m of meds) {
      const L = m.name[0].toUpperCase();
      if (L !== lastLetter && !active && !showFavs) { rows += `<div class="alpha-head">${L}</div>`; lastLetter = L; }
      rows += medRow(m);
    }

    el.innerHTML = `
      <h1 class="page-title">Medikamente</h1>
      <p class="page-sub">${meds.length} Einträge · Quelle: Pharma Zusammenfassung NFS Kurs E 2025/26</p>
      <div class="chip-row">
        <button class="chip ${!active && !showFavs ? "active" : ""}" data-g="">Alle</button>
        <button class="chip ${showFavs ? "active" : ""}" data-favs="1">★ Favoriten</button>
        ${groups.map(g => `<button class="chip ${g === active ? "active" : ""}" data-g="${esc(g)}">${esc(g)}</button>`).join("")}
      </div>
      <div class="med-list">${rows || `<div class="empty-hint">Keine Einträge${showFavs ? " – markiere Medikamente mit ★" : ""}.</div>`}</div>`;

    el.querySelectorAll(".chip").forEach(c => c.onclick = () => {
      if (c.dataset.favs) App.go("#/meds?filter=favoriten");
      else App.go(c.dataset.g ? "#/meds?gruppe=" + encodeURIComponent(c.dataset.g) : "#/meds");
    });
  }

  /* ---------- Medikament Detail ---------- */
  function medDetail(el, id) {
    const m = App.state.meds.find(x => x.id === id);
    if (!m) { el.innerHTML = `<div class="placeholder-box">Medikament nicht gefunden.</div>`; return; }
    App.pushHistory(id);

    const doseBody = (m.dosierung && m.dosierung.length)
      ? m.dosierung.map(d => `<div class="dose-row"><span class="dose-ctx">${esc(d.kontext)}</span><span>${esc(d.wert)}</span></div>`).join("")
      : `<span class="missing">nicht in Unterlagen vorhanden</span>`;

    el.innerHTML = `
      <a class="back-link" href="#/meds">‹ Medikamente</a>
      <div class="detail-head">
        <div class="row">
          <h1 style="flex:1;margin:0">${esc(m.name)}</h1>
          ${favBtn(m.id)}
        </div>
        <div class="handelsname">${esc(m.handelsname || "")}</div>
        <div class="detail-badges">
          <span class="badge gruppe">${esc(m.gruppe)}</span>
          ${m.untergruppe ? `<span class="badge teal">${esc(m.untergruppe)}</span>` : ""}
          ${m.pruefungsrelevanz ? `<span class="badge ${m.pruefungsrelevanz}">Prüfungsrelevanz: ${m.pruefungsrelevanz}</span>` : ""}
        </div>
      </div>

      ${section("Indikation", "🎯", "#5b9cf6", listVal(m.indikation), true)}
      ${section("Dosierung", "⚖️", "#2dd4bf", doseBody, true)}
      ${section("Wirkung", "⚡", "#a78bfa", listVal(m.wirkung))}
      ${section("Wirkungsbeginn / -dauer", "⏱️", "#4ade80", listVal(m.wirkungsbeginn))}
      ${section("Kontraindikationen", "🚫", "#f87171", listVal(m.kontraindikation))}
      ${section("Nebenwirkungen", "⚠️", "#fbbf24", listVal(m.nebenwirkungen))}
      ${m.achtung ? section("Achtung / CAVE", "❗", "#f87171", listVal(m.achtung), true) : ""}
      ${m.kinder ? section("Bei Kindern", "🧒", "#2dd4bf", listVal(m.kinder)) : ""}
      ${(m.merksaetze && m.merksaetze.length) ? section("Merksätze", "💡", "#a78bfa", m.merksaetze.map(x => `<div class="merksatz">${esc(x)}</div>`).join("")) : ""}

      <div class="src-note">Quelle: ${esc(m.quelle)} · Wirkstoff: ${esc(m.wirkstoff || "–")}</div>
      <div class="fc-actions">
        <a class="btn primary" href="#/karten?med=${m.id}">🗂️ Lernkarten zu diesem Medikament</a>
      </div>`;
  }

  /* ---------- AML ---------- */
  function aml(el) {
    el.innerHTML = `
      <h1 class="page-title">Arzneimittelliste I & II</h1>
      <p class="page-sub">Österreichisches Rotes Kreuz · Landesverband OÖ · Version 5.1 / 2025</p>
      <div class="notice info">Originaldokument – wird unverändert angezeigt. Verbindliche Referenz für Indikationen und Dosierungen.</div>
      <iframe class="pdf-frame" src="assets/aml/AML_OOe_V5.1_2025.pdf" title="AML OÖ V5.1 2025"></iframe>
      <div class="fc-actions">
        <a class="btn primary" href="assets/aml/AML_OOe_V5.1_2025.pdf" target="_blank" rel="noopener">In eigenem Tab öffnen</a>
        <a class="btn" href="assets/aml/AML_OOe_V5.1_2025.pdf" download>Herunterladen</a>
      </div>`;
  }

  /* ---------- Grundlagen ---------- */
  function grundlagenList(el) {
    el.innerHTML = `
      <h1 class="page-title">Pharma-Grundlagen</h1>
      <p class="page-sub">Begriffe & Grundeinteilung der Medikamente</p>
      <div class="med-list">
        ${App.state.grundlagen.map(g => `<a class="med-item" href="#/grundlagen/${g.id}">
          <div class="mi-main"><div class="mi-name">${esc(g.titel)}</div><div class="mi-sub">${esc(g.kategorie)}</div></div>
        </a>`).join("")}
      </div>`;
  }

  function grundlagenDetail(el, id) {
    const g = App.state.grundlagen.find(x => x.id === id);
    if (!g) { el.innerHTML = `<div class="placeholder-box">Nicht gefunden.</div>`; return; }
    el.innerHTML = `
      <a class="back-link" href="#/grundlagen">‹ Grundlagen</a>
      <h1 class="page-title">${esc(g.titel)}</h1>
      <div class="card" style="white-space:pre-wrap">${esc(g.inhalt)}</div>
      <div class="src-note">Quelle: ${esc(g.quelle)}</div>`;
  }

  /* ---------- Lernkarten ---------- */
  function karten(el, params) {
    let cards = App.allCards();
    let scopeLabel = "Alle Karten";
    if (params.med) {
      cards = cards.filter(c => c.medId === params.med);
      const m = App.state.meds.find(x => x.id === params.med);
      scopeLabel = m ? m.name : "";
    } else if (params.gruppe) {
      cards = cards.filter(c => c.gruppe === params.gruppe);
      scopeLabel = params.gruppe;
    } else if (params.filter === "favoriten") {
      cards = cards.filter(c => App.state.favs.has(c.medId));
      scopeLabel = "Favoriten";
    }

    // Wiederholsystem: niedrige Box zuerst, dann mischen
    const box = App.state.cardsBox;
    cards.sort((a, b) => (box[a.key] || 0) - (box[b.key] || 0) || Math.random() - 0.5);

    if (!cards.length) {
      el.innerHTML = `<h1 class="page-title">Lernkarten</h1><div class="placeholder-box">Keine Karten in dieser Auswahl.</div>`;
      return;
    }

    let i = 0, flipped = false;
    const groups = [...new Set(App.state.meds.map(m => m.gruppe))];

    function render() {
      const c = cards[i];
      const b = box[c.key] || 0;
      el.innerHTML = `
        <h1 class="page-title">Lernkarten</h1>
        <div class="chip-row">
          <button class="chip ${!params.med && !params.gruppe && !params.filter ? "active" : ""}" data-r="#/karten">Alle</button>
          <button class="chip ${params.filter === "favoriten" ? "active" : ""}" data-r="#/karten?filter=favoriten">★ Favoriten</button>
          ${groups.map(g => `<button class="chip ${g === params.gruppe ? "active" : ""}" data-r="#/karten?gruppe=${encodeURIComponent(g)}">${esc(g)}</button>`).join("")}
        </div>
        <div class="quiz-progress">${scopeLabel} · Karte ${i + 1} / ${cards.length} · Stufe ${b}/3</div>
        <div class="flashcard-stage">
          <div class="flashcard ${flipped ? "flipped" : ""}" id="fc">
            <div class="fc-face">
              <span class="fc-label">${esc(c.label)}</span>
              <div class="fc-q">${esc(c.q)}</div>
              <div class="fc-hint">Tippen zum Umdrehen</div>
            </div>
            <div class="fc-face back">
              <span class="fc-label">Antwort</span>
              <div class="fc-answer">${c.aHtml}</div>
            </div>
          </div>
        </div>
        ${flipped ? `<div class="fc-actions">
          <button class="btn bad" id="fc-bad">Nochmal</button>
          <button class="btn good" id="fc-good">Gewusst</button>
        </div>` : `<div class="fc-actions"><button class="btn" id="fc-skip">Überspringen</button></div>`}
        <div class="fc-meta">„Gewusst“ erhöht die Stufe – Karten mit niedriger Stufe kommen zuerst.</div>`;

      el.querySelector("#fc").onclick = () => { flipped = !flipped; render(); };
      el.querySelectorAll(".chip").forEach(ch => ch.onclick = () => App.go(ch.dataset.r));
      const next = () => { i = (i + 1) % cards.length; flipped = false; render(); };
      const good = el.querySelector("#fc-good");
      if (good) good.onclick = (e) => { e.stopPropagation(); box[c.key] = Math.min(3, (box[c.key] || 0) + 1); App.save(); next(); };
      const bad = el.querySelector("#fc-bad");
      if (bad) bad.onclick = (e) => { e.stopPropagation(); box[c.key] = 0; App.save(); next(); };
      const skip = el.querySelector("#fc-skip");
      if (skip) skip.onclick = next;
    }
    render();
  }

  /* ---------- Quiz ---------- */
  function quiz(el, params) {
    const s = App.state;
    const mode = params.modus || "";
    if (!mode) {
      const wrongCount = Object.keys(s.quizErrors).length;
      el.innerHTML = `
        <h1 class="page-title">Quiz</h1>
        <p class="page-sub">Multiple Choice – automatisch aus den Unterlagen generiert</p>
        <div class="grid-2">
          <a class="card tappable quick-card" href="#/quiz?modus=uebung">
            <span class="qc-icon" style="background:var(--accent-soft)">🎓</span>
            <span class="qc-title">Übungsmodus</span><span class="qc-sub">10 Fragen, sofortiges Feedback</span></a>
          <a class="card tappable quick-card" href="#/quiz?modus=pruefung">
            <span class="qc-icon" style="background:var(--red-soft)">⏱️</span>
            <span class="qc-title">Prüfungsmodus</span><span class="qc-sub">20 Fragen, Auswertung am Ende</span></a>
          <a class="card tappable quick-card" href="#/quiz?modus=fehler">
            <span class="qc-icon" style="background:var(--amber-soft)">🔁</span>
            <span class="qc-title">Fehler wiederholen</span><span class="qc-sub">${wrongCount} offene Fragen</span></a>
        </div>`;
      return;
    }

    let questions;
    const n = mode === "pruefung" ? 20 : 10;
    if (mode === "fehler") {
      const keys = Object.keys(s.quizErrors);
      questions = App.buildQuiz(999).filter(q => keys.includes(q.key)).slice(0, 20);
      if (!questions.length) {
        el.innerHTML = `<h1 class="page-title">Quiz</h1><div class="placeholder-box">🎉 Keine offenen Fehlerfragen!</div>
        <div class="fc-actions"><a class="btn primary" href="#/quiz">Zurück</a></div>`;
        return;
      }
    } else {
      questions = App.buildQuiz(n);
    }

    let i = 0, score = 0, answered = false;
    const results = [];

    function render() {
      if (i >= questions.length) { renderResult(); return; }
      const q = questions[i];
      el.innerHTML = `
        <a class="back-link" href="#/quiz">‹ Quiz beenden</a>
        <div class="quiz-progress">Frage ${i + 1} / ${questions.length}${mode !== "pruefung" ? ` · ${score} richtig` : ""}</div>
        <div class="quiz-q">${esc(q.q)}</div>
        ${q.options.map((o, oi) => `<button class="quiz-opt" data-i="${oi}">${esc(o)}</button>`).join("")}`;

      el.querySelectorAll(".quiz-opt").forEach(btn => btn.onclick = () => {
        if (answered) return;
        answered = true;
        const pick = +btn.dataset.i;
        const correct = pick === q.answer;
        if (correct) { score++; delete s.quizErrors[q.key]; }
        else s.quizErrors[q.key] = true;
        App.save();
        results.push({ q, pick, correct });
        el.querySelectorAll(".quiz-opt").forEach((b, bi) => {
          b.disabled = true;
          if (bi === q.answer) b.classList.add("correct");
          else if (bi === pick) b.classList.add("wrong");
        });
        setTimeout(() => { i++; answered = false; render(); }, correct ? 650 : 1600);
      });
    }

    function renderResult() {
      const pct = Math.round((score / questions.length) * 100);
      el.innerHTML = `
        <h1 class="page-title">Ergebnis</h1>
        <div class="card" style="text-align:center;padding:28px">
          <div style="font-size:42px;font-weight:780">${pct}%</div>
          <div style="color:var(--text-dim)">${score} von ${questions.length} richtig</div>
          <div class="progress-bar"><div style="width:${pct}%"></div></div>
        </div>
        ${results.filter(r => !r.correct).length ? `<div class="section-title">Fehleranalyse</div>` +
          results.filter(r => !r.correct).map(r => `<div class="card" style="margin-bottom:8px">
            <div style="font-weight:640;margin-bottom:5px">${esc(r.q.q)}</div>
            <div style="color:var(--red);font-size:13.5px">Deine Antwort: ${esc(r.q.options[r.pick])}</div>
            <div style="color:var(--green);font-size:13.5px">Richtig: ${esc(r.q.options[r.q.answer])}</div>
            ${r.q.medId ? `<a href="#/med/${r.q.medId}" style="font-size:13px">→ Zum Medikament</a>` : ""}
          </div>`).join("") : ""}
        <div class="fc-actions">
          <a class="btn" href="#/quiz">Menü</a>
          <a class="btn primary" href="#/quiz?modus=${mode}&r=${Date.now()}">Nochmal</a>
        </div>`;
    }
    render();
  }

  /* ---------- Modul-Platzhalter ---------- */
  const MODULE_INFO = {
    anatomie: ["Anatomie", "🫀", "Skriptum Anatomie (59 Seiten, handschriftlich) liegt in den Unterlagen vor. Die Inhalte werden in einer eigenen Session sorgfältig transkribiert – unsichere OCR-Stellen werden markiert."],
    notfaelle: ["Notfälle", "🚑", "Drei Skripten (Krankheitsbilder, Spezielle Notfälle, Vitalfunktionen – zusammen 218 Seiten) liegen vor und werden als Nächstes strukturiert aufbereitet und mit den Medikamenten verknüpft."],
    ekg: ["EKG", "📈", "EKG-Gesamt und EKG-Skript mediknow liegen vor und werden in einer späteren Session aufbereitet."],
    geraetelehre: ["Gerätelehre", "🛠️", "NFS Kurs Gerätelehre und Sanitätstechnik (70 Seiten) liegt vor und wird in einer späteren Session aufbereitet."],
    hygiene: ["Hygiene", "🧼", "Hygiene-Mitschrift liegt vor und wird in einer späteren Session aufbereitet."]
  };

  function modul(el, name) {
    const m = MODULE_INFO[name] || ["Modul", "📦", "Unbekanntes Modul."];
    el.innerHTML = `
      <h1 class="page-title">${m[0]}</h1>
      <div class="placeholder-box card">
        <div class="ph-icon">${m[1]}</div>
        <strong>Inhalte in Vorbereitung</strong>
        <p style="font-size:14px">${m[2]}</p>
        <p style="font-size:12.5px;color:var(--text-faint)">Es werden ausschließlich Inhalte aus den bereitgestellten Ausbildungsunterlagen übernommen – nichts wird erfunden.</p>
      </div>`;
  }

  return { dashboard, medsList, medDetail, aml, grundlagenList, grundlagenDetail, karten, quiz, modul, medRow };
})();
