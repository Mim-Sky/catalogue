import client, { urlFor } from "@/sanityClient";
import { Insect } from "@/sanity/types/types";
import Image from "next/image";

interface InsectDetailsProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const insects = await client.fetch<Insect[]>(
    `*[_type == "insect"]{ slug }`
  );

  return insects.map((insect) => ({
    slug: insect.slug.current,
  }));
}

const InsectDetails = async ({ params }: InsectDetailsProps) => {
  const { slug } = await params;
  if (!slug) {
    return <div>Invalid route</div>;
  }

  const insect = await client.fetch<Insect>(
    `*[_type == "insect" && slug.current == $slug][0]{
      title,
      description,
      image
    }`,
    { slug }
  );

  if (!insect) {
    return <div>404 - Insect Not Found</div>;
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
};

export default InsectDetails;
