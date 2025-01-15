'use client';

import { QueryClient, QueryClientProvider, DefaultOptions } from '@tanstack/react-query';
import { ReactNode } from 'react';

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 60 * 12, 
    gcTime: 1000 * 60 * 60 * 24, 
    refetchOnWindowFocus: false, 
  },
};

const queryClient = new QueryClient({ defaultOptions });

export const QueryProvider = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);
