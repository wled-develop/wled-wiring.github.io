# Konzept: Neues Komponentenmodell

Stand: 2026-05-25

## Ziel

Das aktuelle Komponentenmodell ist fuer Entwickler einfach: Eine neue Komponente wird als neue TypeScript-Datei in `src/components/ComponentTypes/` angelegt und in `ComponentList.ts` importiert. Fuer einen Komponenten-Editor und fuer Benutzerkomponenten aus einem Store ist dieses Modell aber unguenstig, weil die Komponente als ausfuehrbarer Code vorliegt und nicht als klar validierbares, speicherbares Datenobjekt.

Das neue Modell soll drei Dinge gleichzeitig ermoeglichen:

1. Neue eingebaute Komponenten bleiben im Source sehr einfach hinzufuegbar.
2. Ein Komponenten-Editor kann dieselbe Komponentendefinition anschaulich bearbeiten.
3. Ein Komponenten-Store kann benutzerdefinierte Komponenten speichern, laden und separat im Katalog anzeigen.

Kernidee: Eine Komponente wird fachlich als reine, JSON-kompatible `ComponentDefinition` beschrieben. Runtime-Code wandelt diese Definition in die heute verwendete ReactFlow-Node-Struktur um.

## Problem im aktuellen Stand

Aktuell enthalten die Dateien in `src/components/ComponentTypes/` direkt ReactFlow-`Node`-Objekte. Darin sind gemischt:

- Katalogdaten wie Name, Beschreibung, Gruppe und Bild.
- Geometrie wie Bildgroesse, Rotation, Resize-Optionen und Handles.
- Elektrische Metadaten fuer Diagramm-Checks.
- Simulationsdaten in `simdata`.
- UI-Felder wie Input- und Select-Felder.
- Teilweise direkte Imports aus `@xyflow/react`, z.B. `Position`.

Diese Mischung ist fuer handgeschriebene Source-Dateien akzeptabel, aber fuer einen Browser-Editor und einen Store problematisch:

- Benutzerkomponenten duerfen keinen beliebigen TypeScript-Code enthalten.
- Der Editor braucht ein stabiles Schema, keine beliebigen TS-Ausdruecke.
- Store-Daten muessen validierbar, versionierbar und sicher ladbar sein.
- `ComponentList.ts` muss heute manuell erweitert werden.
- Uebersetzungen ueber `compData.*` Keys funktionieren fuer eingebaute Komponenten, aber nicht direkt fuer Komponenten, die Nutzer im Browser erstellen.

## Grundprinzip

Die fachliche Komponente wird als Datenpaket beschrieben:

```ts
type ComponentPackage = {
  schemaVersion: 1;
  source: ComponentSource;
  component: ComponentDefinition;
  assets?: ComponentAsset[];
  translations?: ComponentTranslations;
  store?: ComponentStoreMetadata;
};
```

`ComponentDefinition` ist JSON-kompatibel. Sie darf keine Funktionen, Klassen, React-Komponenten, Imports oder berechneten Werte enthalten. Alle abgeleiteten Werte entstehen in einer Normalisierungs- und Validierungsschicht.

Runtime-Pipeline:

1. Komponentenpakete aus dem Source und optional aus dem Store laden.
2. Schema validieren.
3. Paket in eine interne `NormalizedComponentDefinition` ueberfuehren.
4. Daraus bei Bedarf eine ReactFlow-`Node<ComponentDataType>` Vorlage erzeugen.
5. Beim Einfuegen ins Diagramm wird wie heute eine konkrete Node mit eigener `id`, Position und `data` erstellt.

Wichtig: Die Anwendung soll bei Benutzerkomponenten nichts erraten. Fehlende oder widerspruechliche Daten erzeugen Validierungsfehler. Es werden keine heuristischen Korrekturen vorgenommen.

## Datenformat

Vorgeschlagene Struktur fuer die eigentliche Komponente:

```ts
type ComponentDefinition = {
  id: string;
  version: number;
  display: ComponentDisplayDefinition;
  geometry: ComponentGeometryDefinition;
  handles: ComponentHandleDefinition[];
  fields?: ComponentFieldDefinition[];
  internalConnections?: ComponentInternalConnectionDefinition[];
  simulation?: ComponentSimulationDefinition;
  editor?: ComponentEditorHints;
};
```

### Identitaet

`id` ersetzt fachlich `technicalID`, kann aber fuer bestehende Komponenten erstmal denselben Wert behalten.

Regeln:

- Eingebaute Komponenten verwenden IDs wie `ESP32D1mini`.
- Benutzerkomponenten bekommen im Store zusaetzlich einen Namespace, z.B. `user:abc123:MyBoard`.
- Die Kombination aus `source`, `id` und `version` ist eindeutig.
- `version` ist die fachliche Template-Version und entspricht heute `technicalVersion`.

Im erzeugten `ComponentDataType` bleiben `technicalID` und `technicalVersion` erhalten, damit bestehende Checks, Simulation und Template-Updates weiter funktionieren. Langfristig sollte zusaetzlich ein expliziter `componentRef` gespeichert werden:

```ts
type ComponentRef = {
  source: "core" | "local" | "store";
  packageId?: string;
  componentId: string;
  version: number;
};
```

### Anzeige und Uebersetzung

```ts
type LocalizedText = string | {
  default: string;
  de?: string;
  en?: string;
  zh?: string;
};

type ComponentDisplayDefinition = {
  name: LocalizedText;
  descriptionShort: LocalizedText;
  description?: LocalizedText;
  group: ComponentGroupType;
  showName?: boolean;
  buyLinks?: {url: string; text: string}[];
};
```

Fuer eingebaute Komponenten duerfen `name` und Beschreibungen weiterhin Translation-Keys enthalten, z.B. `compData.ESP32D1mini.name`. Fuer Benutzerkomponenten sind Inline-Texte vorgesehen. Der Text-Resolver entscheidet:

- Wenn ein String als bekannter i18n-Key existiert, wird `t(key)` verwendet.
- Wenn ein `LocalizedText` Objekt existiert, wird die aktuelle Sprache genutzt, sonst `default`.
- Wenn beides fehlt, ist die Definition ungueltig.

Bei eingebauten Komponenten bleiben die Dateien in `src/translations/` die Quelle fuer gepflegte App-Uebersetzungen. Der Komponenten-Editor schreibt fuer Benutzerkomponenten keine App-Translations, sondern speichert Texte direkt im Paket.

### Geometrie und Assets

```ts
type ComponentGeometryDefinition = {
  image?: {
    assetId?: string;
    url?: string;
    width: number;
    height: number;
  };
  noBackgroundImage?: boolean;
  rotation?: number;
  rotatable?: boolean;
  resizableX?: boolean;
  resizableY?: boolean;
  borderWidth?: number;
  physLengthStep?: number;
};

type ComponentAsset = {
  id: string;
  kind: "image";
  mimeType: "image/png" | "image/jpeg" | "image/webp" | "image/svg+xml";
  fileName?: string;
  url?: string;
  dataUrl?: string;
  width?: number;
  height?: number;
  sha256?: string;
};
```

Eingebaute Komponenten koennen Bilder weiter aus `public/` referenzieren. Store-Komponenten koennen entweder ein Store-gehostetes Asset, eine externe Bild-URL oder ein kleines eingebettetes `dataUrl` verwenden. Eingebettete Assets sind auf maximal 1 kB pro Asset begrenzt. Wenn eine Komponente auf eine externe Bild-URL verweist, muss der Editor vor dem Speichern oder Veroeffentlichen bestaetigen lassen, dass das Bild frei verwendet werden darf.

### Handles

Handles bleiben explizit, weil Diagramm-Checks und Simulation davon leben.

```ts
type ComponentHandleDefinition = {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  type: "source" | "target";
  x: number;
  y: number;
  xalign: "start" | "end";
  yalign: "start" | "end";
  width: number;
  height: number;
  postype: "centered" | "top" | "bottom" | "left" | "right";
  position?: "left" | "right" | "top" | "bottom";
  border?: {
    type: string;
    color: string;
    lineWidth: number;
    radius: string;
  };
  functions?: HandleFunction[];
  voltage?: {
    out?: number;
    outDependency?: string;
    toleranceMin?: number;
    toleranceMax?: number;
  };
  behavior?: {
    repeated?: boolean;
    repeatAtFirst?: boolean;
    mustBeConnected?: boolean;
    changeColorAutomatically?: boolean;
    controllableBy?: string;
    preferredLineWidth?: number;
    preferredLineDirection?: "up" | "down" | "left" | "right";
    hideConditions?: {fieldId: string; values: number[]}[];
  };
};
```

Beim Normalisieren wird daraus der heutige `HandleDataType` erzeugt:

- `id` wird zu `hid`.
- `position` wird auf die von ReactFlow erwartete `Position` gemappt.
- `voltage.out` wird zu `Vout`.
- `voltage.outDependency` wird zu `VoutDependency`.
- `behavior.*` wird auf die bestehenden Felder gemappt.

Die erlaubten `functions` muessen zentral aus einem Katalog kommen, nicht frei getippt werden. Der Editor bietet diese Werte als Auswahl an. Neue Funktionswerte sind eine Aenderung am Programm und muessen in Diagramm-Checks, Simulation und Dokumentation bewusst ergaenzt werden.

### Felder und Optionen

Input- und Select-Felder sollten aus dem heutigen Modell uebernommen, aber vereinheitlicht werden:

```ts
type ComponentFieldDefinition =
  | {
      id: string;
      type: "number";
      name: LocalizedText;
      value: number;
      min: number;
      max: number;
      step: number;
      unit?: string;
      ui?: ComponentFieldUi;
    }
  | {
      id: string;
      type: "select";
      name: LocalizedText;
      selectedValue: number;
      options: {
        value: number;
        label: LocalizedText;
        image?: {assetId?: string; url?: string; width?: number; height?: number};
        x?: number;
        y?: number;
      }[];
      ui?: ComponentFieldUi;
    };
```

Die bestehenden `inputFields`, `selectFields` und `inputFieldsBox` werden beim Normalisieren daraus erzeugt. Damit bleiben die sichtbaren Komponenten erstmal kompatibel.

### Interne Verbindungen

Interne Verbindungen bleiben Daten, weil Diagramm-Checks und Simulation sie auswerten:

```ts
type ComponentInternalConnectionDefinition =
  | {
      kind: "short";
      fromHandle: string;
      toHandle: string;
    }
  | {
      kind: "fuse";
      fromHandle: string;
      toHandle: string;
      fuseId: string;
      nominalCurrent?: number;
      nominalCurrentField?: string;
    };
```

Validierung:

- `fromHandle` und `toHandle` muessen existieren.
- `nominalCurrentField` muss auf ein numerisches Feld verweisen.
- IDs duerfen innerhalb einer Komponente nicht doppelt sein.

### Simulation

`simulation` sollte strukturell identisch mit der aktuellen `simdata` bleiben:

```ts
type ComponentSimulationDefinition = {
  version: 1;
  elements?: ComponentSimulationElementUse[];
};
```

Der Editor kann dafuer einen visuellen Element-Builder anbieten, aber das Datenformat bleibt dasselbe wie in `Docs/SIMUL_CONCEPT.MD`. Dadurch muessen Solver und Modellaufbau nicht neu erfunden werden.

Validierung:

- Jedes Terminal muss auf einen existierenden Handle verweisen.
- Jede Parameterreferenz auf `{field: "..."}` oder `{select: "..."}` muss existieren.
- `ledSimulationOption` darf nur bei Komponenten mit passenden LED-Optionen verwendet werden.
- Unbekannte Elementtypen sind Fehler.

## Source-Komponenten

Neue eingebaute Komponenten sollen weiter so einfach sein wie heute eine neue Datei anzulegen. Dafuer gibt es zwei sinnvolle Varianten.

### Empfohlene Variante: eine Datei pro Komponente mit `defineComponent`

Beispiel:

```ts
// src/components/catalog/core/WS2812B_5V_30LPM.component.ts
import { defineComponent } from "../defineComponent";

export default defineComponent({
  schemaVersion: 1,
  source: {type: "core"},
  component: {
    id: "WS2812B_5V_30LPM",
    version: 1,
    display: {
      name: "compData.WS2812B_5V_30LPM.name",
      descriptionShort: "compData.WS2812B_5V_30LPM.descriptionShort",
      description: "compData.WS2812B_5V_30LPM.description",
      group: "led",
      showName: true,
    },
    geometry: {
      image: {url: "./WS2812B_5V_30LPM.png", width: 85, height: 25},
      rotatable: true,
      resizableX: true,
      borderWidth: 2,
      physLengthStep: 0.016667,
    },
    handles: [
      {
        id: "5V_start",
        type: "source",
        x: 2.7,
        y: 19.2,
        xalign: "start",
        yalign: "start",
        width: 6,
        height: 5,
        postype: "centered",
        position: "left",
        name: "5V pin",
        description: "5V supply input",
        border: {type: "dotted", color: "red", lineWidth: 0.8, radius: "30%"},
        functions: ["suppl_in"],
        voltage: {toleranceMin: 4, toleranceMax: 5},
        behavior: {preferredLineDirection: "left"},
      },
    ],
    simulation: {
      version: 1,
      elements: [],
    },
  },
});
```

Der Vorteil: Entwickler behalten TypeScript-Unterstuetzung (`satisfies`, Autocomplete, Fehler beim Build), aber die Definition bleibt JSON-kompatibel.

Die Registry kann diese Dateien automatisch laden:

```ts
const modules = import.meta.glob("./core/*.component.ts", {eager: true});
```

Damit entfaellt das manuelle Pflegen von `ComponentList.ts`. Eine neue Komponente braucht nur noch eine neue Datei im richtigen Ordner.

### Alternative: reine JSON-Dateien

Einbau-Komponenten koennen auch als `.component.json` gespeichert werden. Das ist naeher am Store-Format und gut fuer automatisierte Bearbeitung. Nachteil: weniger TypeScript-Komfort beim Entwickeln.

Empfehlung: Source-Komponenten zuerst als `.component.ts` mit JSON-kompatiblem Objekt definieren. Der Editor und Store verwenden exakt dasselbe Schema als JSON.

## Komponenten-Registry

Statt `ComponentList` als statischem Array sollte es eine Registry geben:

```ts
type ComponentCatalog = {
  core: NormalizedComponentDefinition[];
  local: NormalizedComponentDefinition[];
  store: NormalizedComponentDefinition[];
};
```

Aufgaben der Registry:

- Eingebaute Komponenten aus Source laden.
- Lokal gespeicherte Nutzerkomponenten laden.
- Store-Index laden und Komponentenpakete nach Bedarf abrufen.
- Definitionen validieren und Fehler sammeln.
- Doppelte IDs mit Namespace aufloesen.
- Nach Gruppe, Herkunft, Suchtext und Simulationsfaehigkeit filtern.
- Aus einer Definition eine ReactFlow-Node-Vorlage erzeugen.

Der bestehende Komponentenbereich kann dann statt `ComponentList` die Registry nutzen:

- Bereich "Built-in components" fuer `core`.
- Bereich "My components" fuer lokal erstellte Komponenten.
- Bereich "Community components" fuer Store-Komponenten.

Fuer die aktuelle UI kann die Gruppierung erstmal so bleiben wie heute, aber Store-Komponenten sollten sichtbar als separate Quelle markiert sein.

## Komponenten-Editor

Der Editor bearbeitet `ComponentPackage`, nicht ReactFlow-Nodes direkt. Er sollte denselben Normalizer verwenden wie die Runtime, damit Vorschau, Katalog und Store identisch reagieren.

### Hauptbereiche

1. Stammdaten
   - Name, Kurzbeschreibung, Beschreibung.
   - Gruppe.
   - Version.
   - Tags und Quelle.

2. Bild und Geometrie
   - Bild hochladen oder URL setzen.
   - Breite/Hoehe festlegen.
   - Vorschau in Originalgroesse.
   - Rotierbarkeit und Resize-Optionen.
   - Physikalischer Laengenschritt fuer LED-Streifen.

3. Anschluesse
   - Handles direkt auf dem Bild platzieren.
   - Handles per Drag verschieben.
   - Groesse, Form, Farbe und Rand bearbeiten.
   - Funktion aus bekanntem Funktionskatalog waehlen.
   - Spannungswerte und Toleranzen setzen.
   - Pflichtanschluss, Wiederholung, Hide-Conditions und bevorzugte Leitungsrichtung setzen.

4. Felder und Optionen
   - Nummernfelder fuer Spannung, Strom, Widerstand usw.
   - Select-Felder mit optionalen Bildern.
   - Hide-Conditions visuell mit Handles verbinden.

5. Interne Verbindungen
   - Short- und Fuse-Verbindungen zwischen Handles auswaehlen.
   - Sicherungsparameter auf feste Werte oder Felder legen.

6. Simulation
   - Elementtypen aus dem bestehenden Simulationskatalog auswaehlen.
   - Terminals per Handle-Auswahl verbinden.
   - Parameter als feste Werte, Field-Refs, Select-Refs oder erlaubte Spezialrefs definieren.
   - Vorschau, ob die Komponente als simulationsfaehig gilt.

7. Validierung
   - Schemafehler.
   - Doppelte IDs.
   - Unbekannte Handle-Funktionen.
   - Fehlende Terminal- oder Field-Referenzen.
   - Fehlende Uebersetzungen oder Fallback-Texte.
   - Ungueltige Asset-Referenzen.

8. Vorschau
   - Katalogkarte.
   - Komponente im Mini-ReactFlow-Canvas.
   - Optionales Testdiagramm fuer Diagramm-Checks und Simulation.

### Editor-Ausgaben

Der Editor sollte drei Speicherwege haben:

- Lokal im Browser speichern, z.B. IndexedDB.
- Als `.component.json` exportieren/importieren.
- In den Komponenten-Store veroeffentlichen.

Der Editor soll keine TypeScript-Dateien erzeugen muessen. Fuer Entwickler kann es spaeter optional einen Export als `defineComponent({...})` geben, aber die fachliche Wahrheit bleibt das JSON-kompatible Paket.

## Komponenten-Store

Der Store ist fachlich aehnlich zum heutigen Teilen von Modellen ueber einen oeffentlichen Link: Benutzer veroeffentlichen ein JSON-Paket, andere koennen es laden. Anders als bei Diagramm-Modellen braucht der Store aber einen Index, damit die App Komponenten listen und suchen kann.

### Store-Dateien

Minimaler Aufbau:

```text
component-store/
  index.json
  components/
    abc123/
      component.json
      assets/
        board.png
```

`index.json` enthaelt nur Metadaten fuer die Liste:

```ts
type ComponentStoreIndex = {
  schemaVersion: 1;
  updatedAt: string;
  components: ComponentStoreIndexEntry[];
};

type ComponentStoreIndexEntry = {
  packageId: string;
  componentId: string;
  version: number;
  name: LocalizedText;
  descriptionShort: LocalizedText;
  group: ComponentGroupType;
  tags?: string[];
  author?: string;
  license?: string;
  rating?: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
  packageUrl: string;
  thumbnailUrl?: string;
  status: "draft" | "submitted" | "public" | "hidden" | "blocked";
  compatibility: {
    minAppSchemaVersion: number;
    componentSchemaVersion: 1;
  };
};
```

Die eigentliche Komponente liegt in `component.json` als `ComponentPackage`.

### Veroeffentlichung

Der Editor sendet ein Komponentenpaket an eine Store-API. Die API validiert serverseitig erneut:

- JSON-Schema gueltig.
- Genau eine Komponente pro Paket.
- Keine unbekannten Funktionen oder Simulationselemente.
- Asset-Groessen und MIME-Typen erlaubt.
- Eingebettete Assets maximal 1 kB pro Asset.
- Bei externen Bild-URLs liegt die Bestaetigung des Nutzers zur freien Verwendbarkeit vor.
- Keine externen Script- oder HTML-Inhalte.
- Package-ID eindeutig.

Danach wird das Paket zunaechst mit Status `submitted` gespeichert. Es erscheint erst nach Moderation/Freigabe mit Status `public` im oeffentlichen Store-Index. Die Speicherung kann analog zum bestehenden Modell-Store in einem GitHub-Repository oder hinter derselben API-Domaene erfolgen.

Der Store stellt zusaetzlich Endpunkte fuer Bewertung und Meldung bereit. Bewertungen duerfen als aggregierte Werte im Index erscheinen. Meldungen bleiben Moderationsdaten und fuehren nicht automatisch zu Aenderungen am Paket; ein Moderator entscheidet, ob eine Komponente sichtbar bleibt, auf `hidden` gesetzt oder als `blocked` gesperrt wird.

### Laden in der App

Beim Start oder beim Oeffnen des Komponentenbereichs:

1. App laedt `index.json`.
2. Store-Komponenten werden als Liste angezeigt.
3. Einzelne Pakete werden erst bei Bedarf geladen oder nach Nutzeraktion gecacht.
4. Geladene Pakete werden lokal gecacht, damit bestehende Diagramme auch offline oder bei Store-Ausfall weiter funktionieren.

Wichtig: Store-Komponenten werden separat gelistet und sollten nicht still in die Built-in-Liste gemischt werden. Nutzer muessen erkennen koennen, ob eine Komponente aus dem Programm, lokal vom Nutzer oder aus dem oeffentlichen Store kommt.

## Speichern von Diagrammen mit Benutzerkomponenten

Ein Diagramm darf nicht unbrauchbar werden, nur weil eine Store-Komponente spaeter nicht mehr erreichbar ist. Deshalb sollte eine eingefuegte Benutzerkomponente im Diagramm zwei Dinge speichern:

1. `componentRef` mit Quelle, Package-ID, Component-ID und Version.
2. Eine normalisierte Snapshot-Kopie der verwendeten `ComponentDataType`-Daten.

Beim Laden:

- Wenn die passende Definition vorhanden ist, kann die App Template-Updates anbieten.
- Wenn die Definition fehlt, wird die Snapshot-Kopie verwendet.
- Wenn eine neuere Version existiert, wird wie bei heutigen Template-Updates gefragt, ob aktualisiert werden soll.

Damit bleiben geteilte Diagramme reproduzierbar.

## Validierung

Die Validierung ist ein eigener Kernbaustein:

```ts
validateComponentPackage(package): ComponentValidationResult
normalizeComponentPackage(package): NormalizedComponentDefinition
createReactFlowTemplate(definition): GeneralComponent
```

Validierungsregeln:

- Alle Pflichtfelder vorhanden.
- IDs stabil und eindeutig.
- `version` ist eine positive ganze Zahl.
- `group` ist bekannt.
- Bildgroessen sind positive Zahlen.
- Handles liegen in einem plausiblen Bereich zur Geometrie.
- Handle-Funktionen stammen aus dem bekannten Katalog.
- Referenzen auf Handles, Felder, Select-Werte und Assets existieren.
- Simulationsdaten entsprechen `Docs/SIMUL_CONCEPT.MD`.
- Interne Verbindungen entsprechen `Docs/DIAGRAMM_CHECKS_CONCEPT.MD`.

Die Validierung darf Korrekturvorschlaege anzeigen, aber nicht automatisch raten und veraendern. Wenn Daten nicht eindeutig sind, bleibt die Definition ungueltig.

## Migration

### Phase 1: Schema und Adapter

- Neues Schema in `src/components/catalog/componentSchema.ts` definieren.
- Normalizer bauen, der `ComponentPackage` in `ComponentDataType` ueberfuehrt.
- Bestehende `ComponentDataType`-Objekte weiter unterstuetzen.
- Tests fuer einige representative Komponenten: Controller, LED-Streifen, PSU, Fuse, Info/Special.

### Phase 2: Auto-Registry fuer Source-Komponenten

- Neue Source-Struktur einfuehren:

```text
src/components/catalog/
  core/
    ESP32D1mini.component.ts
    WS2812B_5V_30LPM.component.ts
  defineComponent.ts
  normalizeComponent.ts
  validateComponent.ts
  componentRegistry.ts
```

- `import.meta.glob` fuer `*.component.ts` nutzen.
- `ComponentList.ts` nur noch als Kompatibilitaetsschicht exportieren oder schrittweise ersetzen.

### Phase 3: Bestehende Komponenten umziehen

- Komponenten einzeln vom alten Node-Format in `ComponentPackage` uebertragen.
- Dabei keine fachlichen Aenderungen vornehmen.
- Nach jeder Gruppe Build und Diagramm-Check-/Simulationsbeispiele pruefen.
- Uebersetzungs-Keys in `src/translations/` erhalten.

### Phase 4: Komponenten-Editor

- Editor zuerst lokal bauen.
- Validierung und Vorschau vor Store-Anbindung fertigstellen.
- Import/Export von `.component.json` anbieten.

### Phase 5: Store-Anbindung

- Store-Index laden und separat anzeigen.
- Einzelpakete laden, validieren und cachen.
- Veroeffentlichen ueber API ergaenzen.
- Datenschutz-/Hinweistexte analog Modell-Share in allen Translations pflegen.

## Auswirkungen auf Checks und Simulation

Diagramm-Checks und Simulation sollen moeglichst wenig wissen, ob eine Komponente aus Source, Editor oder Store kommt. Sie bekommen weiterhin `ComponentDataType` mit:

- `handles`
- `internalConnections`
- `simdata`
- `inputFields`
- `selectFields`
- `group`
- `technicalID`
- `technicalVersion`

Das neue Modell veraendert also primaer die Entstehung der Komponentendaten, nicht die fachliche Auswertung.

Wenn neue Handle-Funktionen, neue interne Verbindungstypen oder neue Simulationselemente ergaenzt werden, muessen weiterhin die passenden Konzeptdokumente gepflegt werden:

- Diagramm-Checks: `Docs/DIAGRAMM_CHECKS_CONCEPT.MD`
- Simulation: `Docs/SIMUL_CONCEPT.MD`
- Solver: `Docs/SOLVER.MD`

## Festlegungen fuer offene Punkte

Die bisher offenen Fragen sind fuer die erste Store- und Editor-Version wie folgt festgelegt.

### Bildquellen

Die erste Store-Version erlaubt externe Bild-URLs und Store-gehostete Assets. Wenn ein Nutzer in einer Komponente auf eine externe Bild-URL verweist, muss der Editor vor dem Speichern oder Veroeffentlichen eine explizite Bestaetigung verlangen, dass das Bild frei verwendet werden darf.

Fuer Store-gehostete Assets bleibt die API verantwortlich, erlaubte MIME-Typen und Dateigroessen zu pruefen. Externe Bild-URLs werden als Referenz gespeichert; sie muessen beim Laden weiterhin durch die normale Paketvalidierung laufen.

### Moderation

Komponenten erscheinen nicht sofort automatisch im oeffentlichen Store-Index. Es gibt eine Moderations- bzw. Freigabestufe, bevor ein Paket den Status `public` bekommt.

Empfohlene Statuswerte:

- `draft`: lokal oder serverseitig gespeichert, aber nicht eingereicht.
- `submitted`: vom Nutzer eingereicht und wartet auf Pruefung.
- `public`: freigegeben und im Store-Index sichtbar.
- `hidden`: nicht mehr im Index sichtbar, aber bestehende Links koennen weiter aufloesbar bleiben.
- `blocked`: gesperrt; die App soll diese Komponente nicht mehr neu laden oder anbieten.

### Bewerten und Melden

Nutzer sollen Store-Komponenten bewerten und melden koennen. Fuer die erste Version reicht eine einfache Trennung:

- Bewertung: freiwillige Nutzerbewertung fuer Qualitaet/Nuetzlichkeit.
- Meldung: Hinweis auf Copyright-Probleme, falsche technische Daten, gefaehrliche elektrische Angaben oder ungeeignete Inhalte.

Meldungen sollen nicht automatisch Komponenten veraendern. Sie erzeugen Moderationsbedarf. Bis zur Pruefung kann die Komponente sichtbar bleiben oder manuell auf `hidden` bzw. `blocked` gesetzt werden.

### Eingebettete Assets

Eingebettete Assets in `dataUrl`-Form sind auf maximal 1 kB pro Asset begrenzt. Dadurch bleiben Komponentenpakete klein und der Store-Index bzw. Diagramm-Snapshots werden nicht mit grossen Bilddaten aufgeblasen.

Groessere Bilder muessen als externe Bild-URL oder als Store-gehostetes Asset referenziert werden.

### Paketumfang

Ein Komponentenpaket enthaelt genau eine Komponente. Der Editor speichert, importiert, exportiert und veroeffentlicht immer ein Paket pro Komponente.

Falls spaeter Komponenten-Sammlungen gebraucht werden, sollen sie als separates Bundle-/Collection-Format auf mehrere einzelne Komponentenpakete verweisen, nicht mehrere Komponenten in einem Paket verschachteln.

### Updates

Store-Komponenten werden nach dem Einfuegen in ein Diagramm nicht automatisch aktualisiert. Updates duerfen nur nach expliziter Nutzerbestaetigung angewendet werden, analog zum heutigen Verhalten fuer eingebaute Komponenten-Templates.

Beim Laden eines Diagramms soll die App erkennen:

- Die verwendete Store-Komponente ist nicht verfuegbar: Snapshot verwenden.
- Dieselbe Version ist verfuegbar: keine Aktion notwendig.
- Eine neuere Version ist verfuegbar: Update anbieten, aber nicht automatisch anwenden.

## Empfehlung

Der beste naechste Schritt ist nicht sofort der Store, sondern das Datenformat und die Registry. Sobald eingebaute Komponenten aus demselben `ComponentPackage`-Schema normalisiert werden koennen, fallen Editor und Store fast natuerlich daraus heraus:

- Entwickler fuegen weiterhin eine Datei hinzu.
- Der Editor bearbeitet dieselbe Struktur.
- Der Store speichert dieselbe Struktur.
- Checks und Simulation verwenden weiterhin die normalisierten Runtime-Daten.

Damit wird das Komponentenmodell vom aktuellen Code-Objekt zu einem echten, validierbaren Bauteilkatalog.
