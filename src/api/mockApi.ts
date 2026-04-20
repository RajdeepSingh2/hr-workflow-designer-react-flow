import type { Automation, ExecutionLog } from '../types/workflow';
import type { Node, Edge } from 'reactflow';

export const getAutomations = (): Automation[] => {
  return [
    {
      id: 'send_email',
      label: 'Send Email',
      params: ['to', 'subject'],
    },
    {
      id: 'generate_doc',
      label: 'Generate Document',
      params: ['template', 'recipient'],
    },
    {
      id: 'notify_manager',
      label: 'Notify Manager',
      params: ['managerId'],
    },
  ];
};

export const simulateWorkflow = async (
  nodes: Node[],
  _edges: Edge[]
): Promise<ExecutionLog[]> => {
  const logs: ExecutionLog[] = [];

  // Find the workflow name (start node title)
  const startNode = nodes.find((n) => n.type === 'start');
  const startTitle = startNode?.data?.title || 'Workflow';

  // Start
  logs.push({
    step: 1,
    message: `✓ ${startTitle} initiated`,
    status: 'success',
  });

  // Process task nodes
  const taskNodes = nodes.filter((n) => n.type === 'task');
  taskNodes.forEach((node) => {
    const nodeData = node.data as any;
    const taskName = nodeData.title || 'Task';
    const assignee = nodeData.assignee || 'Team';
    logs.push({
      step: logs.length + 1,
      message: `→ ${taskName} assigned to ${assignee}`,
      status: 'success',
    });
  });

  // Process approval nodes
  const approvalNodes = nodes.filter((n) => n.type === 'approval');
  approvalNodes.forEach((node) => {
    const nodeData = node.data as any;
    const approvalTitle = nodeData.title || 'Approval';
    const approverRole = nodeData.approverRole || 'Manager';
    logs.push({
      step: logs.length + 1,
      message: `⧉ ${approvalTitle} request sent to ${approverRole}`,
      status: 'success',
    });
    logs.push({
      step: logs.length + 1,
      message: `✓ ${approverRole} approved the request`,
      status: 'success',
    });
  });

  // Process automated nodes
  const automatedNodes = nodes.filter((n) => n.type === 'automated');
  automatedNodes.forEach((node) => {
    const nodeData = node.data as any;
    const nodeTitle = nodeData.title || 'Automation';
    const automationId = nodeData.automationId || 'action';
    
    let actionMsg = '';
    if (automationId === 'send_email') {
      actionMsg = `📧 ${nodeTitle}: Email sent successfully to recipients`;
    } else if (automationId === 'generate_doc') {
      actionMsg = `📄 ${nodeTitle}: Document generated and prepared`;
    } else if (automationId === 'notify_manager') {
      actionMsg = `🔔 ${nodeTitle}: Manager notification sent`;
    } else {
      actionMsg = `⚙️ ${nodeTitle}: Automation executed`;
    }

    logs.push({
      step: logs.length + 1,
      message: actionMsg,
      status: 'success',
    });
  });

  // End
  const endNode = nodes.find((n) => n.type === 'end');
  const endMessage = endNode?.data?.endMessage || 'Workflow completed';
  logs.push({
    step: logs.length + 1,
    message: `✓ ${endMessage}`,
    status: 'success',
  });

  return logs;
};

export const validateWorkflow = (
  nodes: Node[],
  edges: Edge[]
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check for exactly one start node
  const startNodes = nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have exactly one Start Node');
  } else if (startNodes.length > 1) {
    errors.push('Workflow cannot have more than one Start Node');
  }

  // Check start node has no incoming edges
  const startNode = startNodes[0];
  if (startNode) {
    const incomingEdges = edges.filter((e) => e.target === startNode.id);
    if (incomingEdges.length > 0) {
      errors.push('Start Node cannot have incoming edges');
    }
  }

  // Check for exactly one end node
  const endNodes = nodes.filter((n) => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push('Workflow must have exactly one End Node');
  } else if (endNodes.length > 1) {
    errors.push('Workflow cannot have more than one End Node');
  }

  // Check end node has no outgoing edges
  const endNode = endNodes[0];
  if (endNode) {
    const outgoingEdges = edges.filter((e) => e.source === endNode.id);
    if (outgoingEdges.length > 0) {
      errors.push('End Node cannot have outgoing edges');
    }
  }

  // Check for disconnected nodes
  const connectedNodeIds = new Set<string>();
  nodes.forEach((node) => {
    if (node.type === 'start' || node.type === 'end') {
      connectedNodeIds.add(node.id);
    }
  });

  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const disconnectedNodes = nodes.filter((n) => !connectedNodeIds.has(n.id));
  disconnectedNodes.forEach((node) => {
    errors.push(`⚠️ Node "${(node.data as any).title || 'Unnamed'}" is disconnected`);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
