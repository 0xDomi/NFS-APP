# CHANGELOG – NFS Lernapp

Format orientiert an „Keep a Changelog“. Datumsangaben: ISO.

## [0.2.0] – 2026-06-12 – AML als strukturierte Ansicht

### Hinzugefügt
- **AML I & II als eigene, strukturierte Datenbasis** (`data/aml.json`, 20 Notfallbilder + allgemeine Regelungen) – 1:1 aus dem Originaldokument (ÖRK LV OÖ V5.1/2025) übernommen, nichts verändert oder weggelassen.
- Neue AML-Ansicht: Liste nach Arzneimittelliste I (Notfallsanitäter) und II (nach Chefarzt-Freigabe); Detailseite je Notfallbild mit ABCDE, Diagnose, Keypoints, Maßnahme/Medikament (altersgestaffelte Dosierung, KI, NW, „oder/und“-Verknüpfungen) und Reevaluation/Wiederholungsregeln.
- Reanimationsalgorithmen (Erwachsene & Kinder) mit Schritten für schockbar/nicht schockbar.
- Querverlinkung AML-Maßnahme → Wirkstoff-Detail; AML-Notfallbilder in der globalen Suche (eigene Gruppe).
- Seite „Allgemeine Regelungen“ (Liste I/II, Kinder & vLJ, Venenzugang, KI, Dokumentation).

### Geändert
- AML-Tab zeigt jetzt die strukturierte Ansicht statt nur des eingebetteten PDFs; Original-PDF weiterhin per Button öffenbar.
- Service-Worker-Cache auf v3, App-Version 0.2.0.

### Getestet
- 22 jsdom-Assertions (AML-Liste, Detail, ABCDE, Dosierungen, ODER/UND, KI, Reevaluation, CPR, Suche) – alle bestanden.
- 10 Faithfulness-Stichproben AML-Daten vs. PDF-Text – alle exakt.

## [0.1.0] – 2026-06-12 – Grundgerüst + Medikamenten-Kernprodukt

### Hinzugefügt
- Projektstruktur, Architektur- und Datenmodell-Dokumentation.
- **Daten:** 49 Medikamente aus „final_Pharma Zusammenfassung 2/2026 V4“ als normalisiertes JSON (5 Dateien nach Gruppen) + 13 Pharma-Grundlagen-Themen. Jeder Eintrag mit Quellenangabe (Dokument + Seite) und Synonymen (87 gesamt).
- **PWA-Shell:** Premium-Dark-Theme-Design-System, Sticky-Topbar, Bottom-Tabbar, hash-basierter Router mit Page-Transitions, Mikrointeraktionen, animierte Expand/Collapse-Detailsektionen.
- **PWA-Infrastruktur:** `manifest.webmanifest`, Service Worker (`sw.js`, Cache-first/offline), Icons (192, 512, maskable, apple-touch).
- **Medikamenten-Modul:** alphabetische Liste mit A–Z-Gruppierung, Gruppenfilter-Chips, Favoriten, Detailansicht mit allen geforderten Feldern (Indikation, Dosierung, Wirkung, Wirkungsbeginn, KI, NW, CAVE, Kinder, Merksätze, Prüfungsrelevanz), „nicht in Unterlagen vorhanden“-Markierung.
- **Globale Suche:** fehlertolerant (Levenshtein-Fuzzy + Teilwort), gruppierte Ergebnisse, Synonyme, Suchhistorie, Favoriten-Schnellzugriff, Tastenkürzel Strg/Cmd+K, Treffer-Hervorhebung.
- **Lernkarten:** 336 automatisch aus den Medikamentendaten generierte Karten mit 4-stufigem Wiederholsystem, Filter nach Gruppe/Favoriten/Medikament, 3D-Flip-Animation.
- **Quiz:** Multiple-Choice (4 Fragetypen aus echten Daten), Übungs-/Prüfungs-/Fehler-Wiederholungs-Modus, Fehleranalyse mit Querlink zum Medikament.
- **AML-Tab:** Original-PDF „Arzneimittelliste I & II ÖRK OÖ V5.1 2025“ unverändert eingebunden (Viewer + Download).
- **Dashboard:** globale Suche, Schnellzugriffe, Lernfortschritt, zuletzt angesehen, Favoriten, Modul-Kacheln.
- **Modul-Platzhalter:** Anatomie, Notfälle, EKG, Gerätelehre, Hygiene als „in Vorbereitung“ markiert.
- **GitHub-Pages-Setup:** `.nojekyll`, README mit Deploy-Anleitung.

### Getestet
- jsdom-Render-/Logik-Test mit 24 Assertions (Daten, Navigation, Suche inkl. Fuzzy, Lernkarten, Quiz, AML, Platzhalter) – alle bestanden.
- JSON-Validität & Pflichtfeld-Prüfung aller Datendateien – 0 Fehler, IDs eindeutig.

### Bekannte Einschränkungen
- Service Worker und PDF-Viewer benötigen echtes HTTP (GitHub Pages/lokaler Server), nicht `file://`.
- Spez. Pharmakologie, Notfälle, Anatomie, EKG, Gerätelehre, Hygiene noch nicht inhaltlich eingearbeitet (siehe TODO).
- Adrenalin-Wirkung: Originalwortlaut „Antagonist“ beibehalten + Quellenhinweis (pharmakologisch Agonist).
