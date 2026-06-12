# ARCHITECTURE – NFS Lernapp

## Designziele
Reine clientseitige PWA, vollständig offline, installierbar, ohne Build-Schritt direkt auf GitHub Pages lauffähig. Schnell, mobile-first, Premium-Dark-Theme im Stil von Notion/Linear/Obsidian. Inhaltliche Korrektheit hat oberste Priorität – ausschließlich Inhalte aus den bereitgestellten Unterlagen.

## Tech-Stack
- **Kein Framework, kein Bundler.** Vanilla HTML + CSS + ES-Module-freies JS (klassische Skripte mit gemeinsamem Scope). Das hält Ladezeiten minimal und macht die App auf GitHub Pages ohne CI/Build sofort lauffähig.
- **Daten:** statische JSON-Dateien unter `data/`, beim Start per `fetch` geladen und zusammengeführt.
- **Persistenz:** `localStorage` (Favoriten, Verlauf, Suchhistorie, Lernkarten-Stufen, Quiz-Fehler). Bewusst gewählt statt IndexedDB, da die Datenmengen klein sind; ein Wechsel auf IndexedDB ist gekapselt in `App.save/load` möglich.
- **Offline:** Service Worker (`sw.js`), Cache-first für App-Shell und Daten.

## Dateistruktur
```
NFS-App/
├── index.html              App-Shell (Topbar, View-Container, Tabbar, Such-Overlay)
├── manifest.webmanifest    PWA-Manifest
├── sw.js                   Service Worker (Cache-first, Offline)
├── css/app.css             Design-System + alle Komponenten-Styles
├── js/
│   ├── search.js           NFSSearch: Index, Fuzzy-/Teilwortsuche, Highlight
│   ├── views.js            Views: alle Render-Funktionen pro Route
│   └── app.js              App: Router, State, Persistenz, Karten-/Quiz-Generierung, Such-UI
├── data/
│   ├── meds_herz.json          Herz-Kreislauf & Rhythmus (13)
│   ├── meds_acs_rr.json        ACS/Gerinnung + Blutdruck/Volumen (6)
│   ├── meds_atemwege.json      Atemwege/Allergie (6)
│   ├── meds_analgesie.json     Analgesie/Sedierung (13)
│   ├── meds_narkose_weitere.json  Narkose/Muskelrelax. + Weitere (11)
│   └── grundlagen.json         Pharma-Grundlagen (13)
├── assets/aml/AML_OOe_V5.1_2025.pdf   Original-AML (unverändert)
├── icons/                  PWA-Icons (192/512/maskable)
└── Unterlagen/             Quell-PDFs (Eingang, nicht Teil der App-Auslieferung nötig)
```

## Laufzeit-Architektur
1. `index.html` lädt `search.js → views.js → app.js` (Reihenfolge wichtig: gemeinsamer Lexical Scope; `app.js` orchestriert).
2. `App.init()` (bei `DOMContentLoaded`): lädt `localStorage`-State, holt alle `data/*.json`, baut den Suchindex (`NFSSearch.build`), registriert Router + Such-UI + Service Worker, rendert die initiale Route.
3. **Router:** hash-basiert (`#/meds`, `#/med/:id`, `#/karten?gruppe=…` …). `route()` parst Pfad + Query, ruft die passende `Views.*`-Funktion, setzt Titel und aktiven Tab, retriggert die View-Transition-Animation.
4. **State** (`App.state`): `meds[]`, `grundlagen[]`, `favs(Set)`, `history[]`, `searchHistory[]`, `cardsBox{}`, `quizErrors{}`. Jede Mutation ruft `App.save()`.
5. **Favoriten** werden global per Event-Delegation (`[data-fav]`) gesetzt – funktioniert in Liste, Detail und Suche.

## Suche (Kernkomponente)
- Normalisierung: lowercase + Umlaut-Transliteration (ä→ae …), Sonderzeichen weg.
- Pro Eintrag: `primary[]` (Name, Synonyme, Wirkstoff – hoch gewichtet) und `haystack` (gesamter durchsuchbarer Text).
- Scoring je Token: exakt (100) > Präfix (80) > Teilwort (60) > Fuzzy auf Titelwörter (45, Levenshtein ≤1–2) > Teilwort im Haystack (25) > Fuzzy im Haystack (15). Mehrere Tokens müssen ALLE matchen (UND-Logik), Scores summieren.
- Ergebnisse nach Typ gruppiert (Medikamente, Grundlagen), Treffer-Hervorhebung im Titel.

## Lernsysteme
- **Lernkarten:** in `App.allCards()` deterministisch aus den Medikamentenfeldern generiert (nur vorhandene, nicht-leere Felder → keine erfundenen Inhalte). Wiederholsystem: `cardsBox[key] ∈ 0..3`; „Gewusst“ +1, „Nochmal“ →0; niedrige Stufen zuerst.
- **Quiz:** `App.buildQuiz(n)` erzeugt Distraktoren aus anderen echten Medikamenten; Fragetypen: Handelsname→Medikament, Wirkstoffgruppe, Indikation→Medikament, Kontraindikation. Falsch beantwortete Fragen landen in `quizErrors` für den Wiederholungsmodus.

## Datenintegrität / Regeln
- Jedes Medikament trägt ein `quelle`-Feld (Dokument + Seite).
- Fehlende Felder: explizit `"nicht in Unterlagen vorhanden"` statt Lückenfüllung.
- AML-PDF wird ausschließlich angezeigt/heruntergeladen, niemals transformiert.
- Erweiterbarkeit: neue Datendatei in `DATA_FILES` (app.js) und `ASSETS` (sw.js) eintragen.

## Erweiterungspunkte
- **Erkrankungen/Anatomie/EKG:** je eigenes `data/*.json` + `Views.*` + Route. Verknüpfungsfelder (z. B. `medikamente[]` in Erkrankungen, `erkrankungen[]` in Medikamenten) sind im Datenmodell vorgesehen und werden im Detail als Querlinks gerendert.
- **IndexedDB/Sync:** nur `App.save/load` austauschen.
