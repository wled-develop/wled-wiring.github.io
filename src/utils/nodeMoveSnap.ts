import type { Edge, Node } from '@xyflow/react';

import type { ComponentDataType, EdgeDataType, XYPoint, edgePoint } from '../types';
import type { OrthogonalWireDragSnapshot } from './orthogonalWireRouting';

const DEFAULT_COMPONENT_SNAP_DISTANCE_PX = 4;
const DEFAULT_COMPONENT_MIN_SEGMENT_LENGTH_PX = 5;
const DEFAULT_SOLDER_JOINT_SNAP_DISTANCE_PX = 4;
const DEFAULT_SOLDER_JOINT_MIN_SEGMENT_LENGTH_PX = 5;

type Axis = 'x' | 'y';

export type SnapMovedNodePositionsParams = {
  snapshot: OrthogonalWireDragSnapshot;
  currentNodes: Node[];
  draggedNodeIds: string[];
  zoom: number;
};

export type SnapMovedNodePositionsResult = {
  nodes: Node[];
  snapped: boolean;
};

type AxisCandidate = {
  axis: Axis;
  target: number;
  reason: 'near-axis' | 'minimum-connected-segment-length' | 'minimum-second-segment-length';
};

const isEditableWire = (edge: Edge) => edge.type === 'editable-wire-type';

const getEdgeData = (edge: Edge) => edge.data as EdgeDataType | undefined;

const pointFromEdgePoint = (point: edgePoint): XYPoint => ({x: point.x, y: point.y});

const isSolderJoint = (node: Node) => (
  (node.data as ComponentDataType | undefined)?.technicalID === 'SolderJoint'
);

const sameNumber = (a: number, b: number) => Math.abs(a - b) <= 0.001;

const getSnapshotNodePosition = (
  snapshot: OrthogonalWireDragSnapshot,
  nodeId: string,
) => snapshot.nodes.find((node) => node.id === nodeId)?.position;

const getEdgePolyline = (edge: Edge): XYPoint[] | undefined => {
  const edgeData = getEdgeData(edge);
  if(!edgeData?.startXY || !edgeData?.endXY) return undefined;

  return [
    {...edgeData.startXY},
    ...(edgeData.edgePoints ?? []).map(pointFromEdgePoint),
    {...edgeData.endXY},
  ];
};

const connectedEndpointInfo = (edge: Edge, nodeId: string) => {
  const points = getEdgePolyline(edge);
  if(!points || points.length < 2) return undefined;

  if(edge.source === nodeId) {
    return {
      endpoint: points[0],
      neighbor: points[1],
      secondNeighbor: points.length >= 4 ? points[2] : undefined,
    };
  }

  if(edge.target === nodeId) {
    return {
      endpoint: points[points.length - 1],
      neighbor: points[points.length - 2],
      secondNeighbor: points.length >= 4 ? points[points.length - 3] : undefined,
    };
  }

  return undefined;
};

const addCandidate = (
  candidates: AxisCandidate[],
  axis: Axis,
  target: number,
  reason: AxisCandidate['reason'],
) => {
  if(!Number.isFinite(target)) return;
  candidates.push({axis, target, reason});
};

const addSecondSegmentCollapseCandidates = (
  candidates: AxisCandidate[],
  info: NonNullable<ReturnType<typeof connectedEndpointInfo>>,
  currentPosition: XYPoint,
  movedEndpoint: XYPoint,
) => {
  if(!info.secondNeighbor) return;

  if(
    sameNumber(info.endpoint.x, info.neighbor.x) &&
    sameNumber(info.neighbor.y, info.secondNeighbor.y)
  ) {
    addCandidate(
      candidates,
      'x',
      currentPosition.x + info.secondNeighbor.x - movedEndpoint.x,
      'minimum-second-segment-length',
    );
  }

  if(
    sameNumber(info.endpoint.y, info.neighbor.y) &&
    sameNumber(info.neighbor.x, info.secondNeighbor.x)
  ) {
    addCandidate(
      candidates,
      'y',
      currentPosition.y + info.secondNeighbor.y - movedEndpoint.y,
      'minimum-second-segment-length',
    );
  }
};

const getComponentCandidates = (
  edge: Edge,
  nodeId: string,
  currentPosition: XYPoint,
  delta: XYPoint,
): AxisCandidate[] => {
  const info = connectedEndpointInfo(edge, nodeId);
  if(!info) return [];

  const movedEndpoint = {
    x: info.endpoint.x + delta.x,
    y: info.endpoint.y + delta.y,
  };
  const candidates: AxisCandidate[] = [];

  if(sameNumber(info.endpoint.x, info.neighbor.x)) {
    addCandidate(
      candidates,
      'x',
      currentPosition.x + info.neighbor.x - movedEndpoint.x,
      'near-axis',
    );
    addCandidate(
      candidates,
      'y',
      currentPosition.y + info.neighbor.y - movedEndpoint.y,
      'minimum-connected-segment-length',
    );
  }
  if(sameNumber(info.endpoint.y, info.neighbor.y)) {
    addCandidate(
      candidates,
      'y',
      currentPosition.y + info.neighbor.y - movedEndpoint.y,
      'near-axis',
    );
    addCandidate(
      candidates,
      'x',
      currentPosition.x + info.neighbor.x - movedEndpoint.x,
      'minimum-connected-segment-length',
    );
  }
  addSecondSegmentCollapseCandidates(candidates, info, currentPosition, movedEndpoint);

  return candidates;
};

const getSolderJointCandidates = (
  edge: Edge,
  nodeId: string,
  currentPosition: XYPoint,
  delta: XYPoint,
): AxisCandidate[] => {
  const info = connectedEndpointInfo(edge, nodeId);
  if(!info) return [];

  const movedEndpoint = {
    x: info.endpoint.x + delta.x,
    y: info.endpoint.y + delta.y,
  };
  const candidates: AxisCandidate[] = [];

  if(sameNumber(info.endpoint.x, info.neighbor.x)) {
    addCandidate(
      candidates,
      'x',
      currentPosition.x + info.neighbor.x - movedEndpoint.x,
      'near-axis',
    );
    addCandidate(
      candidates,
      'y',
      currentPosition.y + info.neighbor.y - movedEndpoint.y,
      'minimum-connected-segment-length',
    );
  }
  if(sameNumber(info.endpoint.y, info.neighbor.y)) {
    addCandidate(
      candidates,
      'y',
      currentPosition.y + info.neighbor.y - movedEndpoint.y,
      'near-axis',
    );
    addCandidate(
      candidates,
      'x',
      currentPosition.x + info.neighbor.x - movedEndpoint.x,
      'minimum-connected-segment-length',
    );
  }
  addSecondSegmentCollapseCandidates(candidates, info, currentPosition, movedEndpoint);

  return candidates;
};

const pickAxisValue = (
  currentValue: number,
  candidates: AxisCandidate[],
  snapDistance: number,
  minSegmentLength: number,
) => {
  let best: AxisCandidate | undefined;
  let bestDistance = Infinity;

  candidates.forEach((candidate) => {
    const distance = Math.abs(currentValue - candidate.target);
    const threshold = candidate.reason === 'near-axis'
      ? snapDistance
      : minSegmentLength;

    if(distance <= threshold && distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  });

  return best?.target;
};

export const snapMovedNodePositions = ({
  snapshot,
  currentNodes,
  draggedNodeIds,
  zoom,
}: SnapMovedNodePositionsParams): SnapMovedNodePositionsResult => {
  if(zoom <= 0 || draggedNodeIds.length !== 1) {
    return {nodes: currentNodes, snapped: false};
  }

  const draggedNodeId = draggedNodeIds[0];
  const draggedNode = currentNodes.find((node) => node.id === draggedNodeId);
  const snapshotPosition = getSnapshotNodePosition(snapshot, draggedNodeId);
  if(!draggedNode || !snapshotPosition) return {nodes: currentNodes, snapped: false};

  const delta = {
    x: draggedNode.position.x - snapshotPosition.x,
    y: draggedNode.position.y - snapshotPosition.y,
  };
  const solderJoint = isSolderJoint(draggedNode);
  const snapDistance = (
    solderJoint ? DEFAULT_SOLDER_JOINT_SNAP_DISTANCE_PX : DEFAULT_COMPONENT_SNAP_DISTANCE_PX
  ) / zoom;
  const minSegmentLength = (
    solderJoint ? DEFAULT_SOLDER_JOINT_MIN_SEGMENT_LENGTH_PX : DEFAULT_COMPONENT_MIN_SEGMENT_LENGTH_PX
  ) / zoom;
  const connectedEdges = snapshot.edges.filter((edge) => (
    isEditableWire(edge) &&
    (edge.source === draggedNodeId || edge.target === draggedNodeId)
  ));
  const candidates = connectedEdges.flatMap((edge) => (
    solderJoint
      ? getSolderJointCandidates(edge, draggedNodeId, draggedNode.position, delta)
      : getComponentCandidates(edge, draggedNodeId, draggedNode.position, delta)
  ));
  const nextX = pickAxisValue(draggedNode.position.x, candidates.filter((candidate) => candidate.axis === 'x'), snapDistance, minSegmentLength);
  const nextY = pickAxisValue(draggedNode.position.y, candidates.filter((candidate) => candidate.axis === 'y'), snapDistance, minSegmentLength);

  if(nextX === undefined && nextY === undefined) {
    return {nodes: currentNodes, snapped: false};
  }

  return {
    snapped: true,
    nodes: currentNodes.map((node) => (
      node.id === draggedNodeId
        ? {
          ...node,
          position: {
            x: nextX ?? node.position.x,
            y: nextY ?? node.position.y,
          },
        }
        : node
    )),
  };
};
