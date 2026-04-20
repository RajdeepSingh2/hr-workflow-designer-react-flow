import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Zap } from 'lucide-react';
import type { AutomatedNodeData } from '../../types/workflow';

const automationLabels: Record<string, string> = {
  send_email: '📧 Send Email',
  generate_doc: '📄 Generate Doc',
  notify_manager: '👔 Notify Manager',
};

export const AutomatedNode = ({ data, selected }: NodeProps<AutomatedNodeData>) => {
  const actionLabel = automationLabels[data.automationId] || data.automationId;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md transition-all max-w-xs ${
        selected
          ? 'border-yellow-500 shadow-lg ring-2 ring-yellow-200'
          : 'border-yellow-400'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap size={16} className="text-yellow-500 flex-shrink-0" />
        <span className="font-semibold text-gray-800 text-sm break-words">
          {data.title || 'Automated'}
        </span>
      </div>
      <div className="text-xs text-gray-600">{actionLabel}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
