import type { DiagramCheckIssue, DiagramCheckSeverity } from './diagramCheckTypes';

const severityRank: Record<DiagramCheckSeverity, number> = {
  error: 3,
  warning: 2,
  info: 1,
};

const fingerprintGroupKey = (issue: DiagramCheckIssue) => {
  const fingerprint = issue.fingerprint;
  if (!fingerprint) return undefined;

  return `${fingerprint.scope}:${fingerprint.key}`;
};

const fullFingerprintKey = (issue: DiagramCheckIssue) => {
  const fingerprint = issue.fingerprint;
  if (!fingerprint) return undefined;

  return `${fingerprint.scope}:${fingerprint.key}:${fingerprint.problem}`;
};

const targetKey = (issue: DiagramCheckIssue) => {
  if (!issue.targets || issue.targets.length === 0) return undefined;

  return issue.targets
    .map((target) => `${target.type}:${target.id}:${target.handleId || ''}`)
    .sort()
    .join('|');
};

const fallbackDuplicateKey = (issue: DiagramCheckIssue) => (
  fullFingerprintKey(issue) || `${issue.ruleId || ''}:${issue.title}:${targetKey(issue) || issue.id}`
);

const betterIssue = (
  candidate: DiagramCheckIssue,
  current: DiagramCheckIssue,
  order: Map<DiagramCheckIssue, number>,
) => {
  const candidateSeverity = severityRank[candidate.severity];
  const currentSeverity = severityRank[current.severity];
  if (candidateSeverity !== currentSeverity) return candidateSeverity > currentSeverity;

  const candidateSpecificity = candidate.specificity ?? 0;
  const currentSpecificity = current.specificity ?? 0;
  if (candidateSpecificity !== currentSpecificity) return candidateSpecificity > currentSpecificity;

  const candidatePriority = candidate.priority ?? Number.MAX_SAFE_INTEGER;
  const currentPriority = current.priority ?? Number.MAX_SAFE_INTEGER;
  if (candidatePriority !== currentPriority) return candidatePriority < currentPriority;

  return (order.get(candidate) ?? 0) < (order.get(current) ?? 0);
};

const suppresses = (candidate: DiagramCheckIssue, other: DiagramCheckIssue) => {
  const candidateFingerprint = candidate.fingerprint;
  const otherFingerprint = other.fingerprint;
  if (!candidateFingerprint || !otherFingerprint) return false;
  if (fingerprintGroupKey(candidate) !== fingerprintGroupKey(other)) return false;

  return (
    candidate.suppresses?.includes(otherFingerprint.problem) ||
    other.suppressedBy?.includes(candidateFingerprint.problem)
  ) || false;
};

const chooseBestDuplicates = (
  issues: DiagramCheckIssue[],
  order: Map<DiagramCheckIssue, number>,
) => {
  const bestByKey = new Map<string, DiagramCheckIssue>();

  issues.forEach((issue) => {
    const key = fallbackDuplicateKey(issue);
    const current = bestByKey.get(key);

    if (!current || betterIssue(issue, current, order)) {
      bestByKey.set(key, issue);
    }
  });

  return Array.from(bestByKey.values());
};

export const normalizeDiagramCheckIssues = (issues: DiagramCheckIssue[]) => {
  const order = new Map(issues.map((issue, index) => [issue, index]));
  const visible = new Set(issues);

  issues.forEach((candidate) => {
    issues.forEach((other) => {
      if (candidate === other || !visible.has(other)) return;
      if (suppresses(candidate, other)) {
        visible.delete(other);
      }
    });
  });

  return chooseBestDuplicates(Array.from(visible), order)
    .sort((a, b) => {
      const severityDiff = severityRank[b.severity] - severityRank[a.severity];
      if (severityDiff !== 0) return severityDiff;

      const priorityDiff = (a.priority ?? Number.MAX_SAFE_INTEGER) - (b.priority ?? Number.MAX_SAFE_INTEGER);
      if (priorityDiff !== 0) return priorityDiff;

      return (order.get(a) ?? 0) - (order.get(b) ?? 0);
    });
};
