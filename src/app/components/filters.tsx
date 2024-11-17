import React, { useState, useEffect } from "react";
import client from "@/sanityClient";

interface ClassData {
  _id: string;
  name: string;
}

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orders, setOrders] = useState<ClassData[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "order"]{_id, name}`
        );
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (className: string) => {
    setSelectedOrders((prev) =>
      prev.includes(className)
        ? prev.filter((item) => item !== className)
        : [...prev, className]
    );
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Filter by Order
      </button>
      {isOpen && (
        <div className="absolute z-10 w-64 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg top-full left-0">
          <div className="max-h-40 overflow-y-auto p-2">
            {orders.map((cls) => (
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

export default Dropdown;