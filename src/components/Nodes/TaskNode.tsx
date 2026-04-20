import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { CheckSquare } from 'lucide-react';
import type { TaskNodeData } from '../../types/workflow';

export const TaskNode = ({ data, selected }: NodeProps<TaskNodeData>) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md transition-all max-w-xs ${
        selected
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
          : 'border-blue-400'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <CheckSquare size={16} className="text-blue-500 flex-shrink-0" />
        <span className="font-semibold text-gray-800 text-sm break-words">
          {data.title || 'Task'}
        </span>
      </div>
      {data.assignee && (
        <div className="text-xs text-gray-600 mb-1">👤 {data.assignee}</div>
      )}
      {data.dueDate && (
        <div className="text-xs text-gray-600 mb-1">📅 {data.dueDate}</div>
      )}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
