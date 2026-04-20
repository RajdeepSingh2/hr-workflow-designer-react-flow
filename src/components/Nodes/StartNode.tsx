import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import type { StartNodeData } from '../../types/workflow';

export const StartNode = ({ data, selected }: NodeProps<StartNodeData>) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md transition-all max-w-xs ${
        selected
          ? 'border-green-500 shadow-lg ring-2 ring-green-200'
          : 'border-green-400'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Play size={16} className="text-green-500 flex-shrink-0" />
        <span className="font-semibold text-gray-800 text-sm break-words">
          {data.title || 'Start'}
        </span>
      </div>
      <div className="text-xs text-gray-500">Start Node</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
