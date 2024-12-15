'use client';

import { QueryClient, QueryClientProvider, DefaultOptions } from '@tanstack/react-query';
import { ReactNode } from 'react';

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (was previously cacheTime)
    refetchOnWindowFocus: false, // Do not refetch on window focus
  },
};

const queryClient = new QueryClient({ defaultOptions });

export const QueryProvider = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);
