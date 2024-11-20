'use client';

import { useEffect, useState } from "react";
import client, { urlFor } from "@/sanityClient";
import Card from "./ui/card";
import { Insect } from "@/sanity/types/types";
import Filters from "./filters";

const Insects = () => {
  const [insects, setInsects] = useState<Insect[]>([]);
  const [filteredInsects, setFilteredInsects] = useState<Insect[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    client
      .fetch<Insect[]>(
        `*[_type == "insect"]{
          _id,
          title,
          latinTitle,
          shortDescription,
          image,
          slug,
          "order": order->name
        }`
      )
      .then((data) => {
        setInsects(data);
        setFilteredInsects(data); // Initially, show all insects
      })
      .catch(console.error);
  }, []);

  const handleFilterChange = (selectedOrders: string[]) => {
    setSelectedOrders(selectedOrders);

    // Filter insects by selected orders
    if (selectedOrders.length > 0) {
      const filtered = insects.filter((insect) =>
        selectedOrders.includes(insect.order)
      );
      setFilteredInsects(filtered);
    } else {
      setFilteredInsects(insects); // Show all insects if no filters are applied
    }
  };

  return (
    <>
      
      <div className="max-w-screen-2xl mx-auto p-5 sm:p-10 md:p-16">
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <Filters onFilterChange={handleFilterChange} />
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
      </div>
    </>
  );
};

export default Insects;
