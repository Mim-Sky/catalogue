'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from 'lucide-react';

type FilterDrawerProps = {
  orders: string[]
  classes: string[]
  onFilterChange: (type: 'order' | 'class', value: string | null) => void
  activeFilter: { type: 'order' | 'class', value: string } | null
  onClose: () => void
  isMobileDrawer: boolean
}

export function FilterDrawer({ 
  orders, 
  classes, 
  onFilterChange, 
  activeFilter, 
  onClose, 
  isMobileDrawer 
}: FilterDrawerProps) {
  const [activeCategory, setActiveCategory] = useState<'order' | 'class'>('order');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') as 'order' | 'class';
    if (category) {
      setActiveCategory(category);
    } else if (activeFilter) {
      setActiveCategory(activeFilter.type);
    }
  }, [activeFilter]);

  const handleCategoryChange = (category: 'order' | 'class') => {
    const params = new URLSearchParams(window.location.search);
    params.set('category', category);
    if (activeFilter && activeFilter.type !== category) {
      params.delete('type');
      params.delete('value');
    }
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    setActiveCategory(category);
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category') as 'order' | 'class';
      if (category) {
        setActiveCategory(category);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="relative flex h-full">
     
      <div className="w-64 h-full bg-background p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          
        </div>
        <div className="space-x-2 mb-4">
          <Button 
            variant={activeCategory === 'order' ? 'default' : 'outline'}
            onClick={() => handleCategoryChange('order')}
          >
            Order
          </Button>
          <Button 
            variant={activeCategory === 'class' ? 'default' : 'outline'}
            onClick={() => handleCategoryChange('class')}
          >
            Class
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {activeCategory === 'order' ? (
            <>
              <Button
                variant="ghost"
                className={`w-full justify-start mb-2 ${!activeFilter || activeFilter.type !== 'order' ? 'bg-secondary' : ''}`}
                onClick={() => onFilterChange('order', null)}
              >
                All Orders
              </Button>
              {orders.map((order) => (
                <Button
                  key={order}
                  variant="ghost"
                  className={`w-full justify-start mb-2 ${activeFilter?.type === 'order' && activeFilter.value === order ? 'bg-secondary' : ''}`}
                  onClick={() => onFilterChange('order', order)}
                >
                  {order}
                </Button>
              ))}
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className={`w-full justify-start mb-2 ${!activeFilter || activeFilter.type !== 'class' ? 'bg-secondary' : ''}`}
                onClick={() => onFilterChange('class', null)}
              >
                All Classes
              </Button>
              {classes.map((cls) => (
                <Button
                  key={cls}
                  variant="ghost"
                  className={`w-full justify-start mb-2 ${activeFilter?.type === 'class' && activeFilter.value === cls ? 'bg-secondary' : ''}`}
                  onClick={() => onFilterChange('class', cls)}
                >
                  {cls}
                </Button>
              ))}
            </>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
