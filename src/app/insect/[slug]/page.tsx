import InsectClient from "./insectClient";
import client from "@/sanityClient";

// Generate static paths for dynamic routes
export async function generateStaticParams() {
  const insects = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "insect"]{ "slug": slug.current }`
  );

  return insects.map((insect) => ({
    slug: insect.slug,
  }));
}

// Dynamic Insect Details Page (Server Component)
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Await params to get the slug from the URL

  if (!slug) {
    return <div>Invalid route</div>;
  }

  // Pass the slug to the client component
  return <InsectClient slug={slug} />;
}
