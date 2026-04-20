import { Play, CheckSquare, Shield, Zap, CheckCircle } from 'lucide-react';

interface NodeType {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const nodeTypes: NodeType[] = [
  {
    type: 'start',
    label: 'Start Node',
    icon: <Play size={18} />,
    color: 'bg-green-50 border-green-200 hover:border-green-400',
  },
  {
    type: 'task',
    label: 'Task Node',
    icon: <CheckSquare size={18} />,
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
  },
  {
    type: 'approval',
    label: 'Approval Node',
    icon: <Shield size={18} />,
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  },
  {
    type: 'automated',
    label: 'Automated Step',
    icon: <Zap size={18} />,
    color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
  },
  {
    type: 'end',
    label: 'End Node',
    icon: <CheckCircle size={18} />,
    color: 'bg-red-50 border-red-200 hover:border-red-400',
  },
];

export const NodeSidebar = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/reactflow', nodeType);
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-bold text-gray-800 mb-4">NODE TYPES</h2>
        <div className="space-y-2">
          {nodeTypes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              className={`p-3 rounded border-2 cursor-move transition-all ${node.color}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-700">{node.icon}</span>
                <span className="text-sm font-medium text-gray-800">
                  {node.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">Drag to canvas</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
