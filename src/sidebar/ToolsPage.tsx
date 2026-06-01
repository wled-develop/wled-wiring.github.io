import { Button, Space, Tooltip, Typography, message } from 'antd';
import { BranchesOutlined } from '@ant-design/icons';
import { useEdges, useReactFlow, type Edge, type Node } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

import type { ComponentDataType, EdgeDataType } from '../types';
import { useZustandStore } from '../utils/pathfinder_functions';
import { rerouteAllWiresWithPathfinder } from '../utils/rotateWireRouting';
import { useUndoRedo } from '../utils/undoRedo';

export const ToolsPage = () => {
  const {t} = useTranslation(['main']);
  const reactFlow = useReactFlow();
  const {takeSnapshot} = useUndoRedo();
  const [messageApi, messageContextHolder] = message.useMessage();
  const pathFindingEnabled = useZustandStore((state) => state.pathFindingEnabled);
  const edges = useEdges();
  const wireCount = edges.filter((edge) => edge.type === 'editable-wire-type').length;
  const disabled = !pathFindingEnabled || wireCount === 0;
  const disabledTooltip = !pathFindingEnabled
    ? t('sidebar.tools.rerouteAllDisabledPF')
    : t('sidebar.tools.rerouteAllDisabledEmpty');

  const rerouteAllWires = () => {
    if(disabled) return;

    takeSnapshot('reroute all wires');
    reactFlow.setEdges((edges) => rerouteAllWiresWithPathfinder(
      reactFlow.getNodes() as Node<ComponentDataType>[],
      edges as Edge<EdgeDataType>[],
    ));
    messageApi.open({
      type: 'success',
      content: t('sidebar.tools.rerouteAllSuccess'),
      duration: 5,
    });
  };

  return (
    <>
      {messageContextHolder}
      <Space direction="vertical" style={{width: '100%'}}>
        <Tooltip title={disabled ? disabledTooltip : t('sidebar.tools.rerouteAllTooltip')}>
          <Button
            icon={<BranchesOutlined />}
            onClick={rerouteAllWires}
            disabled={disabled}
            block
          >
            {t('sidebar.tools.rerouteAllButton')}
          </Button>
        </Tooltip>
        <Typography.Text type="secondary">
          {t('sidebar.tools.rerouteAllDescription')}
        </Typography.Text>
      </Space>
    </>
  );
};
