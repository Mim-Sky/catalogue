'use client';

import { useQuery } from '@tanstack/react-query';
import client, { urlFor } from "@/sanityClient";
import { Insect } from "@/sanity/types/types";
import Image from "next/image";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from 'react';

interface InsectClientProps {
  slug: string;
}

export default function InsectClient({ slug }: InsectClientProps) {
  const [isTextVisible, setIsTextVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsTextVisible(true), 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const { data: insect, isLoading, isError } = useQuery({
    queryKey: ['insect', slug],
    queryFn: async () => {
      const data = await client.fetch<Insect>(
        `*[_type == "insect" && slug.current == $slug][0]{
          title,
          description,
          image,
          latinTitle,
        }`,
        { slug }
      );
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ImSpinner2 className="text-white animate-spin w-12 h-12" />
      </div>
    );
  }

  if (isError || !insect) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white text-xl">404 - Specimen Not Found</p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden text-black">
      {/* Header Section */}
      <div
        className={`flex items-center justify-around px-6 lg:px-12 pt-6 transform transition-all duration-700 ${
          isTextVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="bg-gray-300 hover:bg-gray-700 hover:text-white rounded-full w-12 h-12 p-0 hidden md:flex"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-center">
          {insect.title}
        </h1>
        <h2 className="text-2xl lg:text-3xl italic tracking-tight text-center">{insect.latinTitle}</h2>
      </div>
      {/* Content Grid */}
      <div className="h-full lg:grid lg:grid-cols-2 lg:gap-8 p-6 lg:p-12">
        {/* Left Column - Image */}
        <div className="space-y-6">
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-300">
            <Image
              src={urlFor(insect.image).url()}
              alt={insect.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
        {/* Right Column - Description */}
        <div
          className={`mt-6 lg:mt-0 transform transition-all duration-700 delay-200 ${
            isTextVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
          }`}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 h-[50vh] lg:h-[70vh]">
            <ScrollArea className="h-full pr-3">
              <div className="space-y-6 text-lg leading-relaxed break-words max-w-full">
                {insect.description.split("\n").map((paragraph, index) => {
                  const creditsRegex = /Photo Credits: (.+?), licensed under (.+?). Source: (.+)$/;
                  const match = paragraph.match(creditsRegex);

                  if (match) {
                    const [, author, license, source] = match;
                    return (
                      <p key={index} className="italic text-gray-600">
                        Photo Credits:{" "}
                        <span className="font-semibold">{author}</span>, licensed under{" "}
                        <span className="underline">{license}</span>.{" "}
                        <a
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Source
                        </a>
                      </p>
                    );
                  }
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
