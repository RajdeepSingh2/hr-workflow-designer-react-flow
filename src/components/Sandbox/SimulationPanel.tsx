import type { ExecutionLog } from '../../types/workflow';
import { AlertCircle, CheckCircle, Loader, X } from 'lucide-react';

interface SimulationPanelProps {
  logs: ExecutionLog[];
  isRunning: boolean;
  onClear: () => void;
  onClose: () => void;
  errors: string[];
}

export const SimulationPanel = ({
  logs,
  isRunning,
  onClear,
  onClose,
  errors,
}: SimulationPanelProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-2xl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">Workflow Execution</h3>
            {isRunning && (
              <Loader size={18} className="animate-spin text-blue-500" />
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClear}
              className="text-xs bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear Logs
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-52 overflow-y-auto p-4 bg-gray-50">
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle
                  size={18}
                  className="text-red-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <h4 className="text-sm font-semibold text-red-800">
                    Validation Errors
                  </h4>
                  <ul className="text-xs text-red-700 mt-1 space-y-1">
                    {errors.map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {logs.length === 0 && !isRunning && (
            <p className="text-sm text-gray-500 text-center py-4">
              {errors.length > 0
                ? 'Fix validation errors before running'
                : 'Click "Run Workflow" to start simulation'}
            </p>
          )}

          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.step}
                className="flex items-start gap-3 p-2.5 bg-white rounded border border-gray-200 text-sm hover:shadow-sm transition-shadow"
              >
                <div className="mt-0.5 flex-shrink-0">
                  {log.status === 'success' && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                  {log.status === 'error' && (
                    <AlertCircle size={16} className="text-red-500" />
                  )}
                  {log.status === 'running' && (
                    <Loader size={16} className="text-blue-500 animate-spin" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-gray-700">{log.message}</span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Step {log.step}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isRunning && logs.length > 0 && (
            <div className="flex items-center justify-center py-4">
              <Loader size={18} className="animate-spin text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Executing workflow...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
