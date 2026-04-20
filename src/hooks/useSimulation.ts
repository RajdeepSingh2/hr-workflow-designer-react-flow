import { useState, useCallback } from 'react';
import type { Node, Edge } from 'reactflow';
import type { ExecutionLog } from '../types/workflow';
import { simulateWorkflow } from '../api/mockApi';

export const useSimulation = () => {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = useCallback(async (nodes: Node[], edges: Edge[]) => {
    setIsRunning(true);
    setLogs([]);

    // Simulate a delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = await simulateWorkflow(nodes, edges);
    
    // Add logs one by one with delay for visual effect
    let currentLogs: ExecutionLog[] = [];
    for (let i = 0; i < result.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      currentLogs.push(result[i]);
      setLogs([...currentLogs]);
    }

    setIsRunning(false);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    logs,
    isRunning,
    runSimulation,
    clearLogs,
  };
};
