import { useState, type CSSProperties } from 'react';

import { useTranslation } from "react-i18next";

import type { CollapseProps } from 'antd';
import { Collapse, theme } from 'antd';

import {ComponentPage} from './ComponentPage';
import {ImportExportPage} from './ImportExportPage';
import {DiagramCheckPage} from './DiagramCheckPage';
import {ToolsPage} from './ToolsPage';
import { SimulationPage } from '../simulation/SimulationPage';

const Sidebar = () => {
  const {t} = useTranslation(['main']);
  const [activePanelKeys, setActivePanelKeys] = useState<string | string[]>(['2']);

  const { token } = theme.useToken();
  const isDiagramCheckOpen = Array.isArray(activePanelKeys)
    ? activePanelKeys.includes('3')
    : activePanelKeys === '3';

  const panelStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 0,
    borderBottomColor: token.colorBorder,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  };
  
  const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
  {
    key: '1',
    label: <span>{t('sidebar.export.title')}</span>,
    children: <ImportExportPage />,
    style: panelStyle,
  },
  {
    key: '2',
    label: <span>{t('sidebar.components.title')}</span>,
    children: <ComponentPage />,
    style: panelStyle,
  },
  {
    key: '3',
    label: <span>{t('sidebar.check.title')}</span>,
    children: <DiagramCheckPage isOpen={isDiagramCheckOpen} />,
    style: panelStyle,
  },
  {
    key: '4',
    label: <span>{t('sidebar.simulation.title')}</span>,
    children: <SimulationPage />,
    style: panelStyle,
  },
  {
    key: '5',
    label: <span>{t('sidebar.tools.title')}</span>,
    children: <ToolsPage />,
    style: panelStyle,
  },
];

  return (
    <Collapse 
      accordion ghost
      activeKey={activePanelKeys}
      items={getItems(panelStyle)}
      onChange={setActivePanelKeys}
      />
  );
};

export default Sidebar;
