import { useState, useRef, useCallback } from 'react';
import { apiClient, User } from '../api';

interface DashboardDataState {
  applications: User[];
  loading: boolean;
  error: string;
  totalPages: number;
}

interface UseDashboardDataOptions {
  fetchFunction: (params: any) => Promise<{ users: User[]; pagination: { totalPages: number } }>;
  initialParams?: any;
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
  const timeoutRef = useRef<NodeJS.Timeout>();

  const fetchData = useCallback(async (params: any) => {
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
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch data',
        loading: false,
      }));
    } finally {
      requestInProgress.current = false;
    }
  }, [fetchFunction]);

  const debouncedFetch = useCallback((params: any, delay: number = 500) => {
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
