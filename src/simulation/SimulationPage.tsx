import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DeleteOutlined, LoadingOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useEdges, useNodes, useReactFlow, type Edge, type Node } from "@xyflow/react";
import { Alert, Button, Empty, Flex, List, Select, Slider, Space, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { createSimulationFingerprint } from "./simulationFingerprint";
import { logSimulationDebug } from "./simulationDebug";
import { runSimulationInWorker, type SimulationWorkerRun } from "./runSimulationInWorker";
import { useSimulationResultStore } from "./simulationResultStore";
import { DEBUG_BYPASS_SIMULATION_DIAGRAM_CHECK } from "./simulationFeatureFlags";
import type {
  LedSimulationColorMode,
  SimulationCheckIssue,
  SimulationModel,
  SimulationSettings,
  SimulationTarget,
} from "./simulationTypes";
import { useDiagramCheckResultStore } from "../check/diagramCheckResultStore";
import type { ComponentDataType, EdgeDataType } from "../types";

type SimulationUiStatus = "idle" | "running" | "success" | "failed" | "blocked";
type SimulationGateState = "ready" | "debug-bypass" | "not-checked" | "stale" | "has-errors";

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

const getSimulationModelStats = (model: SimulationModel) => {
  const simulatedCircuitNodeIds = new Set(
    model.elements.flatMap((element) => Object.values(element.terminals)),
  );

  return {
    components: model.components.filter((component) => component.elementIds.length > 0).length,
    wires: model.wires.filter((wire) => (
      simulatedCircuitNodeIds.has(wire.sourceCircuitNodeId) &&
      simulatedCircuitNodeIds.has(wire.targetCircuitNodeId)
    )).length,
  };
};

const allNodeHandles = (node: Node<ComponentDataType>) => [
  ...(node.data.handles || []),
  ...(node.data.repeatedHandleArray || []),
];

const findNodeForSimulationElement = (
  elementId: string,
  nodes: Node<ComponentDataType>[],
) => {
  if(!elementId.startsWith("component:")) return undefined;

  const elementPath = elementId.slice("component:".length);
  return nodes.find((node) => (
    elementPath === node.id || elementPath.startsWith(`${node.id}:`)
  ));
};

export const SimulationPage = () => {
  const { t, i18n } = useTranslation(["main"]);
  const reactFlow = useReactFlow<Node<ComponentDataType>, Edge<EdgeDataType>>();
  const nodes = useNodes<Node<ComponentDataType>>();
  const edges = useEdges<Edge<EdgeDataType>>();
  const setSimulationOverlayResult = useSimulationResultStore((state) => state.setResult);
  const diagramCheckResult = useDiagramCheckResultStore((state) => state.result);
  const [settings, setSettings] = useState<SimulationSettings>({
    ledColorMode: "RGB_WHITE",
    brightnessPercent: 100,
  });
  const [status, setStatus] = useState<SimulationUiStatus>("idle");
  const [issues, setIssues] = useState<SimulationCheckIssue[] | null>(null);
  const [modelStats, setModelStats] = useState<{
    components: number;
    wires: number;
  } | null>(null);
  const [resultFingerprint, setResultFingerprint] = useState<string | null>(null);
  const [wasInvalidated, setWasInvalidated] = useState(false);
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const simulationRequestIdRef = useRef(0);
  const simulationWorkerRunRef = useRef<SimulationWorkerRun | null>(null);
  const currentFingerprintRef = useRef<string | null>(null);

  const currentFingerprint = useMemo(() => (
    createSimulationFingerprint(nodes, edges)
  ), [edges, nodes]);

  useEffect(() => {
    currentFingerprintRef.current = currentFingerprint;
  }, [currentFingerprint]);

  const simulationGate = useMemo((): {state: SimulationGateState; errorCount: number} => {
    if(DEBUG_BYPASS_SIMULATION_DIAGRAM_CHECK) {
      return {state: "debug-bypass", errorCount: 0};
    }

    if(!diagramCheckResult) {
      return {state: "not-checked", errorCount: 0};
    }

    if(diagramCheckResult.fingerprint !== currentFingerprint) {
      return {state: "stale", errorCount: 0};
    }

    const errorCount = diagramCheckResult.issues.filter((issue) => issue.severity === "error").length;
    if(errorCount > 0) {
      return {state: "has-errors", errorCount};
    }

    return {state: "ready", errorCount: 0};
  }, [currentFingerprint, diagramCheckResult]);

  const simulationBlocked = simulationGate.state !== "ready" && simulationGate.state !== "debug-bypass";

  const colorModeSelectOptions = useMemo(() => (
    colorModeOptions.map((option) => ({
      value: option.value,
      label: t(`sidebar.simulation.colorModes.${option.labelKey}`),
    }))
  ), [t]);

  const nodeById = useMemo(() => (
    new Map(nodes.map((node) => [node.id, node]))
  ), [nodes]);

  const edgeById = useMemo(() => (
    new Map(edges.map((edge) => [edge.id, edge]))
  ), [edges]);

  const componentLabel = (nodeId: string) => {
    const node = nodeById.get(nodeId);
    if(!node) return nodeId;

    return t(node.data.name || node.data.technicalID || node.id);
  };

  const pinLabel = (nodeId: string, handleId: string) => {
    const node = nodeById.get(nodeId);
    const handle = node ? allNodeHandles(node).find((candidate) => candidate.hid === handleId) : undefined;
    const pin = handle?.name || handleId;

    return t("sidebar.simulation.targetPin", {
      component: componentLabel(nodeId),
      pin,
    });
  };

  const targetLabel = (target: SimulationTarget) => {
    if(target.type === "node") return componentLabel(target.nodeId);

    if(target.type === "pin") {
      return pinLabel(target.nodeId, target.handleId);
    }

    if(target.type === "wire") {
      const edge = edgeById.get(target.edgeId);
      if(!edge) return target.edgeId;

      const source = edge.sourceHandle ? pinLabel(edge.source, edge.sourceHandle) : componentLabel(edge.source);
      const targetPin = edge.targetHandle ? pinLabel(edge.target, edge.targetHandle) : componentLabel(edge.target);
      return t("sidebar.simulation.targetWire", {
        source,
        target: targetPin,
      });
    }

    const node = findNodeForSimulationElement(target.elementId, nodes);
    if(node) {
      return t("sidebar.simulation.targetComponent", {
        component: componentLabel(node.id),
      });
    }

    return target.elementId;
  };

  const clearSimulationHighlights = useCallback(() => {
    reactFlow.setNodes((currentNodes) => currentNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        simulationHighlighted: false,
      },
    })));

    reactFlow.setEdges((currentEdges) => currentEdges.map((edge) => ({
      ...edge,
      data: {
        ...(edge.data as EdgeDataType),
        simulationHighlighted: false,
      },
    })));
  }, [reactFlow]);

  const highlightSimulationTargets = useCallback((targets: SimulationTarget[] = []) => {
    const highlightedNodeIds = new Set<string>();
    const highlightedEdgeIds = new Set<string>();

    targets.forEach((target) => {
      if(target.type === "node" || target.type === "pin") {
        highlightedNodeIds.add(target.nodeId);
        return;
      }

      if(target.type === "wire") {
        highlightedEdgeIds.add(target.edgeId);
        return;
      }

      const node = findNodeForSimulationElement(target.elementId, reactFlow.getNodes());
      if(node) {
        highlightedNodeIds.add(node.id);
      }
    });

    reactFlow.setNodes((currentNodes) => currentNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        simulationHighlighted: node.data.technicalID !== "SolderJoint" && highlightedNodeIds.has(node.id),
      },
    })));

    reactFlow.setEdges((currentEdges) => currentEdges.map((edge) => ({
      ...edge,
      data: {
        ...(edge.data as EdgeDataType),
        simulationHighlighted: highlightedEdgeIds.has(edge.id),
      },
    })));
  }, [reactFlow]);

  const restoreActiveIssueHighlight = useCallback(() => {
    const activeIssue = issues?.find((issue) => issue.id === activeIssueId);
    if(activeIssue) {
      highlightSimulationTargets(activeIssue.targets);
      return;
    }

    clearSimulationHighlights();
  }, [activeIssueId, clearSimulationHighlights, highlightSimulationTargets, issues]);

  const activateIssue = (issue: SimulationCheckIssue) => {
    if(!issue.targets || issue.targets.length === 0) return;

    const nextIssueId = activeIssueId === issue.id ? null : issue.id;
    setActiveIssueId(nextIssueId);
    if(nextIssueId) {
      highlightSimulationTargets(issue.targets);
      return;
    }

    clearSimulationHighlights();
  };

  const applySimulationResult = (simulation: Awaited<SimulationWorkerRun["promise"]>) => {
    const simulationFingerprint = simulation.ok
      ? simulation.result.diagramFingerprint
      : simulation.diagramFingerprint;

    if(currentFingerprintRef.current !== simulationFingerprint) {
      setStatus("idle");
      setIssues(null);
      setModelStats(null);
      setResultFingerprint(null);
      setWasInvalidated(true);
      setSimulationOverlayResult(null);
      setActiveIssueId(null);
      clearSimulationHighlights();
      return;
    }

    logSimulationDebug(simulation);
    setIssues(simulation.issues);

    if(simulation.ok) {
      setResultFingerprint(simulation.result.diagramFingerprint);
      setSimulationOverlayResult(simulation.result);
      setModelStats(getSimulationModelStats(simulation.model));
      setStatus("success");
      return;
    }

    setResultFingerprint(simulation.diagramFingerprint);
    setSimulationOverlayResult(null);
    setStatus("failed");
  };

  const runSimulation = () => {
    if(simulationBlocked) {
      setStatus("blocked");
      setIssues(null);
      setModelStats(null);
      setWasInvalidated(false);
      setSimulationOverlayResult(null);
      setActiveIssueId(null);
      clearSimulationHighlights();
      return;
    }

    setStatus("running");
    setIssues(null);
    setModelStats(null);
    setWasInvalidated(false);
    setSimulationOverlayResult(null);
    setActiveIssueId(null);
    clearSimulationHighlights();

    simulationWorkerRunRef.current?.terminate();
    const requestId = simulationRequestIdRef.current + 1;
    simulationRequestIdRef.current = requestId;
    const workerRun = runSimulationInWorker({
      requestId,
      nodes: reactFlow.getNodes(),
      edges: reactFlow.getEdges(),
      settings,
      language: i18n.resolvedLanguage,
    });
    simulationWorkerRunRef.current = workerRun;

    workerRun.promise
      .then((simulation) => {
        if(simulationRequestIdRef.current !== requestId) return;
        simulationWorkerRunRef.current = null;
        applySimulationResult(simulation);
      })
      .catch((error) => {
        if(simulationRequestIdRef.current !== requestId) return;
        simulationWorkerRunRef.current = null;
        setIssues([{
          id: "simulation-worker:failed",
          severity: "error",
          title: t("sidebar.simulation.workerFailedTitle"),
          description: error instanceof Error ? error.message : String(error),
        }]);
        setResultFingerprint(currentFingerprint);
        setSimulationOverlayResult(null);
        setActiveIssueId(null);
        clearSimulationHighlights();
        setStatus("failed");
      });
  };

  const deleteResults = () => {
    simulationRequestIdRef.current += 1;
    simulationWorkerRunRef.current?.terminate();
    simulationWorkerRunRef.current = null;
    setStatus("idle");
    setIssues(null);
    setModelStats(null);
    setResultFingerprint(null);
    setWasInvalidated(false);
    setSimulationOverlayResult(null);
    setActiveIssueId(null);
    clearSimulationHighlights();
  };

  useEffect(() => {
    if(!resultFingerprint || status === "running") return;
    if(currentFingerprint === resultFingerprint) return;

    setStatus("idle");
    setIssues(null);
    setModelStats(null);
    setResultFingerprint(null);
    setWasInvalidated(true);
    setSimulationOverlayResult(null);
    setActiveIssueId(null);
    clearSimulationHighlights();
  }, [clearSimulationHighlights, currentFingerprint, resultFingerprint, setSimulationOverlayResult, status]);

  useEffect(() => () => {
    simulationRequestIdRef.current += 1;
    simulationWorkerRunRef.current?.terminate();
    clearSimulationHighlights();
  }, [clearSimulationHighlights]);

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

      {simulationGate.state === "debug-bypass" &&
        <Alert
          type="warning"
          showIcon
          message={t("sidebar.simulation.diagramCheckDebugBypass")}
        />
      }

      {simulationBlocked &&
        <Alert
          type="warning"
          showIcon
          message={t(`sidebar.simulation.diagramCheckGate.${simulationGate.state}.title`, {
            count: simulationGate.errorCount,
          })}
          description={t(`sidebar.simulation.diagramCheckGate.${simulationGate.state}.description`, {
            count: simulationGate.errorCount,
          })}
        />
      }

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

      {status === "blocked" &&
        <Alert
          type="warning"
          showIcon
          message={t("sidebar.simulation.blockedTitle")}
          description={t("sidebar.simulation.blockedDescription")}
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
            <List.Item
              role={issueItem.targets?.length ? "button" : undefined}
              tabIndex={issueItem.targets?.length ? 0 : undefined}
              onClick={() => activateIssue(issueItem)}
              onKeyDown={(event) => {
                if(!issueItem.targets?.length) return;
                if(event.key !== "Enter" && event.key !== " ") return;

                event.preventDefault();
                activateIssue(issueItem);
              }}
              onMouseEnter={() => {
                if(issueItem.targets?.length) {
                  highlightSimulationTargets(issueItem.targets);
                }
              }}
              onMouseLeave={restoreActiveIssueHighlight}
              style={{
                borderRadius: 4,
                cursor: issueItem.targets?.length ? "pointer" : undefined,
                outline: activeIssueId === issueItem.id ? "1px solid #1677ff" : undefined,
                outlineOffset: activeIssueId === issueItem.id ? -1 : undefined,
                paddingInline: 6,
              }}
            >
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
