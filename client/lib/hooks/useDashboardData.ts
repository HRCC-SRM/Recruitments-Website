import { useState, useRef, useCallback } from 'react';
import { User } from '../api';

interface DashboardDataState {
  applications: User[];
  loading: boolean;
  error: string;
  totalPages: number;
}

interface UseDashboardDataOptions {
  fetchFunction: (params: Record<string, unknown>) => Promise<{ users: User[]; pagination: { totalPages: number } }>;
  initialParams?: Record<string, unknown>;
}

export function useDashboardData({ fetchFunction, initialParams = {} }: UseDashboardDataOptions) {
  const [state, setState] = useState<DashboardDataState>({
    applications: [],
    loading: true,
    error: '',
    totalPages: 1,
  });

  const requestInProgress = useRef(false);
  const lastParams = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchData = useCallback(async (params: Record<string, unknown>) => {
    const paramsString = JSON.stringify(params);
    
    // Skip if same params or request in progress
    if (requestInProgress.current || lastParams.current === paramsString) {
      return;
    }

    requestInProgress.current = true;
    lastParams.current = paramsString;

    try {
      setState(prev => ({ ...prev, loading: true, error: '' }));
      
      const response = await fetchFunction(params);
      
      setState(prev => ({
        ...prev,
        applications: response.users,
        totalPages: response.pagination.totalPages,
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    } finally {
      requestInProgress.current = false;
    }
  }, [fetchFunction]);

  const debouncedFetch = useCallback((params: Record<string, unknown>, delay: number = 500) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      fetchData(params);
    }, delay);
  }, [fetchData]);

  return {
    ...state,
    fetchData: debouncedFetch,
    refetch: () => fetchData(initialParams),
  };
}
