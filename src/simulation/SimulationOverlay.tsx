import { useMemo } from "react";

import { useEdges, useNodes, useViewport, type Edge, type Node } from "@xyflow/react";

import type { ComponentDataType, DirectionType, EdgeDataType, XYPoint } from "../types";
import { findHandleData, getRenderedWireEndpoint, rotatePrefferedLineDirection } from "../utils/utils_functions";
import { useSimulationResultStore } from "./simulationResultStore";
import type { SimulationPinResult } from "./simulationTypes";

const formatVoltage = (value: number) => `${value.toFixed(2)} V`;
const formatCurrent = (value: number) => `${Math.abs(value).toFixed(2)} A`;

const pinResultHasVisibleValue = (result: SimulationPinResult) => (
  result.voltageV !== undefined || result.currentA !== undefined
);

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

const labelOffsetForDirection = (direction: DirectionType, zoom: number) => {
  const distance = 14 * Math.min(1, Math.max(0.55, zoom));

  if(direction === "right") return {x: distance, y: 0, translateX: 0, translateY: -50};
  if(direction === "up") return {x: 0, y: -distance, translateX: -50, translateY: -100};
  if(direction === "down") return {x: 0, y: distance, translateX: -50, translateY: 0};
  return {x: -distance, y: 0, translateX: -100, translateY: -50};
};

const componentEdgeDirection = (node: Node<ComponentDataType>, endpoint: XYPoint): DirectionType => {
  const width = node.measured?.width ?? node.width ?? node.data.image?.width ?? 0;
  const height = node.measured?.height ?? node.height ?? node.data.image?.height ?? 0;
  const center = {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  };

  return directionFromVector(center, endpoint);
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

    const edgePoints = edge.data?.edgePoints ?? [];
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    const sourceEndpoint = getRenderedWireEndpoint(sourceNode, edge.sourceHandle) ?? edge.data?.startXY;
    const targetEndpoint = getRenderedWireEndpoint(targetNode, edge.targetHandle) ?? edge.data?.endXY;
    const nextPoint = isSourcePin
      ? edgePoints[0] ?? targetEndpoint
      : edgePoints[edgePoints.length - 1] ?? sourceEndpoint;

    if(!nextPoint) return [];
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

const labelOffsetForHandle = (
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

export const SimulationOverlay = () => {
  const simulationResult = useSimulationResultStore((state) => state.result);
  const nodes = useNodes<Node<ComponentDataType>>();
  const edges = useEdges<Edge<EdgeDataType>>();
  const viewport = useViewport();

  const labels = useMemo(() => {
    if(!simulationResult) return [];

    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const scale = overlayScale(viewport.zoom);

    return simulationResult.pinResults
      .filter(pinResultHasVisibleValue)
      .flatMap((pinResult) => {
        const node = nodeById.get(pinResult.nodeId);
        const endpoint = getRenderedWireEndpoint(node, pinResult.handleId);
        if(!node || !endpoint) return [];

        const connected = pinHasConnectedWire(edges, pinResult.nodeId, pinResult.handleId);
        const showVoltage = pinResult.voltageV !== undefined && (
          connected || isLedSupplyVoltagePin(node, pinResult.handleId)
        );
        const showCurrent = pinResult.currentA !== undefined && connected;

        if(!showVoltage && !showCurrent) return [];

        const offset = labelOffsetForHandle(
          nodeById,
          edges,
          node,
          pinResult.handleId,
          endpoint,
          viewport.zoom,
        );
        const screenX = (endpoint.x * viewport.zoom) + viewport.x + (offset.x * viewport.zoom);
        const screenY = (endpoint.y * viewport.zoom) + viewport.y + (offset.y * viewport.zoom);
        const valueLines = [
          showVoltage && pinResult.voltageV !== undefined ? formatVoltage(pinResult.voltageV) : undefined,
          showCurrent && pinResult.currentA !== undefined ? formatCurrent(pinResult.currentA) : undefined,
        ].filter((value): value is string => value !== undefined);

        return [{
          id: pinResult.pinId,
          valueLines,
          screenX,
          screenY,
          transform: `translate(${offset.translateX}%, ${offset.translateY}%) scale(${scale})`,
        }];
      });
  }, [edges, nodes, simulationResult, viewport.x, viewport.y, viewport.zoom]);

  if(!simulationResult || labels.length === 0) return null;

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
      {labels.map((label) => (
        <div
          key={label.id}
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            border: "1px solid rgba(22, 119, 255, 0.42)",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.16)",
            color: "#1f1f1f",
            fontSize: 10,
            fontVariantNumeric: "tabular-nums",
            left: label.screenX,
            lineHeight: 1.2,
            maxWidth: 72,
            padding: "2px 4px",
            position: "absolute",
            textAlign: "center",
            top: label.screenY,
            transform: label.transform,
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
