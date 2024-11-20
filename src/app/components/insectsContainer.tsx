'use client';

import { useEffect, useState, useMemo } from "react";
import client, { urlFor } from "@/sanityClient";
import Card from "./ui/card";
import { Insect } from "@/sanity/types/types";
import Filters from "./filters";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import icons from react-icons

const Insects = () => {
  const [insects, setInsects] = useState<Insect[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false); // For mobile toggle

  const fetchInsects = async (
    offset: number = 0,
    limit: number | "all" = 20,
    filterOrders: string[] = []
  ): Promise<Insect[]> => {
    const orderFilter = filterOrders.length
      ? `&& order->name in [${filterOrders.map((o) => `"${o}"`).join(",")}]`
      : "";

    const range = limit === "all" ? "" : `[${offset}...${offset + limit}]`;

    const query = `*[_type == "insect" ${orderFilter}] | order(title asc) ${range} {
      _id,
      title,
      latinTitle,
      shortDescription,
      image,
      slug,
      "order": order->name
    }`;

    const data = await client.fetch<Insect[]>(query);
    return data;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const data = await fetchInsects();
      setInsects(data);
      setHasMore(data.length === 20);
    };
    fetchInitialData();
  }, []);

  const handleFilterChange = async (selectedOrders: string[]) => {
    setSelectedOrders(selectedOrders);
    setLoading(true);

    const limit = selectedOrders.length > 0 ? "all" : 20;
    const filteredData = await fetchInsects(0, limit, selectedOrders);

    setInsects(filteredData);
    setHasMore(selectedOrders.length === 0 && filteredData.length === 20);
    setLoading(false);
  };

  const handleShowMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const moreData = await fetchInsects(insects.length, 20, selectedOrders);
      setInsects((prev) => [...prev, ...moreData]);
      setHasMore(moreData.length === 20);
    } catch (error) {
      console.error("Error fetching more insects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInsects = useMemo(() => {
    if (selectedOrders.length === 0) return insects;
    return insects.filter((insect) => selectedOrders.includes(insect.order));
  }, [insects, selectedOrders]);

  return (
    <div className="max-w-screen-2xl mx-auto p-5 sm:p-10 md:p-16">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Filters Column */}
        <div className="lg:col-span-1">
          {/* Mobile Collapsible Filter */}
          <div className="lg:hidden mb-4">
            <button
              className="w-full flex justify-between items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <h1 className="text-lg font-semibold">Filters</h1>
              {filtersOpen ? (
                <FaChevronUp className="text-xl" />
              ) : (
                <FaChevronDown className="text-xl" />
              )}
            </button>
            {filtersOpen && (
              <div className="mt-4 bg-white border rounded-lg p-4 shadow-lg">
                <Filters onFilterChange={handleFilterChange} />
              </div>
            )}
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:block bg-white border rounded-lg p-4 shadow-lg sticky top-4">
            <Filters onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Cards Column */}
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

          {/* Show More Button */}
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
    </div>
  );
};

export default Insects;
