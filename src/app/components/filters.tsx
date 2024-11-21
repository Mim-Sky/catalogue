'use client';

import React, { useState, useEffect } from "react";
import client from "@/sanityClient";
import { AccordionContent, AccordionPanel, Button } from "flowbite-react";
import { FaTimes } from "react-icons/fa";
import { Accordion } from "flowbite-react";

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
    
    <Accordion>
      <AccordionPanel>
      <Accordion.Title>Filters</Accordion.Title>
      <AccordionContent>
    
      {/* Class Filters */}
      <h1>Choose class</h1>
      <div className="flex justify-between">
        {classes.map((cls) => (
          <Button
            key={cls._id}
            onClick={() => handleClassClick(cls.name)}
            color="light"
            className={`!px-4 !py-2 !rounded-lg focus:none focus:ring-0 ${
              selectedClass === cls.name
                ? "!bg-blue-500 !text-white hover:!bg-blue-400 hover:!text-white"
                : "!bg-white !text-blue-500 !border !border-blue-500 hover:!bg-blue-100 hover:!text-blue-700"
            }`}
          >
            {cls.name}
          </Button>
        ))}
      </div>
      <h1>Choose order</h1>
      {/* Order Filters */}
      <div className="flex flex-wrap gap-2 mt-4">
        {/* "All" or "Clear Filters" Button */}
        <Button
          onClick={() => handleOrderClick("All")}
          color={selectedOrders.length === 0 && !selectedClass ? "blue" : "red"}
          className={`!px-4 !py-2 !rounded-lg focus:none focus:ring-0 ${
            selectedOrders.length === 0 && !selectedClass
              ? "hover:!bg-blue-600 hover:!text-white"
              : "!bg-red-500 !text-white hover:!bg-red-400 hover:!text-white"
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

        {/* Individual Order Buttons */}
        {orders.map((order) => (
          <Button
            key={order._id}
            onClick={() => handleOrderClick(order.name)}
            color="light"
            className={`!px-4 !py-2 !rounded-lg focus:none focus:ring-0 ${
              selectedOrders.includes(order.name)
                ? "!bg-blue-500 !text-white hover:!bg-blue-400 hover:!text-white"
                : "!bg-white !text-blue-500 !border !border-blue-500 hover:!bg-blue-100 hover:!text-blue-700"
            }`}
          >
            {order.name}
          </Button>
        ))}
      </div>
    
    </AccordionContent>
    </AccordionPanel>
    </Accordion>
  );
};

export default Filters;