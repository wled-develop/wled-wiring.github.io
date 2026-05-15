import { useMemo } from "react";

import { useReactFlow, useViewport, type Node } from "@xyflow/react";

import type { ComponentDataType } from "../types";
import { findHandleData, getRenderedWireEndpoint, rotatePostypeToLineDirection } from "../utils/utils_functions";
import { useSimulationResultStore } from "./simulationResultStore";
import type { SimulationPinResult } from "./simulationTypes";

const formatVoltage = (value: number) => `${value.toFixed(2)} V`;
const formatCurrent = (value: number) => `${Math.abs(value).toFixed(2)} A`;

const pinResultHasVisibleValue = (result: SimulationPinResult) => (
  result.voltageV !== undefined || result.currentA !== undefined
);

const labelOffsetForHandle = (node: Node<ComponentDataType>, handleId: string) => {
  const handle = findHandleData(node, handleId);
  const rotation = node.data.rotatable ? node.data.rotation : 0;
  const direction = rotatePostypeToLineDirection(handle?.postype, rotation);
  const distance = 14;

  if(direction === "right") return {x: distance, y: 0, translateX: 0, translateY: -50};
  if(direction === "up") return {x: 0, y: -distance, translateX: -50, translateY: -100};
  if(direction === "down") return {x: 0, y: distance, translateX: -50, translateY: 0};
  return {x: -distance, y: 0, translateX: -100, translateY: -50};
};

export const SimulationOverlay = () => {
  const simulationResult = useSimulationResultStore((state) => state.result);
  const reactFlow = useReactFlow<Node<ComponentDataType>>();
  const viewport = useViewport();

  const labels = useMemo(() => {
    if(!simulationResult) return [];

    return simulationResult.pinResults
      .filter(pinResultHasVisibleValue)
      .flatMap((pinResult) => {
        const node = reactFlow.getNode(pinResult.nodeId);
        const endpoint = getRenderedWireEndpoint(node, pinResult.handleId);
        if(!node || !endpoint) return [];

        const offset = labelOffsetForHandle(node, pinResult.handleId);
        const screenX = (endpoint.x * viewport.zoom) + viewport.x + (offset.x * viewport.zoom);
        const screenY = (endpoint.y * viewport.zoom) + viewport.y + (offset.y * viewport.zoom);
        const valueLines = [
          pinResult.voltageV !== undefined ? formatVoltage(pinResult.voltageV) : undefined,
          pinResult.currentA !== undefined ? formatCurrent(pinResult.currentA) : undefined,
        ].filter((value): value is string => value !== undefined);

        return [{
          id: pinResult.pinId,
          valueLines,
          screenX,
          screenY,
          transform: `translate(${offset.translateX}%, ${offset.translateY}%)`,
        }];
      });
  }, [reactFlow, simulationResult, viewport.x, viewport.y, viewport.zoom]);

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
