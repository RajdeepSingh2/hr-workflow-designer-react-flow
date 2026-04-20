import type { Node } from 'reactflow';

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface CustomField {
  name: string;
  value: string;
  type?: 'text' | 'number' | 'date';
}

export interface StartNodeData {
  title: string;
  metadata: KeyValuePair[];
}

export interface TaskNodeData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: CustomField[];
}

export interface ApprovalNodeData {
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData {
  title: string;
  automationId: string;
  parameters: KeyValuePair[];
}

export interface EndNodeData {
  endMessage: string;
  summaryFlag: boolean;
}

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface WorkflowNode extends Node {
  data: NodeData;
  type: 'start' | 'task' | 'approval' | 'automated' | 'end';
}

export interface Automation {
  id: string;
  label: string;
  params: string[];
}

export interface WorkflowValidationError {
  type: string;
  message: string;
}

export interface ExecutionLog {
  step: number;
  message: string;
  status: 'pending' | 'running' | 'success' | 'error';
}
