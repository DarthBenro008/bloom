import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  TaskWithSubtasks,
  CreateTaskRequest,
  CompleteTaskRequest,
  CompleteTaskResponse,
  InitiateCompletionResponse,
} from '@/lib/api/types';
import { gardenKeys } from './use-garden';

export const taskKeys = {
  all: ['tasks'] as const,
  detail: (id: string) => ['tasks', id] as const,
};

/**
 * Get all tasks for current user
 */
export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: async (): Promise<TaskWithSubtasks[]> => {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      return res.json();
    },
  });
}

/**
 * Get a single task by ID
 */
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async (): Promise<TaskWithSubtasks> => {
      const res = await fetch(`/api/tasks/${id}`);
      if (!res.ok) throw new Error('Failed to fetch task');
      return res.json();
    },
    enabled: !!id,
  });
}

/**
 * Create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskRequest) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Task created!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create task');
    },
  });
}

/**
 * Start working on a task
 */
export function useStartTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}/start`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start task');
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Task started!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to start task');
    },
  });
}

/**
 * Toggle subtask completion
 */
export function useToggleSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subtaskId, taskId }: { subtaskId: string; taskId: string }) => {
      const res = await fetch(`/api/subtasks/${subtaskId}/toggle`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to toggle subtask');
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update subtask');
    },
  });
}

/**
 * Initiate task completion (get reflection question)
 */
export function useInitiateCompletion() {
  return useMutation({
    mutationFn: async (taskId: string): Promise<InitiateCompletionResponse> => {
      const res = await fetch(`/api/tasks/${taskId}/initiate-completion`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to get reflection question');
      return res.json();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to prepare completion');
    },
  });
}

/**
 * Complete a task with reflection
 */
export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      reflectionResponse,
    }: {
      taskId: string;
      reflectionResponse: string;
    }): Promise<CompleteTaskResponse> => {
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflectionResponse }),
      });
      if (!res.ok) throw new Error('Failed to complete task');
      return res.json();
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: gardenKeys.all });
      toast.success('Task completed! Your garden is growing 🌱');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to complete task');
    },
  });
}

/**
 * Abandon a task
 */
export function useAbandonTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}/abandon`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to abandon task');
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: gardenKeys.all });
      toast.info('Task abandoned');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to abandon task');
    },
  });
}
