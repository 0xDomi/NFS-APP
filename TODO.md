# TODO – NFS Lernapp

## ✅ Erledigt (Session 1)
- [x] Quell-Unterlagen gesichtet, Architektur & Datenmodell entworfen
- [x] Pharma-Zusammenfassung V4 (33 S.) → 49 Medikamente als JSON
- [x] Pharma-Grundlagen (13 Themen) als JSON
- [x] PWA-Shell: Dark-Theme-Design-System, Topbar, Tabbar, Hash-Router, Page-Transitions
- [x] Manifest + Service Worker (offline) + Icons (192/512/maskable)
- [x] Medikamenten-Modul: Liste (A–Z), Gruppenfilter, Favoriten, Collapse-Detail, Quellen, „nicht in Unterlagen“-Markierung
- [x] Globale Suche: fehlertolerant, Teilwort, Synonyme, gruppiert, Historie, Favoriten, Strg+K
- [x] Lernkarten (336) mit Wiederholsystem + Filter
- [x] Quiz: MC, Übungs-/Prüfungs-/Fehlermodus, Fehleranalyse
- [x] AML-Tab (Original-PDF, unverändert) + Download
- [x] Dashboard (Suche, Schnellzugriffe, Fortschritt, Verlauf, Favoriten)
- [x] Doku: PROJECT_STATUS, ARCHITECTURE, DATA_MODEL, TODO, CHANGELOG, README
- [x] GitHub-Pages-Setup (.nojekyll, README-Anleitung)
- [x] Automatisierter Render-/Logik-Test (jsdom): 24/24 bestanden

## 🔜 Als Nächstes (Priorität)
- [ ] **Spez. Pharmakologie (192 S.)** auswerten → bestehende Medikamente anreichern, fehlende ergänzen; Widersprüche mit beiden Quellen zeigen
- [ ] **Notfälle-Modul**: Datenmodell `erkrankungen_*.json` + Views + Verknüpfung Erkrankung↔Medikament (3 Skripten, 218 S.)
- [ ] Medikament-Detail: Querlinks zu verknüpften Erkrankungen rendern

## 📋 Backlog
- [ ] **Anatomie** (59 S., handschriftlich): seitenweise transkribieren, unsichere Stellen markieren; Kategorien Herz-Kreislauf/Atmung/Nervensystem/Bewegungsapparat/Organe
- [ ] **EKG** (EKG-Gesamt + mediknow) aufbereiten
- [ ] **Gerätelehre** (70 S.) aufbereiten
- [ ] **Hygiene** (Mitschrift) aufbereiten
- [ ] Quiz: Wahr/Falsch- und Freitext-Fragetypen ergänzen
- [ ] Lernkarten: Schwierigkeitsgrad pro Karte + Favoriten auf Kartenebene
- [ ] Schnellübersicht/„Spickzettel“-Ansicht pro Medikamentengruppe (Tabelle)
- [ ] Optional: Volltextsuche auch über AML-PDF-Inhalt (Textlayer indexieren)
- [ ] Optional: Light-Theme-Umschalter

## 🧪 Test/Qualität
- [ ] Inhaltliche Zweitprüfung aller Dosierungen gegen Quell-PDF (stichprobenartig erfolgt)
- [ ] Lighthouse/PWA-Check auf GitHub Pages (Installierbarkeit, Offline)
- [ ] Test auf echtem iOS/Android-Gerät (Installation „Zum Homebildschirm“)
