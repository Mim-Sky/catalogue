'use client';

import { useEffect, useState, useMemo } from "react";
import client, { urlFor } from "@/sanityClient";
import Card from "./ui/card";
import { Insect } from "@/sanity/types/types";
import Filters from "./filters";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "flowbite-react";

const Insects = () => {
  const [insects, setInsects] = useState<Insect[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const classParam = searchParams.get("class");
    const ordersParam = searchParams.get("orders");

    if (isInitialLoad) {
      setSelectedClass(classParam || null);
      setSelectedOrders(ordersParam ? ordersParam.split(",") : []);
      setIsInitialLoad(false);
    }
  }, [searchParams, isInitialLoad]);

  const fetchInsects = async (
    offset: number = 0,
    limit: number | "all" = 20,
    filterOrders: string[] = [],
    filterClass: string | null = null
  ): Promise<Insect[]> => {
    const orderFilter = filterOrders.length
      ? `&& order->name in [${filterOrders.map((o) => `"${o}"`).join(",")}]`
      : "";
    const classFilter = filterClass ? `&& class->name == "${filterClass}"` : "";
    const range = limit === "all" ? "" : `[${offset}...${offset + limit}]`;

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

  const handleFilterChange = async (orders: string[], cls: string | null) => {
    // prevent sending user on top of the page on filter change
    const currentScroll = window.scrollY;
  
    setSelectedOrders(orders);
    setSelectedClass(cls);
  
    
    const query = new URLSearchParams();
    if (cls) query.set("class", cls);
    if (orders.length > 0) query.set("orders", orders.join(","));
    const newUrl = `${window.location.pathname}?${query.toString()}`;
  
    // Use history API to avoid jumping to the top
    window.history.replaceState(null, "", newUrl);
  
    setLoading(true);
    const limit = orders.length > 0 || cls ? "all" : 20;
    const filteredData = await fetchInsects(0, limit, orders, cls);
    setInsects(filteredData);
    setHasMore(!cls && orders.length === 0 && filteredData.length === 20);
    setLoading(false);
  
    // Ensure scroll position remains consistent
    window.scrollTo(0, currentScroll);
  };
  

  const handleShowMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const moreData = await fetchInsects(insects.length, 20, selectedOrders, selectedClass);
    setInsects((prev) => [...prev, ...moreData]);
    setHasMore(moreData.length === 20);
    setLoading(false);
  };

  const filteredInsects = useMemo(() => {
    if (selectedOrders.length === 0 && !selectedClass) return insects;
    return insects.filter(
      (insect) =>
        (!selectedClass || insect.class === selectedClass) &&
        (selectedOrders.length === 0 || selectedOrders.includes(insect.order))
    );
  }, [insects, selectedOrders, selectedClass]);

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      const limit = selectedOrders.length > 0 || selectedClass ? "all" : 20;
      const initialData = await fetchInsects(0, limit, selectedOrders, selectedClass);
      setInsects(initialData);
      setHasMore(!selectedClass && selectedOrders.length === 0 && initialData.length === 20);
      setLoading(false);
    };

    if (isInitialLoad) initialLoad();
  }, [selectedClass, selectedOrders, isInitialLoad]);

  return (
    <div className="max-w-screen-2xl mx-auto p-5 sm:p-10 md:p-16">
      {loading && isInitialLoad ? (
        <div className="flex justify-center items-center h-96">
          <Spinner size="lg" color="blue" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="lg:hidden mb-4">
              <button
                className="w-full flex justify-between items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <h1 className="text-lg font-semibold">Filters</h1>
                {filtersOpen ? <FaChevronUp className="text-xl" /> : <FaChevronDown className="text-xl" />}
              </button>
              {filtersOpen && (
                <div className="mt-4 bg-white border rounded-lg p-4 shadow-lg">
                  <Filters onFilterChange={handleFilterChange} />
                </div>
              )}
            </div>
            <div className="hidden lg:block bg-white border rounded-lg p-4 shadow-lg sticky top-4">
              <Filters onFilterChange={handleFilterChange} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredInsects.map((insect) => (
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
              ))}
            </div>
            {hasMore && (
              <button
                onClick={handleShowMore}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Loading..." : "Show More"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Insects;
