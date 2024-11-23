'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import client, { urlFor } from '@/sanityClient';
import Card from './ui/card';
import { FilterDrawer } from './FilterDrawer';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
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
  console.log('Fetched Data:', result);
  return result;
};

const Insects = () => {
  const [activeFilter, setActiveFilter] = useState<{ type: 'order' | 'class', value: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: insects = [], isLoading } = useQuery<Insect[]>({
    queryKey: ['insects'],
    queryFn: fetchInsects,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false, // Avoid refetching when switching tabs
  });

  const filteredInsects = useMemo(() => {
    if (!activeFilter) return insects;
    return insects.filter(insect => insect[activeFilter.type] === activeFilter.value);
  }, [insects, activeFilter]);

  const orders = useMemo(() => [...new Set(insects.map(insect => insect.order))], [insects]);
  const classes = useMemo(() => [...new Set(insects.map(insect => insect.class))], [insects]);

  const handleFilterChange = (type: 'order' | 'class', value: string | null) => {
    setActiveFilter(value ? { type, value } : null);
  };

  return (
    <div className="flex h-screen">
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="fixed left-4 top-4 z-10 lg:hidden"
            aria-label="Open filters"
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <FilterDrawer 
            orders={orders}
            classes={classes}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            onClose={() => setIsDrawerOpen(false)}
            isMobileDrawer={true}
          />
        </SheetContent>
      </Sheet>

      <div className="hidden lg:block">
        <FilterDrawer 
          orders={orders}
          classes={classes}
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          onClose={() => {}}
          isMobileDrawer={false}
        />
      </div>

      <ScrollArea className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Insect Catalogue</h1>
        {activeFilter && (
          <div className="mb-4">
            <span className="font-semibold">Active Filter:</span> {activeFilter.type} - {activeFilter.value}
          </div>
        )}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInsects.map((insect) => (
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
                slug={insect.slug.current}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Insects;

