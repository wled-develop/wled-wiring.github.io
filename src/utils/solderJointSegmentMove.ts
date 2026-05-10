import type { Edge, Node } from '@xyflow/react';

import type { ComponentDataType, EdgeDataType, XYPoint, edgePoint } from '../types';
import { simplifyWirePath } from './wireMerge';
import { moveWireSegment, type SegmentOrientation } from './wireSegmentMove';

const EPSILON = 0.001;
const GLIDE_LIMIT_PADDING = 1;

type Direction = 'up' | 'down' | 'left' | 'right';
type JointEndpoint = 'start' | 'end';

export type ApplySolderJointSegmentMoveParams = {
  nodes: Node[];
  edges: Edge[];
  movedEdgeId: string;
  movedPoints: XYPoint[];
  segmentIndex: number;
  orientation: SegmentOrientation;
  axisValue: number;
  pinStubLength?: number;
};

export type ApplySolderJointSegmentMoveResult = {
  handled: boolean;
  nodes: Node[];
  edges: Edge[];
};

const isSolderJointNode = (node: Node | undefined) => (
  (node?.data as ComponentDataType | undefined)?.technicalID === 'SolderJoint'
);

const getEdgeData = (edge: Edge | undefined) => edge?.data as EdgeDataType | undefined;

const pointFromEdgePoint = (point: edgePoint): XYPoint => ({x: point.x, y: point.y});

const edgePointFromPoint = (point: XYPoint): edgePoint => ({...point, active: -1});

const sameNumber = (a: number, b: number) => Math.abs(a - b) <= EPSILON;

const samePoint = (a: XYPoint, b: XYPoint) => sameNumber(a.x, b.x) && sameNumber(a.y, b.y);

const getEdgePoints = (edge: Edge): XYPoint[] | undefined => {
  const edgeData = getEdgeData(edge);
  if(!edgeData?.startXY || !edgeData?.endXY) return undefined;

  return [
    {...edgeData.startXY},
    ...(edgeData.edgePoints ?? []).map(pointFromEdgePoint),
    {...edgeData.endXY},
  ];
};

const getDirection = (from: XYPoint, to: XYPoint): Direction | undefined => {
  if(samePoint(from, to)) return undefined;
  if(sameNumber(from.x, to.x)) return to.y > from.y ? 'down' : 'up';
  if(sameNumber(from.y, to.y)) return to.x > from.x ? 'right' : 'left';
  return undefined;
};

const oppositeDirection = (direction: Direction): Direction => {
  switch(direction) {
    case 'up': return 'down';
    case 'down': return 'up';
    case 'left': return 'right';
    case 'right': return 'left';
  }
};

const dragDirectionForMove = (
  oldJoint: XYPoint,
  newJoint: XYPoint,
): Direction | undefined => getDirection(oldJoint, newJoint);

const isDirectionOnAxis = (direction: Direction, orientation: SegmentOrientation) => (
  orientation === 'horizontal'
    ? direction === 'up' || direction === 'down'
    : direction === 'left' || direction === 'right'
);

const clampJointToGlideSegment = (
  requestedJoint: XYPoint,
  glideNeighbor: XYPoint,
  direction: Direction,
) => {
  if(direction === 'down') {
    return {
      ...requestedJoint,
      y: Math.min(requestedJoint.y, glideNeighbor.y - GLIDE_LIMIT_PADDING),
    };
  }
  if(direction === 'up') {
    return {
      ...requestedJoint,
      y: Math.max(requestedJoint.y, glideNeighbor.y + GLIDE_LIMIT_PADDING),
    };
  }
  if(direction === 'right') {
    return {
      ...requestedJoint,
      x: Math.min(requestedJoint.x, glideNeighbor.x - GLIDE_LIMIT_PADDING),
    };
  }

  return {
    ...requestedJoint,
    x: Math.max(requestedJoint.x, glideNeighbor.x + GLIDE_LIMIT_PADDING),
  };
};

const buildMovedEdgePoints = (
  points: XYPoint[],
  movedEdge: Edge,
  nodes: Node[],
  endpoint: JointEndpoint,
  axisValue: number,
  newJoint: XYPoint,
  segmentIndex: number,
  pinStubLength?: number,
) => {
  const sourceNode = nodes.find((node) => node.id === movedEdge.source);
  const targetNode = nodes.find((node) => node.id === movedEdge.target);
  const result = moveWireSegment({
    points,
    segmentIndex,
    axisValue,
    pinStubLength,
    preserveStartPinStub: !isSolderJointNode(sourceNode),
    preserveEndPinStub: !isSolderJointNode(targetNode),
  });
  if(!result) return undefined;

  const nextPoints = result.points.map((point) => ({...point}));

  if(endpoint === 'start') {
    nextPoints[0] = {...newJoint};
  } else {
    nextPoints[nextPoints.length - 1] = {...newJoint};
  }

  return simplifyWirePath(nextPoints);
};

const updateEdgePolyline = (edge: Edge, points: XYPoint[]) => ({
  ...edge,
  data: {
    ...(edge.data as EdgeDataType),
    startXY: points[0],
    endXY: points[points.length - 1],
    edgePoints: points.slice(1, -1).map(edgePointFromPoint),
  } as EdgeDataType,
});

type ConnectedWireInfo = {
  edge: Edge;
  points: XYPoint[];
  jointEndpoint: JointEndpoint;
  direction: Direction;
  neighbor: XYPoint;
};

const getConnectedWireInfo = (edge: Edge, jointNodeId: string): ConnectedWireInfo | undefined => {
  const points = getEdgePoints(edge);
  if(!points || points.length < 2) return undefined;

  if(edge.source === jointNodeId) {
    const direction = getDirection(points[0], points[1]);
    if(!direction) return undefined;

    return {
      edge,
      points,
      jointEndpoint: 'start',
      direction,
      neighbor: points[1],
    };
  }

  if(edge.target === jointNodeId) {
    const direction = getDirection(points[points.length - 1], points[points.length - 2]);
    if(!direction) return undefined;

    return {
      edge,
      points,
      jointEndpoint: 'end',
      direction,
      neighbor: points[points.length - 2],
    };
  }

  return undefined;
};

const buildAdjustedOtherWirePoints = (
  wire: ConnectedWireInfo,
  oldJoint: XYPoint,
  newJoint: XYPoint,
  dragDirection: Direction,
) => {
  const isTransverse = (
    wire.direction !== dragDirection &&
    wire.direction !== oppositeDirection(dragDirection)
  );

  if(wire.jointEndpoint === 'start') {
    return simplifyWirePath(isTransverse
      ? [newJoint, oldJoint, ...wire.points.slice(1).map((point) => ({...point}))]
      : [newJoint, ...wire.points.slice(1).map((point) => ({...point}))]);
  }

  return simplifyWirePath(isTransverse
    ? [...wire.points.slice(0, -1).map((point) => ({...point})), oldJoint, newJoint]
    : [...wire.points.slice(0, -1).map((point) => ({...point})), newJoint]);
};

const tryApplyForEndpoint = (
  params: ApplySolderJointSegmentMoveParams,
  endpoint: JointEndpoint,
): ApplySolderJointSegmentMoveResult | undefined => {
  const {nodes, edges, movedEdgeId, movedPoints, segmentIndex, orientation, axisValue, pinStubLength} = params;
  const movedEdge = edges.find((edge) => edge.id === movedEdgeId);
  if(!movedEdge) return undefined;

  const jointNodeId = endpoint === 'start' ? movedEdge.source : movedEdge.target;
  const jointNode = nodes.find((node) => node.id === jointNodeId);
  if(!isSolderJointNode(jointNode)) return undefined;

  const oldJoint = endpoint === 'start'
    ? movedPoints[0]
    : movedPoints[movedPoints.length - 1];
  const requestedJoint = orientation === 'horizontal'
    ? {x: oldJoint.x, y: axisValue}
    : {x: axisValue, y: oldJoint.y};

  const otherConnectedWires = edges.filter((edge) => (
    edge.id !== movedEdgeId &&
    edge.type === 'editable-wire-type' &&
    (edge.source === jointNodeId || edge.target === jointNodeId)
  ));
  if(otherConnectedWires.length !== 2) return undefined;

  const connectedInfos = otherConnectedWires
    .map((edge) => getConnectedWireInfo(edge, jointNodeId));
  if(connectedInfos.some((info) => !info)) return undefined;

  const otherWireInfos = connectedInfos as ConnectedWireInfo[];
  if(samePoint(oldJoint, requestedJoint)) {
    return {
      handled: true,
      nodes,
      edges,
    };
  }

  const dragDirection = dragDirectionForMove(oldJoint, requestedJoint);
  if(!dragDirection || !isDirectionOnAxis(dragDirection, orientation)) return undefined;

  const glideWire = otherWireInfos.find((wire) => wire.direction === dragDirection);
  if(!glideWire) return undefined;

  const newJoint = clampJointToGlideSegment(
    requestedJoint,
    glideWire.neighbor,
    dragDirection,
  );
  if(samePoint(oldJoint, newJoint)) return undefined;

  const delta = {
    x: newJoint.x - oldJoint.x,
    y: newJoint.y - oldJoint.y,
  };
  const movedEdgePoints = buildMovedEdgePoints(
    movedPoints,
    movedEdge,
    nodes,
    endpoint,
    orientation === 'horizontal' ? newJoint.y : newJoint.x,
    newJoint,
    segmentIndex,
    pinStubLength,
  );
  if(!movedEdgePoints) return undefined;
  const otherWirePointsById = new Map(
    otherWireInfos.map((wire) => [
      wire.edge.id,
      buildAdjustedOtherWirePoints(wire, oldJoint, newJoint, dragDirection),
    ]),
  );

  return {
    handled: true,
    nodes: nodes.map((node) => (
      node.id === jointNodeId
        ? {
          ...node,
          position: {
            x: node.position.x + delta.x,
            y: node.position.y + delta.y,
          },
        }
        : node
    )),
    edges: edges.map((edge) => {
      if(edge.id === movedEdgeId) return updateEdgePolyline(edge, movedEdgePoints);

      const otherWirePoints = otherWirePointsById.get(edge.id);
      if(otherWirePoints) return updateEdgePolyline(edge, otherWirePoints);

      return {...edge};
    }),
  };
};

export const applySolderJointSegmentMove = (
  params: ApplySolderJointSegmentMoveParams,
): ApplySolderJointSegmentMoveResult => {
  const {movedPoints, segmentIndex} = params;
  const segmentTouchesStart = segmentIndex === 0;
  const segmentTouchesEnd = segmentIndex === movedPoints.length - 2;

  if(segmentTouchesStart) {
    const startResult = tryApplyForEndpoint(params, 'start');
    if(startResult) return startResult;
  }

  if(segmentTouchesEnd) {
    const endResult = tryApplyForEndpoint(params, 'end');
    if(endResult) return endResult;
  }

  return {
    handled: false,
    nodes: params.nodes,
    edges: params.edges,
  };
};
