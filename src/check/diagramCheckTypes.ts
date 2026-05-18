export type DiagramCheckSeverity = 'error' | 'warning' | 'info';

export type DiagramCheckTarget = {
  type: 'node' | 'edge';
  id: string;
  handleId?: string;
  label?: string;
};

export type DiagramCheckIssueFingerprint = {
  scope: 'net' | 'component' | 'handle' | 'edge' | 'diagram';
  key: string;
  problem: string;
};

export type DiagramCheckIssue = {
  id: string;
  severity: DiagramCheckSeverity;
  priority?: number;
  specificity?: number;
  suppresses?: string[];
  suppressedBy?: string[];
  fingerprint?: DiagramCheckIssueFingerprint;
  title: string;
  shortDescription: string;
  description: string;
  recommendation?: string;
  targets?: DiagramCheckTarget[];
  ruleId?: string;
};
