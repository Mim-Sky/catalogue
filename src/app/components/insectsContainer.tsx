'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useInsectsInfinite } from "../hooks/useInsectsInfinite"; 
import { useTaxonomies } from "../hooks/useTaxonomies";
import Card from './ui/card';
import { FilterDrawer } from './FilterDrawer';
import { urlFor } from '@/sanityClient';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ImSpinner2 } from "react-icons/im";
import { DialogTitle, DialogDescription, Dialog } from '@radix-ui/react-dialog';
import { useInsectFilter } from '../hooks/useInsectFilter'; // New hook we'll create

const INTERSECTION_THRESHOLD = 0.5;

const Insects = () => {
  const { isDrawerOpen, setIsDrawerOpen } = useInsectFilter(); // Use the shared state
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


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') as 'order' | 'class';
    const value = params.get('value');
    if (type && value) {
      setActiveFilter({ type, value });
    }
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

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ scrollPosition: window.scrollY }, '', newUrl);
  };

  useEffect(() => {
    const { scrollPosition } = window.history.state || {};

    if (scrollPosition !== undefined) {
      setTimeout(() => {
        window.scrollTo({ top: scrollPosition, behavior: 'auto' });
      }, 100);
    }

    const saveScrollPosition = () => {
      window.history.replaceState(
        { ...window.history.state, scrollPosition: window.scrollY },
        ''
      );
    };

    window.addEventListener('scroll', saveScrollPosition);
    return () => window.removeEventListener('scroll', saveScrollPosition);
  }, []);

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
      root: null,
      rootMargin: '100px',
    });

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [handleObserver]);

  return (
    
    <div className="flex h-screen">
       <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <DialogTitle>
            <p className="text-lg font-bold p-4">Choose a filter</p>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 flex p-4">
            Use the options below to filter insects by order or class.
          </DialogDescription>
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
      <div className='hidden md:block'>
        <Sheet>
          <Dialog>
          <DialogTitle>
            <p className="text-lg font-bold p-4 w-64">Choose a filter</p>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 flex p-4 w-64">
            Use the options below to filter insects by order or class.
          </DialogDescription>
          </Dialog>
          <FilterDrawer 
            orders={orders}
            classes={classes}
            onFilterChange={handleFilterChange}
            activeFilter={activeFilter}
            onClose={() => {}}
            isMobileDrawer={false}
          />
        </Sheet>
      </div>
      <div className="flex-1 p-6">
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
          <div className="flex justify-center">
            <ImSpinner2 className="text-[#deecfa] animate-spin w-8 h-8" />
          </div>
        ) : (
          <>
            <div id="insects-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <div ref={loadMoreRef} className="mt-8 flex justify-center">
              {isFetchingNextPage && (
                <div className="flex justify-center">
                  <ImSpinner2 className="text-[#deecfa] animate-spin w-8 h-8" />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
    
  );
};

export default Insects;
