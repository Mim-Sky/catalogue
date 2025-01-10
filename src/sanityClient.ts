import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o6fq908b",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2023-11-15",
  useCdn: process.env.NODE_ENV === "production",
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: Parameters<typeof builder.image>[0]) => builder.image(source);

export default client;
