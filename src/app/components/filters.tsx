'use client';

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters } from "../redux/insectsSlice";
import client from "@/sanityClient";
import { Button } from "flowbite-react";
import { FaTimes } from "react-icons/fa";
import { RootState } from "../redux/store";

const Filters = () => {
  const dispatch = useDispatch();
  const { selectedClass, selectedOrders } = useSelector(
    (state: RootState) => state.insects.filters
  );

  const [availableClasses, setAvailableClasses] = useState<{ name: string }[]>([]);
  const [availableOrders, setAvailableOrders] = useState<string[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await client.fetch(`*[_type == "class"]{name}`);
        setAvailableClasses(classesData);

        if (!selectedClass) {
          dispatch(updateFilters({ selectedClass: "Insects", selectedOrders: [] }));
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [dispatch, selectedClass]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedClass) return;

      try {
        const ordersData = await client.fetch(
          `*[_type == "order" && references(*[_type == "class" && name == "${selectedClass}"]._id)]{
            name
          }`
        );
        setAvailableOrders(ordersData.map((order: { name: string }) => order.name));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [selectedClass]);

  const handleClassClick = (cls: string) => {
    dispatch(updateFilters({ selectedClass: cls, selectedOrders: [] }));
  };

  const handleOrderClick = (order: string) => {
    if (order === "All") {
      dispatch(updateFilters({ selectedClass, selectedOrders: [] }));
    } else {
      const updatedOrders = selectedOrders.includes(order)
        ? selectedOrders.filter((o) => o !== order)
        : [...selectedOrders, order];

      dispatch(updateFilters({ selectedClass, selectedOrders: updatedOrders }));
    }
  };

  return (
    <div>
      <div className="flex gap-2 border-b-2 pb-2">
        {availableClasses.map((cls) => (
          <Button
            key={cls.name}
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
        {availableOrders.map((order) => (
          <Button
            key={order}
            onClick={() => handleOrderClick(order)}
            className={`px-4 py-2 rounded-lg ${
              selectedOrders.includes(order)
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white text-blue-500 border border-blue-500 hover:bg-gray-100"
            }`}
          >
            {order}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
