import type { Edge, Node } from '@xyflow/react';

import i18next from '../i18n';
import type { ComponentDataType, EdgeDataType } from '../types';
import { createDiagramCheckContext } from './checkContext';
import type { DiagramCheckIssue } from './diagramCheckTypes';
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
      title: t('title'),
      shortDescription: t('shortDescription'),
      description: t('description'),
      recommendation: t('recommendation'),
      ruleId: 'diagram-empty',
    }];
  }

  const context = createDiagramCheckContextFromJson(jsonData);
  return diagramCheckRules.flatMap((rule) => rule.check(context));
}
