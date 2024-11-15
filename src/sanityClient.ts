// src/sanityClient.ts
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "o6fq908b",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",    
  apiVersion: "2023-11-15",                            
  useCdn: true,                                        
});

const builder = imageUrlBuilder(client);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => builder.image(source);

export default client;
