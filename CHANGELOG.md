# CHANGELOG – NFS Lernapp

Format orientiert an „Keep a Changelog“. Datumsangaben: ISO.

## [1.1.0] – 2026-06-12 – Bilder bei Medikamenten & EKG

### Hinzugefügt
- **Ampullenfotos bei allen 49 Medikamenten**: aus der Pharma-Zusammenfassung extrahiert und über die Seitenzahl dem jeweiligen Wirkstoff zugeordnet (bei mehreren Medikamenten pro Seite der Reihe nach verteilt). Anzeige oben im Medikamenten-Detail; Tippen vergrößert (Lightbox).
- **EKG-Rhythmusstreifen**: 10 beschriftete, eigene schematische SVG-Abbildungen (Sinusrhythmus, AV-Block I°/II° Wenckebach/II° 2:1/III°, SVT, VT, Kammerflimmern, VES-Bigeminus, STEMI) – im EKG-Modul bei den passenden Themen.
- Generische Bildergalerie mit Lightbox; Bilder werden vom Service Worker zur Laufzeit gecacht (offline nach erstem Aufruf).
- Service-Worker-Cache v8, App-Version 1.1.0.

### Hinweis
- EKG-Abbildungen sind eigene schematische Darstellungen (das kommerzielle „mediknow“-Skript wurde nicht verwendet). Medikamentenfotos stammen aus der bereitgestellten Pharma-Zusammenfassung.

## [1.0.0] – 2026-06-12 – EKG, Gerätelehre & Hygiene (Funktionsumfang vollständig)

### Hinzugefügt
- **Generisches Wissensmodul-System** und drei neue Module:
  - **EKG-Grundlagen** (5 Themen): Zacken/Normwerte, Ableitungen (Einthoven/Goldberger/Wilson), systematische Befundung & Frequenzbestimmung, AV-Blöcke/SVT/VT/VES/Schrittmacher, STEMI/NSTEMI. Eigene Zusammenfassung auf Basis des Kursskripts.
  - **Gerätelehre & Sanitätstechnik** (7 Themen): MPG, Corpuls C³ (Sicherheit/Kontrolle/Monitoring/Therapie), Atemwegsmanagement & Intubation (inkl. DOPES), Infusion/Injektion & Applikationsformen.
  - **Hygiene** (4 Themen): Geschichte, Erreger & Immunsystem, Sterilisation/Desinfektion, Recht.
- Alle drei Module in der globalen Suche (Gruppe „📘“) und als aktive Dashboard-Kacheln.
- Service-Worker-Cache v7, App-Version 1.0.0.

### Status
- Alle bereitgestellten Ausbildungsunterlagen sind eingearbeitet. Damit Funktionsumfang v1.0.0 erreicht.

### Hinweis
- Das EKG-Modul ist eine eigenständige Zusammenfassung; das kommerzielle „mediknow“-Skript wurde nicht übernommen.

## [0.4.0] – 2026-06-12 – Notfälle-Modul

### Hinzugefügt
- **Notfälle & Krankheitsbilder** als eigenes Modul: 32 Krankheitsbilder aus den drei NFS-Skripten („Notfälle bei verschiedenen Krankheitsbildern“, „Spezielle Notfälle“, „Störung der Vitalfunktionen und Regelkreise“), gegliedert in 12 Kategorien (Kardiale, Pulmonale, Schock, Abdominelle/Chirurgische, Neurologische, Stoffwechsel & Endokrin, Traumatologische, Thermische, Pädiatrische, Gynäkologie & Geburt, Intoxikationen, Vitalfunktionen).
- Pro Krankheitsbild: Definition, Symptome, Diagnostik, Therapie/Maßnahmen, Differentialdiagnosen, Prüfungsfragen (aufklappbar).
- **Verknüpfungen Erkrankung ↔ Medikament ↔ AML**: anklickbare Chips im Erkrankungs-Detail; Rückverlinkung im Medikament („Verknüpfte Notfallbilder“) und im AML-Notfallbild („Zugehörige Krankheitsbilder“).
- Krankheitsbilder in der globalen Suche (eigene Gruppe „🩺“, inkl. Volltext über Symptome/Therapie). Dashboard-Kachel aktiviert.
- Service-Worker-Cache v6, App-Version 0.4.0.

### Hinweis
- Aufbereitung der Ausbildungsfoliensätze (A. Gruber, Lehrsanitäter NFS/NKV). Verbindlich bleiben AML, ärztliche Anweisung und offizielles Lehrwerk.

## [0.3.0] – 2026-06-12 – Anatomie-Modul

### Hinzugefügt
- **Anatomie & Physiologie** als eigenes Modul: vollständige Transkription des handschriftlichen Skriptums (alle 59 Seiten) in 41 strukturierte Themen, gegliedert in 6 Kategorien (Grundlagen/Zelle & Gewebe, Bewegungsapparat, Herz-Kreislauf, Atmung, Nervensystem, Organe).
- Kategorie-gruppierte Übersicht mit Filter-Chips, Detailansicht je Thema mit Absatz-Formatierung.
- Schwer lesbare Handschrift-Stellen sind im Text mit **[?]** markiert (gelb hervorgehoben); ggf. ganze Themen als „unsichere Transkription“ gekennzeichnet – nichts geraten. Quellen-/Lehrwerkhinweis pro Seite.
- Anatomie-Themen in der globalen Suche (eigene Gruppe „🫀“). Dashboard-Kachel aktiviert.
- Service-Worker-Cache v5, App-Version 0.3.0.

### Hinweis
- Inhalte stammen aus dem optionalen handschriftlichen Skriptum; als offizielles Lehrwerk gilt „LPN Notfall San Österreich“.

## [0.2.1] – 2026-06-12 – AML: Notarzt-Farbcodierung & Hervorhebungen

### Hinzugefügt
- **Notarzt-Farbcodierung** je Notfallbild – direkt aus dem Original-PDF visuell ausgelesen: rot „Notarzt alarmieren“ (11), gelb „Notarzt erwägen“ (8), grün „Kein Notarzt erforderlich“ (1). Farbpunkt + linker Farbbalken in der Liste, großer Farbbanner in der Detailansicht, Legende in der Übersicht.
- **Wiederholungs-Hervorhebung**: Reevaluations-Zeilen sind jetzt farbig – rot mit ✕ bei „KEINE Wiederholung / nicht wiederholbar“, grün mit ↻ bei „wiederholbar / einmalig wiederholen“.
- **Kritische Keypoints** (Reanimationsbereitschaft, Defibrillation/DefiPads, 12-Kanal-EKG, CAVE/Wechsel zu ALS, assistierte Beatmung, Notarzt, Eigen-/Fremdschutz) werden mit Warn-Icon hervorgehoben.

### Geändert / Korrigiert
- Seitenzahlen aus der AML-Ansicht entfernt (auf Wunsch).
- Diazepam rektal (zerebraler Krampfanfall, Liste I): dritte Dosiszeile aus dem PDF eindeutig als **„ab 65. vLJ: 5 mg rektal“** korrigiert (vorher als layout-unklar markiert).
- App-Version 0.2.1, Service-Worker-Cache v4.

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
