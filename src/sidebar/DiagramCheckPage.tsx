import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useReactFlow } from '@xyflow/react';
import { Alert, Button, Collapse, Empty, Flex, List, Space, Tag, Typography, theme, type CollapseProps } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import type { CheckNet } from '../check/checkContext';
import { createDiagramCheckContextFromJson, runDiagramCheck } from '../check/runDiagramCheck';
import type { DiagramCheckIssue, DiagramCheckSeverity, DiagramCheckTarget } from '../check/diagramCheckTypes';
import { createDiagramExportJson } from '../utils/exportModel';

const severityColor: Record<DiagramCheckSeverity, string> = {
  error: 'red',
  warning: 'gold',
  info: 'blue',
};

const targetTypeLabel = (target: DiagramCheckTarget) => (
  target.type === 'node' ? 'Component' : 'Wire'
);

const SHOW_NET_DEBUG = false;

const netDebugTargets = (net: CheckNet): DiagramCheckTarget[] => {
  const nodeTargets = new Map<string, DiagramCheckTarget>();
  const edgeTargets = new Map<string, DiagramCheckTarget>();

  net.handles.forEach((handle) => {
    nodeTargets.set(handle.node.id, {
      type: 'node',
      id: handle.node.id,
      label: handle.node.data.technicalID || handle.node.data.name || handle.node.id,
    });
  });

  net.edges.forEach((edge) => {
    edgeTargets.set(edge.id, {
      type: 'edge',
      id: edge.id,
      label: `${edge.sourceHandle || edge.source} -> ${edge.targetHandle || edge.target}`,
    });
  });

  return [...nodeTargets.values(), ...edgeTargets.values()];
};

const handleDebugLabel = (handle: CheckNet['handles'][number]) => (
  `${handle.node.data.technicalID || handle.node.id}.${handle.handle.hid} (${handle.functions.join(', ') || 'none'})`
);

type DiagramCheckPageProps = {
  isOpen: boolean;
};

export const DiagramCheckPage = ({ isOpen }: DiagramCheckPageProps) => {
  const { t, i18n } = useTranslation(['main']);
  const { token } = theme.useToken();
  const reactFlow = useReactFlow();
  const [issues, setIssues] = useState<DiagramCheckIssue[] | null>(null);
  const [netDebugNets, setNetDebugNets] = useState<CheckNet[] | null>(null);
  const [activeIssueKeys, setActiveIssueKeys] = useState<string[]>([]);
  const previousLanguageRef = useRef(i18n.resolvedLanguage);

  const clearHighlights = useCallback(() => {
    reactFlow.setNodes((nodes) => nodes.map((node) => ({
      ...node,
      selected: node.data.checkHighlighted ? false : node.selected,
      data: {
        ...node.data,
        checkHighlighted: false,
      },
    })));

    reactFlow.setEdges((edges) => edges.map((edge) => ({
      ...edge,
      selected: edge.data?.checkHighlighted ? false : edge.selected,
      data: {
        ...edge.data,
        checkHighlighted: false,
      },
    })));
  }, [reactFlow]);

  const highlightTargets = useCallback((targets: DiagramCheckTarget[] = []) => {
    const highlightedNodeIds = new Set(targets.filter((target) => target.type === 'node').map((target) => target.id));
    const highlightedEdgeIds = new Set(targets.filter((target) => target.type === 'edge').map((target) => target.id));

    reactFlow.setNodes((nodes) => nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        checkHighlighted: node.data.technicalID !== 'SolderJoint' && highlightedNodeIds.has(node.id),
      },
    })));

    reactFlow.setEdges((edges) => edges.map((edge) => ({
      ...edge,
      data: {
        ...edge.data,
        checkHighlighted: highlightedEdgeIds.has(edge.id),
      },
    })));
  }, [reactFlow]);

  const updateIssues = useCallback((keepActiveIssue = false) => {
    const jsonData = createDiagramExportJson(reactFlow);
    const nextIssues = runDiagramCheck(jsonData);
    const debugContext = SHOW_NET_DEBUG ? createDiagramCheckContextFromJson(jsonData) : undefined;
    const activeIssueId = activeIssueKeys[activeIssueKeys.length - 1];
    const activeIssue = keepActiveIssue
      ? nextIssues.find((issue) => issue.id === activeIssueId)
      : undefined;

    setIssues(nextIssues);
    setNetDebugNets(debugContext
      ? [
        ...debugContext.elementaryNets,
        ...debugContext.fusedNets,
        ...debugContext.componentLinkedNets,
      ]
      : null);
    setActiveIssueKeys(activeIssue ? activeIssueKeys : []);

    if (activeIssue) {
      highlightTargets(activeIssue.targets);
    } else {
      clearHighlights();
    }
  }, [activeIssueKeys, clearHighlights, highlightTargets, reactFlow]);

  const runCheck = () => {
    updateIssues(false);
  };

  useEffect(() => {
    if (previousLanguageRef.current === i18n.resolvedLanguage) return;

    previousLanguageRef.current = i18n.resolvedLanguage;
    if (issues === null) return;

    updateIssues(true);
  }, [i18n.resolvedLanguage, issues, updateIssues]);

  useEffect(() => {
    if (isOpen) return;

    setActiveIssueKeys([]);
    clearHighlights();
  }, [clearHighlights, isOpen]);

  const issueItems: CollapseProps['items'] = useMemo(() => (
    issues?.map((issue) => ({
      key: issue.id,
      label: (
        <Space size={6} align="start">
          <Tag color={severityColor[issue.severity]} style={{ marginInlineEnd: 0 }}>
            {t(`sidebar.check.severity.${issue.severity}`)}
          </Tag>
          <span>{issue.title}</span>
        </Space>
      ),
      children: (
        <Flex gap="small" vertical>
          <Typography.Text>{issue.description}</Typography.Text>
          {issue.recommendation &&
            <Alert
              type="info"
              showIcon
              message={t('sidebar.check.recommendation')}
              description={issue.recommendation}
            />
          }
          {issue.targets && issue.targets.length > 0 &&
            <List
              size="small"
              header={t('sidebar.check.affectedElements')}
              dataSource={issue.targets}
              renderItem={(target) => (
                <List.Item>
                  <Typography.Text>
                    {targetTypeLabel(target)}: {target.label || target.id}
                  </Typography.Text>
                </List.Item>
              )}
            />
          }
        </Flex>
      ),
      style: {
        border: `1px solid ${token.colorBorder}`,
        borderRadius: 4,
        marginBottom: 6,
      },
    }))
  ), [issues, t, token.colorBorder]);

  const netDebugItems: CollapseProps['items'] = useMemo(() => (
    netDebugNets?.map((net) => ({
      key: net.id,
      label: (
        <Space size={6} align="start" wrap>
          <Tag color={net.layer === 'elementary' ? 'blue' : net.layer === 'fused' ? 'orange' : 'purple'}>
            {net.layer}
          </Tag>
          <Typography.Text>{net.id}</Typography.Text>
          {net.classifications.map((classification) => (
            <Tag key={classification}>{classification}</Tag>
          ))}
        </Space>
      ),
      children: (
        <Flex gap="small" vertical>
          <Button size="small" onClick={() => highlightTargets(netDebugTargets(net))}>
            Highlight net
          </Button>
          <Typography.Text type="secondary">
            Components: {net.componentIds.length ? net.componentIds.join(', ') : 'none'}
          </Typography.Text>
          <Typography.Text type="secondary">
            Child nets: {net.childNetIds.length ? net.childNetIds.join(', ') : 'none'}
          </Typography.Text>
          <List
            size="small"
            header="Pins"
            dataSource={net.handles}
            renderItem={(handle) => (
              <List.Item>
                <Typography.Text>{handleDebugLabel(handle)}</Typography.Text>
              </List.Item>
            )}
          />
          {net.edges.length > 0 &&
            <List
              size="small"
              header="Wires"
              dataSource={net.edges}
              renderItem={(edge) => (
                <List.Item>
                  <Typography.Text>{`${edge.id}: ${edge.sourceHandle} -> ${edge.targetHandle}`}</Typography.Text>
                </List.Item>
              )}
            />
          }
        </Flex>
      ),
      style: {
        border: `1px solid ${token.colorBorder}`,
        borderRadius: 4,
        marginBottom: 6,
      },
    }))
  ), [highlightTargets, netDebugNets, token.colorBorder]);

  return (
    <Flex gap="small" vertical>
      <Alert
        type="info"
        showIcon
        message={t('sidebar.check.betaNoticeTitle')}
        description={t('sidebar.check.betaNoticeDescription')}
      />

      <Button
        type="primary"
        icon={<SafetyCertificateOutlined />}
        onClick={runCheck}
      >
        {t('sidebar.check.buttonRun')}
      </Button>

      {issues === null &&
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('sidebar.check.notChecked')}
        />
      }

      {issues !== null && issues.length === 0 &&
        <Alert
          type="success"
          showIcon
          message={t('sidebar.check.noIssuesTitle')}
          description={t('sidebar.check.noIssuesDescription')}
        />
      }

      {issues !== null && issues.length > 0 &&
        <>
          <Typography.Text type="secondary">
            {t('sidebar.check.issueCount', { count: issues.length })}
          </Typography.Text>
          <Collapse
            ghost
            activeKey={activeIssueKeys}
            items={issueItems}
            onChange={(key) => {
              const keys = Array.isArray(key) ? key.map(String) : [String(key)];
              setActiveIssueKeys(keys);
              const activeIssue = issues.find((issue) => issue.id === keys[keys.length - 1]);
              if (activeIssue) {
                highlightTargets(activeIssue.targets);
              } else {
                clearHighlights();
              }
            }}
          />
        </>
      }

      {SHOW_NET_DEBUG && netDebugNets !== null &&
        <Collapse
          ghost
          items={[
            {
              key: 'net-debug',
              label: `Net debug (${netDebugNets.length})`,
              children: (
                <Collapse
                  ghost
                  items={netDebugItems}
                />
              ),
            },
          ]}
        />
      }
    </Flex>
  );
};
