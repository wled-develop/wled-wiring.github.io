import type { Edge, Node } from '@xyflow/react';

import i18next from '../i18n';
import type { ComponentDataType, EdgeDataType } from '../types';
import type { CheckHandle, CheckInvalidWire, CheckNet, CheckNetClassification, DiagramCheckContext } from './checkContext';
import { describeHandle } from './checkContext';
import { runComponentSpecificRules } from './componentSpecificRules';
import type { DiagramCheckIssue, DiagramCheckIssueFingerprint, DiagramCheckTarget } from './diagramCheckTypes';

export type DiagramCheckRule = {
  id: string;
  title: string;
  description: string;
  issueKeys: string[];
  check: (context: DiagramCheckContext) => DiagramCheckIssue[];
};

export type DiagramCheckRuleInfo = {
  id: string;
  title: string;
  description: string;
  checks: {
    id: string;
    title: string;
    description: string;
  }[];
};

type TranslationValues = Record<string, number | string | undefined>;
type IssueOptions = {
  priority?: number;
  specificity?: number;
  fingerprint?: DiagramCheckIssueFingerprint;
  suppresses?: string[];
  suppressedBy?: string[];
  diagnosticOnly?: boolean;
};

const checkText = (key: string, values?: TranslationValues) => (
  String(i18next.t(`sidebar.check.${key}`, { ns: 'main', ...values }))
);

const ruleText = (ruleId: string, field: 'title' | 'description') => (
  checkText(`rules.${ruleId}.${field}`)
);

const issueText = (
  ruleId: string,
  issueKey: string,
  field: 'title' | 'shortDescription' | 'description' | 'recommendation',
  values?: TranslationValues,
) => checkText(`rules.${ruleId}.issues.${issueKey}.${field}`, values);

const ruleOverviewValues = (issueKey: string): TranslationValues | undefined => {
  if(issueKey === 'signalSinkWithoutSource' || issueKey === 'multipleSignalSources') {
    return {signal: checkText('rulePlaceholders.signal')};
  }

  if(issueKey === 'mainsInputMissing') {
    return {label: checkText('rulePlaceholders.mainsInput')};
  }

  return undefined;
};

const ruleInfo = (rule: DiagramCheckRule): DiagramCheckRuleInfo => ({
  id: rule.id,
  title: rule.title,
  description: rule.description,
  checks: rule.issueKeys.map((issueKey) => {
    const values = ruleOverviewValues(issueKey);
    return {
      id: `${rule.id}.${issueKey}`,
      title: issueText(rule.id, issueKey, 'title', values),
      description: issueText(rule.id, issueKey, 'shortDescription', values),
    };
  }),
});

const nodeTarget = (node: Node<ComponentDataType>): DiagramCheckTarget => ({
  type: 'node',
  id: node.id,
  label: node.data.technicalID || node.data.name || node.id,
});

const edgeTarget = (edge: Edge<EdgeDataType>): DiagramCheckTarget => ({
  type: 'edge',
  id: edge.id,
  label: `${edge.sourceHandle || edge.source} -> ${edge.targetHandle || edge.target}`,
});

const handleTargets = (handle: CheckHandle): DiagramCheckTarget[] => [
  nodeTarget(handle.node),
  ...handle.connectedEdges.map(edgeTarget),
];

const netTargets = (net: CheckNet): DiagramCheckTarget[] => {
  const nodes = new Map(net.handles.map((handle) => [handle.node.id, nodeTarget(handle.node)]));
  const edges = new Map(net.edges.map((edge) => [edge.id, edgeTarget(edge)]));
  return [...nodes.values(), ...edges.values()];
};

const uniqueTargets = (targets: DiagramCheckTarget[]) => {
  const targetsByKey = new Map<string, DiagramCheckTarget>();

  targets.forEach((target) => {
    targetsByKey.set(`${target.type}:${target.id}:${target.handleId || ''}`, target);
  });

  return Array.from(targetsByKey.values());
};

const issue = (
  id: string,
  severity: DiagramCheckIssue['severity'],
  title: string,
  shortDescription: string,
  description: string,
  recommendation?: string,
  targets?: DiagramCheckTarget[],
  ruleId = 'network-rules',
  options?: IssueOptions,
): DiagramCheckIssue => ({
  id,
  ruleId,
  severity,
  priority: options?.priority,
  specificity: options?.specificity,
  fingerprint: options?.fingerprint,
  suppresses: options?.suppresses,
  suppressedBy: options?.suppressedBy,
  diagnosticOnly: options?.diagnosticOnly,
  title,
  shortDescription,
  description,
  recommendation,
  targets: targets ? uniqueTargets(targets) : undefined,
});

const translatedIssue = (
  ruleId: string,
  issueKey: string,
  id: string,
  severity: DiagramCheckIssue['severity'],
  values?: TranslationValues,
  targets?: DiagramCheckTarget[],
  options?: IssueOptions,
) => issue(
  id,
  severity,
  issueText(ruleId, issueKey, 'title', values),
  issueText(ruleId, issueKey, 'shortDescription', values),
  issueText(ruleId, issueKey, 'description', values),
  issueText(ruleId, issueKey, 'recommendation', values),
  targets,
  ruleId,
  options,
);

const hasFunction = (handle: CheckHandle, fn: string) => (
  handle.functions.includes(fn as never)
);

const isTechnicalComponent = (node: Node<ComponentDataType>) => (
  !['InfoNode', 'LineBoxNode', 'WireInfoNode'].includes(node.data.technicalID)
);

const isPassiveConnectorComponent = (node: Node<ComponentDataType>) => (
  ['SolderJoint', 'WAGO_2X', 'WAGO_3X'].includes(node.data.technicalID)
);

const diagramIssueOptions = (
  problem: string,
  specificity: number,
  priority: number,
  extra?: Pick<IssueOptions, 'suppresses' | 'suppressedBy' | 'diagnosticOnly'>,
): IssueOptions => ({
  priority,
  specificity,
  fingerprint: {
    scope: 'diagram',
    key: 'diagram',
    problem,
  },
  ...extra,
});

const netIssueOptions = (
  net: CheckNet,
  problem: string,
  specificity: number,
  priority: number,
  extra?: Pick<IssueOptions, 'suppresses' | 'suppressedBy' | 'diagnosticOnly'>,
): IssueOptions => ({
  priority,
  specificity,
  fingerprint: {
    scope: 'net',
    key: net.id,
    problem,
  },
  ...extra,
});

const componentIssueOptions = (
  node: Node<ComponentDataType>,
  problem: string,
  specificity: number,
  priority: number,
  extra?: Pick<IssueOptions, 'suppresses' | 'suppressedBy' | 'diagnosticOnly'>,
): IssueOptions => ({
  priority,
  specificity,
  fingerprint: {
    scope: 'component',
    key: node.id,
    problem,
  },
  ...extra,
});

const handleIssueOptions = (
  handle: CheckHandle,
  problem: string,
  specificity: number,
  priority: number,
  extra?: Pick<IssueOptions, 'suppresses' | 'suppressedBy' | 'diagnosticOnly'>,
): IssueOptions => ({
  priority,
  specificity,
  fingerprint: {
    scope: 'handle',
    key: handle.key,
    problem,
  },
  ...extra,
});

const edgeIssueOptions = (
  edge: Edge<EdgeDataType>,
  problem: string,
  specificity: number,
  priority: number,
  extra?: Pick<IssueOptions, 'suppresses' | 'suppressedBy' | 'diagnosticOnly'>,
): IssueOptions => ({
  priority,
  specificity,
  fingerprint: {
    scope: 'edge',
    key: edge.id,
    problem,
  },
  ...extra,
});

const hasInputField = (handle: CheckHandle, technicalId?: string) => (
  Boolean(technicalId && handle.node.data.inputFields?.some((field) => field.technicalID === technicalId))
);

const getDependencyInputHandle = (
  context: DiagramCheckContext,
  handle: CheckHandle,
) => {
  const dependency = handle.handle.VoutDependency;
  if (!dependency) return undefined;

  const dependencyHandle = context.getHandle(handle.node.id, dependency);
  if (!dependencyHandle || !hasFunction(dependencyHandle, 'suppl_in')) return undefined;

  return dependencyHandle;
};

const getFusedInputHandle = (
  context: DiagramCheckContext,
  handle: CheckHandle,
) => {
  const connection = handle.node.data.internalConnections?.find((candidate) => (
    candidate.kind === 'fuse' &&
    (candidate.fromHandle === handle.handle.hid || candidate.toHandle === handle.handle.hid)
  ));
  if (!connection) return undefined;

  const counterpartHandleId = connection.fromHandle === handle.handle.hid
    ? connection.toHandle
    : connection.fromHandle;
  const counterpart = context.getHandle(handle.node.id, counterpartHandleId);

  return counterpart && hasFunction(counterpart, 'suppl_in') ? counterpart : undefined;
};

const isForwardedSupplyOutput = (
  context: DiagramCheckContext,
  handle: CheckHandle,
) => (
  Boolean(getDependencyInputHandle(context, handle) || getFusedInputHandle(context, handle))
);

const supplySourceKey = (
  context: DiagramCheckContext,
  handle: CheckHandle,
) => {
  if (typeof handle.handle.Vout === 'number' && handle.handle.Vout > 0) {
    return `${handle.node.id}:fixed:${handle.handle.Vout}`;
  }

  if (hasInputField(handle, handle.handle.VoutDependency)) {
    return `${handle.node.id}:input-field:${handle.handle.VoutDependency}`;
  }

  const resolvedVoltage = context.resolveVoltageOut(handle);
  if (resolvedVoltage !== undefined) {
    return `${handle.node.id}:resolved:${resolvedVoltage}`;
  }

  return `${handle.node.id}:handle:${handle.handle.hid}`;
};

const independentSupplySources = (
  context: DiagramCheckContext,
  net: CheckNet,
) => {
  const sourcesByKey = new Map<string, CheckHandle[]>();
  const outputHandles = net.sourceHandles
    .filter((handle) => hasFunction(handle, 'suppl_out'))
    .filter((handle) => !isForwardedSupplyOutput(context, handle));
  const exclusiveOutputHandles = outputHandles.filter((handle) => !hasFunction(handle, 'suppl_in'));
  const sourceHandles = exclusiveOutputHandles.length > 0
    ? exclusiveOutputHandles
    : outputHandles.slice(0, 1);

  sourceHandles.forEach((handle) => {
    const key = supplySourceKey(context, handle);
    sourcesByKey.set(key, [...(sourcesByKey.get(key) || []), handle]);
  });

  return Array.from(sourcesByKey.entries()).map(([key, handles]) => ({ key, handles }));
};

const classificationLabel = (classification: CheckNetClassification) => (
  checkText(`classificationLabels.${classification}`)
);

const signalLabel = (signalId: string) => checkText(`signalLabels.${signalId}`);

const mainsInputLabel = (inputId: string) => checkText(`mainsInputLabels.${inputId}`);

const netHasAnyClassification = (
  net: CheckNet,
  classifications: CheckNetClassification[],
) => classifications.some((classification) => net.classifications.includes(classification));

const handleNetHasClassification = (
  context: DiagramCheckContext,
  handle: CheckHandle,
  classification: CheckNetClassification,
) => (
  context.getNetByHandle(handle)?.classifications.includes(classification) || false
);

const supplyInputHasExternalSource = (
  context: DiagramCheckContext,
  handle: CheckHandle,
) => {
  const net = context.getNetByHandle(handle);
  if (!net?.classifications.includes('suppl_net_type')) return false;

  return net.handles.some((candidate) => (
    candidate.node.id !== handle.node.id &&
    hasFunction(candidate, 'suppl_out')
  ));
};

const handlesByNode = (context: DiagramCheckContext) => {
  const byNode = new Map<string, CheckHandle[]>();

  context.handles.forEach((handle) => {
    byNode.set(handle.node.id, [...(byNode.get(handle.node.id) || []), handle]);
  });

  return byNode;
};

const lowVoltageOrSignalClassifications: CheckNetClassification[] = [
  'gnd_net_type',
  'suppl_net_type',
  'digital_net_type',
  'pwm_net_type',
  'analog_net_type',
  'audio_net_type',
  'eth_net_type',
  'usb_net_type',
  'rs485_a_net_type',
  'rs485_b_net_type',
];

const activeOrSignalClassifications: CheckNetClassification[] = [
  'L_net_type',
  'N_net_type',
  'suppl_net_type',
  'digital_net_type',
  'pwm_net_type',
  'analog_net_type',
  'audio_net_type',
  'eth_net_type',
  'usb_net_type',
  'rs485_a_net_type',
  'rs485_b_net_type',
];

const signalRuleDefinitions: {
  id: string;
  label: string;
  classification: CheckNetClassification;
  sourceFunctions: string[];
  sinkFunctions: string[];
}[] = [
  {
    id: 'digital',
    label: 'Digital',
    classification: 'digital_net_type',
    sourceFunctions: ['dig_out', 'dig_clock_out', 'dig_backup_out'],
    sinkFunctions: ['dig_in', 'dig_clock_in', 'dig_backup_in'],
  },
  {
    id: 'pwm',
    label: 'PWM',
    classification: 'pwm_net_type',
    sourceFunctions: ['pwm_out'],
    sinkFunctions: ['pwm_in_R', 'pwm_in_G', 'pwm_in_B', 'pwm_in_W', 'pwm_in_WW'],
  },
  {
    id: 'analog',
    label: 'Analog',
    classification: 'analog_net_type',
    sourceFunctions: ['an_out'],
    sinkFunctions: ['an_in'],
  },
  {
    id: 'audio',
    label: 'Audio',
    classification: 'audio_net_type',
    sourceFunctions: ['audio_out'],
    sinkFunctions: ['audio_in'],
  },
  {
    id: 'usb',
    label: 'USB',
    classification: 'usb_net_type',
    sourceFunctions: ['usb_power_out'],
    sinkFunctions: ['usb_full'],
  },
];

const digitalSinkFunctions = ['dig_in', 'dig_clock_in', 'dig_backup_in'];
const digitalSourceFunctions = ['dig_out', 'dig_clock_out', 'dig_backup_out'];

const isDigitalSink = (handle: CheckHandle) => (
  digitalSinkFunctions.some((fn) => hasFunction(handle, fn))
);

const isDigitalSource = (handle: CheckHandle) => (
  digitalSourceFunctions.some((fn) => hasFunction(handle, fn))
);

const isUsbFull = (handle: CheckHandle) => hasFunction(handle, 'usb_full');

const isPassiveSignalComponent = (handle: CheckHandle) => (
  ['Kerko', 'Resistor'].includes(handle.node.data.technicalID)
);

const handlesWithAnyFunction = (handles: CheckHandle[], functions: string[]) => (
  handles.filter((handle) => functions.some((fn) => hasFunction(handle, fn)))
);

const voltageMatches = (sourceVoltage: number | undefined, target: CheckHandle) => {
  if (sourceVoltage === undefined) return false;
  const min = target.voltageMin;
  const max = target.voltageMax;
  if (min === undefined && max === undefined) return true;
  return (min === undefined || sourceVoltage >= min) && (max === undefined || sourceVoltage <= max);
};

const digitalBiasTargets = (reachableHandles: CheckHandle[]) => (
  reachableHandles.filter((handle) => (
    isDigitalSink(handle) && !isPassiveSignalComponent(handle)
  ))
);

const hasReachableDigitalSource = (context: DiagramCheckContext, handle: CheckHandle) => (
  context.signalReachableHandles(handle).some(isDigitalSource)
);

const hasValidDigitalBias = (context: DiagramCheckContext, handle: CheckHandle) => {
  const reachableHandles = context.signalReachableHandles(handle);
  const targets = digitalBiasTargets(reachableHandles);
  if (targets.length === 0) return false;

  if (reachableHandles.some((candidate) => hasFunction(candidate, 'gnd'))) {
    return targets.some((target) => voltageMatches(0, target));
  }

  return reachableHandles
    .filter((candidate) => hasFunction(candidate, 'suppl_out'))
    .some((source) => {
      const sourceVoltage = context.resolveVoltageOut(source);
      return targets.some((target) => voltageMatches(sourceVoltage, target));
    });
};

const hasResolvedDigitalSink = (context: DiagramCheckContext, handle: CheckHandle) => (
  hasReachableDigitalSource(context, handle) || hasValidDigitalBias(context, handle)
);

const hasDigitalBiasConsumer = (context: DiagramCheckContext, net: CheckNet) => (
  net.handles.some((handle) => hasValidDigitalBias(context, handle))
);

const digitalVoltageMismatchReason = (
  sourceVoltage: number | undefined,
  target: CheckHandle,
) => {
  if (sourceVoltage === undefined) return undefined;
  const min = target.voltageMin;
  const max = target.voltageMax;

  if (min !== undefined && sourceVoltage < min) return 'low';
  if (max !== undefined && sourceVoltage > max) return 'high';
  return undefined;
};

const digitalSignalSourcesForInput = (
  context: DiagramCheckContext,
  input: CheckHandle,
) => (
  context.signalReachableHandles(input)
    .filter((candidate) => candidate.node.id !== input.node.id)
    .filter(isDigitalSource)
);

const shouldCheckDigitalSignalVoltage = (
  net: CheckNet,
  digitalSources: CheckHandle[],
) => (
  net.classifications.includes('digital_net_type') ||
  (net.classifications.length === 0 && digitalSources.length > 0)
);

const mainsFunctions = ['line_in', 'line_out', 'neutral_in', 'neutral_out', 'pe_in', 'pe_out'];

const hasMainsFunction = (handle: CheckHandle) => (
  mainsFunctions.some((fn) => hasFunction(handle, fn))
);

const hasAnyConnectedEdge = (handles: CheckHandle[]) => (
  handles.some((handle) => handle.connectedEdges.length > 0)
);

const issueTargetsForInvalidWire = (invalidWire: CheckInvalidWire) => (
  [
    edgeTarget(invalidWire.edge),
    ...(invalidWire.node ? [nodeTarget(invalidWire.node)] : []),
  ]
);

const checkWireConnectedToHiddenOrMissingHandle = (context: DiagramCheckContext) => (
  context.invalidWires.map((invalidWire) => translatedIssue(
    'network-rules',
    'wireConnectedToHiddenOrMissingHandle',
    `wire-connected-to-hidden-or-missing-handle-${invalidWire.edge.id}-${invalidWire.side}`,
    'error',
    {
      wire: invalidWire.edge.id,
      side: invalidWire.side,
      handle: invalidWire.handleId || 'unknown',
      reason: checkText(`invalidWireReasons.${invalidWire.reason}`),
    },
    issueTargetsForInvalidWire(invalidWire),
    edgeIssueOptions(invalidWire.edge, 'wire-connected-to-hidden-or-missing-handle', 90, 10),
  ))
);

const checkDuplicateParallelWires = (context: DiagramCheckContext) => {
  const groups = new Map<string, Edge<EdgeDataType>[]>();

  context.edges.forEach((edge) => {
    const a = `${edge.source}:${edge.sourceHandle || ''}`;
    const b = `${edge.target}:${edge.targetHandle || ''}`;
    const key = [a, b].sort().join('<->');
    groups.set(key, [...(groups.get(key) || []), edge]);
  });

  return Array.from(groups.values())
    .filter((edges) => edges.length > 1)
    .map((edges) => translatedIssue(
      'network-rules',
      'duplicateParallelWire',
      `duplicate-parallel-wire-${edges.map((edge) => edge.id).sort().join('-')}`,
      'info',
      { count: edges.length },
      edges.map(edgeTarget),
      edgeIssueOptions(edges[0], 'duplicate-parallel-wire', 35, 170),
    ));
};

const checkWireWithoutPhysicalParameters = (context: DiagramCheckContext) => (
  context.componentLinkedNets
    .filter((net) => netHasAnyClassification(net, ['suppl_net_type', 'gnd_net_type']))
    .flatMap((net) => net.edges.map((edge) => ({ net, edge })))
    .filter(({ edge }) => (
      edge.data?.physType === 'single' &&
      (typeof edge.data?.physLength !== 'number' || edge.data.physLength <= 0 ||
        typeof edge.data?.physCrosssection !== 'number' || edge.data.physCrosssection <= 0)
    ))
    .map(({ edge }) => translatedIssue(
      'network-rules',
      'wireWithoutPhysicalParameters',
      `wire-without-physical-parameters-${edge.id}`,
      'warning',
      undefined,
      [edgeTarget(edge)],
      edgeIssueOptions(edge, 'wire-without-physical-parameters', 40, 150, {
        suppressedBy: ['wire-connected-to-hidden-or-missing-handle'],
      }),
    ))
);

const checkMainsWireConnectedToLowVoltageComponent = (context: DiagramCheckContext) => (
  context.componentLinkedNets
    .filter((net) => netHasAnyClassification(net, ['L_net_type', 'N_net_type', 'PE_net_type']))
    .flatMap((net) => net.handles
      .filter((handle) => !hasMainsFunction(handle))
      .filter((handle) => isTechnicalComponent(handle.node))
      .filter((handle) => !isPassiveConnectorComponent(handle.node))
      .map((handle) => ({ net, handle })))
    .map(({ net, handle }) => translatedIssue(
      'network-rules',
      'mainsWireConnectedToLowVoltageComponent',
      `mains-wire-connected-to-low-voltage-component-${handle.key}`,
      'error',
      { component: handle.node.data.technicalID || handle.node.id, handle: describeHandle(handle) },
      [
        ...handleTargets(handle),
        ...netTargets(net),
      ],
      handleIssueOptions(handle, 'mains-wire-connected-to-low-voltage-component', 95, 4, {
        suppresses: ['mixed-classification'],
      }),
    ))
);

const checkGroundAndSupplyPolaritySwapped = (net: CheckNet) => (
  translatedIssue(
    'network-rules',
    'groundAndSupplyPolaritySwapped',
    `network-ground-and-supply-polarity-swapped-${net.id}`,
    'error',
    undefined,
    netTargets(net),
    netIssueOptions(net, 'polarity-ground-supply', 95, 8, {
      suppresses: ['mixed-classification', 'supply-input-without-source', 'supply-source-without-consumer'],
    }),
  )
);

const checkSupplyVoltageUnknown = (context: DiagramCheckContext, net: CheckNet) => {
  const sources = independentSupplySources(context, net);
  if (sources.length !== 1) return undefined;
  if (context.resolveVoltageOut(sources[0].handles[0]) !== undefined) return undefined;

  const supplyInputs = handlesWithAnyFunction(net.handles, ['suppl_in'])
    .filter((handle) => !isUsbFull(handle));
  if (supplyInputs.length === 0) return undefined;

  return translatedIssue(
    'network-rules',
    'supplyVoltageUnknown',
    `network-supply-voltage-unknown-${net.id}`,
    'warning',
    { source: sources[0].handles.map(describeHandle).join(', ') },
    [
      ...netTargets(net),
      ...supplyInputs.flatMap(handleTargets),
      ...sources[0].handles.flatMap(handleTargets),
    ],
    netIssueOptions(net, 'supply-voltage-unknown', 55, 95, {
      suppressedBy: ['supply-voltage-mismatch', 'multiple-supply-sources'],
    }),
  );
};

const checkFuseBypassed = (context: DiagramCheckContext) => (
  context.nodes.flatMap((node) => (
    (node.data.internalConnections || [])
      .filter((connection) => connection.kind === 'fuse')
      .flatMap((connection) => {
        const fromHandle = context.getHandle(node.id, connection.fromHandle);
        const toHandle = context.getHandle(node.id, connection.toHandle);
        if (!fromHandle || !toHandle) return [];
        const fromElementaryNet = context.getElementaryNetByHandle(fromHandle);
        const toElementaryNet = context.getElementaryNetByHandle(toHandle);
        if (!fromElementaryNet || !toElementaryNet || fromElementaryNet.id !== toElementaryNet.id) return [];

        return [translatedIssue(
          'network-rules',
          'fuseBypassed',
          `fuse-bypassed-${node.id}-${connection.fromHandle}-${connection.toHandle}`,
          'error',
          { component: node.data.technicalID || node.id },
          [
            nodeTarget(node),
            ...netTargets(fromElementaryNet),
          ],
          netIssueOptions(fromElementaryNet, 'fuse-bypassed', 90, 18, {
            suppresses: ['duplicate-parallel-wire'],
          }),
        )];
      })
  ))
);

const digitalDataIn = (handles: CheckHandle[]) => handles.find((handle) => hasFunction(handle, 'dig_in'));
const digitalBackupIn = (handles: CheckHandle[]) => handles.find((handle) => hasFunction(handle, 'dig_backup_in'));
const digitalClockIn = (handles: CheckHandle[]) => handles.find((handle) => hasFunction(handle, 'dig_clock_in'));

const ledUpstreamDataSource = (context: DiagramCheckContext, dataIn: CheckHandle) => {
  const sources = digitalSignalSourcesForInput(context, dataIn)
    .filter((source) => source.node.id !== dataIn.node.id)
    .filter((source) => source.node.data.group === 'led')
    .filter((source) => hasFunction(source, 'dig_out'));

  return sources.length === 1 ? sources[0] : undefined;
};

const checkDigitalBackupPairMismatch = (context: DiagramCheckContext) => {
  const issues: DiagramCheckIssue[] = [];

  handlesByNode(context).forEach((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node || node.data.group !== 'led') return;

    const dataIn = digitalDataIn(nodeHandles);
    const backupIn = digitalBackupIn(nodeHandles);
    if (!dataIn || !backupIn) return;

    const backupNet = context.getNetByHandle(backupIn);
    const upstreamData = ledUpstreamDataSource(context, dataIn);
    if (upstreamData) {
      const upstreamBackupOut = context.handles.find((handle) => (
        handle.node.id === upstreamData.node.id && hasFunction(handle, 'dig_backup_out')
      ));
      const hasMatchingBackup = Boolean(upstreamBackupOut && backupNet?.handles.some((handle) => handle.key === upstreamBackupOut.key));
      if (hasMatchingBackup) return;

      issues.push(translatedIssue(
        'network-rules',
        'digitalBackupPairMismatch',
        `digital-backup-pair-mismatch-${backupIn.key}`,
        'error',
        {
          component: node.data.technicalID || node.id,
          source: upstreamData.node.data.technicalID || upstreamData.node.id,
        },
        [
          ...handleTargets(dataIn),
          ...handleTargets(backupIn),
          ...handleTargets(upstreamData),
          ...(upstreamBackupOut ? handleTargets(upstreamBackupOut) : []),
        ],
        handleIssueOptions(backupIn, 'digital-backup-pair-mismatch', 75, 70, {
          suppresses: ['digital-sink-without-source'],
        }),
      ));
      return;
    }

    if (backupNet?.classifications.includes('gnd_net_type')) return;
    const dataNet = context.getNetByHandle(dataIn);
    const backupInDataNet = Boolean(dataNet && backupNet && dataNet.id === backupNet.id);

    issues.push(translatedIssue(
      'network-rules',
      backupInDataNet ? 'digitalBackupInputTiedToData' : 'digitalBackupInputNotGrounded',
      backupInDataNet
        ? `digital-backup-input-tied-to-data-${backupIn.key}`
        : `digital-backup-input-not-grounded-${backupIn.key}`,
      backupInDataNet ? 'warning' : 'error',
      { component: node.data.technicalID || node.id },
      [
        ...handleTargets(dataIn),
        ...handleTargets(backupIn),
      ],
      handleIssueOptions(
        backupIn,
        backupInDataNet ? 'digital-backup-input-tied-to-data' : 'digital-backup-input-not-grounded',
        75,
        70,
      ),
    ));
  });

  return issues;
};

const checkClockedLedClockMissing = (context: DiagramCheckContext) => {
  const issues: DiagramCheckIssue[] = [];

  handlesByNode(context).forEach((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node || node.data.group !== 'led') return;

    const dataIn = digitalDataIn(nodeHandles);
    const clockIn = digitalClockIn(nodeHandles);
    if (!dataIn || !clockIn || dataIn.connectedEdges.length === 0) return;

    const upstreamData = ledUpstreamDataSource(context, dataIn);
    if (upstreamData) {
      const upstreamClockOut = context.handles.find((handle) => (
        handle.node.id === upstreamData.node.id && hasFunction(handle, 'dig_clock_out')
      ));
      const clockNet = context.getNetByHandle(clockIn);
      const hasMatchingClock = Boolean(upstreamClockOut && clockNet?.handles.some((handle) => handle.key === upstreamClockOut.key));
      if (hasMatchingClock) return;

      issues.push(translatedIssue(
        'network-rules',
        'clockedLedClockMissing',
        `clocked-led-clock-missing-${clockIn.key}`,
        'error',
        { component: node.data.technicalID || node.id },
        [
          ...handleTargets(dataIn),
          ...handleTargets(clockIn),
          ...handleTargets(upstreamData),
          ...(upstreamClockOut ? handleTargets(upstreamClockOut) : []),
        ],
        handleIssueOptions(clockIn, 'clocked-led-clock-missing', 85, 46, {
          suppresses: ['digital-sink-without-source'],
        }),
      ));
      return;
    }

    if (hasResolvedDigitalSink(context, clockIn)) return;
    issues.push(translatedIssue(
      'network-rules',
      'clockedLedClockMissing',
      `clocked-led-clock-missing-${clockIn.key}`,
      'error',
      { component: node.data.technicalID || node.id },
      [
        ...handleTargets(dataIn),
        ...handleTargets(clockIn),
      ],
      handleIssueOptions(clockIn, 'clocked-led-clock-missing', 85, 46, {
        suppresses: ['digital-sink-without-source'],
      }),
    ));
  });

  return issues;
};

const checkSignalOutputWithoutConsumer = (context: DiagramCheckContext) => (
  context.componentLinkedNets.flatMap((net) => (
    signalRuleDefinitions.flatMap((definition) => {
      if (!net.classifications.includes(definition.classification)) return [];
      const sources = handlesWithAnyFunction(net.sourceHandles, definition.sourceFunctions);
      return sources
        .filter((source) => source.connectedEdges.length > 0)
        .filter((source) => (
          !context.signalReachableHandles(source).some((candidate) => (
            candidate.key !== source.key &&
            definition.sinkFunctions.some((fn) => hasFunction(candidate, fn))
          ))
        ))
        .map((source) => translatedIssue(
          'network-rules',
          'signalOutputWithoutConsumer',
          `signal-output-without-consumer-${source.key}`,
          'warning',
          { signal: signalLabel(definition.id), source: describeHandle(source) },
          [
            ...handleTargets(source),
            ...netTargets(net),
          ],
          handleIssueOptions(source, `${definition.id}-output-without-consumer`, 50, 125, {
            suppressedBy: ['data-direction-wrong', 'mixed-digital-signal-types'],
          }),
        ));
    })
  ))
);

const checkDataDirectionWrong = (context: DiagramCheckContext) => (
  context.componentLinkedNets
    .filter((net) => net.classifications.includes('digital_net_type'))
    .flatMap((net) => {
      const dataSources = handlesWithAnyFunction(net.handles, ['dig_out']);
      const dataSinks = handlesWithAnyFunction(net.handles, ['dig_in']);
      if (dataSources.length > 1 && dataSinks.length === 0) {
        return [translatedIssue(
          'network-rules',
          'dataDirectionWrong',
          `data-direction-wrong-output-only-${net.id}`,
          'error',
          { handles: dataSources.map(describeHandle).join(', ') },
          [
            ...netTargets(net),
            ...dataSources.flatMap(handleTargets),
          ],
          netIssueOptions(net, 'data-direction-wrong', 80, 48, {
            suppresses: ['multiple-digital-sources', 'digital-output-without-consumer'],
          }),
        )];
      }
      if (dataSources.length === 0 && dataSinks.length > 1) {
        return [translatedIssue(
          'network-rules',
          'dataDirectionWrong',
          `data-direction-wrong-input-only-${net.id}`,
          'error',
          { handles: dataSinks.map(describeHandle).join(', ') },
          [
            ...netTargets(net),
            ...dataSinks.flatMap(handleTargets),
          ],
          netIssueOptions(net, 'data-direction-wrong', 80, 48, {
            suppresses: ['digital-sink-without-source'],
          }),
        )];
      }
      return [];
    })
);

const checkSupplyInputOnlyInternallyPowered = (context: DiagramCheckContext) => (
  Array.from(handlesByNode(context).values()).flatMap((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node || !isTechnicalComponent(node)) return [];

    const supplyInputs = handlesWithAnyFunction(nodeHandles, ['suppl_in'])
      .filter((handle) => !hasFunction(handle, 'usb_full'));
    const connectedSupplyInputs = supplyInputs.filter((handle) => handle.connectedEdges.length > 0);
    if (connectedSupplyInputs.length === 0) return [];

    const hasExternalSource = connectedSupplyInputs.some((handle) => supplyInputHasExternalSource(context, handle));
    const hasInternalSupplyOnly = connectedSupplyInputs.some((handle) => (
      context.powerReachableHandles(handle).some((candidate) => (
        candidate.node.id === node.id && candidate.key !== handle.key && hasFunction(candidate, 'suppl_in')
      ))
    ));
    if (hasExternalSource || !hasInternalSupplyOnly) return [];

    return [translatedIssue(
      'component-rules',
      'supplyInputOnlyInternallyPowered',
      `supply-input-only-internally-powered-${node.id}`,
      'warning',
      { component: node.data.technicalID || node.id },
      [
        nodeTarget(node),
        ...connectedSupplyInputs.flatMap(handleTargets),
      ],
      componentIssueOptions(node, 'supply-input-only-internally-powered', 60, 90, {
        suppressedBy: ['supply-input-without-source'],
      }),
    )];
  })
);

const fuseNominalValueIsMissing = (node: Node<ComponentDataType>, fieldId?: string) => {
  if (!fieldId) return true;

  const inputValue = node.data.inputFields?.find((field) => field.technicalID === fieldId)?.value;
  if (typeof inputValue === 'number' && inputValue > 0) return false;

  const selectValue = node.data.selectFields?.find((field) => field.technicalID === fieldId)?.selectedValue;
  return !(typeof selectValue === 'number' && selectValue > 0);
};

const checkFuseCurrentMissingOrUnderspecified = (context: DiagramCheckContext) => (
  context.nodes.flatMap((node) => {
    const fuseConnections = (node.data.internalConnections || []).filter((connection) => connection.kind === 'fuse');
    if (fuseConnections.length === 0) return [];

    const missingConnections = fuseConnections.filter((connection) => (
      typeof connection.nominalCurrent !== 'number' &&
      fuseNominalValueIsMissing(node, connection.nominalCurrentField || connection.fuseId)
    ));
    if (missingConnections.length === 0) return [];

    return [translatedIssue(
      'component-rules',
      'fuseCurrentMissingOrUnderspecified',
      `fuse-current-missing-or-underspecified-${node.id}`,
      'info',
      { component: node.data.technicalID || node.id },
      [nodeTarget(node)],
      componentIssueOptions(node, 'fuse-current-missing-or-underspecified', 45, 160),
    )];
  })
);

const checkComponentHasOnlyOneTerminalConnected = (context: DiagramCheckContext) => (
  Array.from(handlesByNode(context).values()).flatMap((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node || !isTechnicalComponent(node) || isPassiveConnectorComponent(node)) return [];
    if (!['Resistor', 'Kerko', 'Elko', 'miniOTOFuse'].includes(node.data.technicalID)) return [];
    if (nodeHandles.length !== 2) return [];

    const connectedHandles = nodeHandles.filter((handle) => handle.connectedEdges.length > 0);
    if (connectedHandles.length !== 1) return [];

    return [translatedIssue(
      'component-rules',
      'componentHasOnlyOneTerminalConnected',
      `component-has-only-one-terminal-connected-${node.id}`,
      'warning',
      { component: node.data.technicalID || node.id, handle: describeHandle(connectedHandles[0]) },
      [
        nodeTarget(node),
        ...nodeHandles.flatMap(handleTargets),
      ],
      componentIssueOptions(node, 'component-has-only-one-terminal-connected', 65, 110),
    )];
  })
);

const checkCapacitorPolarityMismatch = (context: DiagramCheckContext) => (
  Array.from(handlesByNode(context).values()).flatMap((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node || node.data.technicalID !== 'Elko') return [];

    const plus = nodeHandles.find((handle) => handle.handle.hid.toLowerCase().includes('plus'));
    const minus = nodeHandles.find((handle) => handle.handle.hid.toLowerCase().includes('minus'));
    if (!plus || !minus) return [];

    const plusNet = context.getNetByHandle(plus);
    const minusNet = context.getNetByHandle(minus);
    const plusWrong = plusNet?.classifications.includes('gnd_net_type') || false;
    const minusWrong = minusNet?.classifications.includes('suppl_net_type') || false;
    if (!plusWrong && !minusWrong) return [];

    return [translatedIssue(
      'component-rules',
      'capacitorPolarityMismatch',
      `capacitor-polarity-mismatch-${node.id}`,
      'error',
      { component: node.data.technicalID || node.id },
      [
        nodeTarget(node),
        ...handleTargets(plus),
        ...handleTargets(minus),
      ],
      componentIssueOptions(node, 'capacitor-polarity-mismatch', 90, 34, {
        suppresses: ['mixed-classification'],
      }),
    )];
  })
);

const checkMainsConnectorIncomplete = (context: DiagramCheckContext) => (
  Array.from(handlesByNode(context).values()).flatMap((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node) return [];
    const lineHandles = handlesWithAnyFunction(nodeHandles, ['line_in']);
    const neutralHandles = handlesWithAnyFunction(nodeHandles, ['neutral_in']);
    if (lineHandles.length === 0 || neutralHandles.length === 0) return [];

    const lineOk = lineHandles.some((handle) => handleNetHasClassification(context, handle, 'L_net_type'));
    const neutralOk = neutralHandles.some((handle) => handleNetHasClassification(context, handle, 'N_net_type'));
    if (lineOk === neutralOk) return [];

    return [translatedIssue(
      'component-rules',
      'mainsConnectorIncomplete',
      `mains-connector-incomplete-${node.id}`,
      'error',
      { component: node.data.technicalID || node.id },
      [
        nodeTarget(node),
        ...lineHandles.flatMap(handleTargets),
        ...neutralHandles.flatMap(handleTargets),
      ],
      componentIssueOptions(node, 'mains-connector-incomplete', 75, 14, {
        suppresses: ['mains-input-missing'],
      }),
    )];
  })
);

const checkProtectiveEarthMissingForMetalOrMainsDevice = (context: DiagramCheckContext) => (
  Array.from(handlesByNode(context).values()).flatMap((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node) return [];

    const peHandles = handlesWithAnyFunction(nodeHandles, ['pe_in']);
    if (peHandles.length === 0) return [];

    const mainsUsed = handlesWithAnyFunction(nodeHandles, ['line_in', 'neutral_in'])
      .some((handle) => handle.connectedEdges.length > 0 || handleNetHasClassification(context, handle, 'L_net_type') || handleNetHasClassification(context, handle, 'N_net_type'));
    if (!mainsUsed) return [];

    const peOk = peHandles.some((handle) => handleNetHasClassification(context, handle, 'PE_net_type'));
    if (peOk) return [];

    return [translatedIssue(
      'component-rules',
      'protectiveEarthMissingForMetalOrMainsDevice',
      `protective-earth-missing-${node.id}`,
      'error',
      { component: node.data.technicalID || node.id },
      [
        nodeTarget(node),
        ...peHandles.flatMap(handleTargets),
      ],
      componentIssueOptions(node, 'protective-earth-missing', 80, 16, {
        suppresses: ['mains-input-missing'],
      }),
    )];
  })
);

const checkIsolatedComponent = (context: DiagramCheckContext) => (
  Array.from(handlesByNode(context).values()).flatMap((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node || !isTechnicalComponent(node)) return [];
    if (hasAnyConnectedEdge(nodeHandles)) return [];

    return [translatedIssue(
      'component-rules',
      'isolatedComponent',
      `isolated-component-${node.id}`,
      'info',
      { component: node.data.technicalID || node.id },
      [nodeTarget(node)],
      componentIssueOptions(node, 'isolated-component', 30, 180),
    )];
  })
);

const hasCheckRelevantFunction = (handle: CheckHandle) => (
  handle.functions.some((fn) => fn !== 'unknown' && fn !== 'not_connected')
);

const checkComponentDefinitionIncompleteForChecks = (context: DiagramCheckContext) => (
  context.handles
    .filter((handle) => (
      handle.rawFunctions.length === 0 ||
      (hasFunction(handle, 'suppl_in') && (handle.voltageMin === undefined || handle.voltageMax === undefined)) ||
      ((hasFunction(handle, 'suppl_out') || hasFunction(handle, 'dig_out') || hasFunction(handle, 'dig_clock_out') || hasFunction(handle, 'dig_backup_out')) &&
        context.resolveVoltageOut(handle) === undefined)
    ))
    .map((handle) => translatedIssue(
      'component-rules',
      'componentDefinitionIncompleteForChecks',
      `component-definition-incomplete-for-checks-${handle.key}`,
      'info',
      { component: handle.node.data.technicalID || handle.node.id, handle: describeHandle(handle) },
      handleTargets(handle),
      handleIssueOptions(handle, 'component-definition-incomplete-for-checks', 60, 900, {
        diagnosticOnly: true,
      }),
    ))
);

const allowedMultiFunctionSets = new Set([
  ['dig_in', 'dig_out'].sort().join('|'),
  ['dig_in', 'an_in'].sort().join('|'),
]);

const checkAmbiguousMultiFunctionHandle = (context: DiagramCheckContext) => (
  context.handles
    .filter((handle) => handle.functions.filter((fn) => fn !== 'unknown').length > 1)
    .filter(hasCheckRelevantFunction)
    .filter((handle) => !allowedMultiFunctionSets.has(handle.functions.slice().sort().join('|')))
    .map((handle) => translatedIssue(
      'component-rules',
      'ambiguousMultiFunctionHandle',
      `ambiguous-multi-function-handle-${handle.key}`,
      'info',
      {
        handle: describeHandle(handle),
        functions: handle.functions.join(', '),
      },
      handleTargets(handle),
      handleIssueOptions(handle, 'ambiguous-multi-function-handle', 60, 910, {
        diagnosticOnly: true,
      }),
    ))
);

const checkUnusedRequiredFunctionalGroup = (context: DiagramCheckContext) => (
  Array.from(handlesByNode(context).values()).flatMap((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node || node.data.group !== 'led') return [];

    const dataIn = digitalDataIn(nodeHandles);
    const hasLedInputUse = Boolean(dataIn && dataIn.connectedEdges.length > 0);
    if (!hasLedInputUse) return [];

    const supplyInputs = handlesWithAnyFunction(nodeHandles, ['suppl_in']);
    const gndInputs = handlesWithAnyFunction(nodeHandles, ['gnd']);
    const missingRequired = [
      ...(!supplyInputs.some((handle) => handle.connectedEdges.length > 0 || handleNetHasClassification(context, handle, 'suppl_net_type')) ? supplyInputs : []),
      ...(!gndInputs.some((handle) => handle.connectedEdges.length > 0 || handleNetHasClassification(context, handle, 'gnd_net_type')) ? gndInputs : []),
    ];
    if (missingRequired.length === 0) return [];

    return [translatedIssue(
      'component-rules',
      'unusedRequiredFunctionalGroup',
      `unused-required-functional-group-${node.id}`,
      'warning',
      { component: node.data.technicalID || node.id },
      [
        nodeTarget(node),
        ...(dataIn ? handleTargets(dataIn) : []),
        ...missingRequired.flatMap(handleTargets),
      ],
      componentIssueOptions(node, 'unused-required-functional-group', 80, 75, {
        suppresses: ['power-missing', 'ground-missing'],
      }),
    )];
  })
);

const runNetworkRules = (context: DiagramCheckContext) => {
  const issues: DiagramCheckIssue[] = [
    ...checkWireConnectedToHiddenOrMissingHandle(context),
    ...checkDuplicateParallelWires(context),
    ...checkWireWithoutPhysicalParameters(context),
    ...checkMainsWireConnectedToLowVoltageComponent(context),
    ...checkFuseBypassed(context),
  ];
  const priorityBlockedNetIds = new Set<string>();
  const componentLinkedNets = context.componentLinkedNets;
  const gndHandles = context.handles.filter((handle) => hasFunction(handle, 'gnd'));
  const gndNets = componentLinkedNets.filter((net) => net.classifications.includes('gnd_net_type'));

  if (gndHandles.length > 0 && gndNets.length === 0) {
    issues.push(translatedIssue(
      'network-rules',
      'groundMissing',
      'network-ground-missing',
      'error',
      undefined,
      gndHandles.flatMap(handleTargets),
      diagramIssueOptions('ground-missing', 50, 30),
    ));
  }

  if (gndNets.length >= 2) {
    gndNets.forEach((net) => priorityBlockedNetIds.add(net.id));
    issues.push(translatedIssue(
      'network-rules',
      'groundMultiple',
      'network-ground-multiple',
      'error',
      { count: gndNets.length },
      gndNets.flatMap(netTargets),
      diagramIssueOptions('ground-multiple', 70, 20),
    ));
  }

  componentLinkedNets
    .filter((net) => (
      net.classifications.includes('gnd_net_type') &&
      net.classifications.includes('suppl_net_type')
    ))
    .forEach((net) => {
      priorityBlockedNetIds.add(net.id);
      issues.push(checkGroundAndSupplyPolaritySwapped(net));
    });

  componentLinkedNets
    .filter((net) => (
      netHasAnyClassification(net, ['L_net_type', 'N_net_type']) &&
      netHasAnyClassification(net, lowVoltageOrSignalClassifications)
    ))
    .forEach((net) => {
      priorityBlockedNetIds.add(net.id);
      issues.push(translatedIssue(
        'network-rules',
        'mainsLowVoltageMixed',
        `network-mains-low-voltage-mixed-${net.id}`,
        'error',
        { classifications: net.classifications.map(classificationLabel).join(', ') },
        netTargets(net),
        netIssueOptions(net, 'mains-low-voltage-mixed', 90, 5, {
          suppresses: ['mixed-classification'],
        }),
      ));
    });

  componentLinkedNets
    .filter((net) => (
      net.classifications.includes('PE_net_type') &&
      netHasAnyClassification(net, activeOrSignalClassifications)
    ))
    .forEach((net) => {
      priorityBlockedNetIds.add(net.id);
      issues.push(translatedIssue(
        'network-rules',
        'peActiveMixed',
        `network-pe-active-mixed-${net.id}`,
        'error',
        { classifications: net.classifications.map(classificationLabel).join(', ') },
        netTargets(net),
        netIssueOptions(net, 'pe-active-mixed', 90, 6, {
          suppresses: ['mixed-classification'],
        }),
      ));
    });

  componentLinkedNets
    .filter((net) => (
      net.classifications.includes('rs485_a_net_type') &&
      net.classifications.includes('rs485_b_net_type')
    ))
    .forEach((net) => {
      priorityBlockedNetIds.add(net.id);
      issues.push(translatedIssue(
        'network-rules',
        'rs485Mixed',
        `network-rs485-a-b-mixed-${net.id}`,
        'error',
        undefined,
        netTargets(net),
        netIssueOptions(net, 'rs485-mixed', 80, 25, {
          suppresses: ['mixed-classification'],
        }),
      ));
    });

  componentLinkedNets
    .filter((net) => net.classifications.length > 1)
    .filter((net) => !priorityBlockedNetIds.has(net.id))
    .forEach((net) => {
      priorityBlockedNetIds.add(net.id);
      issues.push(translatedIssue(
        'network-rules',
        'mixedClassifications',
        `network-mixed-classifications-${net.id}`,
        'error',
        { classifications: net.classifications.map(classificationLabel).join(', ') },
        netTargets(net),
        netIssueOptions(net, 'mixed-classification', 20, 80, {
          suppressedBy: ['mains-low-voltage-mixed', 'pe-active-mixed', 'rs485-mixed'],
        }),
      ));
    });

  componentLinkedNets
    .filter((net) => net.classifications.includes('suppl_net_type'))
    .filter((net) => !priorityBlockedNetIds.has(net.id))
    .forEach((net) => {
      const sources = independentSupplySources(context, net);
      if (sources.length <= 1) return;

      issues.push(translatedIssue(
        'network-rules',
        'multipleSupplySources',
        `network-multiple-supply-sources-${net.id}`,
        'error',
        {
          count: sources.length,
          sources: sources.map((source) => source.handles.map(describeHandle).join(' / ')).join('; '),
        },
        [
          ...netTargets(net),
          ...sources.flatMap((source) => source.handles.flatMap(handleTargets)),
        ],
        netIssueOptions(net, 'multiple-supply-sources', 70, 35, {
          suppresses: ['supply-voltage-mismatch', 'supply-source-without-consumer'],
        }),
      ));
    });

  componentLinkedNets
    .filter((net) => !priorityBlockedNetIds.has(net.id))
    .forEach((net) => {
      signalRuleDefinitions.forEach((definition) => {
        const sinks = handlesWithAnyFunction(net.handles, definition.sinkFunctions);
        const unresolvedSinks = definition.id === 'digital'
          ? sinks.filter((handle) => !hasResolvedDigitalSink(context, handle))
          : sinks;

        if (unresolvedSinks.length === 0 || net.classifications.includes(definition.classification)) return;

        issues.push(translatedIssue(
          'network-rules',
          'signalSinkWithoutSource',
          `network-${definition.id}-sink-without-source-${net.id}`,
          'error',
          {
            signal: signalLabel(definition.id),
            sinks: unresolvedSinks.map(describeHandle).join(', '),
          },
          [
            ...netTargets(net),
            ...unresolvedSinks.flatMap(handleTargets),
          ],
          netIssueOptions(net, `${definition.id}-sink-without-source`, 60, 50, {
            suppressedBy: ['mixed-digital-signal-types', 'data-direction-wrong'],
          }),
        ));
      });
    });

  componentLinkedNets
    .filter((net) => !priorityBlockedNetIds.has(net.id))
    .forEach((net) => {
      handlesWithAnyFunction(net.handles, digitalSinkFunctions).forEach((input) => {
        const sources = digitalSignalSourcesForInput(context, input);
        if (!shouldCheckDigitalSignalVoltage(net, sources)) return;

        const mismatches = sources
          .map((source) => ({
            source,
            voltage: context.resolveVoltageOut(source),
          }))
          .map((source) => ({
            ...source,
            reason: digitalVoltageMismatchReason(source.voltage, input),
          }))
          .filter((source): source is {
            source: CheckHandle;
            voltage: number;
            reason: 'low' | 'high';
          } => source.reason !== undefined && source.voltage !== undefined);

        if (mismatches.length === 0) return;

        const min = input.voltageMin ?? '?';
        const max = input.voltageMax ?? '?';
        const mismatchDescription = mismatches
          .map((mismatch) => `${describeHandle(mismatch.source)} (${mismatch.voltage} V)`)
          .join(', ');

        issues.push(translatedIssue(
          'network-rules',
          'digitalSignalVoltageMismatch',
          `network-digital-signal-voltage-mismatch-${input.key}`,
          'error',
          {
            input: describeHandle(input),
            min,
            max,
            sources: mismatchDescription,
          },
          [
            ...handleTargets(input),
            ...mismatches.flatMap((mismatch) => handleTargets(mismatch.source)),
          ],
          handleIssueOptions(input, 'digital-signal-voltage-mismatch', 75, 45),
        ));
      });
    });

  componentLinkedNets
    .filter((net) => !priorityBlockedNetIds.has(net.id))
    .forEach((net) => {
      signalRuleDefinitions.forEach((definition) => {
        if (!net.classifications.includes(definition.classification)) return;

        const sources = handlesWithAnyFunction(net.sourceHandles, definition.sourceFunctions);
        if (sources.length <= 1) return;

        issues.push(translatedIssue(
          'network-rules',
          'multipleSignalSources',
          `network-multiple-${definition.id}-sources-${net.id}`,
          'error',
          {
            signal: signalLabel(definition.id),
            sources: sources.map(describeHandle).join(', '),
          },
          [
            ...netTargets(net),
            ...sources.flatMap(handleTargets),
          ],
          netIssueOptions(net, `multiple-${definition.id}-sources`, 65, 55, {
            suppressedBy: ['mixed-digital-signal-types', 'data-direction-wrong'],
          }),
        ));
      });
    });

  componentLinkedNets
    .filter((net) => !priorityBlockedNetIds.has(net.id))
    .forEach((net) => {
      const supplyInputs = handlesWithAnyFunction(net.handles, ['suppl_in'])
        .filter((handle) => !isUsbFull(handle));
      const supplySources = net.classifications.includes('suppl_net_type')
        ? independentSupplySources(context, net)
        : [];

      if (supplyInputs.length > 0 && supplySources.length === 0) {
        issues.push(translatedIssue(
          'network-rules',
          'supplyInputWithoutSource',
          `network-supply-input-without-source-${net.id}`,
          'error',
          { inputs: supplyInputs.map(describeHandle).join(', ') },
          [
            ...netTargets(net),
            ...supplyInputs.flatMap(handleTargets),
          ],
          netIssueOptions(net, 'supply-input-without-source', 60, 40),
        ));
      }

      if (
        net.classifications.includes('suppl_net_type') &&
        supplyInputs.length === 0 &&
        !hasDigitalBiasConsumer(context, net)
      ) {
        issues.push(translatedIssue(
          'network-rules',
          'supplySourceWithoutConsumer',
          `network-supply-source-without-consumer-${net.id}`,
          'warning',
          undefined,
          netTargets(net),
          netIssueOptions(net, 'supply-source-without-consumer', 45, 120, {
            suppressedBy: [
              'mixed-classification',
              'mains-low-voltage-mixed',
              'pe-active-mixed',
              'multiple-supply-sources',
              'supply-voltage-mismatch',
            ],
          }),
        ));
      }
    });

  componentLinkedNets
    .filter((net) => net.classifications.includes('suppl_net_type'))
    .filter((net) => !priorityBlockedNetIds.has(net.id))
    .forEach((net) => {
      const sources = independentSupplySources(context, net);
      if (sources.length !== 1) return;

      const sourceVoltage = context.resolveVoltageOut(sources[0].handles[0]);
      if (sourceVoltage === undefined) return;

      const mismatchedInputs = handlesWithAnyFunction(net.handles, ['suppl_in'])
        .filter((handle) => !isUsbFull(handle))
        .filter((handle) => !voltageMatches(sourceVoltage, handle));
      if (mismatchedInputs.length === 0) return;

      issues.push(translatedIssue(
        'network-rules',
        'supplyVoltageMismatch',
        `network-supply-voltage-mismatch-${net.id}`,
        'error',
        {
          voltage: sourceVoltage,
          inputs: mismatchedInputs.map(describeHandle).join(', '),
        },
        [
          ...netTargets(net),
          ...sources[0].handles.flatMap(handleTargets),
          ...mismatchedInputs.flatMap(handleTargets),
        ],
        netIssueOptions(net, 'supply-voltage-mismatch', 75, 42, {
          suppressedBy: ['multiple-supply-sources'],
        }),
      ));
    });

  componentLinkedNets
    .filter((net) => net.classifications.includes('suppl_net_type'))
    .filter((net) => !priorityBlockedNetIds.has(net.id))
    .forEach((net) => {
      const issueForNet = checkSupplyVoltageUnknown(context, net);
      if (issueForNet) issues.push(issueForNet);
    });

  issues.push(
    ...checkClockedLedClockMissing(context),
    ...checkDigitalBackupPairMismatch(context),
    ...checkDataDirectionWrong(context),
    ...checkSignalOutputWithoutConsumer(context),
  );

  return issues;
};

const runComponentRules = (context: DiagramCheckContext) => {
  const issues: DiagramCheckIssue[] = [];
  const mainsInputRequirements: {
    id: string;
    label: string;
    inputFunction: string;
    classification: CheckNetClassification;
  }[] = [
    {
      id: 'line',
      label: 'Line',
      inputFunction: 'line_in',
      classification: 'L_net_type',
    },
    {
      id: 'neutral',
      label: 'Neutral',
      inputFunction: 'neutral_in',
      classification: 'N_net_type',
    },
    {
      id: 'pe',
      label: 'PE',
      inputFunction: 'pe_in',
      classification: 'PE_net_type',
    },
  ];

  handlesByNode(context).forEach((nodeHandles) => {
    const node = nodeHandles[0]?.node;
    if (!node) return;

    const requiredDisconnectedHandles = nodeHandles.filter((handle) => (
      handle.handle.mustBeConnected === true &&
      handle.connectedEdges.length === 0
    ));

    if (requiredDisconnectedHandles.length > 0) {
      issues.push(translatedIssue(
        'component-rules',
        'requiredPinUnconnected',
        `component-required-pin-unconnected-${node.id}`,
        'error',
        {
          component: node.data.technicalID || node.data.name || node.id,
          handles: requiredDisconnectedHandles.map(describeHandle).join(', '),
        },
        [
          nodeTarget(node),
          ...requiredDisconnectedHandles.flatMap(handleTargets),
        ],
        componentIssueOptions(node, 'required-pin-unconnected', 70, 32),
      ));
    }

    const gndHandles = handlesWithAnyFunction(nodeHandles, ['gnd']);
    const hasGroundConnection = gndHandles.some((handle) => (
      handleNetHasClassification(context, handle, 'gnd_net_type')
    ));

    if (gndHandles.length > 0 && !hasGroundConnection) {
      issues.push(translatedIssue(
        'component-rules',
        'groundMissing',
        `component-ground-missing-${node.id}`,
        'error',
        { component: node.data.technicalID || node.data.name || node.id },
        [
          nodeTarget(node),
          ...gndHandles.flatMap(handleTargets),
        ],
        componentIssueOptions(node, 'ground-missing', 55, 60),
      ));
    }

    const supplyInputHandles = nodeHandles.filter((handle) => (
      hasFunction(handle, 'suppl_in') && !hasFunction(handle, 'usb_full')
    ));
    const usbFullHandles = handlesWithAnyFunction(nodeHandles, ['usb_full']);
    const hasSupplyNeed = supplyInputHandles.length > 0 || usbFullHandles.length > 0;
    const hasSupplyConnection = supplyInputHandles.some((handle) => (
      supplyInputHasExternalSource(context, handle)
    ));
    const hasUsbConnection = usbFullHandles.some((handle) => (
      handleNetHasClassification(context, handle, 'usb_net_type')
    ));

    if (hasSupplyNeed && !hasSupplyConnection && !hasUsbConnection) {
      issues.push(translatedIssue(
        'component-rules',
        'powerMissing',
        `component-power-missing-${node.id}`,
        'error',
        { component: node.data.technicalID || node.data.name || node.id },
        [
          nodeTarget(node),
          ...supplyInputHandles.flatMap(handleTargets),
          ...usbFullHandles.flatMap(handleTargets),
        ],
        componentIssueOptions(node, 'power-missing', 55, 58),
      ));
    }

    mainsInputRequirements.forEach((requirement) => {
      const inputHandles = handlesWithAnyFunction(nodeHandles, [requirement.inputFunction]);
      const missingHandles = inputHandles.filter((handle) => (
        !handleNetHasClassification(context, handle, requirement.classification)
      ));

      if (missingHandles.length === 0) return;

      issues.push(translatedIssue(
        'component-rules',
        'mainsInputMissing',
        `component-${requirement.id}-input-missing-${node.id}`,
        'error',
        {
          component: node.data.technicalID || node.data.name || node.id,
          label: mainsInputLabel(requirement.id),
        },
        [
          nodeTarget(node),
          ...missingHandles.flatMap(handleTargets),
        ],
        {
          priority: 12,
          specificity: 70,
          fingerprint: {
            scope: 'component',
            key: `${node.id}:${requirement.id}`,
            problem: 'mains-input-missing',
          },
        },
      ));
    });
  });

  return [
    ...issues,
    ...checkUnusedRequiredFunctionalGroup(context),
    ...checkComponentHasOnlyOneTerminalConnected(context),
    ...checkCapacitorPolarityMismatch(context),
    ...checkMainsConnectorIncomplete(context),
    ...checkProtectiveEarthMissingForMetalOrMainsDevice(context),
    ...checkSupplyInputOnlyInternallyPowered(context),
    ...checkFuseCurrentMissingOrUnderspecified(context),
    ...checkIsolatedComponent(context),
    ...checkComponentDefinitionIncompleteForChecks(context),
    ...checkAmbiguousMultiFunctionHandle(context),
    ...runComponentSpecificRules(context),
  ];
};

export const diagramCheckRules: DiagramCheckRule[] = [
  {
    id: 'network-rules',
    get title() { return ruleText('network-rules', 'title'); },
    get description() { return ruleText('network-rules', 'description'); },
    issueKeys: [
      'groundMissing',
      'groundMultiple',
      'wireConnectedToHiddenOrMissingHandle',
      'mainsWireConnectedToLowVoltageComponent',
      'mainsLowVoltageMixed',
      'peActiveMixed',
      'rs485Mixed',
      'groundAndSupplyPolaritySwapped',
      'mixedClassifications',
      'multipleSupplySources',
      'supplyVoltageUnknown',
      'signalSinkWithoutSource',
      'digitalSignalVoltageMismatch',
      'multipleSignalSources',
      'signalOutputWithoutConsumer',
      'dataDirectionWrong',
      'clockedLedClockMissing',
      'digitalBackupPairMismatch',
      'digitalBackupInputTiedToData',
      'digitalBackupInputNotGrounded',
      'supplyInputWithoutSource',
      'supplySourceWithoutConsumer',
      'supplyVoltageMismatch',
      'fuseBypassed',
      'wireWithoutPhysicalParameters',
      'duplicateParallelWire',
    ],
    check: runNetworkRules,
  },
  {
    id: 'component-rules',
    get title() { return ruleText('component-rules', 'title'); },
    get description() { return ruleText('component-rules', 'description'); },
    issueKeys: [
      'requiredPinUnconnected',
      'groundMissing',
      'powerMissing',
      'mainsInputMissing',
      'unusedRequiredFunctionalGroup',
      'componentHasOnlyOneTerminalConnected',
      'capacitorPolarityMismatch',
      'mainsConnectorIncomplete',
      'protectiveEarthMissingForMetalOrMainsDevice',
      'supplyInputOnlyInternallyPowered',
      'fuseCurrentMissingOrUnderspecified',
      'isolatedComponent',
      'componentDefinitionIncompleteForChecks',
      'ambiguousMultiFunctionHandle',
      'sn74Ahct125nUsedChannelInputMissing',
    ],
    check: runComponentRules,
  },
];

export const getDiagramCheckRuleInfos = () => diagramCheckRules.map(ruleInfo);
