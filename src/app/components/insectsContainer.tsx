'use client';

import { useEffect, useState, useMemo } from "react";
import client, { urlFor } from "@/sanityClient";
import Card from "./ui/card";
import { Insect } from "@/sanity/types/types";
import Filters from "./filters";

const Insects = () => {
  const [allInsects, setAllInsects] = useState<Insect[]>([]); 
  const [visibleInsects, setVisibleInsects] = useState<Insect[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchInsects = async (
    offset: number = 0,
    limit: number = 20,
    filterOrders: string[] = [],
    filterClass: string | null = null
  ): Promise<Insect[]> => {
    const orderFilter = filterOrders.length
      ? `&& order->name in [${filterOrders.map((o) => `"${o}"`).join(",")}]`
      : "";
    const classFilter = filterClass ? `&& class->name == "${filterClass}"` : "";
    const range = `[${offset}...${offset + limit}]`;

    const query = `*[_type == "insect" ${classFilter} ${orderFilter}] | order(title asc) ${range} {
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const classParam = params.get("class");
    const ordersParam = params.get("orders");

    setSelectedClass(classParam || null);
    setSelectedOrders(ordersParam ? ordersParam.split(",") : []);

    const fetchInitialData = async () => {
      setLoading(true);
      const initialData = await fetchInsects(0, 20);
      setAllInsects(initialData); 
      setVisibleInsects(initialData);
      setHasMore(initialData.length === 20);
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  // Handle filter changes
  const handleFilterChange = async (orders: string[], cls: string | null) => {
    setSelectedOrders(orders);
    setSelectedClass(cls);


    const params = new URLSearchParams();
    if (cls) params.set("class", cls);
    if (orders.length > 0) params.set("orders", orders.join(","));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);

    const filteredData = allInsects.filter(
      (insect) =>
        (!cls || insect.class === cls) &&
        (orders.length === 0 || orders.includes(insect.order))
    );

    setVisibleInsects(filteredData);

    if (filteredData.length === 0) {
      setLoading(true);
      const additionalData = await fetchInsects(0, 20, orders, cls);
      setAllInsects((prev) => [...prev, ...additionalData]);
      setVisibleInsects((prev) => [...prev, ...additionalData]);
      setLoading(false);
    }
  };

  const handleShowMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const additionalData = await fetchInsects(allInsects.length, 20);
    setAllInsects((prev) => [...prev, ...additionalData]);
    setVisibleInsects((prev) => [...prev, ...additionalData]);
    setHasMore(additionalData.length === 20);
    setLoading(false);
  };

  const filteredInsects = useMemo(() => {
    return visibleInsects.filter(
      (insect) =>
        (!selectedClass || insect.class === selectedClass) &&
        (selectedOrders.length === 0 || selectedOrders.includes(insect.order))
    );
  }, [visibleInsects, selectedClass, selectedOrders]);

  return (
    <div className="max-w-screen-2xl mx-auto p-5 sm:p-10 md:p-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Filters Column */}
        <div className="lg:col-span-1 bg-white border rounded-lg p-4 shadow-lg sticky top-4">
          <Filters onFilterChange={handleFilterChange} />
        </div>

        {/* Cards Column */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              <p>Loading...</p>
            ) : (
              filteredInsects.map((insect) => (
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

          {/* Show More Button */}
          {hasMore && !loading && (
            <button
              onClick={handleShowMore}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insects;
