# DATA_MODEL – NFS Lernapp

Alle Daten liegen als statische JSON-Arrays unter `data/`. Modular, offline durchsuchbar, normalisiert für Suche und Verknüpfungen.

## Medikament (`data/meds_*.json`)
Array von Objekten. **Kernprodukt** – Schema:

```jsonc
{
  "id": "adrenalin",            // eindeutig, kebab-case, stabil (URL & Lernkarten-Keys)
  "name": "Adrenalin",          // Anzeigename
  "handelsname": "Suprarenin 1 mg | 1 ml, …",  // Präparat(e) + Konzentration(en)
  "wirkstoff": "Adrenalin (Epinephrin)",
  "gruppe": "Herz-Kreislauf & Rhythmus",        // Oberkategorie (= Filter & Quizgruppe)
  "untergruppe": "Katecholamine / Sympathomimetika", // optional, kann null sein
  "indikation": ["…", "…"],     // Array
  "dosierung": [                // Array aus {kontext, wert} – erlaubt mehrere Szenarien
    { "kontext": "Atem-Kreislauf-Stillstand", "wert": "1 mg Erw. i.v. (0,01 mg/kg KG Kind)" }
  ],
  "wirkung": "…",               // String
  "wirkungsbeginn": "…",        // String, ggf. "nicht in Unterlagen vorhanden"
  "kontraindikation": ["…"],
  "nebenwirkungen": ["…"],
  "achtung": "…",               // Besonderheiten / CAVE; optional (null)
  "kinder": "…",                // Pädiatrie-Hinweis; optional (null)
  "merksaetze": ["…"],          // Array; optional leer
  "synonyme": ["Suprarenin","Supra","Epinephrin"], // für Suche; NUR aus Unterlagen
  "pruefungsrelevanz": "hoch",  // "hoch" | "mittel" | "niedrig"
  "quelle": "Pharma Zusammenfassung 2025/26 V4, S. 7"
}
```

### Konventionen
- **Fehlende Inhalte:** Wert `"nicht in Unterlagen vorhanden"` (String) bzw. `["nicht in Unterlagen vorhanden"]` (einelementiges Array) oder `null` bei optionalen Feldern. Niemals raten/füllen.
- **Pflichtfelder** (vom Test geprüft): `id, name, wirkstoff, gruppe, indikation, kontraindikation, nebenwirkungen, dosierung, wirkung, pruefungsrelevanz, quelle`.
- `id` ist global eindeutig über alle `meds_*.json` (Test erzwingt das).
- **Quellenpriorität:** Pharma-Zusammenfassung führend. Bei Widerspruch zur Spez. Pharmakologie: beide Werte mit Quellenangabe nebeneinander (z. B. im betreffenden Feld als „Wert A (Quelle X) / Wert B (Quelle Y)“).

### Vorgesehene Verknüpfungsfelder (für spätere Module)
- `erkrankungen: ["myokardinfarkt", …]` – IDs aus `erkrankungen_*.json`. Wird im Detail als Querlink gerendert, sobald das Notfälle-Modul existiert.

## Grundlagen (`data/grundlagen.json`)
```jsonc
{ "id":"rezeptoren", "titel":"…", "kategorie":"Pharma-Grundlagen", "inhalt":"… (mit \n)", "quelle":"… S. X" }
```

## Erkrankung (geplant – `data/erkrankungen_*.json`)
```jsonc
{
  "id":"anaphylaxie", "name":"Anaphylaxie", "kategorie":"…",
  "definition":"…", "symptome":["…"], "diagnostik":["…"], "therapie":["…"],
  "medikamente":["adrenalin","prednisolon"],   // Querverweis → Medikament-IDs
  "differentialdiagnosen":["…"], "pruefungsfragen":["…"],
  "quelle":"Notfälle … S. X"
}
```

## Anatomie (geplant – `data/anatomie_*.json`)
```jsonc
{
  "id":"…", "titel":"…",
  "kategorie":"Herz-Kreislauf|Atmung|Nervensystem|Bewegungsapparat|Organe",
  "inhalt":"…", "unsicher": false,   // true = OCR/Handschrift unsicher → in UI markiert
  "quelle":"Skriptum Anatomie S. X"
}
```

## Abgeleitete Daten (zur Laufzeit, nicht gespeichert)
- **Suchindex** (`NFSSearch.build`): pro Eintrag `primary[]` + `haystack` (normalisiert).
- **Lernkarten** (`App.allCards`): generiert aus vorhandenen Medikamentenfeldern; Key = `"<medId>:<feld>"`.
- **Quizfragen** (`App.buildQuiz`): generiert; Key = `"q-<typ>:<medId>"`.

## Persistenter Nutzer-State (`localStorage` Key `nfs-app-v1`)
```jsonc
{ "favs":["adrenalin"], "history":["…"], "searchHistory":["…"],
  "cardsBox": {"adrenalin:dos": 2}, "quizErrors": {"q-hn:atropin": true} }
```

## Aktueller Datenbestand
49 Medikamente · 87 Synonyme · 13 Grundlagen-Themen · ~336 generierte Lernkarten.
Gruppen: Herz-Kreislauf & Rhythmus, ACS | Gerinnung, Blutdruck | Volumen, Atemwege | Allergie, Analgesie | Sedierung, Narkose | Muskelrelaxanzien, Weitere wichtige Medikamente.
