import { useMemo } from "react";

import { useEdges, useNodes, useViewport, type Edge, type Node } from "@xyflow/react";

import type { ComponentDataType, EdgeDataType, XYPoint } from "../types";
import { getRenderedWireEndpoint } from "../utils/utils_functions";
import { useSimulationResultStore } from "./simulationResultStore";
import type { SimulationPinResult } from "./simulationTypes";

type OverlayLabel = {
  id: string;
  kind: "voltage" | "voltageDelta" | "wireCurrent" | "wireHover";
  valueLines: string[];
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  width: number;
  height: number;
};

type OverlayArrow = {
  id: string;
  kind: "current" | "voltageDelta";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  bidirectional: boolean;
};

type SegmentPoint = {
  point: XYPoint;
  direction: XYPoint;
  from: XYPoint;
  to: XYPoint;
  length: number;
};

const LABEL_PADDING_X = 8;
const LABEL_HEIGHT = 20;
const LEADER_LINE_THRESHOLD = 28;
const OVERLAP_PADDING = 4;
const VOLTAGE_LABEL_GAP = 18;
const WIRE_ARROW_LENGTH_PX = 14;
const WIRE_ARROW_STROKE_WIDTH = 2;
const WIRE_ARROW_MIN_GAP_PX = 2;
const WIRE_ARROW_CROSSING_PADDING_PX = 4;
const VOLTAGE_DELTA_ARROW_OFFSET_PX = 9;
const VOLTAGE_DELTA_LABEL_GAP_PX = 24;
const WIRE_LABEL_GAP = 20;
const HOVER_NORMAL_DISPLAY_DISTANCE = 40;
const HOVER_HORIZONTAL_LABEL_EXTRA_GAP_PX = 16;
const COMPONENT_OBSTACLE_PADDING = 3;
const WIRE_OBSTACLE_PADDING = 5;

const formatVoltage = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)} V`;
const formatDeltaVoltage = (value: number) => `\u0394V=${value.toFixed(2)}V`;
const formatCurrent = (value: number) => `${Math.abs(value).toFixed(2)} A`;

const pinResultHasVoltage = (result: SimulationPinResult) => result.voltageV !== undefined;

const screenPoint = (point: XYPoint, viewport: {x: number; y: number; zoom: number}) => ({
  x: (point.x * viewport.zoom) + viewport.x,
  y: (point.y * viewport.zoom) + viewport.y,
});

const wirePoints = (
  nodeById: Map<string, Node<ComponentDataType>>,
  edge: Edge<EdgeDataType>,
) => {
  const sourceNode = nodeById.get(edge.source);
  const targetNode = nodeById.get(edge.target);
  const sourceEndpoint = getRenderedWireEndpoint(sourceNode, edge.sourceHandle) ?? edge.data?.startXY;
  const targetEndpoint = getRenderedWireEndpoint(targetNode, edge.targetHandle) ?? edge.data?.endXY;
  if(!sourceEndpoint || !targetEndpoint) return [];

  return [
    sourceEndpoint,
    ...(edge.data?.edgePoints ?? []),
    targetEndpoint,
  ];
};

const pinHasConnectedWire = (
  edges: Edge<EdgeDataType>[],
  nodeId: string,
  handleId: string,
) => edges.some((edge) => (
  (edge.source === nodeId && edge.sourceHandle === handleId) ||
  (edge.target === nodeId && edge.targetHandle === handleId)
));

const isLedSupplyVoltagePin = (
  node: Node<ComponentDataType>,
  handleId: string,
) => (
  node.data.group === "led" &&
  /^(?:\d+V)_(?:start|end|middle_\d+)$/.test(handleId)
);

const overlayScale = (zoom: number) => Math.min(1, Math.max(0.55, zoom));

const estimateLabelSize = (valueLines: string[], scale: number) => {
  const longest = Math.max(...valueLines.map((value) => value.length), 1);
  return {
    width: Math.max(42, longest * 6 + LABEL_PADDING_X * 2) * scale,
    height: LABEL_HEIGHT * Math.max(valueLines.length, 1) * scale,
  };
};

const wireSegments = (points: XYPoint[]) => (
  points.slice(0, -1).map((from, index) => {
    const to = points[index + 1];
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    return {
      from,
      to,
      length,
      index,
      direction: length > 0
        ? {x: (to.x - from.x) / length, y: (to.y - from.y) / length}
        : {x: 0, y: 0},
    };
  }).filter((segment) => segment.length > 0)
);

const longestSegmentMidpoint = (points: XYPoint[]): SegmentPoint | undefined => {
  if(points.length < 2) return undefined;

  const segment = wireSegments(points)
    .sort((a, b) => b.length - a.length)[0];
  if(!segment) return undefined;

  return {
    point: {
      x: segment.from.x + (segment.to.x - segment.from.x) / 2,
      y: segment.from.y + (segment.to.y - segment.from.y) / 2,
    },
    direction: segment.direction,
    from: segment.from,
    to: segment.to,
    length: segment.length,
  };
};

const closestPointOnSegment = (point: XYPoint, from: XYPoint, to: XYPoint) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const lengthSquared = dx * dx + dy * dy;
  if(lengthSquared <= 0) return {point: from, ratio: 0, distance: Math.hypot(point.x - from.x, point.y - from.y)};

  const ratio = Math.min(1, Math.max(0, ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared));
  const closest = {
    x: from.x + dx * ratio,
    y: from.y + dy * ratio,
  };

  return {
    point: closest,
    ratio,
    distance: Math.hypot(point.x - closest.x, point.y - closest.y),
  };
};

const closestPointOnPolyline = (points: XYPoint[], point: XYPoint): SegmentPoint | undefined => {
  const segment = wireSegments(points)
    .map((candidate) => ({
      ...candidate,
      closest: closestPointOnSegment(point, candidate.from, candidate.to),
    }))
    .sort((a, b) => a.closest.distance - b.closest.distance)[0];
  if(!segment) return undefined;

  return {
    point: segment.closest.point,
    direction: segment.direction,
    from: segment.from,
    to: segment.to,
    length: segment.length,
  };
};

const pointAtSegmentRatio = (
  segment: Pick<SegmentPoint, "from" | "to" | "direction" | "length">,
  ratio: number,
): SegmentPoint => ({
  point: {
    x: segment.from.x + (segment.to.x - segment.from.x) * ratio,
    y: segment.from.y + (segment.to.y - segment.from.y) * ratio,
  },
  direction: segment.direction,
  from: segment.from,
  to: segment.to,
  length: segment.length,
});

const rectsOverlap = (
  a: {left: number; right: number; top: number; bottom: number},
  b: {left: number; right: number; top: number; bottom: number},
) => (
  a.left < b.right &&
  a.right > b.left &&
  a.top < b.bottom &&
  a.bottom > b.top
);

const labelRect = (label: Pick<OverlayLabel, "x" | "y" | "width" | "height">) => ({
  left: label.x - label.width / 2,
  right: label.x + label.width / 2,
  top: label.y - label.height / 2,
  bottom: label.y + label.height / 2,
});

const screenSegmentRect = (
  from: XYPoint,
  to: XYPoint,
  viewport: {x: number; y: number; zoom: number},
  padding: number,
) => {
  const start = screenPoint(from, viewport);
  const end = screenPoint(to, viewport);
  return {
    left: Math.min(start.x, end.x) - padding,
    right: Math.max(start.x, end.x) + padding,
    top: Math.min(start.y, end.y) - padding,
    bottom: Math.max(start.y, end.y) + padding,
  };
};

const nodeObstacleRects = (
  nodes: Node<ComponentDataType>[],
  viewport: {x: number; y: number; zoom: number},
) => nodes.map((node) => {
  const width = node.measured?.width ?? node.width ?? node.data.image?.width ?? 0;
  const height = node.measured?.height ?? node.height ?? node.data.image?.height ?? 0;
  const topLeft = screenPoint(node.position, viewport);
  return {
    left: topLeft.x - COMPONENT_OBSTACLE_PADDING,
    right: topLeft.x + width * viewport.zoom + COMPONENT_OBSTACLE_PADDING,
    top: topLeft.y - COMPONENT_OBSTACLE_PADDING,
    bottom: topLeft.y + height * viewport.zoom + COMPONENT_OBSTACLE_PADDING,
  };
});

const handleObstacleRects = (
  nodes: Node<ComponentDataType>[],
  viewport: {x: number; y: number; zoom: number},
) => nodes.flatMap((node) => (
  [...(node.data.handles ?? []), ...(node.data.repeatedHandleArray ?? [])].flatMap((handle) => {
    const endpoint = getRenderedWireEndpoint(node, handle.hid);
    if(!endpoint) return [];

    const center = screenPoint(endpoint, viewport);
    const width = Math.max(8, (handle.width ?? 8) * viewport.zoom);
    const height = Math.max(8, (handle.height ?? 8) * viewport.zoom);
    return [{
      left: center.x - width / 2 - COMPONENT_OBSTACLE_PADDING,
      right: center.x + width / 2 + COMPONENT_OBSTACLE_PADDING,
      top: center.y - height / 2 - COMPONENT_OBSTACLE_PADDING,
      bottom: center.y + height / 2 + COMPONENT_OBSTACLE_PADDING,
    }];
  })
));

const wireObstacleRects = (
  edges: Edge<EdgeDataType>[],
  nodeById: Map<string, Node<ComponentDataType>>,
  viewport: {x: number; y: number; zoom: number},
) => edges.flatMap((edge) => {
  const points = wirePoints(nodeById, edge);
  return wireSegments(points).map((segment) => screenSegmentRect(
    segment.from,
    segment.to,
    viewport,
    Math.max(WIRE_OBSTACLE_PADDING, ((edge.data?.width ?? 1) * viewport.zoom) / 2 + WIRE_OBSTACLE_PADDING),
  ));
});

const wireArrowBlockingRects = (
  edges: Edge<EdgeDataType>[],
  nodeById: Map<string, Node<ComponentDataType>>,
  viewport: {x: number; y: number; zoom: number},
  activeEdgeId: string,
) => edges.flatMap((edge) => {
  if(edge.id === activeEdgeId) return [];

  const points = wirePoints(nodeById, edge);
  return wireSegments(points).map((segment) => screenSegmentRect(
    segment.from,
    segment.to,
    viewport,
    Math.max(
      WIRE_ARROW_CROSSING_PADDING_PX,
      ((edge.data?.width ?? 1) * viewport.zoom) / 2 + WIRE_ARROW_CROSSING_PADDING_PX,
    ),
  ));
});

const hoverPreferredNormal = (
  currentDirection: XYPoint,
) => {
  const normal = {x: -currentDirection.y, y: currentDirection.x};
  if(Math.abs(currentDirection.x) >= Math.abs(currentDirection.y)) {
    return normal.y < 0 ? normal : {x: -normal.x, y: -normal.y};
  }

  return normal.x < 0 ? normal : {x: -normal.x, y: -normal.y};
};

const arrowRect = (
  center: XYPoint,
  direction: XYPoint,
  normal: XYPoint,
  lengthPx: number,
  paddingPx: number,
) => {
  const halfLength = lengthPx / 2;
  const halfThickness = WIRE_ARROW_STROKE_WIDTH / 2 + paddingPx;
  const corners = [
    {
      x: center.x - direction.x * halfLength - normal.x * halfThickness,
      y: center.y - direction.y * halfLength - normal.y * halfThickness,
    },
    {
      x: center.x - direction.x * halfLength + normal.x * halfThickness,
      y: center.y - direction.y * halfLength + normal.y * halfThickness,
    },
    {
      x: center.x + direction.x * halfLength - normal.x * halfThickness,
      y: center.y + direction.y * halfLength - normal.y * halfThickness,
    },
    {
      x: center.x + direction.x * halfLength + normal.x * halfThickness,
      y: center.y + direction.y * halfLength + normal.y * halfThickness,
    },
  ];

  return {
    left: Math.min(...corners.map((corner) => corner.x)),
    right: Math.max(...corners.map((corner) => corner.x)),
    top: Math.min(...corners.map((corner) => corner.y)),
    bottom: Math.max(...corners.map((corner) => corner.y)),
  };
};

const chooseArrowPoint = (
  point: SegmentPoint,
  currentDirection: XYPoint,
  normal: XYPoint,
  arrowOffsetPx: number,
  viewport: {x: number; y: number; zoom: number},
  blockingRects: Array<{left: number; right: number; top: number; bottom: number}>,
) => {
  const minimumMarginFlow = WIRE_ARROW_LENGTH_PX / 2 / Math.max(viewport.zoom, 0.001);
  const availableLength = Math.max(point.length - minimumMarginFlow * 2, 0);
  const preferredRatio = availableLength > 0
    ? Math.min(1, Math.max(0, ((point.point.x - point.from.x) * point.direction.x + (point.point.y - point.from.y) * point.direction.y) / point.length))
    : 0.5;
  const maxRatioShift = availableLength > 0 ? availableLength / point.length / 2 : 0;
  const ratioOffsets = [0, 0.12, -0.12, 0.22, -0.22, 0.34, -0.34, 0.44, -0.44];
  const candidateRatios = ratioOffsets
    .map((offset) => Math.min(1, Math.max(0, preferredRatio + offset)))
    .filter((ratio) => Math.abs(ratio - 0.5) <= 0.5 && Math.abs(ratio - preferredRatio) <= Math.max(maxRatioShift, 0.02));

  const candidates = Array.from(new Set(candidateRatios.map((ratio) => ratio.toFixed(4))))
    .map((ratio) => pointAtSegmentRatio(point, Number(ratio)))
    .map((candidate) => {
      const candidateScreen = screenPoint(candidate.point, viewport);
      const arrowCenter = {
        x: candidateScreen.x + normal.x * arrowOffsetPx,
        y: candidateScreen.y + normal.y * arrowOffsetPx,
      };
      const rect = arrowRect(
        arrowCenter,
        currentDirection,
        normal,
        WIRE_ARROW_LENGTH_PX,
        WIRE_ARROW_CROSSING_PADDING_PX,
      );
      const blockingPenalty = blockingRects.reduce((sum, blockingRect) => (
        sum + rectOverlapPenalty(rect, blockingRect)
      ), 0);
      const shiftPenalty = Math.hypot(
        candidateScreen.x - screenPoint(point.point, viewport).x,
        candidateScreen.y - screenPoint(point.point, viewport).y,
      ) * 0.15;

      return {candidate, penalty: blockingPenalty * 10 + shiftPenalty};
    })
    .sort((a, b) => a.penalty - b.penalty);

  return candidates[0]?.candidate ?? point;
};

const rectOverlapPenalty = (
  rect: {left: number; right: number; top: number; bottom: number},
  obstacle: {left: number; right: number; top: number; bottom: number},
) => {
  if(!rectsOverlap(rect, obstacle)) return 0;
  return (Math.min(rect.right, obstacle.right) - Math.max(rect.left, obstacle.left)) *
    (Math.min(rect.bottom, obstacle.bottom) - Math.max(rect.top, obstacle.top));
};

const chooseLabelPosition = (
  anchor: XYPoint,
  direction: XYPoint,
  normal: XYPoint,
  size: {width: number; height: number},
  existingLabels: OverlayLabel[],
  obstacles: Array<{left: number; right: number; top: number; bottom: number}>,
  labelGapPx = WIRE_LABEL_GAP,
) => {
  const candidates = [
    {x: anchor.x + normal.x * labelGapPx, y: anchor.y + normal.y * labelGapPx},
    {x: anchor.x - normal.x * labelGapPx, y: anchor.y - normal.y * labelGapPx},
    {x: anchor.x + direction.x * labelGapPx, y: anchor.y + direction.y * labelGapPx},
    {x: anchor.x - direction.x * labelGapPx, y: anchor.y - direction.y * labelGapPx},
    {x: anchor.x + (normal.x + direction.x) * labelGapPx, y: anchor.y + (normal.y + direction.y) * labelGapPx},
    {x: anchor.x + (normal.x - direction.x) * labelGapPx, y: anchor.y + (normal.y - direction.y) * labelGapPx},
    {x: anchor.x - (normal.x + direction.x) * labelGapPx, y: anchor.y - (normal.y + direction.y) * labelGapPx},
    {x: anchor.x - (normal.x - direction.x) * labelGapPx, y: anchor.y - (normal.y - direction.y) * labelGapPx},
  ];

  return candidates
    .map((candidate) => {
      const rect = labelRect({...candidate, ...size});
      const obstaclePenalty = obstacles.reduce((sum, obstacle) => sum + rectOverlapPenalty(rect, obstacle), 0);
      const labelPenalty = existingLabels.reduce((sum, label) => (
        sum + rectOverlapPenalty(rect, labelRect(label)) * 3
      ), 0);
      const distancePenalty = Math.hypot(candidate.x - anchor.x, candidate.y - anchor.y) * 0.05;
      return {candidate, penalty: obstaclePenalty + labelPenalty + distancePenalty};
    })
    .sort((a, b) => a.penalty - b.penalty)[0].candidate;
};

const chooseVoltageLabelPosition = (
  anchor: XYPoint,
  size: {width: number; height: number},
  existingLabels: OverlayLabel[],
  obstacles: Array<{left: number; right: number; top: number; bottom: number}>,
) => {
  const gap = VOLTAGE_LABEL_GAP;
  const candidates = [
    {x: anchor.x, y: anchor.y - gap},
    {x: anchor.x + gap, y: anchor.y},
    {x: anchor.x, y: anchor.y + gap},
    {x: anchor.x - gap, y: anchor.y},
    {x: anchor.x + gap, y: anchor.y - gap},
    {x: anchor.x - gap, y: anchor.y - gap},
    {x: anchor.x + gap, y: anchor.y + gap},
    {x: anchor.x - gap, y: anchor.y + gap},
    {x: anchor.x, y: anchor.y - gap * 1.7},
    {x: anchor.x + gap * 1.7, y: anchor.y},
    {x: anchor.x, y: anchor.y + gap * 1.7},
    {x: anchor.x - gap * 1.7, y: anchor.y},
  ];

  return candidates
    .map((candidate) => {
      const rect = labelRect({...candidate, ...size});
      const obstaclePenalty = obstacles.reduce((sum, obstacle) => sum + rectOverlapPenalty(rect, obstacle), 0);
      const labelPenalty = existingLabels.reduce((sum, label) => (
        sum + rectOverlapPenalty(rect, labelRect(label)) * 4
      ), 0);
      const distancePenalty = Math.hypot(candidate.x - anchor.x, candidate.y - anchor.y) * 0.08;
      return {candidate, penalty: obstaclePenalty + labelPenalty + distancePenalty};
    })
    .sort((a, b) => a.penalty - b.penalty)[0].candidate;
};

const createVoltageLabel = (
  id: string,
  value: number,
  anchor: XYPoint,
  scale: number,
  existingLabels: OverlayLabel[],
  obstacles: Array<{left: number; right: number; top: number; bottom: number}>,
): OverlayLabel => {
  const valueLines = [formatVoltage(value)];
  const size = estimateLabelSize(valueLines, scale);
  const position = chooseVoltageLabelPosition(anchor, size, existingLabels, obstacles);

  return {
    id,
    kind: "voltage",
    valueLines,
    x: position.x,
    y: position.y,
    anchorX: anchor.x,
    anchorY: anchor.y,
    width: size.width,
    height: size.height,
  };
};

const isLedNode = (node: Node<ComponentDataType>) => node.data.group === "led";

const ledPairedGndHandleId = (handleId: string) => {
  const match = /^(\d+V)_(start|end|middle_\d+)$/.exec(handleId);
  return match ? `GND_${match[2]}` : undefined;
};

const createVoltageDeltaOverlay = (
  id: string,
  supplyAnchor: XYPoint,
  gndAnchor: XYPoint,
  deltaV: number,
  scale: number,
  existingLabels: OverlayLabel[],
  obstacles: Array<{left: number; right: number; top: number; bottom: number}>,
) => {
  const dx = gndAnchor.x - supplyAnchor.x;
  const dy = gndAnchor.y - supplyAnchor.y;
  const length = Math.hypot(dx, dy) || 1;
  const direction = {x: dx / length, y: dy / length};
  const normal = {x: -direction.y, y: direction.x};
  const preferredNormal = Math.abs(direction.x) >= Math.abs(direction.y)
    ? (normal.y < 0 ? normal : {x: -normal.x, y: -normal.y})
    : (normal.x < 0 ? normal : {x: -normal.x, y: -normal.y});
  const arrowStart = {
    x: supplyAnchor.x + preferredNormal.x * VOLTAGE_DELTA_ARROW_OFFSET_PX,
    y: supplyAnchor.y + preferredNormal.y * VOLTAGE_DELTA_ARROW_OFFSET_PX,
  };
  const arrowEnd = {
    x: gndAnchor.x + preferredNormal.x * VOLTAGE_DELTA_ARROW_OFFSET_PX,
    y: gndAnchor.y + preferredNormal.y * VOLTAGE_DELTA_ARROW_OFFSET_PX,
  };
  const arrowCenter = {
    x: (arrowStart.x + arrowEnd.x) / 2,
    y: (arrowStart.y + arrowEnd.y) / 2,
  };
  const valueLines = [formatDeltaVoltage(deltaV)];
  const size = estimateLabelSize(valueLines, scale);
  const labelPosition = chooseLabelPosition(
    arrowCenter,
    direction,
    preferredNormal,
    size,
    existingLabels,
    obstacles,
    VOLTAGE_DELTA_LABEL_GAP_PX,
  );

  return {
    arrow: {
      id: `voltage-delta-arrow:${id}`,
      kind: "voltageDelta" as const,
      startX: arrowStart.x,
      startY: arrowStart.y,
      endX: arrowEnd.x,
      endY: arrowEnd.y,
      bidirectional: false,
    },
    label: {
      id: `voltage-delta:${id}`,
      kind: "voltageDelta" as const,
      valueLines,
      x: labelPosition.x,
      y: labelPosition.y,
      anchorX: arrowCenter.x,
      anchorY: arrowCenter.y,
      width: size.width,
      height: size.height,
    },
  };
};

const roundedCurrentIsZero = (value: number) => Math.abs(value) < 0.005;

const createWireCurrentOverlay = (
  id: string,
  point: SegmentPoint,
  currentA: number,
  wireWidth: number,
  viewport: {x: number; y: number; zoom: number},
  scale: number,
  existingLabels: OverlayLabel[],
  obstacles: Array<{left: number; right: number; top: number; bottom: number}>,
  blockingRects: Array<{left: number; right: number; top: number; bottom: number}>,
  preferredNormal?: XYPoint,
  labelGapPx = WIRE_LABEL_GAP,
) => {
  const bidirectional = roundedCurrentIsZero(currentA);
  const currentDirection = currentA >= 0
    ? point.direction
    : {x: -point.direction.x, y: -point.direction.y};
  const normal = preferredNormal ?? {x: -currentDirection.y, y: currentDirection.x};
  const arrowOffsetPx = Math.max(
    WIRE_ARROW_MIN_GAP_PX + WIRE_ARROW_STROKE_WIDTH / 2,
    ((wireWidth * viewport.zoom) / 2) + WIRE_ARROW_MIN_GAP_PX + WIRE_ARROW_STROKE_WIDTH / 2,
  );
  const arrowPoint = chooseArrowPoint(
    point,
    currentDirection,
    normal,
    arrowOffsetPx,
    viewport,
    blockingRects,
  );
  const arrowPointScreen = screenPoint(arrowPoint.point, viewport);
  const arrowCenterScreen = {
    x: arrowPointScreen.x + normal.x * arrowOffsetPx,
    y: arrowPointScreen.y + normal.y * arrowOffsetPx,
  };
  const arrowStart = {
    x: arrowCenterScreen.x - currentDirection.x * WIRE_ARROW_LENGTH_PX / 2,
    y: arrowCenterScreen.y - currentDirection.y * WIRE_ARROW_LENGTH_PX / 2,
  };
  const arrowEnd = {
    x: arrowCenterScreen.x + currentDirection.x * WIRE_ARROW_LENGTH_PX / 2,
    y: arrowCenterScreen.y + currentDirection.y * WIRE_ARROW_LENGTH_PX / 2,
  };
  const valueLines = [formatCurrent(currentA)];
  const size = estimateLabelSize(valueLines, scale);
  const labelPosition = chooseLabelPosition(
    arrowCenterScreen,
    currentDirection,
    normal,
    size,
    existingLabels,
    obstacles,
    labelGapPx,
  );

  return {
    arrow: {
      id: `wire-arrow:${id}`,
      kind: "current" as const,
      startX: arrowStart.x,
      startY: arrowStart.y,
      endX: arrowEnd.x,
      endY: arrowEnd.y,
      bidirectional,
    },
    label: {
      id: `wire-current:${id}`,
      kind: "wireCurrent" as const,
      valueLines,
      x: labelPosition.x,
      y: labelPosition.y,
      anchorX: arrowCenterScreen.x,
      anchorY: arrowCenterScreen.y,
      width: size.width,
      height: size.height,
    },
  };
};

const labelsOverlap = (a: OverlayLabel, b: OverlayLabel) => (
  Math.abs(a.x - b.x) < (a.width + b.width) / 2 + OVERLAP_PADDING &&
  Math.abs(a.y - b.y) < (a.height + b.height) / 2 + OVERLAP_PADDING
);

const resolveLabelOverlaps = (labels: OverlayLabel[]) => {
  const resolved = labels.map((label) => ({...label}));

  for(let iteration = 0; iteration < 18; iteration += 1) {
    let changed = false;

    for(let aIndex = 0; aIndex < resolved.length; aIndex += 1) {
      for(let bIndex = aIndex + 1; bIndex < resolved.length; bIndex += 1) {
        const a = resolved[aIndex];
        const b = resolved[bIndex];
        if(!labelsOverlap(a, b)) continue;

        const dx = b.x - a.x || 1;
        const dy = b.y - a.y || 1;
        const distance = Math.hypot(dx, dy) || 1;
        const overlapX = (a.width + b.width) / 2 + OVERLAP_PADDING - Math.abs(dx);
        const overlapY = (a.height + b.height) / 2 + OVERLAP_PADDING - Math.abs(dy);
        const push = Math.min(Math.max(overlapX, overlapY), 14) / 2;
        const pushX = (dx / distance) * push;
        const pushY = (dy / distance) * push;

        a.x -= pushX;
        a.y -= pushY;
        b.x += pushX;
        b.y += pushY;
        changed = true;
      }
    }

    if(!changed) break;
  }

  return resolved;
};

const leaderLineNeeded = (label: OverlayLabel) => (
  label.kind === "voltage" ||
  label.kind === "voltageDelta" ||
  label.kind === "wireCurrent" ||
  label.kind === "wireHover" ||
  Math.hypot(label.x - label.anchorX, label.y - label.anchorY) > LEADER_LINE_THRESHOLD
);

export const SimulationOverlay = () => {
  const simulationResult = useSimulationResultStore((state) => state.result);
  const wireHover = useSimulationResultStore((state) => state.wireHover);
  const nodes = useNodes<Node<ComponentDataType>>();
  const edges = useEdges<Edge<EdgeDataType>>();
  const viewport = useViewport();

  const selectedWireActive = edges.some((edge) => edge.selected);

  const overlayData = useMemo(() => {
    if(!simulationResult || selectedWireActive) return {labels: [], arrows: []};

    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const wireResultByEdgeId = new Map(simulationResult.wireResults.map((wire) => [wire.edgeId, wire]));
    const scale = overlayScale(viewport.zoom);
    const labels: OverlayLabel[] = [];
    const arrows: OverlayArrow[] = [];
    const obstacles = [
      ...handleObstacleRects(nodes, viewport),
      ...nodeObstacleRects(nodes, viewport),
      ...wireObstacleRects(edges, nodeById, viewport),
    ];
    const pinResultByNodeHandle = new Map(
      simulationResult.pinResults.map((pinResult) => [`${pinResult.nodeId}:${pinResult.handleId}`, pinResult]),
    );

    edges.forEach((edge) => {
      const wireResult = wireResultByEdgeId.get(edge.id);
      if(!wireResult || wireResult.currentA === undefined) return;

      const normalPoint = longestSegmentMidpoint(wirePoints(nodeById, edge));
      if(!normalPoint) return;

      const overlay = createWireCurrentOverlay(
        edge.id,
        normalPoint,
        wireResult.currentA,
        edge.data?.width ?? 1,
        viewport,
        scale,
        labels,
        obstacles,
        wireArrowBlockingRects(edges, nodeById, viewport, edge.id),
      );
      arrows.push(overlay.arrow);
      labels.push(overlay.label);
    });

    simulationResult.pinResults
      .filter(pinResultHasVoltage)
      .forEach((pinResult) => {
        const node = nodeById.get(pinResult.nodeId);
        const endpoint = getRenderedWireEndpoint(node, pinResult.handleId);
        if(!node || !endpoint || pinResult.voltageV === undefined) return;

        const connected = pinHasConnectedWire(edges, pinResult.nodeId, pinResult.handleId);
        if(!connected) return;

        const anchor = screenPoint(endpoint, viewport);
        const label = createVoltageLabel(
          `pin:${pinResult.pinId}`,
          pinResult.voltageV,
          anchor,
          scale,
          labels,
          obstacles,
        );
        labels.push(label);
      });

    nodes
      .filter(isLedNode)
      .forEach((node) => {
        simulationResult.pinResults
          .filter((pinResult) => (
            pinResult.nodeId === node.id &&
            pinResult.voltageV !== undefined &&
            isLedSupplyVoltagePin(node, pinResult.handleId)
          ))
          .forEach((supplyResult) => {
            const gndHandleId = ledPairedGndHandleId(supplyResult.handleId);
            if(!gndHandleId || supplyResult.voltageV === undefined) return;

            const gndResult = pinResultByNodeHandle.get(`${node.id}:${gndHandleId}`);
            if(gndResult?.voltageV === undefined) return;

            const supplyEndpoint = getRenderedWireEndpoint(node, supplyResult.handleId);
            const gndEndpoint = getRenderedWireEndpoint(node, gndHandleId);
            if(!supplyEndpoint || !gndEndpoint) return;

            const overlay = createVoltageDeltaOverlay(
              `${node.id}:${supplyResult.handleId}:${gndHandleId}`,
              screenPoint(supplyEndpoint, viewport),
              screenPoint(gndEndpoint, viewport),
              supplyResult.voltageV - gndResult.voltageV,
              scale,
              labels,
              obstacles,
            );
            arrows.push(overlay.arrow);
            labels.push(overlay.label);
          });
      });

    if(wireHover) {
      const hoverWireResult = wireResultByEdgeId.get(wireHover.edgeId);
      if(hoverWireResult?.currentA !== undefined) {
        const edge = edges.find((candidate) => candidate.id === wireHover.edgeId);
        const points = edge ? wirePoints(nodeById, edge) : [];
        const normalPoint = longestSegmentMidpoint(points);
        const hoverPoint = closestPointOnPolyline(points, wireHover);
        if(hoverPoint) {
          const normalScreenPoint = normalPoint ? screenPoint(normalPoint.point, viewport) : undefined;
          const hoverScreenPoint = screenPoint(hoverPoint.point, viewport);
          const overlapsNormalDisplay = normalScreenPoint
            ? Math.hypot(
              hoverScreenPoint.x - normalScreenPoint.x,
              hoverScreenPoint.y - normalScreenPoint.y,
            ) < HOVER_NORMAL_DISPLAY_DISTANCE * scale
            : false;

          if(!overlapsNormalDisplay) {
            const hoverDirection = hoverWireResult.currentA >= 0
              ? hoverPoint.direction
              : {x: -hoverPoint.direction.x, y: -hoverPoint.direction.y};
            const hoverNormal = hoverPreferredNormal(hoverDirection);
            const hoverLabelGap = Math.abs(hoverDirection.x) >= Math.abs(hoverDirection.y)
              ? WIRE_LABEL_GAP + HOVER_HORIZONTAL_LABEL_EXTRA_GAP_PX
              : WIRE_LABEL_GAP;
            const overlay = createWireCurrentOverlay(
              `hover:${wireHover.edgeId}`,
              hoverPoint,
              hoverWireResult.currentA,
              edge?.data?.width ?? 1,
              viewport,
              scale,
              labels,
              obstacles,
              wireArrowBlockingRects(edges, nodeById, viewport, wireHover.edgeId),
              hoverNormal,
              hoverLabelGap,
            );
            arrows.push(overlay.arrow);
            labels.push({...overlay.label, id: `wire-hover:${wireHover.edgeId}`, kind: "wireHover"});
          }
        }
      }
    }

    return {
      labels: resolveLabelOverlaps(labels),
      arrows,
    };
  }, [edges, nodes, selectedWireActive, simulationResult, viewport, wireHover]);

  if(!simulationResult || selectedWireActive || (overlayData.labels.length === 0 && overlayData.arrows.length === 0)) {
    return null;
  }

  const scale = overlayScale(viewport.zoom);
  const leaderLines = overlayData.labels.filter(leaderLineNeeded);

  return (
    <div
      style={{
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        position: "absolute",
        zIndex: 8,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          inset: 0,
          position: "absolute",
        }}
      >
        <defs>
          <marker
            id="simulation-current-arrowhead"
            markerHeight="6"
            markerUnits="userSpaceOnUse"
            markerWidth="8"
            orient="auto-start-reverse"
            refX="5"
            refY="3"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill="#1677ff" />
          </marker>
          <marker
            id="simulation-leader-arrowhead"
            markerHeight="5"
            markerWidth="7"
            orient="auto"
            refX="6"
            refY="2.5"
          >
            <path d="M0,0 L7,2.5 L0,5 Z" fill="rgba(38, 38, 38, 0.56)" />
          </marker>
          <marker
            id="simulation-voltage-arrowhead"
            markerHeight="6"
            markerUnits="userSpaceOnUse"
            markerWidth="8"
            orient="auto"
            refX="5"
            refY="3"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill="#fa8c16" />
          </marker>
        </defs>
        {overlayData.arrows.map((arrow) => (
          <line
            key={arrow.id}
            x1={arrow.startX}
            y1={arrow.startY}
            x2={arrow.endX}
            y2={arrow.endY}
            stroke={arrow.kind === "voltageDelta" ? "#fa8c16" : "#1677ff"}
            strokeLinecap="round"
            strokeWidth={2}
            markerStart={arrow.kind === "current" && arrow.bidirectional ? "url(#simulation-current-arrowhead)" : undefined}
            markerEnd={arrow.kind === "voltageDelta" ? "url(#simulation-voltage-arrowhead)" : "url(#simulation-current-arrowhead)"}
          />
        ))}
        {leaderLines.map((label) => (
          <line
            key={`leader:${label.id}`}
            x1={label.x}
            y1={label.y}
            x2={label.anchorX}
            y2={label.anchorY}
            stroke={label.kind === "voltage" || label.kind === "voltageDelta"
              ? "rgba(250, 140, 22, 0.58)"
              : "rgba(38, 38, 38, 0.46)"}
            strokeDasharray="3 3"
            strokeWidth={1}
            markerEnd={label.kind === "voltage" || label.kind === "voltageDelta"
              ? "url(#simulation-voltage-arrowhead)"
              : "url(#simulation-leader-arrowhead)"}
          />
        ))}
      </svg>
      {overlayData.labels.map((label) => (
        <div
          key={label.id}
          style={{
            background: label.kind === "voltage"
              ? "rgba(255, 255, 255, 0.92)"
              : label.kind === "voltageDelta"
                ? "rgba(255, 247, 230, 0.94)"
              : "rgba(230, 244, 255, 0.94)",
            border: label.kind === "voltage"
              ? "1px solid rgba(250, 173, 20, 0.56)"
              : label.kind === "voltageDelta"
                ? "1px solid rgba(250, 140, 22, 0.62)"
              : "1px solid rgba(22, 119, 255, 0.48)",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.16)",
            color: "#1f1f1f",
            fontSize: 10,
            fontVariantNumeric: "tabular-nums",
            left: label.x,
            lineHeight: 1.2,
            maxWidth: 72,
            padding: "2px 4px",
            position: "absolute",
            textAlign: "center",
            top: label.y,
            transform: `translate(-50%, -50%) scale(${scale})`,
            whiteSpace: "nowrap",
          }}
        >
          {label.valueLines.map((value) => (
            <div key={value}>{value}</div>
          ))}
        </div>
      ))}
    </div>
  );
};
