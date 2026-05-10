import type { XYPoint, edgePoint } from '../types';
import { simplifyWirePath } from './wireMerge';

const ORTHOGONAL_EPSILON = 0.001;

export type SegmentOrientation = 'horizontal' | 'vertical';

export type MoveWireSegmentParams = {
  points: XYPoint[];
  segmentIndex: number;
  axisValue: number;
  pinStubLength?: number;
  preserveStartPinStub?: boolean;
  preserveEndPinStub?: boolean;
};

export type MoveWireSegmentResult = {
  points: XYPoint[];
  edgePoints: edgePoint[];
  orientation: SegmentOrientation;
};

const pointEquals = (a: XYPoint, b: XYPoint) => a.x === b.x && a.y === b.y;

const isHorizontal = (a: XYPoint, b: XYPoint) => Math.abs(a.y - b.y) <= ORTHOGONAL_EPSILON;

const isVertical = (a: XYPoint, b: XYPoint) => Math.abs(a.x - b.x) <= ORTHOGONAL_EPSILON;

const clampStubLength = (segmentLength: number, preferredStubLength: number) => {
  if(segmentLength <= 0) return preferredStubLength;
  return Math.max(1, Math.min(preferredStubLength, segmentLength / 3));
};

const pushPoint = (target: XYPoint[], point: XYPoint) => {
  if(target.length > 0 && pointEquals(target[target.length - 1], point)) return;
  target.push(point);
};

const resetEdgePoints = (points: XYPoint[]) => (
  points.slice(1, -1).map((point) => ({...point, active: -1} as edgePoint))
);

export const getSegmentOrientation = (
  start: XYPoint,
  end: XYPoint,
): SegmentOrientation | undefined => {
  if(isHorizontal(start, end)) return 'horizontal';
  if(isVertical(start, end)) return 'vertical';
  return undefined;
};

export const moveWireSegment = ({
  points,
  segmentIndex,
  axisValue,
  pinStubLength = 12,
  preserveStartPinStub = true,
  preserveEndPinStub = true,
}: MoveWireSegmentParams): MoveWireSegmentResult | undefined => {
  if(segmentIndex < 0 || segmentIndex >= points.length - 1) return undefined;

  const segmentStart = points[segmentIndex];
  const segmentEnd = points[segmentIndex + 1];
  const orientation = getSegmentOrientation(segmentStart, segmentEnd);
  if(!orientation) return undefined;

  const segmentLength = orientation === 'horizontal'
    ? Math.abs(segmentEnd.x - segmentStart.x)
    : Math.abs(segmentEnd.y - segmentStart.y);
  const stubLength = clampStubLength(segmentLength, pinStubLength);

  const nextPoints: XYPoint[] = points.slice(0, segmentIndex).map((point) => ({...point}));
  const segmentTouchesStartPin = segmentIndex === 0;
  const segmentTouchesEndPin = segmentIndex === points.length - 2;

  if(orientation === 'horizontal') {
    const newY = axisValue;

    if(segmentTouchesStartPin && preserveStartPinStub) {
      const directionFromPin = segmentEnd.x >= segmentStart.x ? 1 : -1;
      const pinStubPoint = {x: segmentStart.x + directionFromPin * stubLength, y: segmentStart.y};
      const shiftedStubCorner = {x: pinStubPoint.x, y: newY};
      pushPoint(nextPoints, {...segmentStart});
      pushPoint(nextPoints, pinStubPoint);
      pushPoint(nextPoints, shiftedStubCorner);
    } else if(segmentTouchesStartPin) {
      pushPoint(nextPoints, {...segmentStart});
      pushPoint(nextPoints, {x: segmentStart.x, y: newY});
    } else {
      pushPoint(nextPoints, {x: segmentStart.x, y: newY});
    }

    if(segmentTouchesEndPin && preserveEndPinStub) {
      const directionFromPin = segmentStart.x >= segmentEnd.x ? 1 : -1;
      const pinStubPoint = {x: segmentEnd.x + directionFromPin * stubLength, y: segmentEnd.y};
      const shiftedStubCorner = {x: pinStubPoint.x, y: newY};
      pushPoint(nextPoints, shiftedStubCorner);
      pushPoint(nextPoints, pinStubPoint);
      pushPoint(nextPoints, {...segmentEnd});
    } else if(segmentTouchesEndPin) {
      pushPoint(nextPoints, {x: segmentEnd.x, y: newY});
      pushPoint(nextPoints, {...segmentEnd});
    } else {
      pushPoint(nextPoints, {x: segmentEnd.x, y: newY});
    }
  } else {
    const newX = axisValue;

    if(segmentTouchesStartPin && preserveStartPinStub) {
      const directionFromPin = segmentEnd.y >= segmentStart.y ? 1 : -1;
      const pinStubPoint = {x: segmentStart.x, y: segmentStart.y + directionFromPin * stubLength};
      const shiftedStubCorner = {x: newX, y: pinStubPoint.y};
      pushPoint(nextPoints, {...segmentStart});
      pushPoint(nextPoints, pinStubPoint);
      pushPoint(nextPoints, shiftedStubCorner);
    } else if(segmentTouchesStartPin) {
      pushPoint(nextPoints, {...segmentStart});
      pushPoint(nextPoints, {x: newX, y: segmentStart.y});
    } else {
      pushPoint(nextPoints, {x: newX, y: segmentStart.y});
    }

    if(segmentTouchesEndPin && preserveEndPinStub) {
      const directionFromPin = segmentStart.y >= segmentEnd.y ? 1 : -1;
      const pinStubPoint = {x: segmentEnd.x, y: segmentEnd.y + directionFromPin * stubLength};
      const shiftedStubCorner = {x: newX, y: pinStubPoint.y};
      pushPoint(nextPoints, shiftedStubCorner);
      pushPoint(nextPoints, pinStubPoint);
      pushPoint(nextPoints, {...segmentEnd});
    } else if(segmentTouchesEndPin) {
      pushPoint(nextPoints, {x: newX, y: segmentEnd.y});
      pushPoint(nextPoints, {...segmentEnd});
    } else {
      pushPoint(nextPoints, {x: newX, y: segmentEnd.y});
    }
  }

  points.slice(segmentIndex + 2).forEach((point) => pushPoint(nextPoints, {...point}));

  const simplifiedPoints = simplifyWirePath(nextPoints);

  return {
    points: simplifiedPoints,
    edgePoints: resetEdgePoints(simplifiedPoints),
    orientation,
  };
};
