import { Button, Drawer, Form, InputNumber, Select, Space, Tooltip, Typography, message } from 'antd';
import { BranchesOutlined, SettingOutlined } from '@ant-design/icons';
import { useEdges, useReactFlow, type Edge, type Node } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDiagramCheckSettingsStore } from '../check/checkSettingsStore';
import type { ComponentDataType, EdgeDataType } from '../types';
import { useZustandStore } from '../utils/pathfinder_functions';
import { rerouteAllWiresWithPathfinder } from '../utils/rotateWireRouting';
import { useUndoRedo } from '../utils/undoRedo';

export const ToolsPage = () => {
  const {t} = useTranslation(['main']);
  const reactFlow = useReactFlow();
  const {takeSnapshot} = useUndoRedo();
  const [wireSettingsOpen, setWireSettingsOpen] = useState(false);
  const wireAmpacitySettings = useDiagramCheckSettingsStore((state) => state.settings.wireAmpacity);
  const setWireAmpacitySettings = useDiagramCheckSettingsStore((state) => state.setWireAmpacitySettings);
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
        <Button
          icon={<SettingOutlined />}
          onClick={() => setWireSettingsOpen(true)}
          block
        >
          {t('sidebar.tools.wireInstallationButton')}
        </Button>
        <Typography.Text type="secondary">
          {t('sidebar.tools.wireInstallationDescription')}
        </Typography.Text>
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
      <Drawer
        title={t('sidebar.tools.wireInstallationTitle')}
        open={wireSettingsOpen}
        onClose={() => setWireSettingsOpen(false)}
        width={360}
      >
        <Form layout="vertical">
          <Form.Item label={t('sidebar.tools.wireInstallationTypeLabel')}>
            <Select
              value={wireAmpacitySettings.installation}
              options={[
                {
                  value: 'surface',
                  label: t('sidebar.tools.wireInstallationTypes.surface'),
                },
                {
                  value: 'conduit',
                  label: t('sidebar.tools.wireInstallationTypes.conduit'),
                },
                {
                  value: 'insulatedWall',
                  label: t('sidebar.tools.wireInstallationTypes.insulatedWall'),
                },
              ]}
              onChange={(installation) => setWireAmpacitySettings({
                ...wireAmpacitySettings,
                installation,
              })}
            />
          </Form.Item>
          <Form.Item label={t('sidebar.tools.ambientTemperatureLabel')}>
            <InputNumber
              min={10}
              max={60}
              step={1}
              addonAfter="°C"
              value={wireAmpacitySettings.ambientTempC}
              onChange={(ambientTempC) => setWireAmpacitySettings({
                ...wireAmpacitySettings,
                ambientTempC: ambientTempC ?? 25,
              })}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
