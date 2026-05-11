import type { XYPoint } from '../types';
import type { SegmentOrientation } from './wireSegmentMove';

const DEFAULT_SNAP_DISTANCE_PX = 3;
const DEFAULT_MIN_SEGMENT_LENGTH_PX = 4;

export type SnapWireSegmentAxisValueParams = {
  points: XYPoint[];
  segmentIndex: number;
  orientation: SegmentOrientation;
  axisValue: number;
  zoom: number;
  snapDistancePx?: number;
  minSegmentLengthPx?: number;
};

export type SnapWireSegmentAxisValueResult = {
  axisValue: number;
  snapped: boolean;
  reason?: 'near-axis' | 'minimum-neighbor-length';
};

const axisCoordinate = (point: XYPoint, orientation: SegmentOrientation) => (
  orientation === 'horizontal' ? point.y : point.x
);

const finiteNumbers = (values: Array<number | undefined>) => (
  values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
);

const findNearestCandidate = (
  value: number,
  candidates: number[],
  distance: number,
) => {
  let best: number | undefined;
  let bestDistance = Infinity;

  candidates.forEach((candidate) => {
    const candidateDistance = Math.abs(value - candidate);
    if(candidateDistance <= distance && candidateDistance < bestDistance) {
      best = candidate;
      bestDistance = candidateDistance;
    }
  });

  return best;
};

export const snapWireSegmentAxisValue = ({
  points,
  segmentIndex,
  orientation,
  axisValue,
  zoom,
  snapDistancePx = DEFAULT_SNAP_DISTANCE_PX,
  minSegmentLengthPx = DEFAULT_MIN_SEGMENT_LENGTH_PX,
}: SnapWireSegmentAxisValueParams): SnapWireSegmentAxisValueResult => {
  if(segmentIndex < 0 || segmentIndex >= points.length - 1 || zoom <= 0) {
    return {axisValue, snapped: false};
  }

  const snapDistance = snapDistancePx / zoom;
  const minSegmentLength = minSegmentLengthPx / zoom;
  const previousPoint = points[segmentIndex - 1];
  const segmentStart = points[segmentIndex];
  const segmentEnd = points[segmentIndex + 1];
  const nextPoint = points[segmentIndex + 2];

  const minimumLengthCandidates = finiteNumbers([
    previousPoint ? axisCoordinate(previousPoint, orientation) : undefined,
    nextPoint ? axisCoordinate(nextPoint, orientation) : undefined,
  ]);
  const minimumLengthSnap = findNearestCandidate(
    axisValue,
    minimumLengthCandidates,
    minSegmentLength,
  );
  if(minimumLengthSnap !== undefined) {
    return {
      axisValue: minimumLengthSnap,
      snapped: minimumLengthSnap !== axisValue,
      reason: 'minimum-neighbor-length',
    };
  }

  const nearAxisCandidates = finiteNumbers([
    previousPoint ? axisCoordinate(previousPoint, orientation) : undefined,
    axisCoordinate(segmentStart, orientation),
    axisCoordinate(segmentEnd, orientation),
    nextPoint ? axisCoordinate(nextPoint, orientation) : undefined,
  ]);
  const nearAxisSnap = findNearestCandidate(axisValue, nearAxisCandidates, snapDistance);
  if(nearAxisSnap !== undefined) {
    return {
      axisValue: nearAxisSnap,
      snapped: nearAxisSnap !== axisValue,
      reason: 'near-axis',
    };
  }

  return {axisValue, snapped: false};
};
