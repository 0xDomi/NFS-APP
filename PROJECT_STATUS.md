# PROJECT_STATUS – NFS Lernapp

**Letztes Update:** 2026-06-12
**Gesamtfortschritt:** ~45 %

Eine reine Frontend-PWA (offline, installierbar, GitHub-Pages-tauglich) als Lern-, Wiederholungs- und Nachschlagewerk für die Notfallsanitäter-Ausbildung. Kernprodukt: die Medikamentensektion.

---

## ▶ CONTINUE_FROM_HERE

### Aktueller Stand
Das App-Grundgerüst läuft vollständig und ist getestet (24/24 automatisierte Render-/Logik-Tests bestanden, via jsdom). Lauffähig durch Öffnen von `index.html` über einen statischen Webserver (oder GitHub Pages). Fertig sind:

- **PWA-Shell:** Dark-Theme-Design-System, Topbar, Bottom-Tabbar, Hash-Router mit Page-Transitions, Service Worker (offline), Manifest, Icons.
- **Medikamenten-Modul (Kernprodukt):** 49 Medikamente aus der Pharma-Zusammenfassung als normalisiertes JSON; alphabetische Liste mit A–Z-Gruppierung, Gruppenfilter, Favoriten, Collapse-Detailansicht mit allen Pflichtfeldern, Quellenangabe pro Eintrag, „nicht in Unterlagen vorhanden“-Markierung.
- **Globale Suche:** fehlertolerant (Levenshtein-Fuzzy + Teilwort), gruppierte Ergebnisse, Synonyme (87 aus den Unterlagen), Suchhistorie, Favoriten im Such-Idle-Screen. Strg/Cmd+K.
- **Lernkarten:** 336 automatisch generierte Karten (Frage/Antwort) mit 4-stufigem Wiederholsystem (Leitner-artig), Filter nach Gruppe/Favoriten/Medikament.
- **Quiz:** Multiple-Choice (Handelsname→Med, Gruppe, Indikation, KI), Übungs-/Prüfungs-/Fehler-Wiederholungs-Modus, Fehleranalyse.
- **AML-Tab:** Original-PDF (ÖRK OÖ V5.1 2025) **unverändert** als eigener Tab eingebunden (Viewer + Download). Wird nie modifiziert.
- **Dashboard:** Suche, Schnellzugriffe, Lernfortschritt, zuletzt angesehen, Favoriten, Modul-Kacheln.
- **Pharma-Grundlagen:** 13 Themen (Rezeptoren, Antiarrhythmika-Klassen, inotrop/chronotrop, Opiat vs. Opioid …).

### Letzte Änderungen (diese Session)
- Pharma-Zusammenfassung V4 (33 S.) vollständig extrahiert und in 49 Medikamenten-Datensätze + 13 Grundlagen-Einträge überführt.
- Komplette App implementiert (HTML/CSS/JS, kein Framework, kein Build-Schritt).
- jsdom-Testlauf: 24/24 bestanden.

### Nächste konkrete Tasks (Priorität von oben)
1. **Spez. Pharmakologie (192 S.) auswerten** → bestehende Einträge anreichern (zusätzliche Medikamente/Details, die NUR dort stehen) und ggf. neue Medikamente ergänzen. Datei `data/meds_*.json` erweitern; bei Abweichungen zur Zusammenfassung **beide Werte mit Quelle** zeigen.
2. **Notfälle-Modul** aus den 3 Notfall-Skripten (218 S.): Datenmodell `data/erkrankungen_*.json` (Definition, Symptome, Diagnostik, Therapie, Medikamente, DD, Prüfungsfragen) + Views + Verknüpfung Erkrankung↔Medikament.
3. **Anatomie-Modul** (59 S., handschriftlich): seitenweise visuell transkribieren, unsichere Stellen als `unsicher: true` markieren. Kategorien: Herz-Kreislauf, Atmung, Nervensystem, Bewegungsapparat, Organe.
4. **EKG-, Gerätelehre-, Hygiene-Module** befüllen.
5. Verknüpfungen Medikament↔Erkrankung im Detail anzeigen (Felder dafür sind im Datenmodell vorgesehen).

### Blocker / Unsicherheiten
- **Anatomie-PDF ist handschriftlich** → Transkription langsam und teils unsicher; eigene Session vorgesehen. Nichts raten.
- **Adrenalin-Wirkung:** Quelle schreibt „Antagonist zu Adrenorezeptoren“; pharmakologisch ist Adrenalin Agonist. Im Eintrag als Quellenhinweis dokumentiert, Originalwortlaut nicht stillschweigend „korrigiert“.
- **Quellpriorität (vom Nutzer bestätigt):** Pharma-Zusammenfassung ist führend für Medikamentendaten; AML bleibt eigener, unveränderter Tab. Spez. Pharmakologie ergänzend; bei Widerspruch beide Werte mit Quelle zeigen.
- Service Worker & PDF-Viewer funktionieren erst über echtes HTTP (GitHub Pages / lokaler Server), nicht per `file://`.

### Auto-Push-Workflow (für KI/Folge-Sessions)
GitHub-Repo: `https://github.com/0xDomi/NFS-APP.git`, Pages deployt von `main`.
Der gemountete Ordner kann NICHT committen (Mount erlaubt kein Löschen → `index.lock` bleibt hängen). Deshalb Push immer über einen frischen Klon:
1. `git clone https://github.com/0xDomi/NFS-APP.git /tmp/nfs`
2. Änderungen in `/tmp/nfs` einbringen (oder Patches aus dem Arbeitsordner anwenden) und parallel in den Arbeitsordner spiegeln, damit der Nutzer lokale Kopien hat.
3. Token lesen: `git -C <arbeitsordner> config --get nfs.pushtoken`
4. `git -C /tmp/nfs push "https://x-access-token:<TOKEN>@github.com/0xDomi/NFS-APP.git" HEAD:main`
**Bei jedem Release:** `APP_VERSION` in `js/app.js` UND `CACHE` in `sw.js` erhöhen, damit der In-App-Update-Button die neue Version erkennt.

### Wie weiterarbeiten
Daten liegen modular in `data/*.json`. Neue Medikamente = Objekt nach Schema in `DATA_MODEL.md` ergänzen → erscheint automatisch in Liste, Suche, Lernkarten, Quiz. Neue Module: View in `js/views.js` + Route in `js/app.js`. Quell-PDFs liegen unter `Unterlagen/`.

---

## Fortschritt nach Bereich

| Bereich | Status | % |
|---|---|---|
| Architektur & Doku | ✅ | 100 |
| PWA-Shell / Offline / Manifest | ✅ | 100 |
| Medikamentendatenbank (Zusammenfassung) | ✅ | 100 |
| Medikamentendatenbank (Spez. Pharma-Ergänzung) | ⬜ | 0 |
| Globale Suche | ✅ | 95 |
| Lernkarten | ✅ | 90 |
| Quiz | ✅ | 85 |
| AML-Tab | ✅ | 100 |
| Dashboard | ✅ | 90 |
| Grundlagen | ✅ | 100 |
| Erkrankungen / Notfälle | ⬜ | 0 |
| Anatomie | ⬜ | 0 |
| EKG / Gerätelehre / Hygiene | ⬜ | 0 |

**Quell-Unterlagen gesamt:** ~712 Seiten. **In dieser Session verarbeitet:** Pharma-Zusammenfassung (33 S.) + AML (eingebunden).
