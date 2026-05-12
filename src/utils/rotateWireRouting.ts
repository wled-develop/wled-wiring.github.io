import type { Edge, Node } from '@xyflow/react';

import type { ComponentDataType, DirectionType, EdgeDataType, XYPoint, edgePoint } from '../types';
import {
  buildPath,
  createMatrix,
  getPathResult,
} from './pathfinder_functions';
import {
  getHandleMiddleRealPosition,
  postypeToAdjustedXYConn,
  rotatePrefferedLineDirection,
} from './utils_functions';

export const ROTATE_WIRE_PIN_STUB_ENABLED = true;
export const ROTATE_WIRE_SHIFT_BENDS_ENABLED = false;
export const ROTATE_WIRE_PATHFINDER_ENABLED = true;

const ROTATE_WIRE_PIN_STUB_LENGTH = 12;
const EPSILON = 0.001;
const PATHFINDER_ENDPOINT_ANCHOR_TOLERANCE = 32;

type RotateComponentWiresParams = {
  nodes: Node[];
  edges: Edge[];
  nodeId: string;
  oldRotation: number;
  newRotation: number;
  pathFindingEnabled: boolean;
};

type RerouteWireItem = {
  edge: Edge;
  originalIndex: number;
  sourcePoint: XYPoint;
  targetPoint: XYPoint;
  distance: number;
  pairKey: string;
};

type RerouteWireGroup = {
  pairKey: string;
  items: RerouteWireItem[];
  originalIndex: number;
  minDistance: number;
  averageDistance: number;
};

const pointFromEdgePoint = (point: edgePoint): XYPoint => ({x: point.x, y: point.y});

const edgePointFromPoint = (point: XYPoint): edgePoint => ({
  x: point.x,
  y: point.y,
  active: -1,
});

const sameNumber = (a: number, b: number) => Math.abs(a - b) <= EPSILON;

const isHorizontalOrVertical = (a: XYPoint, b: XYPoint) => (
  sameNumber(a.x, b.x) || sameNumber(a.y, b.y)
);

const isFinitePoint = (point: XYPoint | undefined): point is XYPoint => (
  Boolean(point) &&
  Number.isFinite(point?.x) &&
  Number.isFinite(point?.y)
);

const isCollinear = (a: XYPoint, b: XYPoint, c: XYPoint) => (
  Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) <= EPSILON
);

const removeRedundantPoints = (points: XYPoint[]) => {
  const withoutDuplicates = points.filter((point, index) => (
    index === 0 || !sameNumber(point.x, points[index - 1].x) || !sameNumber(point.y, points[index - 1].y)
  ));
  const compacted = [...withoutDuplicates];

  let changed = true;
  while(changed) {
    changed = false;
    for(let index = 1; index < compacted.length - 1; index += 1) {
      if(isCollinear(compacted[index - 1], compacted[index], compacted[index + 1])) {
        compacted.splice(index, 1);
        changed = true;
        break;
      }
    }
  }

  return compacted;
};

const getNodeData = (node: Node | undefined) => node?.data as ComponentDataType | undefined;

const getHandle = (node: Node | undefined, handleId?: string | null) => {
  const nodeData = getNodeData(node);
  if(!nodeData || !handleId) return undefined;

  return nodeData.handles.find((handle) => handle.hid === handleId)
    ?? nodeData.repeatedHandleArray?.find((handle) => handle.hid === handleId);
};

const getHandleConnectionPoint = (node: Node, handleId?: string | null): XYPoint | undefined => {
  const nodeData = node.data as ComponentDataType;
  const handle = getHandle(node, handleId);
  if(!handle) return undefined;

  const handleMiddle = getHandleMiddleRealPosition(node, handleId || '');
  const handleX = handleMiddle.x + node.position.x + nodeData.borderWidth;
  const handleY = handleMiddle.y + node.position.y + nodeData.borderWidth;
  const [x, y] = postypeToAdjustedXYConn(
    handle.postype || 'left',
    handleX,
    handleY,
    handle.width || 0,
    handle.height || 0,
    nodeData.rotation || 0,
  );

  return {x, y};
};

const getEdgePoints = (edgeData: EdgeDataType) => (
  [
    edgeData.startXY,
    ...(edgeData.edgePoints ?? []).map(pointFromEdgePoint),
    edgeData.endXY,
  ].filter((point): point is XYPoint => Boolean(point))
);

const directionFromSegment = (from: XYPoint, to: XYPoint): DirectionType => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if(Math.abs(dx) >= Math.abs(dy)) {
    if(sameNumber(dx, 0)) return undefined;
    return dx > 0 ? 'right' : 'left';
  }

  if(sameNumber(dy, 0)) return undefined;
  return dy > 0 ? 'down' : 'up';
};

const rotateDirectionByDelta = (direction: DirectionType, deltaDegrees: number): DirectionType => {
  if(!direction) return undefined;

  const directions: Exclude<DirectionType, undefined>[] = ['right', 'down', 'left', 'up'];
  const index = directions.indexOf(direction);
  const steps = ((((Math.round(deltaDegrees / 90) % 4) + 4) % 4));
  return directions[(index + steps) % directions.length];
};

const pointFromDirection = (start: XYPoint, direction: DirectionType, length: number): XYPoint | undefined => {
  if(direction === 'right') return {x: start.x + length, y: start.y};
  if(direction === 'left') return {x: start.x - length, y: start.y};
  if(direction === 'down') return {x: start.x, y: start.y + length};
  if(direction === 'up') return {x: start.x, y: start.y - length};
  return undefined;
};

const directionIsHorizontal = (direction: DirectionType) => direction === 'left' || direction === 'right';

const addStub = (
  points: XYPoint[],
  atStart: boolean,
  direction: DirectionType,
) => {
  const endpoint = atStart ? points[0] : points[points.length - 1];
  const stubPoint = pointFromDirection(endpoint, direction, ROTATE_WIRE_PIN_STUB_LENGTH);
  if(!stubPoint) return points;

  return atStart
    ? [endpoint, stubPoint, ...points.slice(1)]
    : [...points.slice(0, -1), stubPoint, endpoint];
};

const shiftBendAfterStub = (points: XYPoint[], atStart: boolean, direction: DirectionType) => {
  if(points.length < 3 || !direction) return points;

  const nextPoints = points.map((point) => ({...point}));
  const stubPointIndex = atStart ? 1 : nextPoints.length - 2;
  const bendIndex = atStart ? 2 : nextPoints.length - 3;
  const stubPoint = nextPoints[stubPointIndex];
  const bendPoint = nextPoints[bendIndex];
  if(!stubPoint || !bendPoint || isHorizontalOrVertical(stubPoint, bendPoint)) return nextPoints;

  const bendIsOppositeStub = atStart
    ? bendIndex >= nextPoints.length - 2
    : bendIndex <= 1;
  if(bendIsOppositeStub) {
    const insertedPoint = directionIsHorizontal(direction)
      ? {x: stubPoint.x, y: bendPoint.y}
      : {x: bendPoint.x, y: stubPoint.y};

    if(atStart) {
      nextPoints.splice(stubPointIndex + 1, 0, insertedPoint);
    } else {
      nextPoints.splice(stubPointIndex, 0, insertedPoint);
    }
    return nextPoints;
  }

  if(directionIsHorizontal(direction)) {
    nextPoints[bendIndex] = {...bendPoint, x: stubPoint.x};
  } else {
    nextPoints[bendIndex] = {...bendPoint, y: stubPoint.y};
  }

  return nextPoints;
};

const nodeIsSolderJoint = (node: Node | undefined) => (
  getNodeData(node)?.technicalID === 'SolderJoint'
);

const distanceBetweenPoints = (a: XYPoint, b: XYPoint) => (
  Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
);

const getRenderedEndpointAnchor = (
  renderedPoint: XYPoint | undefined,
  pathfinderPoint: XYPoint,
) => (
  isFinitePoint(renderedPoint) &&
  distanceBetweenPoints(renderedPoint, pathfinderPoint) <= PATHFINDER_ENDPOINT_ANCHOR_TOLERANCE
    ? renderedPoint
    : pathfinderPoint
);

const segmentAxis = (from: XYPoint, to: XYPoint): 'horizontal' | 'vertical' => {
  if(sameNumber(from.x, to.x)) return 'vertical';
  if(sameNumber(from.y, to.y)) return 'horizontal';

  return Math.abs(to.x - from.x) >= Math.abs(to.y - from.y)
    ? 'horizontal'
    : 'vertical';
};

const forcePointOntoEndpointAxis = (
  point: XYPoint,
  endpoint: XYPoint,
  axis: 'horizontal' | 'vertical',
) => (
  axis === 'vertical'
    ? {...point, x: endpoint.x}
    : {...point, y: endpoint.y}
);

const makeRoutePathOrthogonal = (points: XYPoint[]) => {
  const orthogonalPoints: XYPoint[] = [];

  points.forEach((point, index) => {
    if(index === 0) {
      orthogonalPoints.push(point);
      return;
    }

    const previous = orthogonalPoints[orthogonalPoints.length - 1];
    if(!previous || isHorizontalOrVertical(previous, point)) {
      orthogonalPoints.push(point);
      return;
    }

    const next = points[index + 1];
    const viaX = {x: point.x, y: previous.y};
    const viaY = {x: previous.x, y: point.y};
    const via = next && isHorizontalOrVertical(viaY, next) ? viaY : viaX;

    orthogonalPoints.push(via, point);
  });

  return removeRedundantPoints(orthogonalPoints);
};

const bindPathfinderPathToRenderedEndpoints = (
  points: XYPoint[],
  renderedStart: XYPoint | undefined,
  renderedEnd: XYPoint | undefined,
) => {
  if(points.length < 2) return points;

  const nextPoints = points.map((point) => ({...point}));
  const startAnchor = getRenderedEndpointAnchor(renderedStart, nextPoints[0]);
  const endAnchor = getRenderedEndpointAnchor(renderedEnd, nextPoints[nextPoints.length - 1]);
  if(nextPoints.length === 2) {
    return makeRoutePathOrthogonal([startAnchor, endAnchor]);
  }

  const startAxis = segmentAxis(nextPoints[0], nextPoints[1]);
  const endAxis = segmentAxis(nextPoints[nextPoints.length - 2], nextPoints[nextPoints.length - 1]);

  nextPoints[0] = startAnchor;
  nextPoints[1] = forcePointOntoEndpointAxis(nextPoints[1], startAnchor, startAxis);
  nextPoints[nextPoints.length - 1] = endAnchor;
  nextPoints[nextPoints.length - 2] = forcePointOntoEndpointAxis(
    nextPoints[nextPoints.length - 2],
    endAnchor,
    endAxis,
  );

  return makeRoutePathOrthogonal(nextPoints);
};

const componentPairKey = (edge: Edge) => (
  [edge.source, edge.target].sort().join('::')
);

const handleSortValue = (item: RerouteWireItem, nodeId: string, axis: 'x' | 'y') => {
  const point = item.edge.source === nodeId ? item.sourcePoint : item.targetPoint;
  return point[axis];
};

const groupSortAxis = (items: RerouteWireItem[], nodeId: string): 'x' | 'y' => {
  const valuesX = items.map((item) => handleSortValue(item, nodeId, 'x'));
  const valuesY = items.map((item) => handleSortValue(item, nodeId, 'y'));
  const spreadX = Math.max(...valuesX) - Math.min(...valuesX);
  const spreadY = Math.max(...valuesY) - Math.min(...valuesY);
  return spreadX >= spreadY ? 'x' : 'y';
};

const sortGroupItems = (group: RerouteWireGroup) => {
  const [firstNodeId, secondNodeId] = group.pairKey.split('::');
  const firstAxis = groupSortAxis(group.items, firstNodeId);
  const secondAxis = groupSortAxis(group.items, secondNodeId);

  return [...group.items].sort((a, b) => (
    handleSortValue(a, firstNodeId, firstAxis) - handleSortValue(b, firstNodeId, firstAxis) ||
    handleSortValue(a, secondNodeId, secondAxis) - handleSortValue(b, secondNodeId, secondAxis) ||
    a.distance - b.distance ||
    a.originalIndex - b.originalIndex
  ));
};

const getRerouteWireItems = (nodes: Node[], edges: Edge[]) => (
  edges.flatMap((edge, originalIndex): RerouteWireItem[] => {
    const edgeData = edge.data as EdgeDataType | undefined;
    if(edge.type !== 'editable-wire-type' || !edgeData || !edge.sourceHandle || !edge.targetHandle) return [];

    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);
    if(!sourceNode || !targetNode) return [];

    const sourcePoint = getHandleConnectionPoint(sourceNode, edge.sourceHandle);
    const targetPoint = getHandleConnectionPoint(targetNode, edge.targetHandle);
    if(!sourcePoint || !targetPoint) return [];

    return [{
      edge,
      originalIndex,
      sourcePoint,
      targetPoint,
      distance: distanceBetweenPoints(sourcePoint, targetPoint),
      pairKey: componentPairKey(edge),
    }];
  })
);

const getSortedRerouteWireItems = (nodes: Node[], edges: Edge[]) => {
  const items = getRerouteWireItems(nodes, edges);
  const groupByPairKey = new Map<string, RerouteWireItem[]>();

  items.forEach((item) => {
    groupByPairKey.set(item.pairKey, [...(groupByPairKey.get(item.pairKey) ?? []), item]);
  });

  const groups = Array.from(groupByPairKey.entries()).map(([pairKey, groupItems]): RerouteWireGroup => ({
    pairKey,
    items: groupItems,
    originalIndex: Math.min(...groupItems.map((item) => item.originalIndex)),
    minDistance: Math.min(...groupItems.map((item) => item.distance)),
    averageDistance: groupItems.reduce((sum, item) => sum + item.distance, 0) / groupItems.length,
  }));

  return groups
    .sort((a, b) => (
      a.minDistance - b.minDistance ||
      a.averageDistance - b.averageDistance ||
      a.originalIndex - b.originalIndex
    ))
    .flatMap(sortGroupItems);
};

export const routeWireWithPathfinder = (
  nodes: Node[],
  edges: Edge[],
  edge: Edge,
) => {
  const sourceNode = nodes.find((node) => node.id === edge.source);
  const targetNode = nodes.find((node) => node.id === edge.target);
  if(!sourceNode || !targetNode || !edge.sourceHandle || !edge.targetHandle) return undefined;

  const sourcePoint = getHandleConnectionPoint(sourceNode, edge.sourceHandle);
  const targetPoint = getHandleConnectionPoint(targetNode, edge.targetHandle);
  if(!sourcePoint || !targetPoint) return undefined;

  const sourceHandle = getHandle(sourceNode, edge.sourceHandle);
  const targetHandle = getHandle(targetNode, edge.targetHandle);
  const sourceDirection = rotatePrefferedLineDirection(
    sourceHandle?.prefferedLineDirection,
    (sourceNode.data as ComponentDataType).rotation,
  );
  const targetDirection = rotatePrefferedLineDirection(
    targetHandle?.prefferedLineDirection,
    (targetNode.data as ComponentDataType).rotation,
  );
  const {x_arr, y_arr, matrix, obstacleRects} = createMatrix(nodes);
  const pathResult = getPathResult(
    matrix,
    x_arr,
    y_arr,
    sourceNode,
    targetNode,
    sourcePoint.x,
    sourcePoint.y,
    targetPoint.x,
    targetPoint.y,
    sourceDirection,
    targetDirection,
  );
  const path = buildPath(
    edges,
    pathResult.result,
    matrix,
    x_arr,
    y_arr,
    sourcePoint.x,
    sourcePoint.y,
    targetPoint.x,
    targetPoint.y,
    pathResult.start_matrix_index_x,
    pathResult.start_matrix_index_y,
    {
      obstacleRects,
      sourceNodeId: sourceNode.id,
      targetNodeId: targetNode.id,
    },
  );
  const edgeData = edge.data as EdgeDataType | undefined;
  const anchoredPath = bindPathfinderPathToRenderedEndpoints(
    path,
    edgeData?.startXY,
    edgeData?.endXY,
  );
  if(anchoredPath.length < 2) return undefined;

  return {
    startXY: anchoredPath[0],
    endXY: anchoredPath[anchoredPath.length - 1],
    edgePoints: anchoredPath.slice(1, -1).map(edgePointFromPoint),
  };
};

export const rerouteAllWiresWithPathfinder = (
  nodes: Node[],
  edges: Edge[],
) => {
  const sortedItems = getSortedRerouteWireItems(nodes, edges);
  const updatedEdgeById = new Map<string, Edge>();
  let workingRoutingEdges: Edge[] = [];

  sortedItems.forEach(({edge}) => {
    const edgeData = edge.data as EdgeDataType | undefined;
    if(!edgeData) return;

    const route = routeWireWithPathfinder(nodes, workingRoutingEdges, edge);
    const updatedEdge = route
      ? {
        ...edge,
        data: {
          ...edgeData,
          ...route,
        },
      }
      : edge;

    updatedEdgeById.set(edge.id, updatedEdge);
    workingRoutingEdges = [...workingRoutingEdges, updatedEdge];
  });

  return edges.map((edge) => updatedEdgeById.get(edge.id) ?? edge);
};

const routeWithStubs = (
  nodes: Node[],
  edge: Edge,
  edgeData: EdgeDataType,
  rotatedNodeId: string,
  oldRotation: number,
  newRotation: number,
  shiftBends: boolean,
) => {
  const oldPoints = getEdgePoints(edgeData);
  if(oldPoints.length < 2) return undefined;

  const sourceNode = nodes.find((node) => node.id === edge.source);
  const targetNode = nodes.find((node) => node.id === edge.target);
  if(!sourceNode || !targetNode) return undefined;

  const sourcePoint = getHandleConnectionPoint(sourceNode, edge.sourceHandle);
  const targetPoint = getHandleConnectionPoint(targetNode, edge.targetHandle);
  if(!sourcePoint || !targetPoint) return undefined;

  const sourceRotated = edge.source === rotatedNodeId;
  const targetRotated = edge.target === rotatedNodeId;
  const rotationDelta = newRotation - oldRotation;
  const oldInnerPoints = (edgeData.edgePoints ?? []).map(pointFromEdgePoint);
  let points = [sourcePoint, ...oldInnerPoints, targetPoint];

  let sourceStubDirection: DirectionType;
  let targetStubDirection: DirectionType;

  if(sourceRotated && isHorizontalOrVertical(oldPoints[0], oldPoints[1])) {
    sourceStubDirection = rotateDirectionByDelta(directionFromSegment(oldPoints[0], oldPoints[1]), rotationDelta);
    points = addStub(points, true, sourceStubDirection);
  }

  if(targetRotated && isHorizontalOrVertical(oldPoints[oldPoints.length - 1], oldPoints[oldPoints.length - 2])) {
    targetStubDirection = rotateDirectionByDelta(
      directionFromSegment(oldPoints[oldPoints.length - 1], oldPoints[oldPoints.length - 2]),
      rotationDelta,
    );
    points = addStub(points, false, targetStubDirection);
  }

  if(oldInnerPoints.length === 0 && sourceRotated && !nodeIsSolderJoint(targetNode)) {
    targetStubDirection = directionFromSegment(oldPoints[oldPoints.length - 1], oldPoints[0]);
    points = addStub(points, false, targetStubDirection);
  }

  if(oldInnerPoints.length === 0 && targetRotated && !nodeIsSolderJoint(sourceNode)) {
    sourceStubDirection = directionFromSegment(oldPoints[0], oldPoints[oldPoints.length - 1]);
    points = addStub(points, true, sourceStubDirection);
  }

  if(shiftBends) {
    if(sourceStubDirection) {
      points = shiftBendAfterStub(points, true, sourceStubDirection);
    }
    if(targetStubDirection) {
      points = shiftBendAfterStub(points, false, targetStubDirection);
    }
  }

  const compactedPoints = removeRedundantPoints(points);
  return {
    startXY: compactedPoints[0],
    endXY: compactedPoints[compactedPoints.length - 1],
    edgePoints: compactedPoints.slice(1, -1).map(edgePointFromPoint),
  };
};

export const rotateComponentWires = ({
  nodes,
  edges,
  nodeId,
  oldRotation,
  newRotation,
  pathFindingEnabled,
}: RotateComponentWiresParams) => {
  const updatedNodes = nodes.map((node) => (
    node.id === nodeId
      ? {
        ...node,
        data: {
          ...(node.data as ComponentDataType),
          rotation: newRotation,
        },
      }
      : node
  ));
  const pathfinderActive = (
    ROTATE_WIRE_PIN_STUB_ENABLED &&
    ROTATE_WIRE_PATHFINDER_ENABLED &&
    pathFindingEnabled
  );
  const shiftBendsActive = (
    ROTATE_WIRE_PIN_STUB_ENABLED &&
    ROTATE_WIRE_SHIFT_BENDS_ENABLED &&
    pathFindingEnabled
  );

  if(pathfinderActive) {
    let workingEdges = [...edges];
    const affectedEdgeIds = edges
      .filter((edge) => {
        const edgeData = edge.data as EdgeDataType | undefined;
        return (
          edge.type === 'editable-wire-type' &&
          edgeData &&
          (edge.source === nodeId || edge.target === nodeId)
        );
      })
      .map((edge) => edge.id);

    affectedEdgeIds.forEach((edgeId) => {
      const currentEdge = workingEdges.find((edge) => edge.id === edgeId);
      const currentEdgeData = currentEdge?.data as EdgeDataType | undefined;
      if(!currentEdge || !currentEdgeData) return;

      const routingEdges = workingEdges.filter((edge) => edge.id !== edgeId);
      const route = routeWireWithPathfinder(updatedNodes, routingEdges, currentEdge)
        ?? (ROTATE_WIRE_PIN_STUB_ENABLED
          ? routeWithStubs(updatedNodes, currentEdge, currentEdgeData, nodeId, oldRotation, newRotation, shiftBendsActive)
          : undefined);
      if(!route) return;

      const updatedEdge = {
        ...currentEdge,
        data: {
          ...currentEdgeData,
          ...route,
        },
      };

      workingEdges = workingEdges.map((edge) => (
        edge.id === edgeId
          ? updatedEdge
          : edge
      ));
    });

    return workingEdges;
  }

  return edges.map((edge) => {
    const edgeData = edge.data as EdgeDataType | undefined;
    if(edge.type !== 'editable-wire-type' || !edgeData || (edge.source !== nodeId && edge.target !== nodeId)) {
      return edge;
    }

    const route = ROTATE_WIRE_PIN_STUB_ENABLED
      ? routeWithStubs(updatedNodes, edge, edgeData, nodeId, oldRotation, newRotation, shiftBendsActive)
      : undefined;

    if(!route) return edge;

    return {
      ...edge,
      data: {
        ...edgeData,
        ...route,
      },
    };
  });
};
