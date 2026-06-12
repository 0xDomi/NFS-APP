# NFS Lernapp 💊

Eine installierbare, **offline-fähige Progressive Web App** als Lern-, Wiederholungs- und Nachschlagewerk für die **Notfallsanitäter-Ausbildung (NFS)**. Kernprodukt ist die Medikamentensektion. Alle Inhalte stammen ausschließlich aus den bereitgestellten Ausbildungsunterlagen.

## Features
- **Globale Suche** über alle Inhalte – fehlertolerant, Teilwort, Synonyme, Suchhistorie (Strg/Cmd+K).
- **Medikamente** (49) mit Indikation, Dosierung, Wirkung, KI, Nebenwirkungen, CAVE, Kinder, Merksätzen, Prüfungsrelevanz – jeweils mit Quellenangabe.
- **Lernkarten** mit Wiederholsystem und **Quiz** (Übungs-, Prüfungs-, Fehlerwiederholungs-Modus).
- **AML OÖ V5.1 (2025)** als eigener Tab – Original-PDF, unverändert.
- **Dashboard** mit Fortschritt, Favoriten und zuletzt Angesehenem.
- Premium-Dark-Theme, mobile-first, **offline installierbar** (Android/iOS/Desktop).

## Lokal starten
Ein statischer Server genügt (wegen Service Worker & `fetch` nicht per Doppelklick/`file://` öffnen):

```bash
cd NFS-App
python3 -m http.server 8000
# Browser: http://localhost:8000
```

## Auf GitHub Pages veröffentlichen
1. Neues GitHub-Repo anlegen, Inhalt dieses Ordners pushen:
   ```bash
   git init && git add . && git commit -m "NFS Lernapp v0.1.0"
   git branch -M main
   git remote add origin https://github.com/<NUTZER>/<REPO>.git
   git push -u origin main
   ```
2. Repo → **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `/ (root)`.
3. Nach ~1 Min. erreichbar unter `https://<NUTZER>.github.io/<REPO>/`.
4. Auf dem Handy im Browser öffnen → „Zum Startbildschirm hinzufügen“ → läuft als App, auch offline.

> Die Datei `.nojekyll` ist enthalten, damit GitHub Pages alle Dateien unverändert ausliefert.

## Inhaltliche Grundregeln
- Nur Inhalte aus den Unterlagen; **nichts erfunden**.
- Fehlende Angaben sind als **„nicht in Unterlagen vorhanden“** markiert.
- Das AML-PDF wird ausschließlich angezeigt, **niemals verändert**.

## Projektdoku
`PROJECT_STATUS.md` (Stand & nächste Schritte) · `ARCHITECTURE.md` · `DATA_MODEL.md` · `TODO.md` · `CHANGELOG.md`.
Die App ist **modular erweiterbar** – neue Medikamente/Module werden als JSON ergänzt (siehe `DATA_MODEL.md`).

## Status
**v0.1.0** – Grundgerüst + Medikamenten-Kernprodukt vollständig. Notfälle, Anatomie, EKG u. a. folgen (siehe `TODO.md`).
