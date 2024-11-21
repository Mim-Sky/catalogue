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
  onFilterChange: (selectedOrders: string[], selectedClass: string | null) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [orders, setOrders] = useState<ClassData[]>([]);

  // Parse URL parameters on mount and update the state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const classParam = params.get("class");
    const ordersParam = params.get("orders");

    setSelectedClass(classParam || null);
    setSelectedOrders(ordersParam ? ordersParam.split(",") : []);
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const classesData = await client.fetch<ClassData[]>(`*[_type == "class"]{_id, name}`);
        setClasses(classesData);

        const ordersData = await client.fetch<ClassData[]>(`*[_type == "order"]{_id, name}`);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  const handleClassClick = (cls: string | null) => {
    setSelectedClass(cls);
    setSelectedOrders([]);
    onFilterChange([], cls);
  };

  const handleOrderClick = (order: string) => {
    if (order === "All") {
      setSelectedOrders([]);
      setSelectedClass(null);
      onFilterChange([], null);
    } else {
      const updatedOrders = selectedOrders.includes(order)
        ? selectedOrders.filter((item) => item !== order)
        : [...selectedOrders, order];

      setSelectedOrders(updatedOrders);
      onFilterChange(updatedOrders, selectedClass);
    }
  };

  return (
    <div>
      <div className="flex gap-2 border-b-2 pb-2">
        {classes.map((cls) => (
          <Button
            key={cls._id}
            onClick={() => handleClassClick(cls.name)}
            className={`px-4 py-2 rounded-lg ${
              selectedClass === cls.name
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border border-blue-500"
            }`}
          >
            {cls.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          onClick={() => handleOrderClick("All")}
          className={`px-4 py-2 rounded-lg ${
            selectedOrders.length === 0 && !selectedClass
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {selectedOrders.length === 0 && !selectedClass ? (
            "All"
          ) : (
            <div className="flex items-center">
              <FaTimes className="mr-2" />
              Clear Filters
            </div>
          )}
        </Button>
        {orders.map((order) => (
          <Button
            key={order._id}
            onClick={() => handleOrderClick(order.name)}
            className={`px-4 py-2 rounded-lg ${
              selectedOrders.includes(order.name)
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white text-blue-500 border border-blue-500 hover:bg-gray-100"
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
