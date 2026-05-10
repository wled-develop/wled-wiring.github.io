import type { Edge, Node } from '@xyflow/react';

import type { EdgeDataType, XYPoint, edgePoint } from '../types';

type DragNodeSnapshot = {
  id: string;
  position: XYPoint;
};

export type OrthogonalWireDragSnapshot = {
  nodes: DragNodeSnapshot[];
  edges: Edge[];
};

type Delta = {
  dx: number;
  dy: number;
};

const EPSILON = 0.001;

const sameNumber = (a: number, b: number) => Math.abs(a - b) <= EPSILON;

const samePoint = (a: XYPoint, b: XYPoint) => sameNumber(a.x, b.x) && sameNumber(a.y, b.y);

const sameDelta = (a?: Delta, b?: Delta) => (
  Boolean(a && b) &&
  sameNumber(a?.dx || 0, b?.dx || 0) &&
  sameNumber(a?.dy || 0, b?.dy || 0)
);

const addDelta = (point: XYPoint, delta?: Delta): XYPoint => ({
  x: point.x + (delta?.dx || 0),
  y: point.y + (delta?.dy || 0),
});

const pointFromEdgePoint = (point: edgePoint): XYPoint => ({ x: point.x, y: point.y });

const edgePointFromPoint = (point: XYPoint): edgePoint => ({
  x: point.x,
  y: point.y,
  active: -1,
});

const isHorizontal = (a: XYPoint, b: XYPoint) => sameNumber(a.y, b.y);

const isVertical = (a: XYPoint, b: XYPoint) => sameNumber(a.x, b.x);

const isOrthogonalSegment = (a: XYPoint, b: XYPoint) => isHorizontal(a, b) || isVertical(a, b);

const isCollinear = (a: XYPoint, b: XYPoint, c: XYPoint) => (
  (sameNumber(a.x, b.x) && sameNumber(b.x, c.x)) ||
  (sameNumber(a.y, b.y) && sameNumber(b.y, c.y))
);

const cloneEdge = (edge: Edge): Edge => ({
  ...edge,
  data: edge.data ? {
    ...edge.data,
    edgePoints: [...(((edge.data as EdgeDataType).edgePoints || []) as edgePoint[])],
  } : edge.data,
});

const removeRedundantPoints = (points: XYPoint[]) => {
  const withoutDuplicates = points.filter((point, index) => (
    index === 0 || !samePoint(point, points[index - 1])
  ));

  let changed = true;
  const compacted = [...withoutDuplicates];

  while (changed) {
    changed = false;
    for (let index = 1; index < compacted.length - 1; index += 1) {
      if (isCollinear(compacted[index - 1], compacted[index], compacted[index + 1])) {
        compacted.splice(index, 1);
        changed = true;
        break;
      }
    }
  }

  return compacted;
};

const directPathWithPreferredShape = (
  start: XYPoint,
  end: XYPoint,
  preferredAxis: 'horizontal' | 'vertical',
) => {
  if (isOrthogonalSegment(start, end)) return [start, end];

  if (preferredAxis === 'vertical') {
    const midY = (start.y + end.y) / 2;
    return [
      start,
      { x: start.x, y: midY },
      { x: end.x, y: midY },
      end,
    ];
  }

  const midX = (start.x + end.x) / 2;
  return [
    start,
    { x: midX, y: start.y },
    { x: midX, y: end.y },
    end,
  ];
};

const makePathOrthogonal = (points: XYPoint[]) => {
  const orthogonalPoints: XYPoint[] = [];

  points.forEach((point, index) => {
    if (index === 0) {
      orthogonalPoints.push(point);
      return;
    }

    const previous = orthogonalPoints[orthogonalPoints.length - 1];
    if (!previous || isOrthogonalSegment(previous, point)) {
      orthogonalPoints.push(point);
      return;
    }

    const next = points[index + 1];
    const viaX = { x: point.x, y: previous.y };
    const viaY = { x: previous.x, y: point.y };
    const via = next && isOrthogonalSegment(viaY, next) ? viaY : viaX;

    orthogonalPoints.push(via, point);
  });

  return removeRedundantPoints(orthogonalPoints);
};

const firstSegmentAxis = (
  oldStart: XYPoint,
  oldPoints: XYPoint[],
  oldEnd: XYPoint,
) => {
  const firstPoint = oldPoints[0] || oldEnd;
  if (isVertical(oldStart, firstPoint)) return 'vertical';
  return 'horizontal';
};

const lastSegmentAxis = (
  oldStart: XYPoint,
  oldPoints: XYPoint[],
  oldEnd: XYPoint,
) => {
  const lastPoint = oldPoints[oldPoints.length - 1] || oldStart;
  if (isVertical(lastPoint, oldEnd)) return 'vertical';
  return 'horizontal';
};

const adjustSourceSide = (
  points: XYPoint[],
  oldStart: XYPoint,
  oldEnd: XYPoint,
  oldInnerPoints: XYPoint[],
  newStart: XYPoint,
) => {
  if (points.length <= 2) return points;

  const axis = firstSegmentAxis(oldStart, oldInnerPoints, oldEnd);
  if (axis === 'vertical') {
    points[1] = { ...points[1], x: newStart.x };
  } else {
    points[1] = { ...points[1], y: newStart.y };
  }

  return points;
};

const adjustTargetSide = (
  points: XYPoint[],
  oldStart: XYPoint,
  oldEnd: XYPoint,
  oldInnerPoints: XYPoint[],
  newEnd: XYPoint,
) => {
  if (points.length <= 2) return points;

  const lastIndex = points.length - 2;
  const axis = lastSegmentAxis(oldStart, oldInnerPoints, oldEnd);
  if (axis === 'vertical') {
    points[lastIndex] = { ...points[lastIndex], x: newEnd.x };
  } else {
    points[lastIndex] = { ...points[lastIndex], y: newEnd.y };
  }

  return points;
};

const routeMovedEdge = (
  edgeData: EdgeDataType,
  sourceDelta?: Delta,
  targetDelta?: Delta,
) => {
  if (!edgeData.startXY || !edgeData.endXY) return edgeData;

  const oldStart = pointFromEdgePoint(edgeData.startXY);
  const oldEnd = pointFromEdgePoint(edgeData.endXY);
  const oldInnerPoints = (edgeData.edgePoints || []).map(pointFromEdgePoint);
  const newStart = addDelta(oldStart, sourceDelta);
  const newEnd = addDelta(oldEnd, targetDelta);

  if (sourceDelta && targetDelta && sameDelta(sourceDelta, targetDelta)) {
    const movedPoints = oldInnerPoints.map((point) => addDelta(point, sourceDelta));
    return {
      ...edgeData,
      startXY: newStart,
      endXY: newEnd,
      edgePoints: removeRedundantPoints([newStart, ...movedPoints, newEnd])
        .slice(1, -1)
        .map(edgePointFromPoint),
    };
  }

  if (oldInnerPoints.length === 0) {
    return {
      ...edgeData,
      startXY: newStart,
      endXY: newEnd,
      edgePoints: directPathWithPreferredShape(
        newStart,
        newEnd,
        firstSegmentAxis(oldStart, oldInnerPoints, oldEnd),
      ).slice(1, -1).map(edgePointFromPoint),
    };
  }

  let routedPoints = [newStart, ...oldInnerPoints, newEnd];

  if (sourceDelta) {
    routedPoints = adjustSourceSide(routedPoints, oldStart, oldEnd, oldInnerPoints, newStart);
  }

  if (targetDelta) {
    routedPoints = adjustTargetSide(routedPoints, oldStart, oldEnd, oldInnerPoints, newEnd);
  }

  const normalizedPoints = makePathOrthogonal(routedPoints);

  return {
    ...edgeData,
    startXY: newStart,
    endXY: newEnd,
    edgePoints: normalizedPoints.slice(1, -1).map(edgePointFromPoint),
  };
};

export const createOrthogonalWireDragSnapshot = (
  nodes: Node[],
  edges: Edge[],
): OrthogonalWireDragSnapshot => ({
  nodes: nodes.map((node) => ({
    id: node.id,
    position: { ...node.position },
  })),
  edges: edges.map(cloneEdge),
});

export const adjustOrthogonalWiresForMovedNodes = (
  snapshot: OrthogonalWireDragSnapshot,
  currentNodes: Node[],
) => {
  const currentNodeById = new Map(currentNodes.map((node) => [node.id, node]));
  const nodeDeltaById = new Map<string, Delta>();

  snapshot.nodes.forEach((node) => {
    const currentNode = currentNodeById.get(node.id);
    if (!currentNode) return;

    const dx = currentNode.position.x - node.position.x;
    const dy = currentNode.position.y - node.position.y;

    if (!sameNumber(dx, 0) || !sameNumber(dy, 0)) {
      nodeDeltaById.set(node.id, { dx, dy });
    }
  });

  if (nodeDeltaById.size === 0) return snapshot.edges.map(cloneEdge);

  return snapshot.edges.map((edge) => {
    if (edge.type !== 'editable-wire-type' || !edge.data) return cloneEdge(edge);

    const sourceDelta = nodeDeltaById.get(edge.source);
    const targetDelta = nodeDeltaById.get(edge.target);
    if (!sourceDelta && !targetDelta) return cloneEdge(edge);

    const nextEdge = cloneEdge(edge);
    nextEdge.data = routeMovedEdge(nextEdge.data as EdgeDataType, sourceDelta, targetDelta);
    return nextEdge;
  });
};
