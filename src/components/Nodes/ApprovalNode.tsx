import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Shield } from 'lucide-react';
import type { ApprovalNodeData } from '../../types/workflow';

export const ApprovalNode = ({ data, selected }: NodeProps<ApprovalNodeData>) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md transition-all max-w-xs ${
        selected
          ? 'border-purple-500 shadow-lg ring-2 ring-purple-200'
          : 'border-purple-400'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Shield size={16} className="text-purple-500 flex-shrink-0" />
        <span className="font-semibold text-gray-800 text-sm break-words">
          {data.title || 'Approval'}
        </span>
      </div>
      {data.approverRole && (
        <div className="text-xs text-gray-600 mb-1">👥 {data.approverRole}</div>
      )}
      <div className="text-xs text-gray-500">
        Auto-approve: {data.autoApproveThreshold || 0}%
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
