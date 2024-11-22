'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllInsects,
  addInsects,
  setVisibleInsects,
  setLoading,
  setHasMore,
  updateFilters,
} from "../redux/insectsSlice";
import client, { urlFor } from "@/sanityClient";
import Card from "./ui/card";
import Filters from "./filters";
import { RootState } from "../redux/store";

const Insects = () => {
  const dispatch = useDispatch();
  const { allInsects, visibleInsects, filters, hasMore, loading } = useSelector(
    (state: RootState) => state.insects
  );

  const fetchInsects = async (offset = 0, limit = 20) => {
    const range = `[${offset}...${offset + limit}]`;
    const query = `*[_type == "insect"] | order(title asc) {
      _id,
      title,
      latinTitle,
      shortDescription,
      description,
      image {
        asset {
          _ref
        }
      },
      "slug": slug.current,
      "order": order->name,
      "class": order->class->name
    }`;

    return client.fetch(query);
  };

  const applyFilters = () => {
    const { selectedClass, selectedOrders } = filters;

    const filteredData = allInsects.filter(
      (insect) =>
        (!selectedClass || insect.class === selectedClass) &&
        (selectedOrders.length === 0 || selectedOrders.includes(insect.order))
    );

    dispatch(setVisibleInsects(filteredData));
  };

  useEffect(() => {
    // Synchronize filters with the URL on load
    const params = new URLSearchParams(window.location.search);
    const classParam = params.get("class") || "Insects"; // Default to "Insects"
    const ordersParam = params.get("orders");

    dispatch(
      updateFilters({
        selectedClass: classParam,
        selectedOrders: ordersParam ? ordersParam.split(",") : [],
      })
    );

    const fetchInitialData = async () => {
      dispatch(setLoading(true));
      const initialData = await fetchInsects(0, 20);
      dispatch(setAllInsects(initialData));
      dispatch(setVisibleInsects(initialData));
      dispatch(setHasMore(initialData.length === 20));
      dispatch(setLoading(false));
    };

    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    applyFilters();

    // Update the URL when filters change
    const params = new URLSearchParams();
    if (filters.selectedClass) params.set("class", filters.selectedClass);
    if (filters.selectedOrders.length > 0) params.set("orders", filters.selectedOrders.join(","));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [filters, allInsects]);

  const handleShowMore = async () => {
    if (!hasMore || loading) return;

    dispatch(setLoading(true));
    const moreData = await fetchInsects(allInsects.length, 20);
    dispatch(addInsects(moreData));
    dispatch(setHasMore(moreData.length === 20));
    dispatch(setLoading(false));
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-5 sm:p-10 md:p-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 bg-white border rounded-lg p-4 shadow-lg sticky top-4">
          <Filters />
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              <p>Loading...</p>
            ) : (
              visibleInsects.map((insect) => (
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
                  slug={insect.slug}
                />
              ))
            )}
          </div>
          {hasMore && (
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
