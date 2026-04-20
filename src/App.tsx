import { useState, useRef, useCallback } from 'react';
import type { Node, Edge } from 'reactflow';
import { Play, Trash2, Download } from 'lucide-react';
import { NodeSidebar } from './components/Sidebar/NodeSidebar';
import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { NodeFormPanel } from './components/NodeForms/NodeFormPanel';
import { SimulationPanel } from './components/Sandbox/SimulationPanel';
import { useNodeSelection } from './hooks/useNodeSelection';
import { useWorkflowValidation } from './hooks/useWorkflowValidation';
import { useSimulation } from './hooks/useSimulation';
import { getAutomations } from './api/mockApi';

export const App = () => {
  const canvasRef = useRef<any>(null);
  const { selectedNodeId, selectNode, clearSelection } = useNodeSelection();
  const { errors, validate } = useWorkflowValidation();
  const { logs, isRunning, runSimulation, clearLogs } = useSimulation();
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showSimulation, setShowSimulation] = useState(false);
  const [automations] = useState(getAutomations());

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const handleNodeUpdate = useCallback(
    (nodeId: string, data: any) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId ? { ...node, data } : node
        )
      );
    },
    []
  );

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((prevNodes) =>
        prevNodes.filter((node) => node.id !== nodeId)
      );
      setEdges((prevEdges) =>
        prevEdges.filter(
          (edge) =>
            edge.source !== nodeId && edge.target !== nodeId
        )
      );
      clearSelection();
    },
    [clearSelection]
  );

  const handleExportJSON = useCallback(() => {
    const canvasNodes = canvasRef.current?.getNodes() || nodes;
    const canvasEdges = canvasRef.current?.getEdges() || edges;

    const workflow = {
      name: 'HR Workflow',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      nodes: canvasNodes,
      edges: canvasEdges,
    };

    const jsonString = JSON.stringify(workflow, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleRunWorkflow = useCallback(async () => {
    const canvasNodes = canvasRef.current?.getNodes() || nodes;
    const canvasEdges = canvasRef.current?.getEdges() || edges;

    const result = validate(canvasNodes, canvasEdges);
    if (!result.valid) {
      setShowSimulation(true);
      return;
    }

    setShowSimulation(true);
    clearLogs();
    await runSimulation(canvasNodes, canvasEdges);
  }, [nodes, edges, validate, clearLogs, runSimulation]);

  const handleClearWorkflow = useCallback(() => {
    if (window.confirm('Clear entire workflow? This cannot be undone.')) {
      setNodes([]);
      setEdges([]);
      clearSelection();
      clearLogs();
    }
  }, [clearSelection, clearLogs]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              HR Workflow Designer
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Design and simulate workflows with visual editor
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              title="Export workflow as JSON"
            >
              <Download size={18} />
              Export JSON
            </button>
            <button
              onClick={handleClearWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              title="Clear entire workflow"
            >
              <Trash2 size={18} />
              Clear
            </button>
            <button
              onClick={handleRunWorkflow}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={18} />
              {isRunning ? 'Running...' : 'Run Workflow'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <NodeSidebar />

        {/* Canvas */}
        <WorkflowCanvas
          ref={canvasRef}
          selectedNodeId={selectedNodeId}
          onNodeSelect={selectNode}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
          nodes={nodes}
          edges={edges}
        />

        {/* Right Panel */}
        <NodeFormPanel
          node={selectedNode}
          onNodeUpdate={handleNodeUpdate}
          onNodeDelete={handleNodeDelete}
          onClose={clearSelection}
          automationsList={automations}
        />
      </div>

      {/* Simulation Panel */}
      {showSimulation && (
        <SimulationPanel
          logs={logs}
          isRunning={isRunning}
          onClear={clearLogs}
          onClose={() => setShowSimulation(false)}
          errors={errors}
        />
      )}
    </div>
  );
};

export default App;
