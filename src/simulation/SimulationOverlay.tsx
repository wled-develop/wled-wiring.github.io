import { useMemo } from "react";

import { useEdges, useNodes, useViewport, type Edge, type Node } from "@xyflow/react";

import type { ComponentDataType, DirectionType, EdgeDataType, XYPoint } from "../types";
import { findHandleData, getRenderedWireEndpoint, rotatePrefferedLineDirection } from "../utils/utils_functions";
import { useSimulationResultStore } from "./simulationResultStore";
import type { SimulationPinResult } from "./simulationTypes";

type OverlayLabel = {
  id: string;
  kind: "voltage" | "wireCurrent" | "wireHover";
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
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type PolylineMidpoint = {
  point: XYPoint;
  direction: XYPoint;
};

const LABEL_GAP = 14;
const LABEL_PADDING_X = 8;
const LABEL_HEIGHT = 20;
const LEADER_LINE_THRESHOLD = 28;
const OVERLAP_PADDING = 4;
const WIRE_ARROW_LENGTH = 28;
const WIRE_ARROW_OFFSET = 12;

const formatVoltage = (value: number) => `${value.toFixed(2)} V`;
const formatCurrent = (value: number) => `${Math.abs(value).toFixed(2)} A`;

const pinResultHasVoltage = (result: SimulationPinResult) => result.voltageV !== undefined;

const directionFromVector = (from: XYPoint, to: XYPoint): DirectionType => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if(Math.abs(dx) < 1 && Math.abs(dy) < 1) return undefined;
  if(Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "right" : "left";
  return dy >= 0 ? "down" : "up";
};

const oppositeDirection = (direction: DirectionType): DirectionType => {
  if(direction === "right") return "left";
  if(direction === "left") return "right";
  if(direction === "up") return "down";
  if(direction === "down") return "up";
  return undefined;
};

const screenPoint = (point: XYPoint, viewport: {x: number; y: number; zoom: number}) => ({
  x: (point.x * viewport.zoom) + viewport.x,
  y: (point.y * viewport.zoom) + viewport.y,
});

const componentEdgeDirection = (node: Node<ComponentDataType>, endpoint: XYPoint): DirectionType => {
  const width = node.measured?.width ?? node.width ?? node.data.image?.width ?? 0;
  const height = node.measured?.height ?? node.height ?? node.data.image?.height ?? 0;
  const center = {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  };

  return directionFromVector(center, endpoint);
};

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

const wireDirectionAtPin = (
  nodeById: Map<string, Node<ComponentDataType>>,
  edges: Edge<EdgeDataType>[],
  nodeId: string,
  handleId: string,
  endpoint: XYPoint,
): DirectionType => {
  const vectors = edges.flatMap((edge) => {
    const isSourcePin = edge.source === nodeId && edge.sourceHandle === handleId;
    const isTargetPin = edge.target === nodeId && edge.targetHandle === handleId;
    if(!isSourcePin && !isTargetPin) return [];

    const points = wirePoints(nodeById, edge);
    if(points.length < 2) return [];

    const nextPoint = isSourcePin ? points[1] : points[points.length - 2];
    const dx = nextPoint.x - endpoint.x;
    const dy = nextPoint.y - endpoint.y;
    if(Math.abs(dx) < 1 && Math.abs(dy) < 1) return [];

    const length = Math.hypot(dx, dy);
    return [{x: dx / length, y: dy / length}];
  });

  if(vectors.length === 0) return undefined;

  const average = vectors.reduce((sum, vector) => ({
    x: sum.x + vector.x,
    y: sum.y + vector.y,
  }), {x: 0, y: 0});

  return directionFromVector({x: 0, y: 0}, average);
};

const labelOffsetForDirection = (direction: DirectionType, zoom: number) => {
  const distance = LABEL_GAP * Math.min(1, Math.max(0.55, zoom));

  if(direction === "right") return {x: distance, y: 0};
  if(direction === "up") return {x: 0, y: -distance};
  if(direction === "down") return {x: 0, y: distance};
  return {x: -distance, y: 0};
};

const labelOffsetForPin = (
  nodeById: Map<string, Node<ComponentDataType>>,
  edges: Edge<EdgeDataType>[],
  node: Node<ComponentDataType>,
  handleId: string,
  endpoint: XYPoint,
  zoom: number,
) => {
  const handle = findHandleData(node, handleId);
  const rotation = node.data.rotatable ? node.data.rotation : 0;
  const wireDirection = wireDirectionAtPin(nodeById, edges, node.id, handleId, endpoint);
  const preferredDirection = rotatePrefferedLineDirection(handle?.prefferedLineDirection, rotation);
  const fallbackDirection = componentEdgeDirection(node, endpoint);

  return labelOffsetForDirection(
    oppositeDirection(wireDirection ?? preferredDirection ?? fallbackDirection) ?? "left",
    zoom,
  );
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

const polylineMidpoint = (points: XYPoint[]): PolylineMidpoint | undefined => {
  if(points.length < 2) return undefined;

  const segments = points.slice(0, -1).map((from, index) => {
    const to = points[index + 1];
    return {
      from,
      to,
      length: Math.hypot(to.x - from.x, to.y - from.y),
    };
  }).filter((segment) => segment.length > 0);

  const totalLength = segments.reduce((sum, segment) => sum + segment.length, 0);
  if(totalLength <= 0) return undefined;

  let walked = 0;
  const target = totalLength / 2;
  const segment = segments.find((candidate) => {
    const contains = walked + candidate.length >= target;
    if(!contains) walked += candidate.length;
    return contains;
  }) ?? segments[segments.length - 1];
  const ratio = Math.min(1, Math.max(0, (target - walked) / segment.length));
  const direction = {
    x: (segment.to.x - segment.from.x) / segment.length,
    y: (segment.to.y - segment.from.y) / segment.length,
  };

  return {
    point: {
      x: segment.from.x + (segment.to.x - segment.from.x) * ratio,
      y: segment.from.y + (segment.to.y - segment.from.y) * ratio,
    },
    direction,
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

    simulationResult.pinResults
      .filter(pinResultHasVoltage)
      .forEach((pinResult) => {
        const node = nodeById.get(pinResult.nodeId);
        const endpoint = getRenderedWireEndpoint(node, pinResult.handleId);
        if(!node || !endpoint || pinResult.voltageV === undefined) return;

        const connected = pinHasConnectedWire(edges, pinResult.nodeId, pinResult.handleId);
        if(!connected && !isLedSupplyVoltagePin(node, pinResult.handleId)) return;

        const offset = labelOffsetForPin(
          nodeById,
          edges,
          node,
          pinResult.handleId,
          endpoint,
          viewport.zoom,
        );
        const anchor = screenPoint(endpoint, viewport);
        const valueLines = [formatVoltage(pinResult.voltageV)];
        const size = estimateLabelSize(valueLines, scale);

        labels.push({
          id: `pin:${pinResult.pinId}`,
          kind: "voltage",
          valueLines,
          x: anchor.x + offset.x * viewport.zoom,
          y: anchor.y + offset.y * viewport.zoom,
          anchorX: anchor.x,
          anchorY: anchor.y,
          width: size.width,
          height: size.height,
        });
      });

    edges.forEach((edge) => {
      const wireResult = wireResultByEdgeId.get(edge.id);
      if(!wireResult || wireResult.currentA === undefined) return;

      const midpoint = polylineMidpoint(wirePoints(nodeById, edge));
      if(!midpoint) return;

      const currentDirection = wireResult.currentA >= 0
        ? midpoint.direction
        : {x: -midpoint.direction.x, y: -midpoint.direction.y};
      const normal = {x: -currentDirection.y, y: currentDirection.x};
      const arrowCenter = {
        x: midpoint.point.x + normal.x * WIRE_ARROW_OFFSET,
        y: midpoint.point.y + normal.y * WIRE_ARROW_OFFSET,
      };
      const arrowStart = {
        x: arrowCenter.x - currentDirection.x * WIRE_ARROW_LENGTH / 2,
        y: arrowCenter.y - currentDirection.y * WIRE_ARROW_LENGTH / 2,
      };
      const arrowEnd = {
        x: arrowCenter.x + currentDirection.x * WIRE_ARROW_LENGTH / 2,
        y: arrowCenter.y + currentDirection.y * WIRE_ARROW_LENGTH / 2,
      };
      const arrowStartScreen = screenPoint(arrowStart, viewport);
      const arrowEndScreen = screenPoint(arrowEnd, viewport);
      const arrowCenterScreen = screenPoint(arrowCenter, viewport);
      const labelAnchor = {
        x: arrowCenter.x + normal.x * 18,
        y: arrowCenter.y + normal.y * 18,
      };
      const labelAnchorScreen = screenPoint(labelAnchor, viewport);
      const valueLines = [formatCurrent(wireResult.currentA)];
      const size = estimateLabelSize(valueLines, scale);

      arrows.push({
        id: `wire-arrow:${edge.id}`,
        startX: arrowStartScreen.x,
        startY: arrowStartScreen.y,
        endX: arrowEndScreen.x,
        endY: arrowEndScreen.y,
      });
      labels.push({
        id: `wire-current:${edge.id}`,
        kind: "wireCurrent",
        valueLines,
        x: labelAnchorScreen.x,
        y: labelAnchorScreen.y,
        anchorX: arrowCenterScreen.x,
        anchorY: arrowCenterScreen.y,
        width: size.width,
        height: size.height,
      });
    });

    if(wireHover) {
      const hoverWireResult = wireResultByEdgeId.get(wireHover.edgeId);
      if(hoverWireResult?.currentA !== undefined) {
        const hover = screenPoint(wireHover, viewport);
        const valueLines = [formatCurrent(hoverWireResult.currentA)];
        const size = estimateLabelSize(valueLines, scale);
        labels.push({
          id: `wire-hover:${wireHover.edgeId}`,
          kind: "wireHover",
          valueLines,
          x: hover.x,
          y: hover.y - 18 * scale,
          anchorX: hover.x,
          anchorY: hover.y,
          width: size.width,
          height: size.height,
        });
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
            markerWidth="8"
            orient="auto"
            refX="7"
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
        </defs>
        {overlayData.arrows.map((arrow) => (
          <line
            key={arrow.id}
            x1={arrow.startX}
            y1={arrow.startY}
            x2={arrow.endX}
            y2={arrow.endY}
            stroke="#1677ff"
            strokeLinecap="round"
            strokeWidth={2}
            markerEnd="url(#simulation-current-arrowhead)"
          />
        ))}
        {leaderLines.map((label) => (
          <line
            key={`leader:${label.id}`}
            x1={label.x}
            y1={label.y}
            x2={label.anchorX}
            y2={label.anchorY}
            stroke="rgba(38, 38, 38, 0.46)"
            strokeDasharray="3 3"
            strokeWidth={1}
            markerEnd="url(#simulation-leader-arrowhead)"
          />
        ))}
      </svg>
      {overlayData.labels.map((label) => (
        <div
          key={label.id}
          style={{
            background: label.kind === "voltage"
              ? "rgba(255, 255, 255, 0.92)"
              : "rgba(230, 244, 255, 0.94)",
            border: label.kind === "voltage"
              ? "1px solid rgba(250, 173, 20, 0.56)"
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
