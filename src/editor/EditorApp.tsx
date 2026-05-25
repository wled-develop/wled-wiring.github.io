import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  ConfigProvider,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
  theme,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  DownloadOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import '../i18n';
import LocaleSwitcher from '../utils/LocaleSwitcher';
import { edgeTypes } from '../wires';
import { nodeTypes } from '../components';
import type {
  ComponentDefinition,
  ComponentFieldDefinition,
  ComponentHandleDefinition,
  ComponentInternalConnectionDefinition,
  ComponentPackage,
  ComponentRuntimeDefinition,
} from '../components/catalog/componentSchema';
import { getAllComponentDefinitions } from '../components/catalog/componentRegistry';
import { createReactFlowTemplate, normalizeComponentPackage } from '../components/catalog/normalizeComponent';
import {
  KNOWN_COMPONENT_GROUPS,
  validateComponentPackage,
  type ComponentValidationIssue,
} from '../components/catalog/validateComponent';

const LOCAL_STORAGE_KEY = 'wled-wiring-component-editor-drafts-v1';

const { TextArea } = Input;

type DraftEntry = {
  id: string;
  updatedAt: string;
  componentPackage: ComponentPackage;
};

const createEmptyPackage = (): ComponentPackage => ({
  schemaVersion: 1,
  source: {type: 'local'},
  component: {
    id: 'MyComponent',
    version: 1,
    display: {
      name: {default: 'My component'},
      descriptionShort: {default: 'Short component description'},
      description: {default: ''},
      group: 'others',
    },
    geometry: {
      image: {
        url: './my-component.png',
        width: 120,
        height: 80,
      },
      rotation: 0,
      rotatable: true,
      resizableX: false,
      resizableY: false,
      borderWidth: 2,
    },
    handles: [],
  },
});

const clonePackageForLocalEdit = (componentPackage: ComponentPackage): ComponentPackage => ({
  ...structuredClone(componentPackage),
  source: {type: 'local', packageId: `local-${componentPackage.component.id}`},
});

const readDrafts = (): DraftEntry[] => {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeDrafts = (drafts: DraftEntry[]) => {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(drafts));
};

const packageDraftId = (componentPackage: ComponentPackage) => (
  `${componentPackage.source.type}:${'packageId' in componentPackage.source ? componentPackage.source.packageId ?? '' : ''}:${componentPackage.component.id}`
);

const localizedTextToInput = (value: ComponentDefinition['display']['name'] | undefined): string => {
  if (typeof value === 'string') return value;
  return value?.default ?? '';
};

const inputToLocalizedText = (value: string) => ({default: value});

const safeJsonParse = <Value,>(value: string): {ok: true; value: Value} | {ok: false; message: string} => {
  try {
    return {ok: true, value: JSON.parse(value) as Value};
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};

const formatJson = (value: unknown) => JSON.stringify(value ?? null, null, 2);

const downloadPackage = (componentPackage: ComponentPackage) => {
  const blob = new Blob([`${JSON.stringify(componentPackage, null, 2)}\n`], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${componentPackage.component.id || 'component'}.component.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

const validationColumns: ColumnsType<ComponentValidationIssue & {key: string}> = [
  {
    title: 'Severity',
    dataIndex: 'severity',
    key: 'severity',
    width: 96,
    render: (severity: ComponentValidationIssue['severity']) => (
      <Tag color={severity === 'error' ? 'red' : 'orange'}>{severity}</Tag>
    ),
  },
  {
    title: 'Path',
    dataIndex: 'path',
    key: 'path',
    width: 260,
  },
  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
  },
];

const useJsonSection = <Value,>(
  value: Value,
  onApply: (value: Value) => void,
  errorPrefix: string,
) => {
  const [text, setText] = useState(formatJson(value));
  const [error, setError] = useState<string | undefined>();

  const reset = (nextValue: Value) => {
    setText(formatJson(nextValue));
    setError(undefined);
  };

  const apply = () => {
    const parsed = safeJsonParse<Value>(text);
    if (!parsed.ok) {
      setError(`${errorPrefix}: ${parsed.message}`);
      return false;
    }
    setError(undefined);
    onApply(parsed.value);
    return true;
  };

  return {text, setText, error, apply, reset};
};

type JsonSectionProps = {
  title: string;
  description: string;
  text: string;
  error?: string;
  onChange: (value: string) => void;
  onApply: () => void;
};

const JsonSection = ({title, description, text, error, onChange, onApply}: JsonSectionProps) => (
  <Flex vertical gap={8}>
    <Typography.Text strong>{title}</Typography.Text>
    <Typography.Text type="secondary">{description}</Typography.Text>
    {error && <Alert type="error" message={error} showIcon />}
    <TextArea
      value={text}
      onChange={(event) => onChange(event.target.value)}
      autoSize={{minRows: 12, maxRows: 24}}
      spellCheck={false}
      style={{fontFamily: 'Consolas, monospace'}}
    />
    <Button onClick={onApply}>{title}</Button>
  </Flex>
);

const ComponentEditorContent = () => {
  const {t} = useTranslation(['main']);
  const {token} = theme.useToken();
  const [messageApi, messageContextHolder] = message.useMessage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [componentPackage, setComponentPackage] = useState<ComponentPackage>(createEmptyPackage());
  const [drafts, setDrafts] = useState<DraftEntry[]>(readDrafts);

  const coreDefinitions = useMemo(() => getAllComponentDefinitions(), []);
  const validation = useMemo(() => validateComponentPackage(componentPackage), [componentPackage]);

  const previewTemplate = useMemo(() => {
    if (!validation.valid) return undefined;
    try {
      return createReactFlowTemplate(normalizeComponentPackage(componentPackage));
    } catch {
      return undefined;
    }
  }, [componentPackage, validation.valid]);

  const handlesJson = useJsonSection<ComponentHandleDefinition[]>(
    componentPackage.component.handles,
    (handles) => setComponentPackage((current) => ({
      ...current,
      component: {...current.component, handles},
    })),
    t('componentEditor.messages.invalidJson'),
  );

  const fieldsJson = useJsonSection<ComponentFieldDefinition[]>(
    componentPackage.component.fields ?? [],
    (fields) => setComponentPackage((current) => ({
      ...current,
      component: {...current.component, fields: fields.length > 0 ? fields : undefined},
    })),
    t('componentEditor.messages.invalidJson'),
  );

  const connectionsJson = useJsonSection<ComponentInternalConnectionDefinition[]>(
    componentPackage.component.internalConnections ?? [],
    (internalConnections) => setComponentPackage((current) => ({
      ...current,
      component: {
        ...current.component,
        internalConnections: internalConnections.length > 0 ? internalConnections : undefined,
      },
    })),
    t('componentEditor.messages.invalidJson'),
  );

  const simulationJson = useJsonSection<ComponentPackage['component']['simulation'] | null>(
    componentPackage.component.simulation ?? null,
    (simulation) => setComponentPackage((current) => ({
      ...current,
      component: {...current.component, simulation: simulation ?? undefined},
    })),
    t('componentEditor.messages.invalidJson'),
  );

  const runtimeJson = useJsonSection<ComponentRuntimeDefinition | null>(
    componentPackage.component.runtime ?? null,
    (runtime) => setComponentPackage((current) => ({
      ...current,
      component: {...current.component, runtime: runtime ?? undefined},
    })),
    t('componentEditor.messages.invalidJson'),
  );

  const resetJsonSections = (nextPackage: ComponentPackage) => {
    handlesJson.reset(nextPackage.component.handles);
    fieldsJson.reset(nextPackage.component.fields ?? []);
    connectionsJson.reset(nextPackage.component.internalConnections ?? []);
    simulationJson.reset(nextPackage.component.simulation ?? null);
    runtimeJson.reset(nextPackage.component.runtime ?? null);
  };

  const replacePackage = (nextPackage: ComponentPackage) => {
    setComponentPackage(nextPackage);
    resetJsonSections(nextPackage);
  };

  const updateComponent = (updater: (component: ComponentDefinition) => ComponentDefinition) => {
    setComponentPackage((current) => ({
      ...current,
      component: updater(current.component),
    }));
  };

  const saveDraft = () => {
    const entry: DraftEntry = {
      id: packageDraftId(componentPackage),
      updatedAt: new Date().toISOString(),
      componentPackage,
    };
    const nextDrafts = drafts.filter((draft) => draft.id !== entry.id).concat(entry);
    setDrafts(nextDrafts);
    writeDrafts(nextDrafts);
    messageApi.success(t('componentEditor.messages.savedLocal'));
  };

  const importFile = (file: File) => {
    file.text()
      .then((content) => {
        const parsed = safeJsonParse<ComponentPackage>(content);
        if (!parsed.ok) {
          messageApi.error(parsed.message);
          return;
        }
        replacePackage(parsed.value);
        messageApi.success(t('componentEditor.messages.imported'));
      })
      .catch(() => messageApi.error(t('componentEditor.messages.importFailed')));
  };

  const validationRows = validation.issues.map((issue, index) => ({...issue, key: String(index)}));
  const previewNodes = previewTemplate
    ? [{
        ...previewTemplate,
        id: 'preview',
        position: {x: 40, y: 40},
      }]
    : [];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.compactAlgorithm,
        token: {fontSize: 14},
      }}
    >
      {messageContextHolder}
      <div className="component-editor-shell">
        <header className="component-editor-header" style={{borderBottomColor: token.colorBorder}}>
          <Flex align="center" gap={8} wrap="wrap">
            <Typography.Title level={3} style={{margin: 0}}>
              {t('componentEditor.title')}
            </Typography.Title>
            <Tag color={validation.valid ? 'green' : 'red'}>
              {validation.valid ? t('componentEditor.valid') : t('componentEditor.invalid')}
            </Tag>
          </Flex>
          <Space wrap>
            <Button icon={<PlusOutlined />} onClick={() => replacePackage(createEmptyPackage())}>
              {t('componentEditor.actions.new')}
            </Button>
            <Select
              showSearch
              placeholder={t('componentEditor.actions.openCore')}
              optionFilterProp="label"
              style={{minWidth: 220}}
              options={coreDefinitions.map((definition) => ({
                value: definition.componentId,
                label: definition.componentId,
              }))}
              onSelect={(componentId) => {
                const definition = coreDefinitions.find((item) => item.componentId === componentId);
                if (definition) replacePackage(clonePackageForLocalEdit(definition.package));
              }}
            />
            <Select
              placeholder={t('componentEditor.actions.openLocal')}
              style={{minWidth: 220}}
              options={drafts.map((draft) => ({
                value: draft.id,
                label: `${draft.componentPackage.component.id} (${new Date(draft.updatedAt).toLocaleString()})`,
              }))}
              onSelect={(draftId) => {
                const draft = drafts.find((item) => item.id === draftId);
                if (draft) replacePackage(structuredClone(draft.componentPackage));
              }}
            />
            <Button icon={<SaveOutlined />} onClick={saveDraft}>
              {t('componentEditor.actions.saveLocal')}
            </Button>
            <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>
              {t('componentEditor.actions.importJson')}
            </Button>
            <Button icon={<DownloadOutlined />} onClick={() => downloadPackage(componentPackage)}>
              {t('componentEditor.actions.exportJson')}
            </Button>
            <Button icon={<FolderOpenOutlined />} href="./">
              {t('componentEditor.actions.backToDesigner')}
            </Button>
            <LocaleSwitcher />
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json,.component.json"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) importFile(file);
              }}
            />
          </Space>
        </header>

        <main className="component-editor-main">
          <section className="component-editor-form">
            <Tabs
              items={[
                {
                  key: 'basics',
                  label: t('componentEditor.tabs.basics'),
                  children: (
                    <Form layout="vertical">
                      <Form.Item label={t('componentEditor.fields.id')}>
                        <Input
                          value={componentPackage.component.id}
                          onChange={(event) => {
                            updateComponent((component) => ({...component, id: event.target.value}));
                          }}
                        />
                      </Form.Item>
                      <Form.Item label={t('componentEditor.fields.version')}>
                        <InputNumber
                          min={1}
                          precision={0}
                          value={componentPackage.component.version}
                          onChange={(value) => {
                            updateComponent((component) => ({...component, version: value ?? 1}));
                          }}
                          style={{width: '100%'}}
                        />
                      </Form.Item>
                      <Form.Item label={t('componentEditor.fields.name')}>
                        <Input
                          value={localizedTextToInput(componentPackage.component.display.name)}
                          onChange={(event) => {
                            updateComponent((component) => ({
                              ...component,
                              display: {...component.display, name: inputToLocalizedText(event.target.value)},
                            }));
                          }}
                        />
                      </Form.Item>
                      <Form.Item label={t('componentEditor.fields.descriptionShort')}>
                        <Input
                          value={localizedTextToInput(componentPackage.component.display.descriptionShort)}
                          onChange={(event) => {
                            updateComponent((component) => ({
                              ...component,
                              display: {
                                ...component.display,
                                descriptionShort: inputToLocalizedText(event.target.value),
                              },
                            }));
                          }}
                        />
                      </Form.Item>
                      <Form.Item label={t('componentEditor.fields.description')}>
                        <TextArea
                          value={localizedTextToInput(componentPackage.component.display.description)}
                          autoSize={{minRows: 3, maxRows: 8}}
                          onChange={(event) => {
                            updateComponent((component) => ({
                              ...component,
                              display: {
                                ...component.display,
                                description: inputToLocalizedText(event.target.value),
                              },
                            }));
                          }}
                        />
                      </Form.Item>
                      <Form.Item label={t('componentEditor.fields.group')}>
                        <Select
                          value={componentPackage.component.display.group}
                          options={KNOWN_COMPONENT_GROUPS.map((group) => ({value: group, label: group}))}
                          onChange={(group) => {
                            updateComponent((component) => ({
                              ...component,
                              display: {...component.display, group},
                            }));
                          }}
                        />
                      </Form.Item>
                      <Checkbox
                        checked={componentPackage.component.display.showName}
                        onChange={(event) => {
                          updateComponent((component) => ({
                            ...component,
                            display: {...component.display, showName: event.target.checked},
                          }));
                        }}
                      >
                        {t('componentEditor.fields.showName')}
                      </Checkbox>
                    </Form>
                  ),
                },
                {
                  key: 'geometry',
                  label: t('componentEditor.tabs.geometry'),
                  children: (
                    <Form layout="vertical">
                      <Form.Item label={t('componentEditor.fields.imageUrl')}>
                        <Input
                          value={componentPackage.component.geometry.image?.url}
                          onChange={(event) => {
                            updateComponent((component) => ({
                              ...component,
                              geometry: {
                                ...component.geometry,
                                image: {
                                  url: event.target.value,
                                  width: component.geometry.image?.width ?? 120,
                                  height: component.geometry.image?.height ?? 80,
                                },
                              },
                            }));
                          }}
                        />
                      </Form.Item>
                      <Flex gap={8}>
                        <Form.Item label={t('componentEditor.fields.imageWidth')} style={{flex: 1}}>
                          <InputNumber
                            min={1}
                            value={componentPackage.component.geometry.image?.width}
                            onChange={(value) => {
                              updateComponent((component) => ({
                                ...component,
                                geometry: {
                                  ...component.geometry,
                                  image: {
                                    url: component.geometry.image?.url ?? '',
                                    width: value ?? 1,
                                    height: component.geometry.image?.height ?? 80,
                                  },
                                },
                              }));
                            }}
                            style={{width: '100%'}}
                          />
                        </Form.Item>
                        <Form.Item label={t('componentEditor.fields.imageHeight')} style={{flex: 1}}>
                          <InputNumber
                            min={1}
                            value={componentPackage.component.geometry.image?.height}
                            onChange={(value) => {
                              updateComponent((component) => ({
                                ...component,
                                geometry: {
                                  ...component.geometry,
                                  image: {
                                    url: component.geometry.image?.url ?? '',
                                    width: component.geometry.image?.width ?? 120,
                                    height: value ?? 1,
                                  },
                                },
                              }));
                            }}
                            style={{width: '100%'}}
                          />
                        </Form.Item>
                      </Flex>
                      <Flex gap={8}>
                        <Form.Item label={t('componentEditor.fields.rotation')} style={{flex: 1}}>
                          <InputNumber
                            value={componentPackage.component.geometry.rotation}
                            onChange={(value) => {
                              updateComponent((component) => ({
                                ...component,
                                geometry: {...component.geometry, rotation: value ?? 0},
                              }));
                            }}
                            style={{width: '100%'}}
                          />
                        </Form.Item>
                        <Form.Item label={t('componentEditor.fields.borderWidth')} style={{flex: 1}}>
                          <InputNumber
                            min={0}
                            value={componentPackage.component.geometry.borderWidth}
                            onChange={(value) => {
                              updateComponent((component) => ({
                                ...component,
                                geometry: {...component.geometry, borderWidth: value ?? 0},
                              }));
                            }}
                            style={{width: '100%'}}
                          />
                        </Form.Item>
                        <Form.Item label={t('componentEditor.fields.lengthStep')} style={{flex: 1}}>
                          <InputNumber
                            min={0}
                            value={componentPackage.component.physical?.lengthStep}
                            onChange={(value) => {
                              updateComponent((component) => ({
                                ...component,
                                physical: value === null || value === undefined ? undefined : {lengthStep: value},
                              }));
                            }}
                            style={{width: '100%'}}
                          />
                        </Form.Item>
                      </Flex>
                      <Space wrap>
                        <Checkbox
                          checked={componentPackage.component.geometry.rotatable}
                          onChange={(event) => {
                            updateComponent((component) => ({
                              ...component,
                              geometry: {...component.geometry, rotatable: event.target.checked},
                            }));
                          }}
                        >
                          {t('componentEditor.fields.rotatable')}
                        </Checkbox>
                        <Checkbox
                          checked={componentPackage.component.geometry.resizableX}
                          onChange={(event) => {
                            updateComponent((component) => ({
                              ...component,
                              geometry: {...component.geometry, resizableX: event.target.checked},
                            }));
                          }}
                        >
                          {t('componentEditor.fields.resizableX')}
                        </Checkbox>
                        <Checkbox
                          checked={componentPackage.component.geometry.resizableY}
                          onChange={(event) => {
                            updateComponent((component) => ({
                              ...component,
                              geometry: {...component.geometry, resizableY: event.target.checked},
                            }));
                          }}
                        >
                          {t('componentEditor.fields.resizableY')}
                        </Checkbox>
                        <Checkbox
                          checked={componentPackage.component.geometry.noBackgroundImage}
                          onChange={(event) => {
                            updateComponent((component) => ({
                              ...component,
                              geometry: {...component.geometry, noBackgroundImage: event.target.checked},
                            }));
                          }}
                        >
                          {t('componentEditor.fields.noBackgroundImage')}
                        </Checkbox>
                      </Space>
                    </Form>
                  ),
                },
                {
                  key: 'handles',
                  label: t('componentEditor.tabs.handles'),
                  children: (
                    <JsonSection
                      title={t('componentEditor.sections.applyHandles')}
                      description={t('componentEditor.sections.handlesDescription')}
                      text={handlesJson.text}
                      error={handlesJson.error}
                      onChange={handlesJson.setText}
                      onApply={handlesJson.apply}
                    />
                  ),
                },
                {
                  key: 'fields',
                  label: t('componentEditor.tabs.fields'),
                  children: (
                    <JsonSection
                      title={t('componentEditor.sections.applyFields')}
                      description={t('componentEditor.sections.fieldsDescription')}
                      text={fieldsJson.text}
                      error={fieldsJson.error}
                      onChange={fieldsJson.setText}
                      onApply={fieldsJson.apply}
                    />
                  ),
                },
                {
                  key: 'connections',
                  label: t('componentEditor.tabs.connections'),
                  children: (
                    <JsonSection
                      title={t('componentEditor.sections.applyConnections')}
                      description={t('componentEditor.sections.connectionsDescription')}
                      text={connectionsJson.text}
                      error={connectionsJson.error}
                      onChange={connectionsJson.setText}
                      onApply={connectionsJson.apply}
                    />
                  ),
                },
                {
                  key: 'simulation',
                  label: t('componentEditor.tabs.simulation'),
                  children: (
                    <JsonSection
                      title={t('componentEditor.sections.applySimulation')}
                      description={t('componentEditor.sections.simulationDescription')}
                      text={simulationJson.text}
                      error={simulationJson.error}
                      onChange={simulationJson.setText}
                      onApply={simulationJson.apply}
                    />
                  ),
                },
                {
                  key: 'runtime',
                  label: t('componentEditor.tabs.runtime'),
                  children: (
                    <JsonSection
                      title={t('componentEditor.sections.applyRuntime')}
                      description={t('componentEditor.sections.runtimeDescription')}
                      text={runtimeJson.text}
                      error={runtimeJson.error}
                      onChange={runtimeJson.setText}
                      onApply={runtimeJson.apply}
                    />
                  ),
                },
              ]}
            />
          </section>

          <aside className="component-editor-preview">
            <Typography.Title level={4}>{t('componentEditor.preview.title')}</Typography.Title>
            <div className="component-editor-flow" style={{borderColor: token.colorBorder}}>
              <ReactFlow
                nodes={previewNodes}
                edges={[]}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
              >
                <Background variant={BackgroundVariant.Dots} gap={16} />
                <Controls />
              </ReactFlow>
            </div>
            <Divider />
            <Typography.Title level={4}>{t('componentEditor.validation.title')}</Typography.Title>
            {validationRows.length === 0 ? (
              <Alert type="success" message={t('componentEditor.validation.noIssues')} showIcon />
            ) : (
              <Table
                size="small"
                columns={validationColumns}
                dataSource={validationRows}
                pagination={false}
                scroll={{x: 520}}
              />
            )}
          </aside>
        </main>
      </div>
    </ConfigProvider>
  );
};

const EditorApp = () => (
  <ReactFlowProvider>
    <ComponentEditorContent />
  </ReactFlowProvider>
);

export default EditorApp;
