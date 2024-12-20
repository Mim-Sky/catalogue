import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import client from '@/sanityClient';
import { Insect } from '@/sanity/types/types';


const ITEMS_PER_PAGE = 10;


interface FilterParams {
  type: 'order' | 'class';
  value: string;
}

export const queryKeys = {
    insects: ['insects'],
    insect: (slug: string) => ['insect', slug],
    insectsInfinite: (filter: FilterParams | null) => 
      filter 
        ? ['insects-infinite', { type: filter.type, value: filter.value }] 
        : ['insects-infinite', 'all'], 
  };

const fetchInsectsPage = async ({ pageParam = 0, filter }: { pageParam?: number; filter: FilterParams | null }) => {
  const start = pageParam * ITEMS_PER_PAGE;
  let filterQuery = '';

  if (filter && filter.type && filter.value) {
    if (filter.type === 'order') {
      filterQuery = `&& order->name == "${filter.value.trim()}"`;
    } else if (filter.type === 'class') {
      filterQuery = `&& order->class->name == "${filter.value.trim()}"`; 
    }
  }

  const query = `*[_type == "insect" ${filterQuery}] | order(title asc) [${start}...${start + ITEMS_PER_PAGE}] {
    _id,
    title,
    latinTitle,
    shortDescription,
    image,
    slug,
    "order": order->name,
    "class": order->class->name
  }`;

  return client.fetch<Insect[]>(query);
};

export const useInsectsInfinite = (filter: FilterParams | null) => {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: queryKeys.insectsInfinite(filter),
    queryFn: ({ pageParam = 0 }) => fetchInsectsPage({ pageParam, filter }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < ITEMS_PER_PAGE) return undefined;
      return allPages.length;
    },
  });
};
