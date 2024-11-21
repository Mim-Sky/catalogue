'use client';

import { useEffect, useState } from "react";
import client, { urlFor } from "@/sanityClient";
import Card from "./ui/card";
import { Insect } from "@/sanity/types/types";
import Filters from "./filters";

const Insects = () => {
  const [insects, setInsects] = useState<Insect[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsects = async (
    filterOrders: string[] = [],
    filterClass: string | null = null
  ): Promise<Insect[]> => {
    const orderFilter = filterOrders.length
      ? `&& order->name in [${filterOrders.map((o) => `"${o}"`).join(",")}]`
      : "";
    const classFilter = filterClass ? `&& class->name == "${filterClass}"` : "";

    const query = `*[_type == "insect" ${classFilter} ${orderFilter}] | order(title asc) {
      _id,
      title,
      latinTitle,
      shortDescription,
      image,
      slug,
      "class": class->name,
      "order": order->name
    }`;

    return client.fetch<Insect[]>(query);
  };

  // Synchronise filters with the URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const classParam = params.get("class");
    const ordersParam = params.get("orders");

    setSelectedClass(classParam || null);
    setSelectedOrders(ordersParam ? ordersParam.split(",") : []);

    const fetchInitialData = async () => {
      setLoading(true);
      const initialData = await fetchInsects(
        ordersParam ? ordersParam.split(",") : [],
        classParam || null
      );
      setInsects(initialData);
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  // Update filters and URL when filter changes
  const handleFilterChange = async (orders: string[], cls: string | null) => {
    setSelectedOrders(orders);
    setSelectedClass(cls);

    // Update the URL
    const params = new URLSearchParams();
    if (cls) params.set("class", cls);
    if (orders.length > 0) params.set("orders", orders.join(","));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);

    // Fetch filtered data
    setLoading(true);
    const filteredData = await fetchInsects(orders, cls);
    setInsects(filteredData);
    setLoading(false);
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-5 sm:p-10 md:p-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 bg-white border rounded-lg p-4 shadow-lg sticky top-4">
          <Filters onFilterChange={handleFilterChange} />
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              <p>Loading...</p>
            ) : (
              insects.map((insect) => (
                <Card
                  key={insect._id}
                  imageUrl={
                    insect.image
                      ? urlFor(insect.image).width(330).height(330).url()
                      : "/zombie.webp"
                  }
                  title={insect.title}
                  latinTitle={insect.latinTitle}
                  shortDescription={insect.shortDescription}
                  slug={insect.slug.current}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insects;
