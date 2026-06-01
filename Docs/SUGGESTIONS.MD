# Vorschlag: Lokales Diagramm-Autosave und Wiederherstellung

## Ziel

Die App soll das aktuelle Diagramm automatisch lokal im Browser zwischenspeichern, damit Benutzer nach einem versehentlichen Tab-/Browser-Schliessen, Reload oder Absturz weiterarbeiten koennen. Beim naechsten Start der App erscheint ein Dialog, wenn ein automatisch gespeichertes Diagramm vorhanden ist:

- `Automatisch gespeichertes Diagramm fortsetzen`
- `Neues Diagramm starten`
- optional `Autosave verwerfen`

Das Autosave ersetzt nicht das bewusste Speichern/Exportieren als Datei. Es ist eine Crash-/Sitzungsrettung.

## Empfohlene technische Richtung

Autosave sollte als eigener lokaler Speicher neben dem normalen Diagramm-Export implementiert werden.

Empfehlung fuer die erste Version: `localStorage`.

Gruende:

- Das vorhandene Diagramm-JSON ist textbasiert und kann direkt aus `createDiagramExportJson(reactFlow)` erzeugt werden.
- Die Funktion ist einfach, synchron und ohne zusaetzliche Browser-API-Abstraktion nutzbar.
- Fuer typische WLED-Diagramme sollte die Groesse unter dem Browser-Limit liegen.

Spaetere Erweiterung: `IndexedDB`, falls Diagramme mit eingebetteten Daten, sehr vielen Komponenten oder mehreren Autosave-Slots groesser werden. Die Architektur sollte den Speicherzugriff deshalb hinter einem kleinen `autosaveStorage`-Modul kapseln.

## Speicherinhalt

Ein Autosave-Eintrag sollte nicht nur das nackte ReactFlow-Objekt enthalten, sondern Metadaten fuer den Restore-Dialog:

```ts
type DiagramAutosaveSnapshot = {
  version: 1;
  savedAt: string; // ISO timestamp
  lastManualSaveAt?: string; // ISO timestamp
  appVersion?: string;
  documentFileName?: string;
  diagram: {
    nodes: Node[];
    edges: Edge[];
    viewport: { x: number; y: number; zoom: number };
    checkSettings?: DiagramCheckSettings;
  };
};
```

Der `diagram`-Teil sollte fachlich dem normalen Exportformat entsprechen. Dadurch kann dieselbe Normalisierung wie beim Dateiimport genutzt werden, insbesondere fuer `checkSettings`.

`lastManualSaveAt` wird gesetzt, wenn der Benutzer das Diagramm erfolgreich manuell speichert oder als Datei herunterlaedt. Der Autosave bleibt danach weiter die aktuelle Arbeitskopie, kann im Restore-Dialog aber als "seit dem letzten manuellen Speichern unveraendert" bzw. "nach dem letzten manuellen Speichern geaendert" eingeordnet werden.

Nicht speichern:

- Undo-/Redo-History.
- Simulationsresultate.
- Diagramm-Check-Ergebnisse.
- UI-only Einstellungen wie offene Sidebar-Panels.

## Autosave-Trigger

Autosave ist als Einstellung unter `Erweiterte Einstellungen` sichtbar und standardmaessig aktiviert. Wird die Einstellung deaktiviert, soll kein weiterer Snapshot geschrieben werden. Ob ein vorhandener Snapshot beim Deaktivieren automatisch geloescht wird oder ein separater Button `Autosave verwerfen` angeboten wird, sollte in der UI eindeutig sein; fuer die erste Implementierung ist automatisches Loeschen beim Deaktivieren am einfachsten und am wenigsten ueberraschend.

Autosave sollte nicht bei jedem einzelnen Render schreiben, sondern gedrosselt:

- Bei Aenderungen an `nodes`, `edges`, `viewport` und Diagramm-Check-Einstellungen einen Dirty-Status setzen.
- Nach z.B. 1000-2000 ms ohne weitere Aenderung speichern.
- Zusaetzlich bei `visibilitychange` nach `hidden` und bei `pagehide` sofort speichern.

Wichtig: Browser begrenzen Arbeit in `beforeunload`; deshalb nicht nur darauf verlassen.

## Restore-Flow beim App-Start

1. App startet mit dem normalen leeren Startdiagramm.
2. Ein `AutosaveRestoreGate` prueft einmalig, ob ein gueltiger Autosave-Eintrag existiert.
3. Falls kein Autosave existiert: nichts anzeigen.
4. Falls Autosave existiert und leer/identisch zum Startdiagramm ist: optional automatisch verwerfen.
5. Falls Autosave existiert: AntD-Modal anzeigen mit Zeitpunkt, optional Dateiname und Hinweis, ob seit dem letzten manuellen Speichern noch Aenderungen vorhanden sind.
6. Bei `Fortsetzen`:
   - Autosave wie Dateiimport parsen/normalisieren.
   - `nodes`, `edges`, `viewport` und `checkSettings` setzen.
   - Undo-/Redo-History leeren.
   - Komponenten-Template-Update-Dialog wie beim Dateiimport anbieten.
7. Bei `Neues Diagramm starten`:
   - Autosave loeschen.
   - Leeres Startdiagramm behalten.

## Wann Autosave geloescht oder ersetzt wird

- Nach erfolgreichem Restore nicht sofort loeschen, sondern weiter als aktueller Autosave-Slot verwenden.
- Bei `Neues Diagramm starten` im Restore-Dialog loeschen.
- Bei bewusstem Datei-Open oder Beispiel-Load sollte der bestehende Autosave ersetzt werden, damit kein altes Diagramm spaeter wieder angeboten wird.
- Nach erfolgreichem manuellem Speichern bleibt der Autosave bestehen; er ist dann weiterhin die aktuelle Arbeitskopie. Dabei wird `lastManualSaveAt` im Snapshot gesetzt.

## Konflikte mit Datei-Handling

Der vorhandene Datei-/Download-Flow merkt sich `documentFileName` und optional einen File System Access API Handle. Autosave sollte keinen File-Handle speichern, weil Handles nicht verlaesslich serialisierbar sind und Benutzerrechte daran haengen.

Autosave darf daher nur den Anzeigenamen speichern, z.B. `wohnzimmer.json`, nicht den echten Zugriff auf die Datei.

## Sicherheits- und Datenschutzaspekte

Das Diagramm bleibt lokal im Browser des Benutzers. Es wird nicht an den Server gesendet.

Trotzdem sollte der Restore-Dialog klar sagen, dass ein lokal zwischengespeichertes Diagramm gefunden wurde. Fuer gemeinsam genutzte Rechner ist ein `Autosave verwerfen` wichtig.

## Fehlerfaelle

- Ungueltiges JSON oder inkompatible Version: Autosave ignorieren und loeschen oder einen Fehlerdialog mit `Verwerfen` anzeigen.
- `localStorage` voll: Autosave deaktivieren und einmalig eine Warnung anzeigen.
- Private-Browsing-Modus blockiert Storage: App bleibt normal nutzbar, nur ohne Autosave.
- Mehrere Tabs: erste Version nutzt genau einen Autosave-Slot und darf "last writer wins" verwenden. Spaeter kann ein `tabId` und `savedAt` helfen, Konflikte zu erkennen.

## Festgelegte Designentscheidungen

- Autosave bekommt eine Einstellung unter `Erweiterte Einstellungen` und ist standardmaessig aktiviert.
- Es gibt genau einen Autosave-Slot pro Browser/App-Origin, nicht einen Slot pro Dokumentname.
- Der Restore-Dialog zeigt keine Vorschau und keine Diagrammstatistik.
- Erfolgreiches manuelles Speichern markiert den Autosave mit `lastManualSaveAt` als gesichert.

## Minimaler Implementierungsplan

1. `src/utils/autosaveStorage.ts` mit `readAutosave`, `writeAutosave`, `clearAutosave`, `isAutosaveAvailable`.
2. Gemeinsame Import-Normalisierung aus `ImportExportPage` extrahieren, damit Dateiimport und Autosave-Restore denselben Parser nutzen.
3. Einstellung `Autosave aktiviert` unter `Erweiterte Einstellungen` ergaenzen, default `true`; Einstellung lokal im Browser speichern, nicht im Diagramm.
4. In `App.tsx` Autosave-Effekt fuer `nodes`, `edges`, `viewport` und Check-Einstellungen einbauen, aber nur wenn Autosave aktiviert ist.
5. Nach erfolgreichem manuellem Speichern/Save-As/Download `lastManualSaveAt` im Autosave-Snapshot aktualisieren.
6. Restore-Modal beim App-Start anzeigen, wenn ein gueltiger Autosave-Snapshot existiert.
7. Uebersetzungen fuer EN/DE/ZH ergaenzen.
8. Tests/Manuellpruefung:
   - Diagramm aendern, Tab schliessen, App neu oeffnen, Restore funktioniert.
   - `Neues Diagramm starten` loescht Autosave.
   - Dateiimport ersetzt den Autosave sauber.
   - Manuelles Speichern aktualisiert `lastManualSaveAt`.
   - Deaktiviertes Autosave schreibt keinen Snapshot.
   - Defekter Autosave blockiert den App-Start nicht.
