'use client';

import React, { useState, useEffect } from "react";
import client from "@/sanityClient";
import { Button } from "flowbite-react";
import { FaTimes } from "react-icons/fa";

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await client.fetch<ClassData[]>(`*[_type == "order"]{_id, name}`);
        setInsectOrders(data);
      } catch (error) {
        console.error("Error fetching insect orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleButtonClick = (order: string) => {
    const updatedOrders =
      order === "All"
        ? [] // Clear all filters
        : selectedOrders.includes(order)
        ? selectedOrders.filter((item) => item !== order) // Remove order
        : [...selectedOrders, order]; // Add order

    setSelectedOrders(updatedOrders);
    onFilterChange(updatedOrders); // Notify parent component
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
<Button
        onClick={() => handleButtonClick("All")}
        className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-0 ${
          selectedOrders.length === 0
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {selectedOrders.length === 0 ? (
          "All"
        ) : (
          <div className="flex items-center">
            <FaTimes className="mr-2" />
            Clear Filters
          </div>
        )}
      </Button>
      {insectOrders.map((cls) => (
        <Button
          key={cls._id}
          onClick={() => handleButtonClick(cls.name)}
          className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-0 ${
            selectedOrders.includes(cls.name)
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500"
          }`}
        >
          {cls.name}
        </Button>
      ))}
    </div>
  );
};

export default Filters;
