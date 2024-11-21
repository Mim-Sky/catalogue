'use client';

import React, { useState, useEffect } from "react";
import { FiltersProps } from "@/sanity/types/types";
import client from "@/sanityClient";
import { Button } from "flowbite-react";
import { FaTimes } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

interface ClassData {
  _id: string;
  name: string;
}

interface OrderData {
  _id: string;
  name: string;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);

  const searchParams = useSearchParams(); // Access URL parameters

  // Synchronise state with URL parameters
  useEffect(() => {
    const classParam = searchParams.get("class");
    const ordersParam = searchParams.get("orders");

    if (classParam) setSelectedClass(classParam);
    else setSelectedClass(null);

    if (ordersParam) setSelectedOrders(ordersParam.split(","));
    else setSelectedOrders([]);
  }, [searchParams]);

  useEffect(() => {
    const fetchClassesAndOrders = async () => {
      try {
        const classesData = await client.fetch<ClassData[]>(`*[_type == "class"]{_id, name}`);
        setClasses(classesData);

        fetchOrders(selectedClass);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchClassesAndOrders();
  }, [selectedClass]);

  const fetchOrders = async (className: string | null) => {
    try {
      const ordersData = await client.fetch<OrderData[]>(
        `*[_type == "order" ${
          className ? `&& references(*[_type == "class" && name == "${className}"]._id)` : ""
        }]{_id, name}`
      );
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleClassClick = (cls: string | null) => {
    setSelectedClass(cls); 
    setSelectedOrders([]); 
    fetchOrders(cls); 
    onFilterChange([], cls); 
  };

  const handleOrderClick = (order: string) => {
    if (order === "All") {
      setSelectedClass(null);
      setSelectedOrders([]); 
      fetchOrders(null); 
      onFilterChange([], null); 
    } else {
      const updatedOrders =
        selectedOrders.includes(order)
          ? selectedOrders.filter((item) => item !== order) 
          : [...selectedOrders, order]; 

      setSelectedOrders(updatedOrders);
      onFilterChange(updatedOrders, selectedClass); 
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Class Tabs */}
      <div className="flex gap-2 border-b-2 pb-2">
        {classes.map((cls) => (
          <Button
            key={cls._id}
            onClick={() => handleClassClick(cls.name)}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-0  ${
              selectedClass === cls.name
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border border-blue-500"
            }`}
          >
            {cls.name}
          </Button>
        ))}
      </div>

      {/* Order Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          onClick={() => handleOrderClick("All")}
          className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-0 ${
            selectedOrders.length === 0 && selectedClass === null
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {selectedOrders.length === 0 && selectedClass === null ? (
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
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-0 ${
              selectedOrders.includes(order.name)
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border border-blue-500"
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
