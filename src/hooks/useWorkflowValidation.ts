import { useState, useCallback } from 'react';
import type { Node, Edge } from 'reactflow';
import { validateWorkflow as validateWorkflowAPI } from '../api/mockApi';

export const useWorkflowValidation = () => {
  const [errors, setErrors] = useState<string[]>([]);

  const validate = useCallback((nodes: Node[], edges: Edge[]) => {
    const result = validateWorkflowAPI(nodes, edges);
    setErrors(result.errors);
    return result;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    validate,
    clearErrors,
    isValid: errors.length === 0,
  };
};
