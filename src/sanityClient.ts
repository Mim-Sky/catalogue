// src/sanityClient.ts
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o6fq908b", // Replace with your project ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",    // Replace with your dataset
  apiVersion: "2023-11-15",                            // Use the current date or preferred API version
  useCdn: true,                                        // Use CDN for faster responses
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source);

export default client;
