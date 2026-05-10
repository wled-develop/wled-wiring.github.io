export type DiagramCheckSeverity = 'error' | 'warning' | 'info';

export type DiagramCheckTarget = {
  type: 'node' | 'edge';
  id: string;
  handleId?: string;
  label?: string;
};

export type DiagramCheckIssue = {
  id: string;
  severity: DiagramCheckSeverity;
  priority?: number;
  title: string;
  shortDescription: string;
  description: string;
  recommendation?: string;
  targets?: DiagramCheckTarget[];
  ruleId?: string;
};
