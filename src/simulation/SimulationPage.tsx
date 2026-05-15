import { useEffect, useMemo, useState } from "react";

import { DeleteOutlined, LoadingOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useEdges, useNodes, useReactFlow, type Edge, type Node } from "@xyflow/react";
import { Alert, Button, Empty, Flex, List, Select, Slider, Space, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { createSimulationFingerprint } from "./simulationFingerprint";
import { runSimulation as runDeterministicSimulation } from "./runSimulation";
import type {
  LedSimulationColorMode,
  SimulationCheckIssue,
  SimulationSettings,
  SimulationTarget,
} from "./simulationTypes";
import type { ComponentDataType, EdgeDataType } from "../types";

type SimulationUiStatus = "idle" | "running" | "success" | "failed";

const severityColor: Record<SimulationCheckIssue["severity"], string> = {
  error: "red",
  warning: "gold",
  info: "blue",
};

const colorModeOptions: {value: LedSimulationColorMode; labelKey: string}[] = [
  {value: "RGB_WHITE", labelKey: "rgbWhite"},
  {value: "SEPARATE_WHITE", labelKey: "separateWhite"},
  {value: "SEPARATE_AND_RGB_WHITE", labelKey: "separateAndRgbWhite"},
  {value: "R", labelKey: "red"},
  {value: "G", labelKey: "green"},
  {value: "B", labelKey: "blue"},
];

const targetLabel = (target: SimulationTarget) => {
  if(target.type === "node") return target.nodeId;
  if(target.type === "wire") return target.edgeId;
  if(target.type === "element") return target.elementId;
  return `${target.nodeId}.${target.handleId}`;
};

export const SimulationPage = () => {
  const { t } = useTranslation(["main"]);
  const reactFlow = useReactFlow<Node<ComponentDataType>, Edge<EdgeDataType>>();
  const nodes = useNodes<Node<ComponentDataType>>();
  const edges = useEdges<Edge<EdgeDataType>>();
  const [settings, setSettings] = useState<SimulationSettings>({
    ledColorMode: "RGB_WHITE",
    brightnessPercent: 100,
  });
  const [status, setStatus] = useState<SimulationUiStatus>("idle");
  const [issues, setIssues] = useState<SimulationCheckIssue[] | null>(null);
  const [modelStats, setModelStats] = useState<{
    nodes: number;
    circuitNodes: number;
    wires: number;
    elements: number;
    pinResults: number;
    wireResults: number;
  } | null>(null);
  const [resultFingerprint, setResultFingerprint] = useState<string | null>(null);
  const [wasInvalidated, setWasInvalidated] = useState(false);

  const currentFingerprint = useMemo(() => (
    createSimulationFingerprint(nodes, edges)
  ), [edges, nodes]);

  const colorModeSelectOptions = useMemo(() => (
    colorModeOptions.map((option) => ({
      value: option.value,
      label: t(`sidebar.simulation.colorModes.${option.labelKey}`),
    }))
  ), [t]);

  const runSimulation = () => {
    setStatus("running");
    setIssues(null);
    setModelStats(null);
    setWasInvalidated(false);

    const simulation = runDeterministicSimulation(
      reactFlow.getNodes(),
      reactFlow.getEdges(),
      settings,
    );

    setIssues(simulation.issues);

    if(simulation.ok) {
      setResultFingerprint(simulation.result.diagramFingerprint);
      setModelStats({
        nodes: simulation.model.nodes.length,
        circuitNodes: simulation.model.circuitNodes.length,
        wires: simulation.model.wires.length,
        elements: simulation.model.elements.length,
        pinResults: simulation.result.pinResults.length,
        wireResults: simulation.result.wireResults.length,
      });
      setStatus("success");
      return;
    }

    setResultFingerprint(simulation.diagramFingerprint);
    setStatus("failed");
  };

  const deleteResults = () => {
    setStatus("idle");
    setIssues(null);
    setModelStats(null);
    setResultFingerprint(null);
    setWasInvalidated(false);
  };

  useEffect(() => {
    if(!resultFingerprint || status === "running") return;
    if(currentFingerprint === resultFingerprint) return;

    setStatus("idle");
    setIssues(null);
    setModelStats(null);
    setResultFingerprint(null);
    setWasInvalidated(true);
  }, [currentFingerprint, resultFingerprint, status]);

  return (
    <Flex gap="small" vertical>
      <Flex gap={4} vertical>
        <Typography.Text strong>{t("sidebar.simulation.settings")}</Typography.Text>
        <Select
          value={settings.ledColorMode}
          options={colorModeSelectOptions}
          onChange={(ledColorMode) => setSettings((current) => ({
            ...current,
            ledColorMode,
          }))}
        />
      </Flex>

      <Flex gap={4} vertical>
        <Typography.Text>
          {t("sidebar.simulation.brightness", { value: settings.brightnessPercent })}
        </Typography.Text>
        <Slider
          min={0}
          max={100}
          step={1}
          value={settings.brightnessPercent}
          onChange={(brightnessPercent) => setSettings((current) => ({
            ...current,
            brightnessPercent,
          }))}
        />
      </Flex>

      <Space.Compact block>
        <Button
          type="primary"
          icon={status === "running" ? <LoadingOutlined /> : <PlayCircleOutlined />}
          loading={status === "running"}
          disabled={status === "running"}
          onClick={runSimulation}
        >
          {status === "running"
            ? t("sidebar.simulation.running")
            : t("sidebar.simulation.buttonRun")
          }
        </Button>
        <Button
          icon={<DeleteOutlined />}
          disabled={status === "running" || status === "idle"}
          onClick={deleteResults}
        >
          {t("sidebar.simulation.buttonDelete")}
        </Button>
      </Space.Compact>

      {status === "idle" &&
        <>
          {wasInvalidated &&
            <Alert
              type="info"
              showIcon
              message={t("sidebar.simulation.invalidated")}
            />
          }
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("sidebar.simulation.notRun")}
          />
        </>
      }

      {status === "running" &&
        <Alert
          type="info"
          showIcon
          message={t("sidebar.simulation.running")}
        />
      }

      {status === "success" &&
        <Alert
          type="success"
          showIcon
          message={t("sidebar.simulation.modelReadyTitle")}
          description={modelStats
            ? t("sidebar.simulation.modelReadyDescription", modelStats)
            : undefined
          }
        />
      }

      {status === "failed" &&
        <Alert
          type="error"
          showIcon
          message={t("sidebar.simulation.failedTitle")}
          description={t("sidebar.simulation.failedDescription")}
        />
      }

      {issues !== null && issues.length === 0 &&
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t("sidebar.simulation.noIssues")}
        />
      }

      {issues !== null && issues.length > 0 &&
        <List
          size="small"
          dataSource={issues}
          header={t("sidebar.simulation.issueCount", { count: issues.length })}
          renderItem={(issueItem) => (
            <List.Item>
              <Flex gap={4} vertical>
                <Space size={6} align="start">
                  <Tag color={severityColor[issueItem.severity]} style={{ marginInlineEnd: 0 }}>
                    {t(`sidebar.simulation.severity.${issueItem.severity}`)}
                  </Tag>
                  <Typography.Text strong>{issueItem.title}</Typography.Text>
                </Space>
                <Typography.Text type="secondary">{issueItem.description}</Typography.Text>
                {issueItem.targets && issueItem.targets.length > 0 &&
                  <Typography.Text type="secondary">
                    {t("sidebar.simulation.affectedElements")}: {issueItem.targets.map(targetLabel).join(", ")}
                  </Typography.Text>
                }
              </Flex>
            </List.Item>
          )}
        />
      }
    </Flex>
  );
};
