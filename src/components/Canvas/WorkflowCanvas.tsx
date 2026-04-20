import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { StartNode } from '../Nodes/StartNode';
import { TaskNode } from '../Nodes/TaskNode';
import { ApprovalNode } from '../Nodes/ApprovalNode';
import { AutomatedNode } from '../Nodes/AutomatedNode';
import { EndNode } from '../Nodes/EndNode';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '../../types/workflow';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

interface WorkflowCanvasProps {
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  nodes?: Node[];
  edges?: Edge[];
}

export const WorkflowCanvas = React.forwardRef<
  any,
  WorkflowCanvasProps
>(({ selectedNodeId, onNodeSelect, onNodesChange, onEdgesChange, nodes: propNodes = [], edges: propEdges = [] }, ref) => {
  const [nodes, setNodes, onNodesStateChange] = useNodesState(propNodes);
  const [edges, setEdges, onEdgesStateChange] = useEdgesState(propEdges);
  const flowContainerRef = useRef<HTMLDivElement>(null);

  // Sync with parent state changes
  React.useEffect(() => {
    setNodes(propNodes);
  }, [propNodes, setNodes]);

  React.useEffect(() => {
    setEdges(propEdges);
  }, [propEdges, setEdges]);

  // Expose nodes and edges to parent
  React.useImperativeHandle(ref, () => ({
    getNodes: () => nodes,
    getEdges: () => edges,
  }));

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = addEdge(connection, edges);
      setEdges(newEdge);
      onEdgesChange(newEdge);
    },
    [edges, setEdges, onEdgesChange]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      // Calculate position relative to the flow container
      const container = flowContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      let newNode: Node;
      const nodeId = `${type}-${Date.now()}`;

      switch (type) {
        case 'start':
          newNode = {
            id: nodeId,
            data: {
              title: 'Start',
              metadata: [],
            } as StartNodeData,
            position,
            type: 'start',
          };
          break;
        case 'task':
          newNode = {
            id: nodeId,
            data: {
              title: 'New Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: [],
            } as TaskNodeData,
            position,
            type: 'task',
          };
          break;
        case 'approval':
          newNode = {
            id: nodeId,
            data: {
              title: 'Approval',
              approverRole: 'Manager',
              autoApproveThreshold: 0,
            } as ApprovalNodeData,
            position,
            type: 'approval',
          };
          break;
        case 'automated':
          newNode = {
            id: nodeId,
            data: {
              title: 'Automated Step',
              automationId: 'send_email',
              parameters: [],
            } as AutomatedNodeData,
            position,
            type: 'automated',
          };
          break;
        case 'end':
          newNode = {
            id: nodeId,
            data: {
              endMessage: 'Workflow Complete',
              summaryFlag: false,
            } as EndNodeData,
            position,
            type: 'end',
          };
          break;
        default:
          return;
      }

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      onNodesChange(newNodes);
    },
    [nodes, setNodes, onNodesChange]
  );

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeSelect(node.id);
    },
    [onNodeSelect]
  );

  return (
    <div ref={flowContainerRef} className="flex-1 relative">
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          selected: node.id === selectedNodeId,
        }))}
        edges={edges}
        onNodesChange={onNodesStateChange}
        onEdgesChange={onEdgesStateChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
});

WorkflowCanvas.displayName = 'WorkflowCanvas';
