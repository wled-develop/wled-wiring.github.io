# LED Strip Drag Resizer Concept

## Ziel

Resizable LED-Streifen sollen neben den vorhandenen Toolbox-Buttons `tooltip.enlarge` und `tooltip.shorten` einen sichtbaren Ziehgriff am Streifenende bekommen. Der Ziehgriff erlaubt das Verlaengern und Verkuerzen mit der Maus, ohne den ReactFlow `NodeResizer` zu verwenden.

Der Ziehgriff muss fuer alle erlaubten Rotationen `0`, `90`, `180` und `270` Grad korrekt am logischen Ende des LED-Streifens liegen. Beim Ziehen bleibt der logische Anfang des Streifens fixiert; nur das Ende bewegt sich. Die Laenge wird immer auf natuerliche Schritte `N * nodeBasicSizeX` gerundet, wobei `N >= 1` gilt.

## Bestehender Kontext

- LED-Streifen sind normale ReactFlow Nodes mit `resizableX`.
- Die dargestellte Laenge wird ueber `compData.nodeLength` abgebildet.
- Ein logischer Laengenschritt entspricht `nodeBasicSizeX`.
- Die Toolbar ist sichtbar, wenn `componentEditActive` gilt:
  - Node ist selektiert.
  - Es gibt keine Mehrfachauswahl.
  - Die Node wird nicht gerade gezogen.
- Die Buttons zum Verlaengern und Verkuerzen verwalten aktuell:
  - `nodeLength`
  - `repeatedHandleArray`
  - Loeschen von Edges, wenn beim Verkuerzen wiederholte Handles wegfallen
  - Positionskorrektur bei `180` und `270` Grad, damit der Anfang fixiert bleibt
- Der ReactFlow `NodeResizer` ist fuer rotierbare Komponenten nicht geeignet und darf fuer diesen Zweck nicht verwendet werden.

## Sichtbarkeit und Aktivierung

Der Drag-Resizer soll sichtbar und aktiv sein, wenn dieselben Bedingungen gelten wie fuer die Bearbeitungs-Toolbar:

```ts
const dragResizeActive = componentEditActive && resizableX;
```

Damit ist er automatisch deaktiviert bei:

- keiner Auswahl
- Mehrfachauswahl
- Node-Drag
- Komponenten ohne `resizableX`

Der Griff soll als `div` innerhalb der Node gerendert werden, nicht als ReactFlow `NodeResizer`. Er braucht die Klassen `nopan` und `nodrag`, damit das Ziehen des Griffs nicht als Canvas-Pan oder Node-Drag interpretiert wird.

## Darstellung

Der Griff wird als kleines Quadrat am logischen Ende des Streifens dargestellt. Im Quadrat kann ein Pfeilsymbol angezeigt werden, das in Richtung der Laengenaenderung zeigt.

Empfohlene Darstellung:

- Groesse: ca. `14px` bis `18px`
- Position: absolut relativ zur Node
- Farbe: gut sichtbar, aber passend zur bestehenden Selection-Optik
- Cursor:
  - `ew-resize` bei `0` und `180` Grad
  - `ns-resize` bei `90` und `270` Grad
- Tooltip optional: bestehende Texte `tooltip.enlarge`/`tooltip.shorten` passen nur bedingt; besser waere langfristig ein eigener Text, z.B. `tooltip.resizeLength`.

Die Pfeilrichtung entspricht der Richtung, in die das Streifenende bei positiver Laengenaenderung wandert:

| Rotation | Ende wandert bei Verlaengerung | Cursor | Griffrotation |
| --- | --- | --- | --- |
| `0` | rechts | `ew-resize` | `0deg` |
| `90` | unten | `ns-resize` | `90deg` |
| `180` | links | `ew-resize` | `180deg` |
| `270` | oben | `ns-resize` | `270deg` |

## Griffposition

Die Position des Griffs muss am logischen Ende liegen, nicht einfach an `right: 0` oder `bottom: 0`, weil die Node bei `90` und `270` Grad ihre dargestellte Breite/Hoehe tauscht.

Ausgangswerte:

```ts
const stripLengthPx = nodeLength * nodeBasicSizeX;
const centerY = nodeBasicSizeY / 2;
const centerX = nodeBasicSizeY / 2;
```

Konzeptionelle Griffanker:

| Rotation | Griffanker relativ zur Node |
| --- | --- |
| `0` | `left = stripLengthPx`, `top = nodeBasicSizeY / 2` |
| `90` | `left = nodeBasicSizeY / 2`, `top = stripLengthPx` |
| `180` | `left = 0`, `top = nodeBasicSizeY / 2` |
| `270` | `left = nodeBasicSizeY / 2`, `top = 0` |

Der Griff selbst wird mit `transform: translate(-50%, -50%) rotate(...)` zentriert und passend gedreht.

## Drag-Modell

Beim `pointerdown` auf den Griff:

1. `event.stopPropagation()` und `event.preventDefault()` ausfuehren.
2. `setPointerCapture(event.pointerId)` auf dem Griff setzen.
3. `takeSnapshot('resize component')` genau einmal am Drag-Start aufrufen.
4. Startzustand speichern:
   - Startpointer in Screen-Koordinaten
   - `nodeLength` beim Start
   - Node-Position beim Start
   - aktuelle Rotation
   - `nodeBasicSizeX`
   - Startwert von `repeatedHandleArray`

Beim `pointermove`:

1. Pointer-Bewegung auf die lokale Laengenachse projizieren.
2. Laengenaenderung in Schritte umrechnen:

```ts
const stepDelta = Math.round(projectedDeltaPx / nodeBasicSizeX);
const nextNodeLength = Math.max(1, startNodeLength + stepDelta);
```

3. Wenn `nextNodeLength` unveraendert ist, nichts updaten.
4. Sonst dieselbe Resize-Logik verwenden wie die Toolbar-Buttons.

Wichtig: Die Projektion muss mit der Rotation arbeiten:

| Rotation | Projektion auf Screen-Delta |
| --- | --- |
| `0` | `deltaX` |
| `90` | `deltaY` |
| `180` | `-deltaX` |
| `270` | `-deltaY` |

Damit bedeutet eine Bewegung in Richtung des sichtbaren Endes immer positive Laengenaenderung.

Beim `pointerup` oder `pointercancel`:

1. Pointer-Capture freigeben.
2. Drag-State leeren.
3. Autopan stoppen.

## Gemeinsame Resize-Logik

Die bestehende Button-Logik sollte nicht dupliziert werden. Stattdessen sollte eine gemeinsame Funktion entstehen, die eine Ziellaenge setzt:

```ts
resizeComponentToLength(nextNodeLength: number, options?: {
  deleteRemovedHandleEdges: boolean;
})
```

Diese Funktion uebernimmt:

- Clamp auf `nextNodeLength >= 1`
- Aufbau zusaetzlicher repeated Handles beim Verlaengern
- Entfernen repeated Handles beim Verkuerzen
- Loeschen verbundener Edges von entfernten Handles
- Aktualisieren von `nodeLength`
- Aktualisieren von `repeatedHandleArray`
- Positionskorrektur bei `180` und `270` Grad
- `updateNodeInternals(id)`

Die vorhandenen Toolbar-Buttons sollten spaeter ebenfalls nur noch diese Funktion aufrufen:

```ts
resizeComponentToLength(nodeLength + 1);
resizeComponentToLength(nodeLength - 1);
```

So bleibt das Verhalten zwischen Button-Resize und Drag-Resize identisch.

## Positionskorrektur

Beim Aendern der Laenge muss der logische Anfang fixiert bleiben. Dafuer wird aus alter und neuer Laenge ein Pixel-Delta berechnet:

```ts
const deltaPx = (nextNodeLength - previousNodeLength) * nodeBasicSizeX;
```

Positionsdelta:

| Rotation | Positionskorrektur |
| --- | --- |
| `0` | `{ x: 0, y: 0 }` |
| `90` | `{ x: 0, y: 0 }` |
| `180` | `{ x: -deltaPx, y: 0 }` |
| `270` | `{ x: 0, y: -deltaPx }` |

Diese Logik muss fuer Buttons und Drag-Resizer identisch sein.

## Autopan

Beim Draggen kann der Pointer leicht an den sichtbaren Rand des Diagramms kommen. Dann soll automatisch gepannt werden.

Konzept:

- Beim aktiven Drag in jedem `pointermove` den Pointer gegen den ReactFlow-Wrapper oder Viewport pruefen.
- Randzone z.B. `48px`.
- Pan-Geschwindigkeit steigt mit Naehe zum Rand, z.B. linear bis `16px` pro Frame.
- Autopan per `requestAnimationFrame` ausfuehren, solange:
  - Drag aktiv ist
  - Pointer in der Randzone liegt

Panning kann ueber die ReactFlow Viewport-API erfolgen. Konzeptionell:

```ts
const viewport = reactFlowInstance.getViewport();
reactFlowInstance.setViewport({
  x: viewport.x + panDelta.x,
  y: viewport.y + panDelta.y,
  zoom: viewport.zoom,
});
```

Nach jedem Autopan muss die Laengenberechnung weiterhin auf der aktuellen Pointer-Bewegung basieren. Da der Pointer in Screen-Koordinaten bleibt, kann die Schrittberechnung ueber `projectedDeltaPx / zoom` erfolgen:

```ts
const zoom = reactFlowInstance.getZoom();
const flowDeltaPx = projectedScreenDeltaPx / zoom;
```

Damit bleibt das Snapping auch bei Zoom korrekt.

## Zoom und Snapping

Pointer-Events liefern Screen-Pixel. `nodeBasicSizeX` ist Flow-/Canvas-Pixel. Deshalb muss beim Drag die Pointer-Bewegung durch den aktuellen Zoom geteilt werden:

```ts
const flowDeltaX = (event.clientX - startClientX) / zoom;
const flowDeltaY = (event.clientY - startClientY) / zoom;
```

Danach wird die rotierte Projektion berechnet und auf ganze Schritte gerundet. `Math.round` fuehlt sich beim Ziehen direkt an, weil der Schritt wechselt, sobald mehr als ein halber Schritt gezogen wurde. Falls spaeter ein konservativeres Verhalten gewuenscht ist, kann auf `Math.floor`/`Math.ceil` je nach Vorzeichen gewechselt werden.

## Edge- und Handle-Verhalten

Beim Verlaengern muessen neue repeated Handles genauso entstehen wie beim Button:

- Template aus `compData.handles` mit `repeated == "yes"`
- `repeatIndex = nextNodeLength - 1`
- `hid = originalHid + "_" + repeatIndex`
- `x = originalX + repeatIndex * nodeBasicSizeX`
- `relatedToHandle` ueber `repeatedRelatedHandleIds(...)` aktualisieren

Beim Verkuerzen muessen repeated Handles mit `repeatIndex >= nextNodeLength` entfernt werden. Verbundene Edges zu diesen Handles muessen geloescht werden, bevor der Handle entfernt wird.

## Empfohlene Implementierungsschritte

1. Bestehende Button-Resize-Logik in `GeneralComponent.tsx` in `resizeComponentToLength(nextNodeLength)` extrahieren.
2. Buttons auf diese Funktion umstellen.
3. Reusable Helper fuer Positionskorrektur einfuehren.
4. Reusable Helper fuer Griffanker und Cursor einfuehren.
5. Drag-State mit `useRef` anlegen.
6. Griff nur bei `componentEditActive && resizableX` rendern.
7. Pointer-Drag mit Snapping auf `nodeBasicSizeX` implementieren.
8. Autopan per `requestAnimationFrame` ergaenzen.
9. Build pruefen.
10. Manuell testen:
    - Rotation `0`, `90`, `180`, `270`
    - Verlaengern und Verkuerzen
    - Zoom ungleich `1`
    - Drag ueber sichtbare Diagrammgrenzen
    - Mehrfachauswahl
    - Entfernen von Handles mit verbundenen Edges

## Nicht-Ziele

- Kein Einsatz von ReactFlow `NodeResizer` fuer rotierbare LED-Streifen.
- Keine heuristische freie Skalierung.
- Keine nicht-ganzzahligen Laengenfaktoren.
- Keine Aenderung der fachlichen physikalischen Laengenwerte in `physLengths`; der Resizer aendert nur die grafische Anzahl der Streifenmodule.
