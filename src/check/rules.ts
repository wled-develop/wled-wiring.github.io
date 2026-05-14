import type { Edge, Node } from '@xyflow/react';

import i18next from '../i18n';
import type { ComponentDataType, EdgeDataType } from '../types';
import type { CheckHandle, CheckNet, CheckNetClassification, DiagramCheckContext } from './checkContext';
import { describeHandle } from './checkContext';
import { runComponentSpecificRules } from './componentSpecificRules';
import type { DiagramCheckIssue, DiagramCheckTarget } from './diagramCheckTypes';

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
  priority?: number,
): DiagramCheckIssue => ({
  id,
  ruleId,
  severity,
  priority,
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
  priority?: number,
) => issue(
  id,
  severity,
  issueText(ruleId, issueKey, 'title', values),
  issueText(ruleId, issueKey, 'shortDescription', values),
  issueText(ruleId, issueKey, 'description', values),
  issueText(ruleId, issueKey, 'recommendation', values),
  targets,
  ruleId,
  priority,
);

const hasFunction = (handle: CheckHandle, fn: string) => (
  handle.functions.includes(fn as never)
);

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

const runNetworkRules = (context: DiagramCheckContext) => {
  const issues: DiagramCheckIssue[] = [];
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
    ));
  }

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
      ));
    });

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
        4,
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
      ));
    });
  });

  return [
    ...issues,
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
      'mainsLowVoltageMixed',
      'peActiveMixed',
      'rs485Mixed',
      'mixedClassifications',
      'multipleSupplySources',
      'signalSinkWithoutSource',
      'digitalSignalVoltageMismatch',
      'multipleSignalSources',
      'supplyInputWithoutSource',
      'supplySourceWithoutConsumer',
      'supplyVoltageMismatch',
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
      'sn74Ahct125nUsedChannelInputMissing',
    ],
    check: runComponentRules,
  },
];

export const getDiagramCheckRuleInfos = () => diagramCheckRules.map(ruleInfo);
