import { useMemo } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import client from '@/sanityClient';
import { Insect } from '@/sanity/types/types';

const ITEMS_PER_PAGE = 20;

interface FilterParams {
  type: 'order' | 'class';
  value: string;
}

export const queryKeys = {
  insects: ['insects'] as const,
  insect: (slug: string) => ['insect', slug] as const,
};

export const useAllInsects = () => {
  return useQuery({
    queryKey: queryKeys.insects,
    queryFn: async () => {
      const query = `*[_type == "insect"] | order(title asc) {
        _id,
        title,
        latinTitle,
        shortDescription,
        image,
        slug,
        "order": order->name,
        "class": order->class->name
      }`;
      return client.fetch(query);
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useInsectsPaginated = (filter: FilterParams | null) => {
  const { data: allInsects = [], isLoading } = useAllInsects();
  
  // Apply filter to all insects
  const filteredInsects = useMemo(() => {
    return filter
    ? allInsects.filter((insect: { [x: string]: string; }) => insect[filter.type] === filter.value)
    : allInsects;
  }, [filter, allInsects]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredInsects.length / ITEMS_PER_PAGE);
  const totalCount = filteredInsects.length;

  // Function to get insects for a specific page
  const getPageInsects = (pageIndex: number) => {
    const start = pageIndex * ITEMS_PER_PAGE;
    return filteredInsects.slice(start, start + ITEMS_PER_PAGE);
  };

  return {
    insects: filteredInsects,
    isLoading,
    totalCount,
    totalPages,
    getPageInsects,
  };
};

// Hook for individual insect details
export const useInsect = (slug: string) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: queryKeys.insect(slug),
    queryFn: async () => {
      const query = `*[_type == "insect" && slug.current == $slug][0]{
        title,
        latinTitle,
        description,
        image,
        shortDescription,
        "order": order->name,
        "class": order->class->name
      }`;
      return client.fetch(query, { slug });
    },
    initialData: () => {
      // Try to find the insect in the main cache
      const cachedInsects = queryClient.getQueryData<Insect[]>(queryKeys.insects);
      return cachedInsects?.find(insect => insect.slug.current === slug);
    },
  });
};