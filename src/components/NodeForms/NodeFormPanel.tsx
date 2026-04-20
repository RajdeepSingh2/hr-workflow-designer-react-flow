import { useState, useEffect } from 'react';
import type { Node } from 'reactflow';
import { X, Trash2, Save } from 'lucide-react';
import { getAutomations } from '../../api/mockApi';

interface NodeFormPanelProps {
  node: Node | null;
  onNodeUpdate: (nodeId: string, data: any) => void;
  onNodeDelete: (nodeId: string) => void;
  onClose: () => void;
  automationsList?: any[];
}

export const NodeFormPanel = ({
  node,
  onNodeUpdate,
  onNodeDelete,
  onClose,
  automationsList = [],
}: NodeFormPanelProps) => {
  const [formData, setFormData] = useState<any>(node?.data || {});
  const [automations, setAutomations] = useState(automationsList);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (node) {
      setFormData(node.data);
    }
  }, [node]);

  useEffect(() => {
    if (automations.length === 0) {
      setAutomations(getAutomations());
    }
  }, []);

  if (!node) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex items-center justify-center p-4">
        <p className="text-gray-500 text-center">
          Select a node to edit its properties
        </p>
      </div>
    );
  }

  const nodeType = node.type || '';

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
  };

  const handleSave = () => {
    onNodeUpdate(node.id, formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this node? All connected edges will be removed.')) {
      onNodeDelete(node.id);
    }
  };

  const handleMetadataChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updated = [...(formData.metadata || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('metadata', updated);
  };

  const addMetadata = () => {
    const updated = [...(formData.metadata || []), { key: '', value: '' }];
    handleChange('metadata', updated);
  };

  const removeMetadata = (index: number) => {
    const updated = (formData.metadata || []).filter(
      (_: any, i: number) => i !== index
    );
    handleChange('metadata', updated);
  };

  const handleCustomFieldChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...(formData.customFields || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('customFields', updated);
  };

  const addCustomField = () => {
    const updated = [...(formData.customFields || []), { name: '', value: '' }];
    handleChange('customFields', updated);
  };

  const removeCustomField = (index: number) => {
    const updated = (formData.customFields || []).filter(
      (_: any, i: number) => i !== index
    );
    handleChange('customFields', updated);
  };

  const handleParameterChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const updated = [...(formData.parameters || [])];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('parameters', updated);
  };

  const addParameter = () => {
    const updated = [...(formData.parameters || []), { key: '', value: '' }];
    handleChange('parameters', updated);
  };

  const removeParameter = (index: number) => {
    const updated = (formData.parameters || []).filter(
      (_: any, i: number) => i !== index
    );
    handleChange('parameters', updated);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col h-full">
      <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">
          {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Properties
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* START NODE */}
        {nodeType === 'start' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Metadata
                </label>
                <button
                  onClick={addMetadata}
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {(formData.metadata || []).map(
                  (item: any, idx: number) => (
                    <div key={idx} className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Key"
                        value={item.key}
                        onChange={(e) =>
                          handleMetadataChange(idx, 'key', e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={item.value}
                        onChange={(e) =>
                          handleMetadataChange(idx, 'value', e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={() => removeMetadata(idx)}
                        className="text-red-500 hover:text-red-700 text-xs px-2"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {/* TASK NODE */}
        {nodeType === 'task' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignee
              </label>
              <input
                type="text"
                value={formData.assignee || ''}
                onChange={(e) => handleChange('assignee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Fields
                </label>
                <button
                  onClick={addCustomField}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {(formData.customFields || []).map(
                  (field: any, idx: number) => (
                    <div key={idx} className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Name"
                        value={field.name}
                        onChange={(e) =>
                          handleCustomFieldChange(idx, 'name', e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                          handleCustomFieldChange(idx, 'value', e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeCustomField(idx)}
                        className="text-red-500 hover:text-red-700 text-xs px-2"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {/* APPROVAL NODE */}
        {nodeType === 'approval' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approver Role
              </label>
              <input
                type="text"
                value={formData.approverRole || ''}
                onChange={(e) => handleChange('approverRole', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auto-Approve Threshold (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.autoApproveThreshold || 0}
                onChange={(e) =>
                  handleChange('autoApproveThreshold', Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </>
        )}

        {/* AUTOMATED NODE */}
        {nodeType === 'automated' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Automation Action
              </label>
              <select
                value={formData.automationId || ''}
                onChange={(e) => handleChange('automationId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Select an automation</option>
                {automations.map((auto: any) => (
                  <option key={auto.id} value={auto.id}>
                    {auto.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Parameters
                </label>
                <button
                  onClick={addParameter}
                  className="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {(formData.parameters || []).map(
                  (param: any, idx: number) => (
                    <div key={idx} className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Key"
                        value={param.key}
                        onChange={(e) =>
                          handleParameterChange(idx, 'key', e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={param.value}
                        onChange={(e) =>
                          handleParameterChange(idx, 'value', e.target.value)
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                      <button
                        onClick={() => removeParameter(idx)}
                        className="text-red-500 hover:text-red-700 text-xs px-2"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {/* END NODE */}
        {nodeType === 'end' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Message
              </label>
              <textarea
                value={formData.endMessage || ''}
                onChange={(e) => handleChange('endMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.summaryFlag || false}
                  onChange={(e) => handleChange('summaryFlag', e.target.checked)}
                  className="w-4 h-4"
                />
                Include Summary
              </label>
            </div>
          </>
        )}
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 text-sm text-center">
          ✓ Node updated successfully
        </div>
      )}

      {/* Footer Buttons */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-2">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Save size={18} />
          Update Node
        </button>
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Trash2 size={18} />
          Delete Node
        </button>
      </div>
    </div>
  );
};
