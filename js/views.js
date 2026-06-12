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
           ["Anatomie", "#/anatomie", "🫀", (App.state.anatomie && App.state.anatomie.themen ? App.state.anatomie.themen.length + " Themen" : "Skriptum"), ""],
           ["Notfälle", "#/notfaelle", "🚑", (App.state.erkrankungen && App.state.erkrankungen.erkrankungen ? App.state.erkrankungen.erkrankungen.length + " Bilder" : "Krankheitsbilder"), ""],
           ["EKG", "#/wissen/ekg", "📈", (App.state.ekg && App.state.ekg.themen ? App.state.ekg.themen.length + " Themen" : "Grundlagen"), ""],
           ["Gerätelehre", "#/wissen/geraetelehre", "🛠️", (App.state.geraetelehre && App.state.geraetelehre.themen ? App.state.geraetelehre.themen.length + " Themen" : "Technik"), ""],
           ["Hygiene", "#/wissen/hygiene", "🧼", (App.state.hygiene && App.state.hygiene.themen ? App.state.hygiene.themen.length + " Themen" : "Mitschrift"), ""]]
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

      ${(() => { const links = erkrankungenLinkingMed(m.id); return links.length ? `<div class="section-title">Verknüpfte Notfallbilder</div>
        <div class="link-chips">${links.map(e => `<a class="link-chip" href="#/notfaelle/e/${e.id}">🩺 ${esc(e.name)}</a>`).join("")}</div>` : ""; })()}

      <div class="fc-actions">
        <a class="btn primary" href="#/karten?med=${m.id}">🗂️ Lernkarten zu diesem Medikament</a>
      </div>`;
  }

  /* ---------- AML – Notarzt-Codierung ---------- */
  const NOTARZT = {
    rot:   { cls: "na-rot",   label: "Notarzt alarmieren" },
    gelb:  { cls: "na-gelb",  label: "Notarzt erwägen" },
    gruen: { cls: "na-gruen", label: "Kein Notarzt erforderlich" }
  };

  /* ---------- AML – Übersicht ---------- */
  function amlRow(a) {
    const meds = (a.medikamente || []).map(m => m.name.replace(/ (i\.v\.|i\.m\.|p\.o\.|inhalativ|rektal|nasal über MAD|bukkal|nasal).*$/, "")).filter((v, i, arr) => arr.indexOf(v) === i);
    const na = NOTARZT[a.notarzt] || {};
    return `<a class="med-item aml-item ${na.cls || ""}" href="#/aml/${a.id}">
      <span class="na-dot" title="${esc(na.label || "")}"></span>
      <div class="mi-main">
        <div class="mi-name">${esc(a.titel)}</div>
        <div class="mi-sub">${esc(meds.slice(0, 3).join(" · ") || (a.typ === "reanimation" ? "Reanimationsalgorithmus" : "—"))}</div>
      </div>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-faint);flex-shrink:0"><path d="M9 6l6 6-6 6"/></svg>
    </a>`;
  }

  function aml(el) {
    const A = App.state.aml;
    const m = A.meta || {};
    const listI = (A.algorithmen || []).filter(a => a.liste === "I");
    const listII = (A.algorithmen || []).filter(a => a.liste === "II");
    el.innerHTML = `
      <h1 class="page-title">Arzneimittelliste I & II</h1>
      <p class="page-sub">${esc(m.herausgeber || "")} · ${esc(m.version || "")}</p>
      <div class="notice info">Inhalte 1:1 aus dem Originaldokument. Strukturiert nach Notfallbild → Maßnahme. Verbindlich bleibt das Originaldokument bzw. die ärztliche Anweisung.</div>

      <div class="aml-legend">
        <span class="na-rot"><span class="na-dot"></span>Notarzt alarmieren</span>
        <span class="na-gelb"><span class="na-dot"></span>Notarzt erwägen</span>
        <span class="na-gruen"><span class="na-dot"></span>kein Notarzt</span>
      </div>

      <a class="card tappable quick-card" href="#/aml/info" style="margin-bottom:8px">
        <span class="qc-icon" style="background:var(--accent-soft);color:var(--accent)">ℹ️</span>
        <span class="qc-title">Allgemeine Regelungen</span>
        <span class="qc-sub">Liste I/II, Kinder & vLJ, Venenzugang, KI, Dokumentation</span>
      </a>

      <div class="section-title">Arzneimittelliste I <span style="font-weight:500;text-transform:none;letter-spacing:0">· Notfallsanitäter</span></div>
      <div class="med-list">${listI.map(amlRow).join("")}</div>

      <div class="section-title">Arzneimittelliste II <span style="font-weight:500;text-transform:none;letter-spacing:0">· nach Chefarzt-Freigabe (NKV/NKA)</span></div>
      <div class="med-list">${listII.map(amlRow).join("")}</div>

      <div class="fc-actions mt">
        <a class="btn" href="assets/aml/AML_OOe_V5.1_2025.pdf" target="_blank" rel="noopener">📄 Original-PDF öffnen</a>
      </div>
      <div class="src-note">Freigabe: ${esc(m.freigabe || "")} · Grundlage: ${esc(m.grundlage || "")}</div>`;
  }

  function amlInfo(el) {
    const A = App.state.aml;
    el.innerHTML = `
      <a class="back-link" href="#/aml">‹ Arzneimittelliste</a>
      <h1 class="page-title">Allgemeine Regelungen</h1>
      <p class="page-sub">${esc((A.meta || {}).version || "")}</p>
      ${(A.allgemein || []).map(s => `<details class="detail-section" open>
        <summary><span class="ds-icon" style="background:var(--accent-soft);color:var(--accent)">§</span>${esc(s.titel)}${ICONS.chev}</summary>
        <div class="ds-body" style="white-space:normal">${esc(s.inhalt)}</div>
      </details>`).join("")}
      <div class="src-note">${esc((A.meta || {}).hinweis || "")}</div>`;
  }

  /* ---------- AML – Detail (Notfallbild) ---------- */
  function amlDetail(el, id) {
    const a = (App.state.aml.algorithmen || []).find(x => x.id === id);
    if (!a) { el.innerHTML = `<div class="placeholder-box">Notfallbild nicht gefunden.</div>`; return; }

    const na = NOTARZT[a.notarzt] || {};
    const naIco = a.notarzt === "gruen"
      ? `<svg class="na-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`
      : `<svg class="na-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;

    const critRe = /(Reanimationsbereitschaft|Reanimation|Defibrillation|DefiPads|Defi-Pads|assistierte Beatmung|Beatmung|CAVE|Wechsel zu|Notarzt|Eigen- und Fremdschutz|12 Kanal EKG|Atem-Kreislaufstillstand)/i;
    const kpHtml = (a.keypoints || []).map(k => {
      const crit = critRe.test(k);
      return crit
        ? `<div class="kp kp-crit"><svg class="kp-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg><span>${esc(k)}</span></div>`
        : `<div class="kp"><span class="kp-dot"></span><span>${esc(k)}</span></div>`;
    }).join("");

    const repNo = /(KEINE Wiederholung|nicht wiederholbar)/i;
    const repYes = /(wiederholbar|wiederholen|Wiederholung)/i;
    const reevalHtml = (a.reevaluation || []).map((r, i) => {
      if (i === 0 && /^Reevaluation/i.test(r)) return `<div class="reeval-head">${esc(r)}</div>`;
      let cls = "rep-neutral", ico = `<svg class="ri-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2.5"/></svg>`;
      if (repNo.test(r)) { cls = "rep-no"; ico = `<svg class="ri-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`; }
      else if (repYes.test(r)) { cls = "rep-yes"; ico = `<svg class="ri-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/></svg>`; }
      return `<div class="reeval-item ${cls}">${ico}<span>${esc(r)}</span></div>`;
    }).join("");

    const abcdeRows = a.abcde ? Object.entries(a.abcde).map(([k, v]) =>
      `<div class="abcde-row"><span class="abcde-key">${k}</span><span class="abcde-val">${v ? esc(v) : "<span class=\"missing\">—</span>"}</span></div>`).join("") : "";

    const medCard = (md) => {
      const conn = md.verknuepfung ? `<div class="med-conn">${md.verknuepfung === "und" ? "UND" : "ODER"}</div>` : "";
      const dose = (md.dosis || []).map(d =>
        `<div class="dose-row"><span class="dose-ctx">${esc(d.gruppe)}</span><span>${esc(d.wert)}</span></div>`).join("");
      const ki = (md.ki && md.ki.length) ? `<div class="aml-line"><span class="aml-tag ki">KI</span><span>${md.ki.map(esc).join(" · ")}</span></div>` : "";
      const nw = (md.nw && md.nw.length) ? `<div class="aml-line"><span class="aml-tag nw">NW</span><span>${md.nw.map(esc).join(" · ")}</span></div>` : "";
      const link = md.medId ? `<a class="aml-medlink" href="#/med/${md.medId}">Wirkstoff-Details ›</a>` : "";
      return `${conn}<div class="aml-med">
        <div class="aml-med-name">${esc(md.name)}${link}</div>
        ${dose}${ki}${nw}
      </div>`;
    };

    const reanimation = a.typ === "reanimation" && a.ablauf;
    const ablaufBlock = reanimation ? `
      <div class="section-title">Schockbar (VF / pulslose VT)</div>
      <div class="card"><ol class="aml-steps">${a.ablauf.schockbar.map(s => `<li>${esc(s)}</li>`).join("")}</ol></div>
      <div class="section-title">Nicht schockbar (PEA / Asystolie)</div>
      <div class="card"><ol class="aml-steps">${a.ablauf.nicht_schockbar.map(s => `<li>${esc(s)}</li>`).join("")}</ol></div>` : "";

    el.innerHTML = `
      <a class="back-link" href="#/aml">‹ Arzneimittelliste</a>
      <div class="detail-head">
        <h1 style="margin:6px 0 8px">${esc(a.titel)}</h1>
        <div class="${na.cls || ""} na-banner">${naIco}<span>${esc((na.label || "").toUpperCase())}</span>
          <span class="spacer"></span><span class="na-pill">Liste ${a.liste}</span></div>
      </div>

      ${abcdeRows ? `<div class="section-title">ABCDE</div><div class="card abcde">${abcdeRows}</div>` : ""}

      ${(a.diagnose && a.diagnose.length) ? `<div class="section-title">${reanimation ? "Auslöser" : "Diagnose"}</div>
        <div class="card">${listBullets(a.diagnose)}</div>` : ""}

      ${(a.keypoints && a.keypoints.length) ? `<div class="section-title">Keypoints</div>
        <div class="card keypoints">${kpHtml}</div>` : ""}

      ${ablaufBlock}

      ${(a.medikamente && a.medikamente.length) ? `<div class="section-title">${reanimation ? "Medikamente (Dosierungen)" : "Maßnahme / Medikament"}</div>
        <div class="aml-meds">${a.medikamente.map(medCard).join("")}</div>` : ""}

      ${(a.reevaluation && a.reevaluation.length) ? `<div class="section-title">Reevaluation & Wiederholung</div>
        <div class="card reeval">${reevalHtml}</div>` : ""}

      ${(() => { const links = erkrankungenLinkingAml(a.id); return links.length ? `<div class="section-title">Zugehörige Krankheitsbilder</div>
        <div class="link-chips">${links.map(e => `<a class="link-chip" href="#/notfaelle/e/${e.id}">🩺 ${esc(e.name)}</a>`).join("")}</div>` : ""; })()}

      <div class="src-note">Quelle: AML I & II des ÖRK – LV Oberösterreich, ${esc((App.state.aml.meta || {}).version || "")}. Inhalt 1:1 übernommen.</div>`;
  }

  function listBullets(arr) {
    return `<ul class="aml-ul">${arr.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
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

  /* ---------- Anatomie ---------- */
  const ANAT_ICON = {
    "Grundlagen (Zelle & Gewebe)": "🔬",
    "Bewegungsapparat": "🦴",
    "Herz-Kreislauf": "🫀",
    "Atmung": "🫁",
    "Nervensystem": "🧠",
    "Organe": "🩺"
  };

  function anatInhalt(s) {
    return esc(s)
      .replace(/\[\?\]/g, '<span class="anat-unsure" title="im Skriptum schwer lesbar">[?]</span>')
      .split("\n").map(line => line.trim() === "" ? "" : `<p>${line}</p>`).join("");
  }

  function anatomie(el, params) {
    const A = App.state.anatomie || { kategorien: [], themen: [] };
    const cats = A.kategorien || [];
    const active = params.kat || "";
    let themen = A.themen || [];
    if (active) themen = themen.filter(t => t.kategorie === active);

    let body;
    if (active) {
      body = `<div class="med-list">${themen.map(anatRow).join("")}</div>`;
    } else {
      body = cats.map(c => {
        const items = (A.themen || []).filter(t => t.kategorie === c);
        if (!items.length) return "";
        return `<div class="section-title">${ANAT_ICON[c] || "•"} ${esc(c)}</div>
          <div class="med-list">${items.map(anatRow).join("")}</div>`;
      }).join("");
    }

    el.innerHTML = `
      <h1 class="page-title">Anatomie & Physiologie</h1>
      <p class="page-sub">${(A.themen || []).length} Themen · Transkription des handschriftlichen Skriptums</p>
      <div class="notice">Handschriftliches Skriptum – schwer lesbare Stellen sind mit [?] markiert. Offizielles Lehrwerk: „LPN Notfall San Österreich“.</div>
      <div class="chip-row">
        <button class="chip ${!active ? "active" : ""}" data-kat="">Alle</button>
        ${cats.map(c => `<button class="chip ${c === active ? "active" : ""}" data-kat="${esc(c)}">${esc(c)}</button>`).join("")}
      </div>
      ${body}`;

    el.querySelectorAll(".chip").forEach(c => c.onclick = () =>
      App.go(c.dataset.kat ? "#/anatomie?kat=" + encodeURIComponent(c.dataset.kat) : "#/anatomie"));
  }

  function anatRow(t) {
    return `<a class="med-item" href="#/anatomie/thema/${t.id}">
      <div class="mi-main">
        <div class="mi-name">${esc(t.titel)}${t.unsicher ? ' <span class="anat-unsure-badge">unsicher</span>' : ""}</div>
        <div class="mi-sub">${esc(t.kategorie)}</div>
      </div>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-faint);flex-shrink:0"><path d="M9 6l6 6-6 6"/></svg>
    </a>`;
  }

  function anatomieDetail(el, id) {
    const t = (App.state.anatomie.themen || []).find(x => x.id === id);
    if (!t) { el.innerHTML = `<div class="placeholder-box">Thema nicht gefunden.</div>`; return; }
    el.innerHTML = `
      <a class="back-link" href="#/anatomie">‹ Anatomie</a>
      <div class="detail-head">
        <h1 style="margin:6px 0 6px">${esc(t.titel)}</h1>
        <div class="detail-badges">
          <span class="badge gruppe">${ANAT_ICON[t.kategorie] || ""} ${esc(t.kategorie)}</span>
          ${t.unsicher ? `<span class="badge hoch">unsichere Transkription</span>` : ""}
        </div>
      </div>
      ${t.unsicher ? `<div class="notice">Diese Seite war im Skriptum besonders schwer lesbar – Inhalt mit Vorsicht verwenden und im Zweifel das offizielle Lehrwerk heranziehen.</div>` : ""}
      <div class="card anat-text">${anatInhalt(t.inhalt)}</div>
      <div class="src-note">Quelle: ${esc((App.state.anatomie.meta || {}).quelle || "Anatomie-Skriptum")}. Offizielles Lehrwerk: „LPN Notfall San Österreich“.</div>`;
  }

  /* ---------- Notfälle / Erkrankungen ---------- */
  const NOTF_ICON = {
    "Kardiale Notfälle": "❤️",
    "Pulmonale Notfälle": "🫁",
    "Schock": "🩸",
    "Abdominelle/Chirurgische Notfälle": "🩻",
    "Neurologische Notfälle": "🧠",
    "Stoffwechsel & Endokrin": "🧪",
    "Traumatologische Notfälle": "🚑",
    "Thermische Notfälle": "🌡️",
    "Pädiatrische Notfälle": "🧒",
    "Gynäkologie & Geburt": "🤰",
    "Intoxikationen": "☠️",
    "Vitalfunktionen": "🫀"
  };

  function erkrankungenLinkingMed(medId) {
    return (App.state.erkrankungen.erkrankungen || []).filter(e => (e.medikamente || []).includes(medId));
  }
  function erkrankungenLinkingAml(amlId) {
    return (App.state.erkrankungen.erkrankungen || []).filter(e => (e.aml || []).includes(amlId));
  }

  function erkrankungRow(e) {
    return `<a class="med-item" href="#/notfaelle/e/${e.id}">
      <div class="mi-main">
        <div class="mi-name">${esc(e.name)}</div>
        <div class="mi-sub">${esc(e.kategorie)}</div>
      </div>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-faint);flex-shrink:0"><path d="M9 6l6 6-6 6"/></svg>
    </a>`;
  }

  function notfaelle(el, params) {
    const E = App.state.erkrankungen || { kategorien: [], erkrankungen: [] };
    const cats = E.kategorien || [];
    const active = params.kat || "";
    let body;
    if (active) {
      body = `<div class="med-list">${(E.erkrankungen || []).filter(x => x.kategorie === active).map(erkrankungRow).join("")}</div>`;
    } else {
      body = cats.map(c => {
        const items = (E.erkrankungen || []).filter(x => x.kategorie === c);
        if (!items.length) return "";
        return `<div class="section-title">${NOTF_ICON[c] || "•"} ${esc(c)}</div>
          <div class="med-list">${items.map(erkrankungRow).join("")}</div>`;
      }).join("");
    }
    el.innerHTML = `
      <h1 class="page-title">Notfälle & Krankheitsbilder</h1>
      <p class="page-sub">${(E.erkrankungen || []).length} Krankheitsbilder · verknüpft mit Medikamenten & AML</p>
      <div class="notice">Aufbereitung der Ausbildungsfoliensätze. Verbindlich bleiben AML, ärztliche Anweisung und offizielles Lehrwerk.</div>
      <div class="chip-row">
        <button class="chip ${!active ? "active" : ""}" data-kat="">Alle</button>
        ${cats.map(c => `<button class="chip ${c === active ? "active" : ""}" data-kat="${esc(c)}">${esc(c)}</button>`).join("")}
      </div>
      ${body}`;
    el.querySelectorAll(".chip").forEach(c => c.onclick = () =>
      App.go(c.dataset.kat ? "#/notfaelle?kat=" + encodeURIComponent(c.dataset.kat) : "#/notfaelle"));
  }

  function erkrankungDetail(el, id) {
    const e = (App.state.erkrankungen.erkrankungen || []).find(x => x.id === id);
    if (!e) { el.innerHTML = `<div class="placeholder-box">Krankheitsbild nicht gefunden.</div>`; return; }

    const medChips = (e.medikamente || []).map(mid => {
      const m = App.state.meds.find(x => x.id === mid);
      return m ? `<a class="link-chip med" href="#/med/${mid}">💊 ${esc(m.name)}</a>` : "";
    }).join("");
    const amlChips = (e.aml || []).map(aid => {
      const a = (App.state.aml.algorithmen || []).find(x => x.id === aid);
      return a ? `<a class="link-chip aml" href="#/aml/${aid}">🚑 ${esc(a.titel)} (Liste ${a.liste})</a>` : "";
    }).join("");

    const fragen = (e.pruefungsfragen || []).map(q =>
      `<details class="detail-section"><summary><span class="ds-icon" style="background:#a78bfa22;color:#a78bfa">?</span>${esc(q.frage)}${ICONS.chev}</summary>
       <div class="ds-body">${esc(q.antwort)}</div></details>`).join("");

    el.innerHTML = `
      <a class="back-link" href="#/notfaelle">‹ Notfälle</a>
      <div class="detail-head">
        <h1 style="margin:6px 0 6px">${esc(e.name)}</h1>
        <div class="detail-badges"><span class="badge gruppe">${NOTF_ICON[e.kategorie] || ""} ${esc(e.kategorie)}</span></div>
      </div>

      ${section("Definition", "📖", "#5b9cf6", `<div style="white-space:pre-wrap">${esc(e.definition)}</div>`, true)}
      ${(e.symptome && e.symptome.length) ? section("Symptome", "🔎", "#fbbf24", listBullets(e.symptome), true) : ""}
      ${(e.diagnostik && e.diagnostik.length) ? section("Diagnostik", "🩺", "#2dd4bf", listBullets(e.diagnostik)) : ""}
      ${(e.therapie && e.therapie.length) ? section("Therapie / Maßnahmen", "💉", "#4ade80", listBullets(e.therapie), true) : ""}
      ${(e.differentialdiagnosen && e.differentialdiagnosen.length) ? section("Differentialdiagnosen", "↔️", "#f87171", listBullets(e.differentialdiagnosen)) : ""}

      ${(medChips || amlChips) ? `<div class="section-title">Verknüpfungen</div>
        <div class="link-chips">${medChips}${amlChips}</div>` : ""}

      ${fragen ? `<div class="section-title">Prüfungsfragen</div>${fragen}` : ""}

      <div class="src-note">Quelle: ${esc(e.quelle)}</div>`;
  }

  /* ---------- Generische Wissensmodule (EKG, Gerätelehre, Hygiene) ---------- */
  const WISSEN_ICON = { ekg: "📈", geraetelehre: "🛠️", hygiene: "🧼" };

  function wissenRow(mod, t) {
    return `<a class="med-item" href="#/wissen/${mod}/t/${t.id}">
      <div class="mi-main"><div class="mi-name">${esc(t.titel)}</div><div class="mi-sub">${esc(t.kategorie)}</div></div>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-faint);flex-shrink:0"><path d="M9 6l6 6-6 6"/></svg>
    </a>`;
  }

  function wissenList(el, mod, params) {
    const D = App.state[mod] || { meta: {}, kategorien: [], themen: [] };
    const cats = D.kategorien || [];
    const active = params.kat || "";
    let body;
    if (active) {
      body = `<div class="med-list">${(D.themen || []).filter(t => t.kategorie === active).map(t => wissenRow(mod, t)).join("")}</div>`;
    } else {
      body = cats.map(c => {
        const items = (D.themen || []).filter(t => t.kategorie === c);
        if (!items.length) return "";
        return `<div class="section-title">${esc(c)}</div><div class="med-list">${items.map(t => wissenRow(mod, t)).join("")}</div>`;
      }).join("");
    }
    el.innerHTML = `
      <h1 class="page-title">${WISSEN_ICON[mod] || ""} ${esc(D.meta.titel || "Modul")}</h1>
      <p class="page-sub">${(D.themen || []).length} Themen</p>
      ${D.meta.hinweis ? `<div class="notice">${esc(D.meta.hinweis)}</div>` : ""}
      <div class="chip-row">
        <button class="chip ${!active ? "active" : ""}" data-kat="">Alle</button>
        ${cats.map(c => `<button class="chip ${c === active ? "active" : ""}" data-kat="${esc(c)}">${esc(c)}</button>`).join("")}
      </div>
      ${body}`;
    el.querySelectorAll(".chip").forEach(c => c.onclick = () =>
      App.go(c.dataset.kat ? `#/wissen/${mod}?kat=` + encodeURIComponent(c.dataset.kat) : `#/wissen/${mod}`));
  }

  function wissenDetail(el, mod, id) {
    const D = App.state[mod] || { meta: {}, themen: [] };
    const t = (D.themen || []).find(x => x.id === id);
    if (!t) { el.innerHTML = `<div class="placeholder-box">Thema nicht gefunden.</div>`; return; }
    const body = esc(t.inhalt).split("\n").map(l => l.trim() === "" ? "" : `<p>${l}</p>`).join("");
    el.innerHTML = `
      <a class="back-link" href="#/wissen/${mod}">‹ ${esc(D.meta.titel || "Modul")}</a>
      <div class="detail-head">
        <h1 style="margin:6px 0 6px">${esc(t.titel)}</h1>
        <div class="detail-badges"><span class="badge gruppe">${WISSEN_ICON[mod] || ""} ${esc(t.kategorie)}</span></div>
      </div>
      <div class="card anat-text">${body}</div>
      <div class="src-note">Quelle: ${esc(t.quelle || D.meta.quelle || "")}</div>`;
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

  /* ---------- Einstellungen ---------- */
  function settings(el) {
    const s = App.state;
    const online = navigator.onLine;
    const learned = Object.values(s.cardsBox).filter(b => b >= 2).length;

    el.innerHTML = `
      <h1 class="page-title">Einstellungen</h1>
      <p class="page-sub">App-Version, Updates & Daten</p>

      <div class="section-title">Version & Updates</div>
      <div class="card">
        <div class="row"><strong>Installierte Version</strong><span class="spacer"></span><span class="badge gruppe">v${esc(App.APP_VERSION)}</span></div>
        <div class="row mt"><span style="color:var(--text-dim);font-size:13.5px">Status</span><span class="spacer"></span>
          <span id="upd-status" style="font-size:13.5px;color:var(--text-dim)">${online ? "online" : "offline – Updates nur mit Internet"}</span></div>
        <div class="fc-actions">
          <button class="btn primary" id="btn-check-update">Nach Updates suchen</button>
        </div>
        <div class="fc-meta" id="upd-hint">Lädt die neueste Version aus dem Web und installiert sie. Deine Favoriten, Lernkarten-Stufen und Quiz-Daten bleiben erhalten.</div>
      </div>

      <div class="section-title">Daten</div>
      <div class="card">
        <div class="row"><span style="color:var(--text-dim);font-size:13.5px">Medikamente</span><span class="spacer"></span><strong>${s.meds.length}</strong></div>
        <div class="row mt"><span style="color:var(--text-dim);font-size:13.5px">Lernkarten</span><span class="spacer"></span><strong>${App.allCards().length}</strong></div>
        <div class="row mt"><span style="color:var(--text-dim);font-size:13.5px">Karten sicher beherrscht</span><span class="spacer"></span><strong>${learned}</strong></div>
        <div class="row mt"><span style="color:var(--text-dim);font-size:13.5px">Favoriten</span><span class="spacer"></span><strong>${s.favs.size}</strong></div>
      </div>

      <div class="section-title">Wartung</div>
      <div class="card">
        <div style="font-weight:640">App neu installieren</div>
        <div style="color:var(--text-dim);font-size:13px;margin:4px 0 10px">Leert den Offline-Cache und lädt alle Dateien neu. Nutze das, falls die App nach einem Update klemmt. Lernfortschritt bleibt gespeichert.</div>
        <button class="btn bad" id="btn-force" style="flex:none;width:100%">Cache leeren & neu laden</button>
      </div>

      <div class="section-title">Über</div>
      <div class="card" style="color:var(--text-dim);font-size:13.5px">
        NFS Lernapp – Lern- und Nachschlagewerk für die Notfallsanitäter-Ausbildung.<br>
        Inhalte ausschließlich aus den bereitgestellten Unterlagen. Kein Ersatz für offizielle Vorgaben (AML, ärztliche Anweisung).
      </div>`;

    const status = el.querySelector("#upd-status");
    const hint = el.querySelector("#upd-hint");
    const btn = el.querySelector("#btn-check-update");

    btn.onclick = async () => {
      btn.disabled = true; btn.textContent = "Suche …"; status.textContent = "prüfe …";
      const res = await App.checkForUpdates();
      const map = {
        updating: ["Update gefunden – wird installiert, App lädt gleich neu …", "Update wird angewendet"],
        current: ["Du hast bereits die neueste Version.", "aktuell ✓"],
        offline: ["Keine Verbindung – bitte mit dem Internet verbinden und erneut versuchen.", "offline"],
        unsupported: ["Updates werden in diesem Browser/Modus nicht unterstützt.", "n/v"]
      };
      const [h, st] = map[res] || ["Unbekannter Status.", ""];
      hint.textContent = h; status.textContent = st;
      if (res === "updating") { hint.textContent = h; /* controllerchange lädt neu */ }
      else { btn.disabled = false; btn.textContent = "Nach Updates suchen"; }
    };

    el.querySelector("#btn-force").onclick = async () => {
      if (!confirm("Offline-Cache leeren und App neu laden? Dein Lernfortschritt bleibt erhalten.")) return;
      await App.forceReinstall();
    };
  }

  return { dashboard, medsList, medDetail, aml, amlInfo, amlDetail, anatomie, anatomieDetail, notfaelle, erkrankungDetail, wissenList, wissenDetail, grundlagenList, grundlagenDetail, karten, quiz, modul, settings, medRow };
})();
