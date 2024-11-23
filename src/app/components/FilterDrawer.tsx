import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from 'lucide-react'

type FilterDrawerProps = {
  orders: string[]
  classes: string[]
  onFilterChange: (type: 'order' | 'class', value: string | null) => void
  activeFilter: { type: 'order' | 'class', value: string } | null
  onClose: () => void
  isMobileDrawer: boolean
}

export function FilterDrawer({ orders, classes, onFilterChange, activeFilter, onClose, isMobileDrawer }: FilterDrawerProps) {
  const [activeCategory, setActiveCategory] = useState<'order' | 'class'>('order')

  return (
    <div className="w-64 h-full bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        {isMobileDrawer && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="space-x-2 mb-4">
        <Button 
          variant={activeCategory === 'order' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('order')}
        >
          Order
        </Button>
        <Button 
          variant={activeCategory === 'class' ? 'default' : 'outline'}
          onClick={() => setActiveCategory('class')}
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
  )
}

