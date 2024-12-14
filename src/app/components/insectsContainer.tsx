'use client';

import { useState, useEffect } from 'react';
import { useInsectsInfinite } from "../hooks/useInsectsInfinite"; // New Hook
import { useTaxonomies } from "../hooks/useTaxonomies";
import Card from './ui/card';
import { FilterDrawer } from './FilterDrawer';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { urlFor } from '@/sanityClient';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight } from 'lucide-react';
import { ImSpinner2 } from "react-icons/im";

const Insects = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{ type: 'order' | 'class', value: string } | null>(null);

  const { data: taxonomies, isLoading: taxonomiesLoading } = useTaxonomies();
  const orders = taxonomies?.orders || [];
  const classes = taxonomies?.classes || [];

  // Use infiniteQuery-based hook
  const {
    data,
    isLoading: insectsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInsectsInfinite(activeFilter);

  // Flatten all pages
  const insects = data?.pages.flat() || [];
  const totalCount = insects.length; // This is total currently loaded, not total in DB
  // For total count of all results if needed, you could fetch a separate count query, 
  // or store it differently. For now, totalCount represents loaded insects.

  useEffect(() => {
    // When filter changes, infiniteQuery resets automatically.
    // No need to set a currentPage state anymore.
  }, [activeFilter]);
  useEffect(() => {
    console.log('Active Filter:', activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const filterType = params.get('type') as 'order' | 'class';
      const filterValue = params.get('value');
      
      if (filterType && filterValue) {
        setActiveFilter({ type: filterType, value: filterValue });
      } else {
        setActiveFilter(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    handlePopState();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleFilterChange = (type: 'order' | 'class', value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    
    if (value === null) {
      params.delete('type');
      params.delete('value');
      setActiveFilter(null);
    } else {
      params.set('type', type);
      params.set('value', value);
      setActiveFilter({ type, value });
    }

    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
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
        <h1 className="text-3xl font-bold mb-6">Discover insects & spiders</h1>
        {activeFilter && (
          <div className="mb-4">
            <span className="font-semibold">Active Filter:</span> {activeFilter.type} - {activeFilter.value}
            <span className="ml-4 text-gray-600">
              {totalCount} {totalCount === 1 ? 'result' : 'results'}
            </span>
          </div>
        )}
        
        {insectsLoading || taxonomiesLoading ? (
          <div className='flex justify-center'>
            <ImSpinner2 className='text-[#deecfa] animate-spin w-8 h-8'/>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {insects.map((insect) => (
                <Card
                  key={insect._id}
                  imageUrl={insect.image ? urlFor(insect.image).width(330).height(330).url() : '/zombie.webp'}
                  title={insect.title}
                  latinTitle={insect.latinTitle}
                  shortDescription={insect.shortDescription}
                  slug={insect.slug.current}
                />
              ))}
            </div>
            
            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => fetchNextPage()}
                  variant="outline"
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? 'Loading more...' : `Show More (${totalCount}+ loaded)`}
                </Button>
              </div>
            )}
          </>
        )}
      </ScrollArea>
    </div>
  );
};

export default Insects;
