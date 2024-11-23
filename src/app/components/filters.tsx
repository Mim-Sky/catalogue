'use client';

import React, { useState, useEffect } from 'react';
import client from '@/sanityClient';
import { Button } from 'flowbite-react';
import { FaTimes } from 'react-icons/fa';

interface FiltersProps {
  onFilterChange: (selectedOrders: string[], selectedClass: string | null) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>(() => {
    const savedOrders = localStorage.getItem('selectedOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [selectedClass, setSelectedClass] = useState<string | null>(() => {
    return localStorage.getItem('selectedClass') || 'Insects';
  });

  const [classes, setClasses] = useState<{ name: string }[]>([]);
  const [orders, setOrders] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      const classesData = await client.fetch(`*[_type == "class"]{name}`);
      setClasses(classesData);

      if (selectedClass) {
        const ordersData = await client.fetch(
          `*[_type == "order" && references(*[_type == "class" && name == "${selectedClass}"]._id)]{name}`
        );
        setOrders(ordersData);
      }
    };
    fetchFilters();
  }, [selectedClass]);

  const handleClassClick = (cls: string) => {
    setSelectedClass(cls);
    setSelectedOrders([]);
    onFilterChange([], cls);

    localStorage.setItem('selectedClass', cls);
    localStorage.removeItem('selectedOrders');
  };

  const handleOrderClick = (order: string) => {
    const updatedOrders = selectedOrders.includes(order)
      ? selectedOrders.filter((o) => o !== order)
      : [...selectedOrders, order];

    setSelectedOrders(updatedOrders);
    onFilterChange(updatedOrders, selectedClass);

    localStorage.setItem('selectedOrders', JSON.stringify(updatedOrders));
  };

  return (
    <div>
      <div className="flex gap-2 border-b-2 pb-2">
        {classes.map((cls) => (
          <Button
            key={cls.name}
            onClick={() => handleClassClick(cls.name)}
            className={`px-4 py-2 rounded-lg ${
              selectedClass === cls.name ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'
            }`}
          >
            {cls.name}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          onClick={() => {
            setSelectedOrders([]);
            setSelectedClass(null);
            onFilterChange([], null);

            localStorage.removeItem('selectedClass');
            localStorage.removeItem('selectedOrders');
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          <FaTimes className="mr-2" /> Clear Filters
        </Button>
        {orders.map((order) => (
          <Button
            key={order.name}
            onClick={() => handleOrderClick(order.name)}
            className={`px-4 py-2 ${
              selectedOrders.includes(order.name) ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'
            }`}
          >
            {order.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
