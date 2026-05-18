import type { Edge, Node } from '@xyflow/react';

import i18next from '../i18n';
import type { ComponentDataType, EdgeDataType } from '../types';
import { createDiagramCheckContext } from './checkContext';
import type { DiagramCheckIssue } from './diagramCheckTypes';
import { normalizeDiagramCheckIssues } from './normalizeDiagramCheckIssues';
import { diagramCheckRules } from './rules';

type DiagramExportModel = {
  nodes?: Node<ComponentDataType>[];
  edges?: Edge<EdgeDataType>[];
};

export function createDiagramCheckContextFromJson(jsonData: string) {
  const model = JSON.parse(jsonData) as DiagramExportModel;
  const nodes = model.nodes || [];
  const edges = model.edges || [];

  return createDiagramCheckContext(nodes, edges);
}

export function runDiagramCheck(jsonData: string): DiagramCheckIssue[] {
  const model = JSON.parse(jsonData) as DiagramExportModel;
  const nodes = model.nodes || [];

  if (nodes.length === 0) {
    const t = i18next.getFixedT(null, 'main', 'sidebar.check.issues.diagramEmpty');

    return [{
      id: 'diagram-empty',
      severity: 'info',
      priority: 100,
      specificity: 80,
      fingerprint: {
        scope: 'diagram',
        key: 'diagram',
        problem: 'diagram-empty',
      },
      title: t('title'),
      shortDescription: t('shortDescription'),
      description: t('description'),
      recommendation: t('recommendation'),
      ruleId: 'diagram-empty',
    }];
  }

  const context = createDiagramCheckContextFromJson(jsonData);
  const rawIssues = diagramCheckRules.flatMap((rule) => rule.check(context));
  return normalizeDiagramCheckIssues(rawIssues);
}
