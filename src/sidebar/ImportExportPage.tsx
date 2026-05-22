
import { useReactFlow, useUpdateNodeInternals, getViewportForBounds, Rect, type Edge, type Node} from '@xyflow/react';
import { Flex, Button, Divider, theme, Modal, Tooltip, message, Select, Input, Typography } from 'antd';
import {CopyOutlined} from '@ant-design/icons'
import { useState } from 'react';

import { useTranslation } from "react-i18next";

import { toPng, toJpeg, toSvg } from 'html-to-image';

import { getCurrentURL, getAdaptedBounds } from '../utils/utils_functions';
import { createDiagramExportJson } from '../utils/exportModel';
import { applyComponentTemplateUpdatesToNodes, findNodeComponentTemplateUpdates } from '../utils/componentTemplateUpdates';
import { useUndoRedo } from '../utils/undoRedo';

type ImportedFlow = {
  nodes: Node[];
  edges: Edge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
};

type WritableFileHandle = {
  name: string;
  getFile: () => Promise<File>;
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>;
    close: () => Promise<void>;
  }>;
};

type FilePickerWindow = Window & typeof globalThis & {
  showOpenFilePicker?: (options?: {
    types?: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
    multiple?: boolean;
  }) => Promise<WritableFileHandle[]>;
  showSaveFilePicker?: (options?: {
    suggestedName?: string;
    types?: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<WritableFileHandle>;
};

const DefaultModelFileName = 'wled-wiring.json';

const modelJsonFileType = {
  description: 'WLED wiring model',
  accept: { 'application/json': ['.json'] },
};

const sanitizeModelFileName = (name: string) => {
  const cleaned = name.trim().replace(/[\\/:*?"<>|]/g, '-');
  const withFallback = cleaned.length > 0 ? cleaned : DefaultModelFileName.replace(/\.json$/i, '');
  return /\.json$/i.test(withFallback) ? withFallback : `${withFallback}.json`;
};

const getExportBaseName = (fileName: string) => (
  sanitizeModelFileName(fileName).replace(/\.json$/i, '') || 'wled-wiring'
);

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const isObject = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const readNumber = (value: unknown, fallback: number) => (
  typeof value === 'number' && Number.isFinite(value) ? value : fallback
);

const parseImportedFlow = (jsonData: string): ImportedFlow => {
  const parsed = JSON.parse(jsonData) as unknown;

  if (!isObject(parsed) || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
    throw new Error('Invalid WLED wiring model file');
  }

  const viewport = isObject(parsed.viewport) ? parsed.viewport : {};

  return {
    nodes: parsed.nodes as Node[],
    edges: parsed.edges as Edge[],
    viewport: {
      x: readNumber(viewport.x, 0),
      y: readNumber(viewport.y, 0),
      zoom: readNumber(viewport.zoom, 1),
    },
  };
};


export const ImportExportPage = () => {
  const {t} = useTranslation(['main']);
  const { token } = theme.useToken();
  const reactFlow = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const { clearHistory, takeSnapshot } = useUndoRedo();
  const [documentFileName, setDocumentFileName] = useState(DefaultModelFileName);
  const [modelFileHandle, setModelFileHandle] = useState<WritableFileHandle | null>(null);
  const [saveAsModalOpen, setSaveAsModalOpen] = useState(false);
  const [saveAsFileName, setSaveAsFileName] = useState(DefaultModelFileName);

  const askForComponentTemplateUpdates = (loadedNodes: Node[]) => {
    const updateInfos = findNodeComponentTemplateUpdates(loadedNodes, t('sidebar.components.updateValueMissing'));
    if(updateInfos.length===0) return;

    modalApi.confirm({
      title: t('message.componentUpdatesAvailableTitle'),
      content: t('message.componentUpdatesAvailableDescription', { count: updateInfos.length }),
      okText: t('message.componentUpdatesApplyAll'),
      cancelText: t('message.componentUpdatesSkip'),
      onOk: () => {
        let updatedNodeIds: string[] = [];
        takeSnapshot('component template update');
        reactFlow.setNodes((currentNodes) => {
          const result = applyComponentTemplateUpdatesToNodes(currentNodes);
          updatedNodeIds = result.updatedNodeIds;
          return result.nodes;
        });
        setTimeout(() => {
          updatedNodeIds.forEach((nodeId) => updateNodeInternals(nodeId));
        }, 0);
        messageApi.open({
          type: 'success',
          content: t('message.componentUpdatesAllApplied', { count: updateInfos.length }),
          duration: 5,
        });
      },
    });
  };

  function createInfoElement(nodesBounds:Rect, textScalefactor:number, textOffset:number):HTMLElement{
    const element=document.createElement('div');
    element.innerHTML="Made by WLED Wiring Designer: "+getCurrentURL();
    element.style.position="absolute";
    element.style.fontSize=String(nodesBounds.height/40)+"px";
    element.style.color="rgba(0,0,0,0.5)";
    element.style.top=String(nodesBounds.y-nodesBounds.height/textScalefactor-textOffset)+"px";
    element.style.left=nodesBounds.x+"px"; 
    return element;
  }

  function generateDataForExport():{element:HTMLElement, viewport:{x:number, y:number, zoom:number}, imageWidth:number, imageHeight:number}{
    const NodesBoundsArr=reactFlow.getNodes().map((node) => ({id: node.id, rect: reactFlow.getNodesBounds([node.id])}));
    const nodesBounds=getAdaptedBounds(reactFlow, NodesBoundsArr);

    const imageWidth = 1024;
    const imageHeight = imageWidth * (nodesBounds.height / nodesBounds.width);

    const doc=document.querySelector('.react-flow__viewport') as HTMLElement;
    const textScalefactor=40;
    const textOffset=10;
    const element = createInfoElement(nodesBounds, textScalefactor, textOffset);
    doc.insertAdjacentElement('afterbegin', element);
    const Offset=nodesBounds.height/textScalefactor+textOffset;
    nodesBounds.y=nodesBounds.y-Offset;
    nodesBounds.height=nodesBounds.height+Offset;

    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.1,
      10,
      0.02
    );
    return {element, viewport, imageWidth, imageHeight};
  }

  const exportBaseName = getExportBaseName(documentFileName);

  const createModelBlob = () => (
    new Blob([createDiagramExportJson(reactFlow)], { type: 'application/json' })
  );

  const saveModelToHandle = async (fileHandle: WritableFileHandle) => {
    const writable = await fileHandle.createWritable();
    await writable.write(createModelBlob());
    await writable.close();
  };

  const downloadModel = (fileName: string) => {
    const nextFileName = sanitizeModelFileName(fileName);
    downloadBlob(createModelBlob(), nextFileName);
    setDocumentFileName(nextFileName);
    messageApi.open({
      type: 'success',
      content: t('message.saveModelDownloadStarted'),
      duration: 2,
    });
  };

  const handleSave = async () => {
    if (modelFileHandle) {
      try {
        await saveModelToHandle(modelFileHandle);
        setDocumentFileName(sanitizeModelFileName(modelFileHandle.name));
        messageApi.open({
          type: 'success',
          content: t('message.saveModelSuccess'),
          duration: 2,
        });
        return;
      } catch {
        setModelFileHandle(null);
      }
    }

    downloadModel(documentFileName);
  };

  const handleSaveAs = async () => {
    const pickerWindow = window as FilePickerWindow;
    if (pickerWindow.showSaveFilePicker) {
      try {
        const fileHandle = await pickerWindow.showSaveFilePicker({
          suggestedName: sanitizeModelFileName(documentFileName),
          types: [modelJsonFileType],
        });
        await saveModelToHandle(fileHandle);
        setModelFileHandle(fileHandle);
        setDocumentFileName(sanitizeModelFileName(fileHandle.name));
        messageApi.open({
          type: 'success',
          content: t('message.saveModelSuccess'),
          duration: 2,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        messageApi.open({
          type: 'error',
          content: t('message.saveModelError'),
          duration: 3,
        });
      }
      return;
    }

    setSaveAsFileName(sanitizeModelFileName(documentFileName));
    setSaveAsModalOpen(true);
  };

  const applyImportedFlow = (flow: ImportedFlow, fileName: string, fileHandle: WritableFileHandle | null) => {
    reactFlow.setNodes(flow.nodes);
    reactFlow.setEdges(flow.edges);
    reactFlow.setViewport(flow.viewport);
    clearHistory();
    setDocumentFileName(sanitizeModelFileName(fileName));
    setModelFileHandle(fileHandle);
    messageApi.open({
      type: 'success',
      content: t('message.loadModelSuccess'),
      duration: 2,
    });
    setTimeout(() => {
      askForComponentTemplateUpdates(flow.nodes);
    }, 0);
  };

  const handleOpenFile = async () => {
    const pickerWindow = window as FilePickerWindow;
    if (pickerWindow.showOpenFilePicker) {
      try {
        const [fileHandle] = await pickerWindow.showOpenFilePicker({
          types: [modelJsonFileType],
          multiple: false,
        });
        if (!fileHandle) return;

        const file = await fileHandle.getFile();
        const jsonData = await file.text();
        const flow = parseImportedFlow(jsonData);
        applyImportedFlow(flow, file.name, fileHandle);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        messageApi.open({
          type: 'error',
          content: t('message.loadModelError'),
          duration: 3,
        });
      }
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const jsonData = e.target?.result;
          if (typeof jsonData === 'string') {
            try {
              const flow = parseImportedFlow(jsonData);
              applyImportedFlow(flow, file.name, null);
            } catch {
              messageApi.open({
                type: 'error',
                content: t('message.loadModelError'),
                duration: 3,
              });
            }
          }
        };
        reader.onerror = () => {
          messageApi.open({
            type: 'error',
            content: t('message.loadModelError'),
            duration: 3,
          });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalLinkText, setModalLinkText] = useState("");
  const [modalErrorText, setModalErrorText] = useState("");
  const [modalOkButtonDisabled, setModalOkButtonDisabled] = useState(false);
  const [modalCancelText, setModalCancelText] = useState("Cancel");
  const [shareLink, setShareLink] = useState("");

  const handleOk = () => {
    setConfirmLoading(true);
    setModalLinkText(t('sidebar.export.share.modalLinkText'));
    setModalText(t('sidebar.export.share.modalLinkBeingGenerated'));
    const data = createDiagramExportJson(reactFlow);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    fetch('https://wled-api.myhome-control.de/wled-wiring/gate_post2.php', requestOptions)
        .then(response => {
          if (response.ok) {
            return response.text();
          }
        })
        .then(data=>{
          if(data && data.length==24){
            setShareLink(getCurrentURL()+"?link="+data);
          } else {
            setModalErrorText(t('sidebar.export.share.modalLinkError'));
            setModalLinkText("");
          }
          setModalText("");
          setConfirmLoading(false);
          setModalOkButtonDisabled(true);
          setModalCancelText(t('sidebar.export.share.modalButtonClose'));   
          
        })
        .catch(() => {
          setModalErrorText(t('sidebar.export.share.modalLinkError'));
          setModalLinkText("");
          setModalText("");
          setConfirmLoading(false);
          setModalOkButtonDisabled(true);
          setModalCancelText(t('sidebar.export.share.modalButtonCancel'));
        });
  };


    return <div id="componentPageDiv">
      {messageContextHolder}
      {modalContextHolder}
      <Flex  gap="small" id="componentPageFlexDiv" vertical>
        <Divider key={"Divider1" }
            style={{fontSize: token.fontSize}}
          >
            {t('sidebar.export.dividerSaveOpen')}
        </Divider>
        <Typography.Text type="secondary">
          {t('sidebar.export.currentFile', { name: documentFileName })}
        </Typography.Text>
        <Button
          onClick={handleSave}
        >{t('sidebar.export.buttonSave')}</Button>
        <Button
          onClick={handleSaveAs}
        >{t('sidebar.export.buttonSaveAs')}</Button>
        <Button
           onClick={handleOpenFile}
        >{t('sidebar.export.buttonOpen')}</Button>
        <Divider key={"Divider2" }
            style={{fontSize: token.fontSize}}
          >
            {t('sidebar.export.dividerExport')}
        </Divider>
        <Button
           onClick={() => {
            const {element, viewport, imageWidth, imageHeight} = generateDataForExport();
            toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
              backgroundColor: 'white',
              width: imageWidth,
              height: imageHeight,
              style: {
                width: String(imageWidth),
                height: String(imageHeight),
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
              },
            }).then((dataUrl) => {
              const a = document.createElement('a');
              a.setAttribute('download', exportBaseName+'.png');
              a.setAttribute('href', dataUrl);
              a.click();
            }).finally(() => element.remove());
           }}
        >{t('sidebar.export.buttonExportPNG')}</Button>
        <Button
           onClick={() => {
            const {element, viewport, imageWidth, imageHeight} = generateDataForExport();
            toJpeg(document.querySelector('.react-flow__viewport') as HTMLElement, {
              backgroundColor: 'white',
              width: imageWidth,
              height: imageHeight,
              style: {
                width: String(imageWidth),
                height: String(imageHeight),
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
              },
            }).then((dataUrl) => {
              const a = document.createElement('a');
              a.setAttribute('download', exportBaseName+'.jpg');
              a.setAttribute('href', dataUrl);
              a.click();
              element.remove();
            });
           }}
        >{t('sidebar.export.buttonExportJPEG')}</Button>
        <Button
           onClick={() => {
            const {element, viewport, imageWidth, imageHeight} = generateDataForExport();
            toSvg(document.querySelector('.react-flow__viewport') as HTMLElement, {
              backgroundColor: 'white',
              width: imageWidth,
              height: imageHeight,
              style: {
                width: String(imageWidth),
                height: String(imageHeight),
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
              },
            }).then((dataUrl) => {
              const a = document.createElement('a');
              a.setAttribute('download', exportBaseName+'.svg');
              a.setAttribute('href', dataUrl);
              a.click();
              element.remove();
            });
           }}
        >{t('sidebar.export.buttonExportSVG')}</Button>
        
      <Divider
        key={"Divider3"}
        style={{fontSize: token.fontSize}}
      >
        {t('sidebar.export.dividerShare')}
      </Divider>
      <Button
          onClick={() => {
            setShareLink("");
            setOpen(true);
          }}
        >{t('sidebar.export.buttonShare')}</Button>
      <Divider
        key={"Divider4"}
        style={{fontSize: token.fontSize}}
      >
        {t('sidebar.export.dividerExamples')}
      </Divider>
      <Select
        showSearch
        placeholder={t('sidebar.export.selectExample')}
        optionFilterProp="label"
        options={[
          {label: t('examples.example1'), value: "examples/example1"},
          {label: t('examples.example2'), value: "examples/example2"},
          {label: t('examples.example3'), value: "examples/example3"},
          {label: t('examples.example4'), value: "examples/example4"},
          {label: t('examples.example5'), value: "examples/example5"},
        ]}
        onSelect={(value,_) => {
          window.open(getCurrentURL()+'?link='+value, '_blank')?.focus();
        }}
      >
      </Select>
      </Flex>

      <Modal
        title={t('sidebar.export.saveAsModalTitle')}
        open={saveAsModalOpen}
        okText={t('sidebar.export.saveAsModalOk')}
        cancelText={t('sidebar.export.share.modalButtonCancel')}
        onOk={() => {
          const nextFileName = sanitizeModelFileName(saveAsFileName);
          downloadModel(nextFileName);
          setModelFileHandle(null);
          setSaveAsModalOpen(false);
        }}
        onCancel={() => setSaveAsModalOpen(false)}
      >
        <Input
          value={saveAsFileName}
          onChange={(event) => setSaveAsFileName(event.target.value)}
          onPressEnter={() => {
            const nextFileName = sanitizeModelFileName(saveAsFileName);
            downloadModel(nextFileName);
            setModelFileHandle(null);
            setSaveAsModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        title={t('sidebar.export.share.modalTitle')}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        okButtonProps={{ disabled: modalOkButtonDisabled }}
        okText={"Ok"}
        cancelText={modalCancelText}
        onCancel={() => {
          setOpen(false);
          setModalOkButtonDisabled(false);
          setModalText("");
          setModalErrorText("");
          setModalLinkText("");
          setShareLink("");
          setConfirmLoading(false);
          setModalCancelText(t('sidebar.export.share.modalButtonCancel'));
        }}
      >
        <p>{t('sidebar.export.share.modalAttentionText')}</p>
        <div><span style={{color:'red'}}>{modalErrorText}</span><span style={{color:'green'}}>{modalLinkText}</span>{modalText}<span style={{backgroundColor:"rgba(0,0,0,0.1)", marginLeft: "5px", marginRight: "5px"}}>{shareLink}</span>
        <Tooltip
            title={t('sidebar.export.share.tooltipCopyLink')}
            placement="top"
        >
          <Button
            type="primary"
            icon={<CopyOutlined />}
            style={{
              display: shareLink.length > 0 ? 'inline-block' : 'none',
            }}
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
              messageApi.open({
                type: 'success',
                content: t('sidebar.export.share.messageLinkCopied'),
                duration: 2,
              });
            }}
          >
          </Button>
        </Tooltip>
        </div>
      </Modal>
    </div>
}
