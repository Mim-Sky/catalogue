'use client';

import { useQuery } from '@tanstack/react-query';
import client, { urlFor } from '@/sanityClient';
import Card from './ui/card';
import { Insect } from '@/sanity/types/types';

// Fetch function for insects
const fetchInsects = async (): Promise<Insect[]> => {
  const query = `*[_type == "insect"] | order(title asc) {
    _id,
    title,
    latinTitle,
    shortDescription,
    image {
      asset {
        _ref
      }
    },
    slug,
    "order": order->name,
    "class": order->class->name
  }`;
  const result = await client.fetch(query);
  console.log('Fetched Data:', result); // Debug: log the fetched data
  return result;
};

// Functional component for Insects
const Insects = () => {
  const { data: insects = [], isLoading } = useQuery<Insect[]>({
    queryKey: ['insects'],
    queryFn: fetchInsects,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false, // Avoid refetching when switching tabs
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        insects.map((insect: Insect) => {
          console.log(`Insect Slug: ${insect.slug.current}`); // Debug: log slug.current
          return (
            <Card
              key={insect._id}
              imageUrl={
                insect.image
                  ? urlFor(insect.image).width(330).height(330).url()
                  : '/zombie.webp'
              }
              title={insect.title}
              latinTitle={insect.latinTitle}
              shortDescription={insect.shortDescription}
              slug={insect.slug.current} // Use slug.current here
            />
          );
        })
      )}
    </div>
  );
};

export default Insects;
