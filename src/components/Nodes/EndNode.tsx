import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { CheckCircle } from 'lucide-react';
import type { EndNodeData } from '../../types/workflow';

export const EndNode = ({ data, selected }: NodeProps<EndNodeData>) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md transition-all max-w-xs ${
        selected
          ? 'border-red-500 shadow-lg ring-2 ring-red-200'
          : 'border-red-400'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle size={16} className="text-red-500 flex-shrink-0" />
        <span className="font-semibold text-gray-800 text-sm">End</span>
      </div>
      {data.endMessage && (
        <div className="text-xs text-gray-600 mb-1 break-words line-clamp-2">
          {data.endMessage}
        </div>
      )}
      <div className="text-xs text-gray-500">
        Summary: {data.summaryFlag ? '✓ Yes' : '✗ No'}
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
};
