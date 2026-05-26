import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Card,
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
  DeleteOutlined,
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
  KNOWN_HANDLE_FUNCTIONS,
  validateComponentPackage,
  type ComponentValidationIssue,
} from '../components/catalog/validateComponent';
import type {
  ComponentSimulationElementType,
  ComponentSimulationElementUse,
  SimulationParameterPrimitive,
  SimulationParameterRef,
} from '../simulation/simulationTypes';

const LOCAL_STORAGE_KEY = 'wled-wiring-component-editor-drafts-v1';

const { TextArea } = Input;

const HANDLE_TYPE_OPTIONS = ['source', 'target'].map((value) => ({value, label: value}));
const HANDLE_ALIGN_OPTIONS = ['start', 'end'].map((value) => ({value, label: value}));
const HANDLE_POSTYPE_OPTIONS = ['centered', 'top', 'bottom', 'left', 'right'].map((value) => ({value, label: value}));
const HANDLE_POSITION_OPTIONS = ['left', 'right', 'top', 'bottom'].map((value) => ({value, label: value}));
const CONNECTION_KIND_OPTIONS = ['short', 'fuse'].map((value) => ({value, label: value}));
const FIELD_TYPE_OPTIONS = ['number', 'select'].map((value) => ({value, label: value}));
const SIMULATION_ELEMENT_TYPES: ComponentSimulationElementType[] = [
  'resistor',
  'shortBridge',
  'voltageSource',
  'currentSource',
  'constantPowerSink',
  'fuse',
  'digitalLed',
  'dcdcConverter',
];

const SIMULATION_ELEMENT_DEFINITIONS: Record<
  ComponentSimulationElementType,
  {terminals: string[]; parameters: string[]}
> = {
  resistor: {terminals: ['a', 'b'], parameters: ['resistanceOhm']},
  shortBridge: {terminals: ['a', 'b'], parameters: []},
  voltageSource: {
    terminals: ['positive', 'negative'],
    parameters: ['voltageV', 'currentLimitA', 'voltageDropPctAt150Current'],
  },
  currentSource: {terminals: ['positive', 'negative'], parameters: ['currentA']},
  constantPowerSink: {terminals: ['positive', 'negative'], parameters: ['powerW', 'minVoltageV']},
  fuse: {terminals: ['a', 'b'], parameters: ['resistanceOhm', 'nominalCurrentA']},
  digitalLed: {
    terminals: ['supplyIn', 'supplyOut', 'gndIn', 'gndOut'],
    parameters: [
      'supplyResistanceOhm',
      'gndResistanceOhm',
      'ledType',
      'ledsPerMeter',
      'physLedsPerLogicLed',
      'currentCurve',
    ],
  },
  dcdcConverter: {
    terminals: ['inPositive', 'inNegative', 'outPositive', 'outNegative'],
    parameters: ['outputVoltageV', 'efficiency', 'outputCurrentLimitA', 'voltageDropPctAt150Current'],
  },
};

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

  useEffect(() => {
    setText(formatJson(value));
    setError(undefined);
  }, [value]);

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

type StructuredSectionProps = {
  ui: React.ReactNode;
  json: React.ReactNode;
};

const StructuredSection = ({ui, json}: StructuredSectionProps) => {
  const {t} = useTranslation(['main']);

  return (
    <Tabs
      items={[
        {key: 'ui', label: t('componentEditor.editorModes.ui'), children: ui},
        {key: 'json', label: t('componentEditor.editorModes.json'), children: json},
      ]}
    />
  );
};

const handleOptions = (handles: ComponentHandleDefinition[]) => (
  handles.map((handle) => ({value: handle.id, label: handle.id || '(empty)'}))
);

const updateArrayItem = <Value,>(
  values: Value[],
  index: number,
  updater: (value: Value) => Value,
): Value[] => values.map((value, itemIndex) => (itemIndex === index ? updater(value) : value));

const removeArrayItem = <Value,>(values: Value[], index: number): Value[] => (
  values.filter((_, itemIndex) => itemIndex !== index)
);

const toPrimitive = (value: string, type: 'number' | 'string' | 'boolean'): SimulationParameterPrimitive => {
  if (type === 'number') return Number(value) || 0;
  if (type === 'boolean') return value === 'true';
  return value;
};

const getParameterKind = (value: SimulationParameterRef): string => {
  if (typeof value !== 'object' || value === null) return typeof value;
  if ('const' in value) return 'const';
  if ('field' in value) return 'field';
  if ('select' in value) return 'select';
  if ('ledSimulationOption' in value) return 'ledSimulationOption';
  return 'json';
};

type ParameterRefEditorProps = {
  value: SimulationParameterRef;
  fields: ComponentFieldDefinition[];
  onChange: (value: SimulationParameterRef) => void;
};

const ParameterJsonTextArea = ({value, onChange}: ParameterRefEditorProps) => {
  const [text, setText] = useState(formatJson(value));

  useEffect(() => {
    setText(formatJson(value));
  }, [value]);

  return (
    <TextArea
      value={text}
      autoSize={{minRows: 2, maxRows: 6}}
      style={{fontFamily: 'Consolas, monospace', width: 320}}
      onChange={(event) => setText(event.target.value)}
      onBlur={() => {
        const parsed = safeJsonParse<SimulationParameterRef>(text);
        if (parsed.ok) onChange(parsed.value);
      }}
    />
  );
};

const ParameterRefEditor = ({value, fields, onChange}: ParameterRefEditorProps) => {
  const kind = getParameterKind(value);
  const fieldOptions = fields.map((field) => ({value: field.id, label: field.id}));
  const selectFieldOptions = fields
    .filter((field) => field.type === 'select')
    .map((field) => ({value: field.id, label: field.id}));
  const primitiveType: 'number' | 'string' | 'boolean' = typeof value === 'boolean'
    ? 'boolean'
    : typeof value === 'string'
      ? 'string'
      : 'number';
  const primitiveValue = typeof value === 'object' && value !== null && 'const' in value ? value.const : value;

  return (
    <Flex gap={8} wrap="wrap" align="start">
      <Select
        value={kind}
        style={{width: 148}}
        options={[
          {value: 'number', label: 'number'},
          {value: 'string', label: 'string'},
          {value: 'boolean', label: 'boolean'},
          {value: 'const', label: 'const'},
          {value: 'field', label: 'field'},
          {value: 'select', label: 'select'},
          {value: 'ledSimulationOption', label: 'LED option'},
          {value: 'json', label: 'JSON'},
        ]}
        onChange={(nextKind) => {
          if (nextKind === 'number') onChange(0);
          else if (nextKind === 'string') onChange('');
          else if (nextKind === 'boolean') onChange(false);
          else if (nextKind === 'const') onChange({const: 0});
          else if (nextKind === 'field') onChange({field: fields[0]?.id ?? ''});
          else if (nextKind === 'select') onChange({select: selectFieldOptions[0]?.value ?? ''});
          else if (nextKind === 'ledSimulationOption') onChange({ledSimulationOption: 'supplyResistance'});
          else onChange({const: 0});
        }}
      />
      {(kind === 'number' || kind === 'string' || kind === 'boolean') && (
        <>
          <Select
            value={primitiveType}
            style={{width: 104}}
            options={[
              {value: 'number', label: 'number'},
              {value: 'string', label: 'string'},
              {value: 'boolean', label: 'boolean'},
            ]}
            onChange={(nextType) => onChange(toPrimitive(String(value), nextType))}
          />
          {primitiveType === 'boolean' ? (
            <Checkbox checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
          ) : (
            <Input
              value={String(value)}
              onChange={(event) => onChange(toPrimitive(event.target.value, primitiveType))}
              style={{width: 180}}
            />
          )}
        </>
      )}
      {kind === 'const' && typeof value === 'object' && value !== null && 'const' in value && (
        <Input
          value={String(primitiveValue)}
          onChange={(event) => {
            const constType = typeof primitiveValue === 'boolean'
              ? 'boolean'
              : typeof primitiveValue === 'string'
                ? 'string'
                : 'number';
            onChange({const: toPrimitive(event.target.value, constType)});
          }}
          style={{width: 180}}
        />
      )}
      {kind === 'field' && typeof value === 'object' && value !== null && 'field' in value && (
        <Select
          value={value.field}
          options={fieldOptions}
          style={{width: 220}}
          onChange={(field) => onChange({...value, field})}
        />
      )}
      {kind === 'select' && typeof value === 'object' && value !== null && 'select' in value && (
        <Select
          value={value.select}
          options={selectFieldOptions}
          style={{width: 220}}
          onChange={(select) => onChange({...value, select})}
        />
      )}
      {kind === 'ledSimulationOption' && typeof value === 'object' && value !== null && 'ledSimulationOption' in value && (
        <Select
          value={value.ledSimulationOption}
          options={[
            {value: 'supplyResistance', label: 'supplyResistance'},
            {value: 'gndResistance', label: 'gndResistance'},
            {value: 'currentCurve', label: 'currentCurve'},
          ]}
          style={{width: 220}}
          onChange={(ledSimulationOption) => onChange({ledSimulationOption})}
        />
      )}
      {kind === 'json' && (
        <ParameterJsonTextArea value={value} fields={fields} onChange={onChange} />
      )}
    </Flex>
  );
};

type HandlesEditorProps = {
  handles: ComponentHandleDefinition[];
  fields: ComponentFieldDefinition[];
  onChange: (handles: ComponentHandleDefinition[]) => void;
};

const HandlesEditor = ({handles, fields, onChange}: HandlesEditorProps) => {
  const {t} = useTranslation(['main']);
  const fieldOptions = fields.map((field) => ({value: field.id, label: field.id}));

  const createHandle = (): ComponentHandleDefinition => ({
    id: `handle_${handles.length + 1}`,
    name: {default: `Handle ${handles.length + 1}`},
    type: 'source',
    x: 0,
    y: 0,
    xalign: 'start',
    yalign: 'start',
    width: 6,
    height: 6,
    postype: 'centered',
    position: 'left',
    border: {type: 'solid', color: '#000000', lineWidth: 1, radius: '30%'},
  });

  return (
    <Flex vertical gap={8}>
      <Button icon={<PlusOutlined />} onClick={() => onChange(handles.concat(createHandle()))}>
        {t('componentEditor.actions.addHandle')}
      </Button>
      {handles.map((handle, index) => (
        <Card
          key={`${handle.id}-${index}`}
          size="small"
          title={handle.id || t('componentEditor.labels.unnamed')}
          extra={(
            <Button
              icon={<DeleteOutlined />}
              onClick={() => onChange(removeArrayItem(handles, index))}
            />
          )}
        >
          <Form layout="vertical">
            <Flex gap={8} wrap="wrap">
              <Form.Item label={t('componentEditor.fields.handleId')} style={{flex: '1 1 160px'}}>
                <Input
                  value={handle.id}
                  onChange={(event) => onChange(updateArrayItem(handles, index, (item) => ({...item, id: event.target.value})))}
                />
              </Form.Item>
              <Form.Item label={t('componentEditor.fields.name')} style={{flex: '1 1 180px'}}>
                <Input
                  value={localizedTextToInput(handle.name)}
                  onChange={(event) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    name: inputToLocalizedText(event.target.value),
                  })))}
                />
              </Form.Item>
              <Form.Item label={t('componentEditor.fields.handleType')} style={{width: 120}}>
                <Select
                  value={handle.type}
                  options={HANDLE_TYPE_OPTIONS}
                  onChange={(type) => onChange(updateArrayItem(handles, index, (item) => ({...item, type})))}
                />
              </Form.Item>
            </Flex>
            <Flex gap={8} wrap="wrap">
              {(['x', 'y', 'width', 'height'] as const).map((key) => (
                <Form.Item key={key} label={key} style={{width: 108}}>
                  <InputNumber
                    value={handle[key]}
                    onChange={(value) => onChange(updateArrayItem(handles, index, (item) => ({
                      ...item,
                      [key]: value ?? 0,
                    })))}
                    style={{width: '100%'}}
                  />
                </Form.Item>
              ))}
              <Form.Item label="xalign" style={{width: 112}}>
                <Select
                  value={handle.xalign}
                  options={HANDLE_ALIGN_OPTIONS}
                  onChange={(xalign) => onChange(updateArrayItem(handles, index, (item) => ({...item, xalign})))}
                />
              </Form.Item>
              <Form.Item label="yalign" style={{width: 112}}>
                <Select
                  value={handle.yalign}
                  options={HANDLE_ALIGN_OPTIONS}
                  onChange={(yalign) => onChange(updateArrayItem(handles, index, (item) => ({...item, yalign})))}
                />
              </Form.Item>
              <Form.Item label="postype" style={{width: 132}}>
                <Select
                  value={handle.postype}
                  options={HANDLE_POSTYPE_OPTIONS}
                  onChange={(postype) => onChange(updateArrayItem(handles, index, (item) => ({...item, postype})))}
                />
              </Form.Item>
              <Form.Item label="position" style={{width: 132}}>
                <Select
                  value={handle.position}
                  options={HANDLE_POSITION_OPTIONS}
                  onChange={(position) => onChange(updateArrayItem(handles, index, (item) => ({...item, position})))}
                />
              </Form.Item>
            </Flex>
            <Form.Item label={t('componentEditor.fields.functions')}>
              <Select
                mode="multiple"
                value={handle.functions ?? []}
                options={KNOWN_HANDLE_FUNCTIONS.map((value) => ({value, label: value}))}
                onChange={(functions) => onChange(updateArrayItem(handles, index, (item) => ({
                  ...item,
                  functions: functions.length > 0 ? functions : undefined,
                })))}
              />
            </Form.Item>
            <Flex gap={8} wrap="wrap">
              <Form.Item label={t('componentEditor.fields.borderColor')} style={{width: 128}}>
                <Input
                  type="color"
                  value={handle.border?.color ?? '#000000'}
                  onChange={(event) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    border: {...(item.border ?? {type: 'solid', lineWidth: 1, radius: '30%'}), color: event.target.value},
                  })))}
                />
              </Form.Item>
              <Form.Item label={t('componentEditor.fields.borderType')} style={{width: 128}}>
                <Input
                  value={handle.border?.type ?? ''}
                  onChange={(event) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    border: {...(item.border ?? {color: '#000000', lineWidth: 1, radius: '30%'}), type: event.target.value},
                  })))}
                />
              </Form.Item>
              <Form.Item label={t('componentEditor.fields.borderLineWidth')} style={{width: 128}}>
                <InputNumber
                  min={0}
                  value={handle.border?.lineWidth}
                  onChange={(lineWidth) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    border: {...(item.border ?? {type: 'solid', color: '#000000', radius: '30%'}), lineWidth: lineWidth ?? 0},
                  })))}
                  style={{width: '100%'}}
                />
              </Form.Item>
              <Form.Item label={t('componentEditor.fields.borderRadius')} style={{width: 128}}>
                <Input
                  value={handle.border?.radius ?? ''}
                  onChange={(event) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    border: {...(item.border ?? {type: 'solid', color: '#000000', lineWidth: 1}), radius: event.target.value},
                  })))}
                />
              </Form.Item>
            </Flex>
            <Flex gap={8} wrap="wrap">
              <Form.Item label="Vout" style={{width: 120}}>
                <InputNumber
                  value={handle.voltage?.out}
                  onChange={(out) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    voltage: {...(item.voltage ?? {}), out: out ?? undefined},
                  })))}
                  style={{width: '100%'}}
                />
              </Form.Item>
              <Form.Item label="Vout dependency" style={{width: 180}}>
                <Select
                  allowClear
                  value={handle.voltage?.outDependency}
                  options={handleOptions(handles)}
                  onChange={(outDependency) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    voltage: {...(item.voltage ?? {}), outDependency},
                  })))}
                />
              </Form.Item>
              <Form.Item label="Tol min" style={{width: 120}}>
                <InputNumber
                  value={handle.voltage?.toleranceMin}
                  onChange={(toleranceMin) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    voltage: {...(item.voltage ?? {}), toleranceMin: toleranceMin ?? undefined},
                  })))}
                  style={{width: '100%'}}
                />
              </Form.Item>
              <Form.Item label="Tol max" style={{width: 120}}>
                <InputNumber
                  value={handle.voltage?.toleranceMax}
                  onChange={(toleranceMax) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    voltage: {...(item.voltage ?? {}), toleranceMax: toleranceMax ?? undefined},
                  })))}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Flex>
            <Space wrap>
              {(['repeated', 'repeatAtFirst', 'mustBeConnected', 'changeColorAutomatically'] as const).map((key) => (
                <Checkbox
                  key={key}
                  checked={Boolean(handle.behavior?.[key])}
                  onChange={(event) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    behavior: {...(item.behavior ?? {}), [key]: event.target.checked},
                  })))}
                >
                  {key}
                </Checkbox>
              ))}
            </Space>
            <Flex gap={8} wrap="wrap" style={{marginTop: 8}}>
              <Form.Item label="controllableBy" style={{width: 180}}>
                <Select
                  allowClear
                  value={handle.behavior?.controllableBy}
                  options={handleOptions(handles)}
                  onChange={(controllableBy) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    behavior: {...(item.behavior ?? {}), controllableBy},
                  })))}
                />
              </Form.Item>
              <Form.Item label="preferredLineWidth" style={{width: 160}}>
                <InputNumber
                  value={handle.behavior?.preferredLineWidth}
                  onChange={(preferredLineWidth) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    behavior: {...(item.behavior ?? {}), preferredLineWidth: preferredLineWidth ?? undefined},
                  })))}
                  style={{width: '100%'}}
                />
              </Form.Item>
              <Form.Item label="preferredLineDirection" style={{width: 180}}>
                <Select
                  allowClear
                  value={handle.behavior?.preferredLineDirection}
                  options={['up', 'down', 'left', 'right'].map((value) => ({value, label: value}))}
                  onChange={(preferredLineDirection) => onChange(updateArrayItem(handles, index, (item) => ({
                    ...item,
                    behavior: {...(item.behavior ?? {}), preferredLineDirection},
                  })))}
                />
              </Form.Item>
            </Flex>
            <Form.Item label={t('componentEditor.fields.hideConditions')}>
              <Select
                mode="multiple"
                value={(handle.behavior?.hideConditions ?? []).map((condition) => condition.fieldId)}
                options={fieldOptions}
                onChange={(fieldIds) => onChange(updateArrayItem(handles, index, (item) => ({
                  ...item,
                  behavior: {
                    ...(item.behavior ?? {}),
                    hideConditions: fieldIds.map((fieldId) => ({
                      fieldId,
                      values: item.behavior?.hideConditions?.find((condition) => condition.fieldId === fieldId)?.values ?? [],
                    })),
                  },
                })))}
              />
            </Form.Item>
          </Form>
        </Card>
      ))}
    </Flex>
  );
};

type FieldsEditorProps = {
  fields: ComponentFieldDefinition[];
  onChange: (fields: ComponentFieldDefinition[]) => void;
};

const FieldsEditor = ({fields, onChange}: FieldsEditorProps) => {
  const {t} = useTranslation(['main']);
  const createNumberField = (): ComponentFieldDefinition => ({
    id: `field_${fields.length + 1}`,
    type: 'number',
    name: {default: `Field ${fields.length + 1}`},
    value: 0,
    min: 0,
    max: 100,
    step: 1,
  });

  return (
    <Flex vertical gap={8}>
      <Button icon={<PlusOutlined />} onClick={() => onChange(fields.concat(createNumberField()))}>
        {t('componentEditor.actions.addField')}
      </Button>
      {fields.map((field, index) => (
        <Card
          key={`${field.id}-${index}`}
          size="small"
          title={field.id || t('componentEditor.labels.unnamed')}
          extra={<Button icon={<DeleteOutlined />} onClick={() => onChange(removeArrayItem(fields, index))} />}
        >
          <Form layout="vertical">
            <Flex gap={8} wrap="wrap">
              <Form.Item label={t('componentEditor.fields.fieldId')} style={{flex: '1 1 160px'}}>
                <Input
                  value={field.id}
                  onChange={(event) => onChange(updateArrayItem(fields, index, (item) => ({...item, id: event.target.value})))}
                />
              </Form.Item>
              <Form.Item label={t('componentEditor.fields.name')} style={{flex: '1 1 180px'}}>
                <Input
                  value={localizedTextToInput(field.name)}
                  onChange={(event) => onChange(updateArrayItem(fields, index, (item) => ({
                    ...item,
                    name: inputToLocalizedText(event.target.value),
                  })))}
                />
              </Form.Item>
              <Form.Item label={t('componentEditor.fields.fieldType')} style={{width: 132}}>
                <Select
                  value={field.type}
                  options={FIELD_TYPE_OPTIONS}
                  onChange={(type) => onChange(updateArrayItem(fields, index, (item) => (
                    type === 'number'
                      ? {
                          id: item.id,
                          type: 'number',
                          name: item.name,
                          value: 'value' in item ? item.value : 0,
                          min: 0,
                          max: 100,
                          step: 1,
                          unit: item.unit,
                          ui: item.ui,
                        }
                      : {
                          id: item.id,
                          type: 'select',
                          name: item.name,
                          selectedValue: 0,
                          options: [{value: 0, label: {default: 'Option 0'}}],
                          unit: item.unit,
                          ui: item.ui,
                        }
                  )))}
                />
              </Form.Item>
              <Form.Item label={t('componentEditor.fields.unit')} style={{width: 120}}>
                <Input
                  value={field.unit}
                  onChange={(event) => onChange(updateArrayItem(fields, index, (item) => ({
                    ...item,
                    unit: event.target.value || undefined,
                  })))}
                />
              </Form.Item>
            </Flex>
            {field.type === 'number' ? (
              <Flex gap={8} wrap="wrap">
                {(['value', 'min', 'max', 'step'] as const).map((key) => (
                  <Form.Item key={key} label={key} style={{width: 120}}>
                    <InputNumber
                      value={field[key]}
                      onChange={(value) => onChange(updateArrayItem(fields, index, (item) => (
                        item.type === 'number' ? {...item, [key]: value ?? 0} : item
                      )))}
                      style={{width: '100%'}}
                    />
                  </Form.Item>
                ))}
              </Flex>
            ) : (
              <Flex vertical gap={8}>
                <Form.Item label={t('componentEditor.fields.selectedValue')} style={{maxWidth: 220}}>
                  <Select
                    value={field.selectedValue}
                    options={field.options.map((option) => ({value: option.value, label: `${option.value}: ${localizedTextToInput(option.label)}`}))}
                    onChange={(selectedValue) => onChange(updateArrayItem(fields, index, (item) => (
                      item.type === 'select' ? {...item, selectedValue} : item
                    )))}
                  />
                </Form.Item>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => onChange(updateArrayItem(fields, index, (item) => (
                    item.type === 'select'
                      ? {
                          ...item,
                          options: item.options.concat({
                            value: item.options.length,
                            label: {default: `Option ${item.options.length}`},
                          }),
                        }
                      : item
                  )))}
                >
                  {t('componentEditor.actions.addOption')}
                </Button>
                {field.options.map((option, optionIndex) => (
                  <Flex key={`${option.value}-${optionIndex}`} gap={8} wrap="wrap" align="center">
                    <InputNumber
                      value={option.value}
                      onChange={(value) => onChange(updateArrayItem(fields, index, (item) => (
                        item.type === 'select'
                          ? {
                              ...item,
                              options: updateArrayItem(item.options, optionIndex, (current) => ({
                                ...current,
                                value: value ?? 0,
                              })),
                            }
                          : item
                      )))}
                      style={{width: 96}}
                    />
                    <Input
                      value={localizedTextToInput(option.label)}
                      onChange={(event) => onChange(updateArrayItem(fields, index, (item) => (
                        item.type === 'select'
                          ? {
                              ...item,
                              options: updateArrayItem(item.options, optionIndex, (current) => ({
                                ...current,
                                label: inputToLocalizedText(event.target.value),
                              })),
                            }
                          : item
                      )))}
                      style={{width: 220}}
                    />
                    <InputNumber
                      placeholder="x"
                      value={option.x}
                      onChange={(x) => onChange(updateArrayItem(fields, index, (item) => (
                        item.type === 'select'
                          ? {
                              ...item,
                              options: updateArrayItem(item.options, optionIndex, (current) => ({...current, x: x ?? undefined})),
                            }
                          : item
                      )))}
                      style={{width: 96}}
                    />
                    <InputNumber
                      placeholder="y"
                      value={option.y}
                      onChange={(y) => onChange(updateArrayItem(fields, index, (item) => (
                        item.type === 'select'
                          ? {
                              ...item,
                              options: updateArrayItem(item.options, optionIndex, (current) => ({...current, y: y ?? undefined})),
                            }
                          : item
                      )))}
                      style={{width: 96}}
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => onChange(updateArrayItem(fields, index, (item) => (
                        item.type === 'select' ? {...item, options: removeArrayItem(item.options, optionIndex)} : item
                      )))}
                    />
                  </Flex>
                ))}
              </Flex>
            )}
            <Divider style={{margin: '8px 0'}} />
            <Space wrap>
              {(['displayName', 'hide', 'showNameIfSelected', 'customImage'] as const).map((key) => (
                <Checkbox
                  key={key}
                  checked={Boolean(field.ui?.[key])}
                  onChange={(event) => onChange(updateArrayItem(fields, index, (item) => ({
                    ...item,
                    ui: {...(item.ui ?? {}), [key]: event.target.checked},
                  })))}
                >
                  {key}
                </Checkbox>
              ))}
            </Space>
          </Form>
        </Card>
      ))}
    </Flex>
  );
};

type ConnectionsEditorProps = {
  connections: ComponentInternalConnectionDefinition[];
  handles: ComponentHandleDefinition[];
  fields: ComponentFieldDefinition[];
  onChange: (connections: ComponentInternalConnectionDefinition[]) => void;
};

const ConnectionsEditor = ({connections, handles, fields, onChange}: ConnectionsEditorProps) => {
  const {t} = useTranslation(['main']);
  const handleSelectOptions = handleOptions(handles);
  const numberFieldOptions = fields
    .filter((field) => field.type === 'number')
    .map((field) => ({value: field.id, label: field.id}));
  const createConnection = (): ComponentInternalConnectionDefinition => ({
    kind: 'short',
    fromHandle: handles[0]?.id ?? '',
    toHandle: handles[1]?.id ?? handles[0]?.id ?? '',
  });

  return (
    <Flex vertical gap={8}>
      <Button icon={<PlusOutlined />} onClick={() => onChange(connections.concat(createConnection()))}>
        {t('componentEditor.actions.addConnection')}
      </Button>
      {connections.map((connection, index) => (
        <Card
          key={`${connection.kind}-${connection.fromHandle}-${connection.toHandle}-${index}`}
          size="small"
          title={`${connection.kind}: ${connection.fromHandle} -> ${connection.toHandle}`}
          extra={<Button icon={<DeleteOutlined />} onClick={() => onChange(removeArrayItem(connections, index))} />}
        >
          <Flex gap={8} wrap="wrap">
            <Form.Item label={t('componentEditor.fields.connectionKind')} style={{width: 132}}>
              <Select
                value={connection.kind}
                options={CONNECTION_KIND_OPTIONS}
                onChange={(kind) => onChange(updateArrayItem(connections, index, (item) => (
                  kind === 'fuse'
                    ? {
                        kind: 'fuse',
                        fromHandle: item.fromHandle,
                        toHandle: item.toHandle,
                        fuseId: item.kind === 'fuse' ? item.fuseId : `fuse_${index + 1}`,
                      }
                    : {kind: 'short', fromHandle: item.fromHandle, toHandle: item.toHandle}
                )))}
              />
            </Form.Item>
            <Form.Item label={t('componentEditor.fields.fromHandle')} style={{width: 180}}>
              <Select
                value={connection.fromHandle}
                options={handleSelectOptions}
                onChange={(fromHandle) => onChange(updateArrayItem(connections, index, (item) => ({...item, fromHandle})))}
              />
            </Form.Item>
            <Form.Item label={t('componentEditor.fields.toHandle')} style={{width: 180}}>
              <Select
                value={connection.toHandle}
                options={handleSelectOptions}
                onChange={(toHandle) => onChange(updateArrayItem(connections, index, (item) => ({...item, toHandle})))}
              />
            </Form.Item>
            {connection.kind === 'fuse' && (
              <>
                <Form.Item label="fuseId" style={{width: 160}}>
                  <Input
                    value={connection.fuseId}
                    onChange={(event) => onChange(updateArrayItem(connections, index, (item) => (
                      item.kind === 'fuse' ? {...item, fuseId: event.target.value} : item
                    )))}
                  />
                </Form.Item>
                <Form.Item label="nominalCurrent" style={{width: 160}}>
                  <InputNumber
                    value={connection.nominalCurrent}
                    onChange={(nominalCurrent) => onChange(updateArrayItem(connections, index, (item) => (
                      item.kind === 'fuse' ? {...item, nominalCurrent: nominalCurrent ?? undefined} : item
                    )))}
                    style={{width: '100%'}}
                  />
                </Form.Item>
                <Form.Item label="nominalCurrentField" style={{width: 200}}>
                  <Select
                    allowClear
                    value={connection.nominalCurrentField}
                    options={numberFieldOptions}
                    onChange={(nominalCurrentField) => onChange(updateArrayItem(connections, index, (item) => (
                      item.kind === 'fuse' ? {...item, nominalCurrentField} : item
                    )))}
                  />
                </Form.Item>
              </>
            )}
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

type SimulationEditorProps = {
  simulation: ComponentPackage['component']['simulation'] | undefined;
  handles: ComponentHandleDefinition[];
  fields: ComponentFieldDefinition[];
  onChange: (simulation: ComponentPackage['component']['simulation'] | undefined) => void;
};

const defaultParameterValue = (parameter: string): SimulationParameterRef => (
  parameter.toLowerCase().includes('resistance') ? 0.001 : 0
);

const createSimulationElement = (
  type: ComponentSimulationElementType,
  index: number,
  handles: ComponentHandleDefinition[],
): ComponentSimulationElementUse => {
  const definition = SIMULATION_ELEMENT_DEFINITIONS[type];
  const terminals = Object.fromEntries(
    definition.terminals.map((terminal, terminalIndex) => [terminal, handles[terminalIndex]?.id ?? handles[0]?.id ?? '']),
  );
  const parameters = Object.fromEntries(
    definition.parameters.map((parameter) => [parameter, defaultParameterValue(parameter)]),
  );
  return {
    id: `${type}_${index + 1}`,
    type,
    terminals,
    ...(definition.parameters.length > 0 ? {parameters} : {}),
  } as ComponentSimulationElementUse;
};

const SimulationEditor = ({simulation, handles, fields, onChange}: SimulationEditorProps) => {
  const {t} = useTranslation(['main']);
  const elements = simulation?.elements ?? [];
  const handleSelectOptions = handleOptions(handles);
  const setElements = (nextElements: ComponentSimulationElementUse[]) => {
    onChange(nextElements.length > 0 ? {version: 1, elements: nextElements} : undefined);
  };

  return (
    <Flex vertical gap={8}>
      <Button
        icon={<PlusOutlined />}
        onClick={() => setElements(elements.concat(createSimulationElement('resistor', elements.length, handles)))}
      >
        {t('componentEditor.actions.addSimulationElement')}
      </Button>
      {elements.map((element, index) => {
        const definition = SIMULATION_ELEMENT_DEFINITIONS[element.type];
        const parameters = element.parameters ?? {};

        return (
          <Card
            key={`${element.id}-${index}`}
            size="small"
            title={element.id || t('componentEditor.labels.unnamed')}
            extra={<Button icon={<DeleteOutlined />} onClick={() => setElements(removeArrayItem(elements, index))} />}
          >
            <Form layout="vertical">
              <Flex gap={8} wrap="wrap">
                <Form.Item label={t('componentEditor.fields.elementId')} style={{flex: '1 1 180px'}}>
                  <Input
                    value={element.id}
                    onChange={(event) => setElements(updateArrayItem(elements, index, (item) => ({
                      ...item,
                      id: event.target.value,
                    })))}
                  />
                </Form.Item>
                <Form.Item label={t('componentEditor.fields.elementType')} style={{width: 220}}>
                  <Select
                    value={element.type}
                    options={SIMULATION_ELEMENT_TYPES.map((value) => ({value, label: value}))}
                    onChange={(type) => setElements(updateArrayItem(elements, index, (item) => ({
                      ...createSimulationElement(type, index, handles),
                      id: item.id,
                    })))}
                  />
                </Form.Item>
              </Flex>
              <Typography.Text strong>{t('componentEditor.labels.terminals')}</Typography.Text>
              <Flex gap={8} wrap="wrap" style={{marginTop: 8}}>
                {definition.terminals.map((terminal) => (
                  <Form.Item key={terminal} label={terminal} style={{width: 200}}>
                    <Select
                      value={(element.terminals as Record<string, string>)[terminal]}
                      options={handleSelectOptions}
                      onChange={(handleId) => setElements(updateArrayItem(elements, index, (item) => ({
                        ...item,
                        terminals: {...item.terminals, [terminal]: handleId},
                      } as ComponentSimulationElementUse)))}
                    />
                  </Form.Item>
                ))}
              </Flex>
              {definition.parameters.length > 0 && (
                <>
                  <Typography.Text strong>{t('componentEditor.labels.parameters')}</Typography.Text>
                  <Flex vertical gap={8} style={{marginTop: 8}}>
                    {definition.parameters.map((parameter) => (
                      <Flex key={parameter} gap={8} align="center" wrap="wrap">
                        <Typography.Text style={{width: 180}}>{parameter}</Typography.Text>
                        <ParameterRefEditor
                          value={(parameters as Record<string, SimulationParameterRef>)[parameter] ?? defaultParameterValue(parameter)}
                          fields={fields}
                          onChange={(value) => setElements(updateArrayItem(elements, index, (item) => ({
                            ...item,
                            parameters: {...(item.parameters ?? {}), [parameter]: value},
                          } as ComponentSimulationElementUse)))}
                        />
                      </Flex>
                    ))}
                  </Flex>
                </>
              )}
            </Form>
          </Card>
        );
      })}
    </Flex>
  );
};

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
                    <StructuredSection
                      ui={(
                        <HandlesEditor
                          handles={componentPackage.component.handles}
                          fields={componentPackage.component.fields ?? []}
                          onChange={(handles) => {
                            updateComponent((component) => ({...component, handles}));
                          }}
                        />
                      )}
                      json={(
                        <JsonSection
                          title={t('componentEditor.sections.applyHandles')}
                          description={t('componentEditor.sections.handlesDescription')}
                          text={handlesJson.text}
                          error={handlesJson.error}
                          onChange={handlesJson.setText}
                          onApply={handlesJson.apply}
                        />
                      )}
                    />
                  ),
                },
                {
                  key: 'fields',
                  label: t('componentEditor.tabs.fields'),
                  children: (
                    <StructuredSection
                      ui={(
                        <FieldsEditor
                          fields={componentPackage.component.fields ?? []}
                          onChange={(fields) => {
                            updateComponent((component) => ({
                              ...component,
                              fields: fields.length > 0 ? fields : undefined,
                            }));
                          }}
                        />
                      )}
                      json={(
                        <JsonSection
                          title={t('componentEditor.sections.applyFields')}
                          description={t('componentEditor.sections.fieldsDescription')}
                          text={fieldsJson.text}
                          error={fieldsJson.error}
                          onChange={fieldsJson.setText}
                          onApply={fieldsJson.apply}
                        />
                      )}
                    />
                  ),
                },
                {
                  key: 'connections',
                  label: t('componentEditor.tabs.connections'),
                  children: (
                    <StructuredSection
                      ui={(
                        <ConnectionsEditor
                          connections={componentPackage.component.internalConnections ?? []}
                          handles={componentPackage.component.handles}
                          fields={componentPackage.component.fields ?? []}
                          onChange={(internalConnections) => {
                            updateComponent((component) => ({
                              ...component,
                              internalConnections: internalConnections.length > 0 ? internalConnections : undefined,
                            }));
                          }}
                        />
                      )}
                      json={(
                        <JsonSection
                          title={t('componentEditor.sections.applyConnections')}
                          description={t('componentEditor.sections.connectionsDescription')}
                          text={connectionsJson.text}
                          error={connectionsJson.error}
                          onChange={connectionsJson.setText}
                          onApply={connectionsJson.apply}
                        />
                      )}
                    />
                  ),
                },
                {
                  key: 'simulation',
                  label: t('componentEditor.tabs.simulation'),
                  children: (
                    <StructuredSection
                      ui={(
                        <SimulationEditor
                          simulation={componentPackage.component.simulation}
                          handles={componentPackage.component.handles}
                          fields={componentPackage.component.fields ?? []}
                          onChange={(simulation) => {
                            updateComponent((component) => ({...component, simulation}));
                          }}
                        />
                      )}
                      json={(
                        <JsonSection
                          title={t('componentEditor.sections.applySimulation')}
                          description={t('componentEditor.sections.simulationDescription')}
                          text={simulationJson.text}
                          error={simulationJson.error}
                          onChange={simulationJson.setText}
                          onApply={simulationJson.apply}
                        />
                      )}
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
