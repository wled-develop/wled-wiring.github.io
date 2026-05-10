// src/check/checkContext.ts
var keyOf = (nodeId, handleId) => `${nodeId}::${handleId}`;
var UnionFind = class {
  parent = /* @__PURE__ */ new Map();
  add(value) {
    if (!this.parent.has(value)) {
      this.parent.set(value, value);
    }
  }
  find(value) {
    const parent = this.parent.get(value);
    if (!parent || parent === value) {
      return value;
    }
    const root = this.find(parent);
    this.parent.set(value, root);
    return root;
  }
  union(a, b) {
    this.add(a);
    this.add(b);
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) {
      this.parent.set(rootB, rootA);
    }
  }
};
var getInputFieldValue = (node, technicalID) => node.data.inputFields?.find((field) => field.technicalID === technicalID)?.value;
var getNodeHandleById = (node, handleId) => allVisibleHandles(node).find((handle) => handle.hid === handleId);
var isPassiveTerminalNode = (node) => ["Kerko", "Resistor"].includes(node.data.technicalID);
var isHiddenByCondition = (node, handle) => handle.hideConditions?.some((condition) => {
  const selectedValue = node.data.selectFields?.find((field) => field.technicalID === condition.selectHID)?.selectedValue;
  return selectedValue !== void 0 && condition.values.includes(selectedValue);
}) || false;
var allVisibleHandles = (node) => [
  ...node.data.handles || [],
  ...node.data.repeatedHandleArray || []
].filter((handle) => !isHiddenByCondition(node, handle));
var inferFunctions = (node, handle) => {
  const rawFunctions = isPassiveTerminalNode(node) ? (handle.functions || []).filter((fn) => fn !== "dig_in" && fn !== "dig_out") : handle.functions || [];
  const functions = new Set(rawFunctions);
  const handleText = `${handle.hid} ${handle.name || ""} ${handle.description || ""}`.toLowerCase();
  if (rawFunctions.includes("usb_power_out")) {
    functions.add("suppl_out");
  }
  if (rawFunctions.includes("usb_full")) {
    functions.add("suppl_in");
  }
  if (node.data.group === "led") {
    if (/(\b|_)(5v|12v|24v|48v)(\b|_)|supply input/.test(handleText)) {
      functions.add("suppl_in");
    }
    if (/\bgnd\b|ground/.test(handleText)) {
      functions.add("gnd");
    }
    if (/data.*start|data.*input/.test(handleText) && !functions.has("not_connected")) {
      functions.add("dig_in");
    }
    if (/data.*end|data.*output/.test(handleText) && !functions.has("not_connected")) {
      functions.add("dig_out");
    }
    if (/clock.*start|clock.*input/.test(handleText) && !functions.has("not_connected")) {
      functions.add("dig_clock_in");
    }
    if (/clock.*end|clock.*output/.test(handleText) && !functions.has("not_connected")) {
      functions.add("dig_clock_out");
    }
  }
  return Array.from(functions).filter((fn) => ["dig_in", "dig_out", "dig_clock_in", "dig_clock_out", "dig_backup_in", "dig_backup_out", "not_connected", "suppl_in", "suppl_out", "gnd", "pe", "neutral", "line"].includes(fn));
};
var inferVoltageOut = (node, handle, functions) => {
  if (!functions.includes("suppl_out") && !functions.includes("dig_out")) {
    return void 0;
  }
  if (typeof handle.Vout === "number" && handle.Vout > 0) {
    return handle.Vout;
  }
  if (handle.VoutDependency) {
    const inputFieldValue = getInputFieldValue(node, handle.VoutDependency);
    if (typeof inputFieldValue === "number") {
      return inputFieldValue;
    }
  }
  const sourceVoltage = getInputFieldValue(node, "source_voltage");
  if (functions.includes("suppl_out") && typeof sourceVoltage === "number") {
    return sourceVoltage;
  }
  return void 0;
};
var inferVoltageRange = (handle, functions) => {
  if (!functions.includes("suppl_in") && !functions.includes("dig_in")) {
    return {};
  }
  if (typeof handle.tolVmin === "number" || typeof handle.tolVmax === "number") {
    return {
      voltageMin: handle.tolVmin,
      voltageMax: handle.tolVmax
    };
  }
  return {};
};
var buildCheckHandle = (node, handle, edges) => {
  const functions = inferFunctions(node, handle);
  const voltageRange = inferVoltageRange(handle, functions);
  return {
    key: keyOf(node.id, handle.hid),
    node,
    handle,
    functions,
    connectedEdges: edges.filter((edge) => edge.source === node.id && edge.sourceHandle === handle.hid || edge.target === node.id && edge.targetHandle === handle.hid),
    voltageOut: inferVoltageOut(node, handle, functions),
    ...voltageRange
  };
};
var isSameInternalRail = (a, b) => {
  if (a.functions.includes("gnd") && b.functions.includes("gnd")) return true;
  if (a.functions.includes("pe") && b.functions.includes("pe")) return true;
  if (a.functions.includes("neutral") && b.functions.includes("neutral")) return true;
  if (a.functions.includes("line") && b.functions.includes("line")) return true;
  if (a.functions.includes("suppl_out") && b.functions.includes("suppl_out")) {
    return a.voltageOut !== void 0 && b.voltageOut !== void 0 && Math.abs(a.voltageOut - b.voltageOut) < 0.5;
  }
  if (a.functions.includes("suppl_in") && b.functions.includes("suppl_in")) {
    const aVoltage = a.voltageMin ?? a.voltageMax;
    const bVoltage = b.voltageMin ?? b.voltageMax;
    return aVoltage !== void 0 && bVoltage !== void 0 && Math.abs(aVoltage - bVoltage) < 0.5;
  }
  return false;
};
var isFuseNode = (node) => /fuse/i.test(node.data.technicalID);
var isSeriesSignalNode = (node) => node.data.technicalID === "Resistor";
var isFusePassThrough = (a, b) => {
  if (a.node.id !== b.node.id || !isFuseNode(a.node)) return false;
  return a.key !== b.key;
};
var isSupplyInputPassThrough = (a, b) => {
  if (a.node.id !== b.node.id || a.key === b.key) return false;
  return a.functions.includes("suppl_in") && b.functions.includes("suppl_in");
};
var isSignalPassThrough = (a, b) => {
  if (a.node.id !== b.node.id || !isSeriesSignalNode(a.node)) return false;
  if (a.key === b.key) return false;
  const nodeHandles = [...a.node.data.handles || [], ...a.node.data.repeatedHandleArray || []];
  return nodeHandles.length === 2;
};
var createNets = (handles, edges) => {
  const uf = new UnionFind();
  const handleByKey = new Map(handles.map((handle) => [handle.key, handle]));
  handles.forEach((handle) => uf.add(handle.key));
  edges.forEach((edge) => {
    if (edge.sourceHandle && edge.targetHandle) {
      const sourceKey = keyOf(edge.source, edge.sourceHandle);
      const targetKey = keyOf(edge.target, edge.targetHandle);
      if (handleByKey.has(sourceKey) && handleByKey.has(targetKey)) {
        uf.union(sourceKey, targetKey);
      }
    }
  });
  const byNode = /* @__PURE__ */ new Map();
  handles.forEach((handle) => {
    byNode.set(handle.node.id, [...byNode.get(handle.node.id) || [], handle]);
  });
  byNode.forEach((nodeHandles) => {
    nodeHandles.forEach((a, index) => {
      nodeHandles.slice(index + 1).forEach((b) => {
        if (isSameInternalRail(a, b)) {
          uf.union(a.key, b.key);
        }
      });
    });
  });
  const netsByRoot = /* @__PURE__ */ new Map();
  handles.forEach((handle) => {
    const root = uf.find(handle.key);
    const net = netsByRoot.get(root) || { id: root, handles: [], edges: [] };
    net.handles.push(handle);
    netsByRoot.set(root, net);
  });
  edges.forEach((edge) => {
    if (!edge.sourceHandle) return;
    const sourceKey = keyOf(edge.source, edge.sourceHandle);
    const root = handleByKey.has(sourceKey) ? uf.find(sourceKey) : void 0;
    const net = root ? netsByRoot.get(root) : void 0;
    if (net) {
      net.edges.push(edge);
    }
  });
  return Array.from(netsByRoot.values());
};
function createDiagramCheckContext(nodes, edges) {
  const handles = nodes.flatMap((node) => allVisibleHandles(node).map((handle) => buildCheckHandle(node, handle, edges)));
  const handleByKey = new Map(handles.map((handle) => [handle.key, handle]));
  const wiredHandlesByKey = /* @__PURE__ */ new Map();
  const nets = createNets(handles, edges);
  const netByHandleKey = /* @__PURE__ */ new Map();
  edges.forEach((edge) => {
    if (!edge.sourceHandle || !edge.targetHandle) return;
    const source = handleByKey.get(keyOf(edge.source, edge.sourceHandle));
    const target = handleByKey.get(keyOf(edge.target, edge.targetHandle));
    if (!source || !target) return;
    wiredHandlesByKey.set(source.key, [...wiredHandlesByKey.get(source.key) || [], target]);
    wiredHandlesByKey.set(target.key, [...wiredHandlesByKey.get(target.key) || [], source]);
  });
  nets.forEach((net) => {
    net.handles.forEach((handle) => {
      netByHandleKey.set(handle.key, net);
    });
  });
  const hasFunction = (handle, fn) => handle.functions.includes(fn);
  const resolveVoltageOut = (handle, visited = /* @__PURE__ */ new Set()) => {
    if (!handle.functions.includes("suppl_out") && !handle.functions.includes("dig_out")) {
      return void 0;
    }
    if (typeof handle.handle.Vout === "number" && handle.handle.Vout > 0) {
      return handle.handle.Vout;
    }
    const dependency = handle.handle.VoutDependency;
    if (dependency) {
      const inputFieldValue = getInputFieldValue(handle.node, dependency);
      if (typeof inputFieldValue === "number") {
        return inputFieldValue;
      }
      const dependencyHandle = getNodeHandleById(handle.node, dependency);
      if (dependencyHandle) {
        const dependencyCheckHandle = handleByKey.get(keyOf(handle.node.id, dependencyHandle.hid));
        if (dependencyCheckHandle && !visited.has(dependencyCheckHandle.key)) {
          visited.add(dependencyCheckHandle.key);
          const dependencyOutputs = externallyPowerReachableHandles(dependencyCheckHandle).filter((candidate) => candidate.functions.includes("suppl_out") || candidate.functions.includes("dig_out"));
          const resolvedVoltage = dependencyOutputs.map((candidate) => resolveVoltageOut(candidate, new Set(visited))).find((voltage) => voltage !== void 0);
          if (resolvedVoltage !== void 0) {
            return resolvedVoltage;
          }
        }
      }
    }
    return handle.voltageOut;
  };
  const reachableHandles = (handle, canPassThrough) => {
    const visited = /* @__PURE__ */ new Set();
    const queue = [handle];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current.key)) continue;
      visited.add(current.key);
      const net = netByHandleKey.get(current.key);
      net?.handles.forEach((candidate) => {
        if (!visited.has(candidate.key)) queue.push(candidate);
      });
      if (handles.some((candidate) => canPassThrough(current, candidate))) {
        handles.filter((candidate) => canPassThrough(current, candidate)).forEach((candidate) => {
          if (!visited.has(candidate.key)) queue.push(candidate);
        });
      }
    }
    return handles.filter((candidate) => visited.has(candidate.key));
  };
  const powerReachableHandles = (handle) => reachableHandles(handle, (current, candidate) => isFuseNode(current.node) && isFusePassThrough(current, candidate) || isSupplyInputPassThrough(current, candidate));
  const externallyPowerReachableHandles = (handle) => {
    const externalHandles = handle.connectedEdges.flatMap((edge) => {
      const sourceKey = edge.sourceHandle ? keyOf(edge.source, edge.sourceHandle) : void 0;
      const targetKey = edge.targetHandle ? keyOf(edge.target, edge.targetHandle) : void 0;
      const counterpartKey = sourceKey === handle.key ? targetKey : sourceKey;
      const counterpart = counterpartKey ? handleByKey.get(counterpartKey) : void 0;
      return counterpart && counterpart.node.id !== handle.node.id ? [counterpart] : [];
    });
    const visited = /* @__PURE__ */ new Set();
    const queue = [...externalHandles];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current.key)) continue;
      visited.add(current.key);
      const wiredHandles = wiredHandlesByKey.get(current.key) || [];
      wiredHandles.filter((candidate) => candidate.node.id !== handle.node.id).forEach((candidate) => {
        if (!visited.has(candidate.key)) queue.push(candidate);
      });
      if (isFuseNode(current.node)) {
        handles.filter((candidate) => candidate.node.id !== handle.node.id && isFusePassThrough(current, candidate)).forEach((candidate) => {
          if (!visited.has(candidate.key)) queue.push(candidate);
        });
      }
      handles.filter((candidate) => candidate.node.id !== handle.node.id && isSupplyInputPassThrough(current, candidate)).forEach((candidate) => {
        if (!visited.has(candidate.key)) queue.push(candidate);
      });
    }
    return handles.filter((candidate) => visited.has(candidate.key));
  };
  const signalReachableHandles = (handle) => reachableHandles(handle, isSignalPassThrough);
  return {
    nodes,
    edges,
    handles,
    nets,
    getHandle: (nodeId, handleId) => handleId ? handleByKey.get(keyOf(nodeId, handleId)) : void 0,
    getNetByHandle: (handle) => netByHandleKey.get(handle.key),
    hasFunction,
    handlesWithFunction: (fn) => handles.filter((handle) => hasFunction(handle, fn)),
    connectedHandles: (handle) => {
      const net = netByHandleKey.get(handle.key);
      return net ? net.handles.filter((candidate) => candidate.key !== handle.key) : [];
    },
    resolveVoltageOut,
    powerReachableHandles,
    externallyPowerReachableHandles,
    signalReachableHandles
  };
}
var describeHandle = (handle) => `${handle.node.data.technicalID || handle.node.id}: ${handle.handle.name || handle.handle.hid}`;
var voltageMatches = (sourceVoltage, target) => {
  if (sourceVoltage === void 0) return false;
  const min = target.voltageMin;
  const max = target.voltageMax;
  if (min === void 0 && max === void 0) return true;
  return (min === void 0 || sourceVoltage >= min) && (max === void 0 || sourceVoltage <= max);
};
export {
  createDiagramCheckContext,
  describeHandle,
  voltageMatches
};
