'use client';

import React, { useState, useEffect } from "react";
import client from "@/sanityClient";

interface ClassData {
  _id: string;
  name: string;
}

interface FiltersProps {
  onFilterChange: (selectedOrders: string[]) => void;
}
const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [insectOrders, setInsectOrders] = useState<ClassData[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "order"]{_id, name}`
        );
        setInsectOrders(data);
      } catch (error) {
        console.error("Error fetching insect orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleCheckboxChange = (className: string) => {
    const updatedOrders = selectedOrders.includes(className)
      ? selectedOrders.filter((item) => item !== className)
      : [...selectedOrders, className];
    setSelectedOrders(updatedOrders);
    onFilterChange(updatedOrders); 
  };
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Filter by insect order ({selectedOrders.length})
      </button>

      {isOpen && (
        <div className="absolute w-64 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            {insectOrders.map((cls) => (
              <label
                key={cls._id}
                className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(cls.name)}
                  onChange={() => handleCheckboxChange(cls.name)}
                  className="mr-2"
                />
                {cls.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
