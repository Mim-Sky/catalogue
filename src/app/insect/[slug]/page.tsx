import InsectClient from "./insectClient";
import client from "@/sanityClient";

export async function generateStaticParams() {
  const insects = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "insect"]{ "slug": slug.current }`
  );

  return insects.map((insect) => ({
    slug: insect.slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; 

  if (!slug) {
    return <div>Invalid route</div>;
  }
  return <InsectClient slug={slug} />;
}
