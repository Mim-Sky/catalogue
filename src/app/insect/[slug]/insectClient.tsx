'use client';

import { useQuery } from '@tanstack/react-query';
import client, { urlFor } from "@/sanityClient";
import { Insect } from "@/sanity/types/types";
import Image from "next/image";
import { ImSpinner2 } from "react-icons/im";

interface InsectClientProps {
  slug: string;
}

export default function InsectClient({ slug }: InsectClientProps) {
  const { data: insect, isLoading, isError } = useQuery({
    queryKey: ['insect', slug],
    queryFn: async () => {
      const data = await client.fetch<Insect>(
        `*[_type == "insect" && slug.current == $slug][0]{
          title,
          description,
          image
        }`,
        { slug }
      );
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ImSpinner2 className='text-[#deecfa] animate-spin w-8 h-8'/>
      </div>
    );
  }

  if (isError || !insect) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>404 - Insect Not Found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative md:bg-fixed bg-center bg-cover h-96 md:h-[600px] before:absolute before:inset-0 before:bg-black before:opacity-40 mb-6 md:mb-12"
        style={{
          backgroundImage: `url(${urlFor(insect.image).url()})`,
        }}
      >
        <h1 className="absolute top-3/4 md:top-1/2 bg-black/80 text-off-white text-3xl text-bold px-3 py-5">
          {insect.title}
        </h1>
      </div>

      {/* Content Section */}
      <div className="container w-full mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:grid-rows-3 p-3 lg:p-0">
        {/* Description */}
        <div className="grid-element-2 bg-off-white p-6">
          <p>{insect.description}</p>
        </div>

        {/* Image */}
        <div className="grid-element-3 bg-earth-gray flex items-center justify-center">
          <Image
            src={urlFor(insect.image).url()}
            alt={insect.title}
            width={500}
            height={500}
            className="rounded shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
