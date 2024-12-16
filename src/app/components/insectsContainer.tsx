'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useInsectsInfinite } from "../hooks/useInsectsInfinite"; 
import { useTaxonomies } from "../hooks/useTaxonomies";
import Card from './ui/card';
import { FilterDrawer } from './FilterDrawer';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { urlFor } from '@/sanityClient';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ChevronRight } from 'lucide-react';
import { ImSpinner2 } from "react-icons/im";

const INTERSECTION_THRESHOLD = 0.5; // Trigger when 50% of the sentinel is visible

const Insects = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{ type: 'order' | 'class', value: string } | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: taxonomies, isLoading: taxonomiesLoading } = useTaxonomies();
  const orders = taxonomies?.orders || [];
  const classes = taxonomies?.classes || [];

  const {
    data,
    isLoading: insectsLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInsectsInfinite(activeFilter);

  const insects = data?.pages.flat() || [];
  const totalCount = insects.length;

  // Intersection Observer setup for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, 
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: INTERSECTION_THRESHOLD,
      root: null, // viewport
      rootMargin: '100px',
    });
  
    const currentRef = loadMoreRef.current; // Capture the ref at the time useEffect runs
    if (currentRef) observer.observe(currentRef);
  
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [handleObserver]); // ✅ No more reference issues
  

  // Handle URL changes (back/forward button)
  const handlePopState = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const filterType = params.get('type') as 'order' | 'class';
    const filterValue = params.get('value');
  
    if (filterType && filterValue) {
      setActiveFilter({ type: filterType, value: filterValue });
    } else {
      setActiveFilter(null);
    }
  }, []);
  
  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    handlePopState();
  
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);
  

  // Update URL and filter state when the filter changes
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

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
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
            <SheetTitle>Filters</SheetTitle>
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
              <div 
                ref={loadMoreRef} 
                className="mt-8 flex justify-center"
              >
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