/* ============ NFS Lernapp – Fehlertolerante Suche ============ */
/* Eigenständiger, offline-fähiger Suchindex: Teilwort + Fuzzy (Levenshtein) */

const NFSSearch = (() => {
  let index = []; // {id, type, title, sub, route, haystack[]}

  function norm(s) {
    return (s || "")
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9%|.,/ -]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function levenshtein(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const m = a.length, n = b.length;
    let prev = new Array(n + 1), cur = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      let rowMin = i;
      for (let j = 1; j <= n; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return max + 1;
      [prev, cur] = [cur, prev];
    }
    return prev[n];
  }

  function build(meds, grundlagen) {
    index = [];
    for (const m of meds) {
      index.push({
        id: m.id, type: "Medikament",
        title: m.name,
        sub: (m.handelsname || "").split(/[,|]/)[0].trim() + " · " + (m.untergruppe || m.gruppe),
        route: "#/med/" + m.id,
        primary: [norm(m.name), ...(m.synonyme || []).map(norm), norm(m.wirkstoff)].filter(Boolean),
        haystack: norm([
          m.name, m.handelsname, m.wirkstoff, m.gruppe, m.untergruppe,
          (m.synonyme || []).join(" "),
          (m.indikation || []).join(" "),
          (m.kontraindikation || []).join(" "),
          (m.nebenwirkungen || []).join(" "),
          m.wirkung
        ].join(" "))
      });
    }
    for (const g of grundlagen) {
      index.push({
        id: g.id, type: "Grundlagen",
        title: g.titel, sub: g.kategorie,
        route: "#/grundlagen/" + g.id,
        primary: [norm(g.titel)],
        haystack: norm(g.titel + " " + g.inhalt)
      });
    }
  }

  function tokenScore(entry, token) {
    let best = 0;
    for (const p of entry.primary) {
      if (p === token) return 100;
      if (p.startsWith(token)) best = Math.max(best, 80);
      else if (p.includes(token)) best = Math.max(best, 60);
      else {
        // Fuzzy auf einzelne Wörter des Primärtitels
        for (const w of p.split(" ")) {
          if (token.length >= 4 && w.length >= 4) {
            const max = token.length >= 7 ? 2 : 1;
            if (levenshtein(w.slice(0, token.length + max), token, max) <= max) {
              best = Math.max(best, 45); break;
            }
          }
        }
      }
    }
    if (best === 0 && entry.haystack.includes(token)) best = 25;
    if (best === 0 && token.length >= 5) {
      // Fuzzy im Haystack (teuer → nur kurze Probe über Wortgrenzen)
      for (const w of entry.haystack.split(" ")) {
        if (w.length >= 4 && levenshtein(w.slice(0, token.length + 1), token, 1) <= 1) { best = 15; break; }
      }
    }
    return best;
  }

  function query(q, limit = 24) {
    const tokens = norm(q).split(" ").filter(t => t.length >= 2);
    if (!tokens.length) return [];
    const results = [];
    for (const e of index) {
      let score = 0, all = true;
      for (const t of tokens) {
        const s = tokenScore(e, t);
        if (s === 0) { all = false; break; }
        score += s;
      }
      if (all) results.push({ entry: e, score });
    }
    results.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, "de"));
    return results.slice(0, limit).map(r => r.entry);
  }

  function highlight(title, q) {
    const t = norm(q).split(" ").filter(Boolean)[0] || "";
    if (!t) return esc(title);
    const i = norm(title).indexOf(t);
    if (i < 0) return esc(title);
    return esc(title.slice(0, i)) + "<mark>" + esc(title.slice(i, i + t.length)) + "</mark>" + esc(title.slice(i + t.length));
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  return { build, query, highlight, esc };
})();
