import { useQuery } from '@tanstack/react-query';
import client from '@/sanityClient';

export const useTaxonomies = () => {
  return useQuery({
    queryKey: ['taxonomies'],
    queryFn: async () => {
      const query = `{
        "orders": *[_type == "order"] | order(name asc) { name },
        "classes": *[_type == "class"] | order(name asc) { name }
      }`;
      return client.fetch(query);
    },
    select: (data) => ({
      orders: data.orders.map((order: { name: string }) => order.name),
      classes: data.classes.map((cls: { name: string }) => cls.name),
    }),
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 24, 
    refetchOnWindowFocus: false, 
  });
};
