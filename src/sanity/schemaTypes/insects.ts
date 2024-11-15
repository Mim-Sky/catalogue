export default {
    name: "insect",
    title: "Insect",
    type: "document",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "latinTitle", title: "Latin Title", type: "string" },
      { name: "description", title: "Description", type: "text" },
      { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
      { name: "image", title: "Image", type: "image", options: { hotspot: true } },
    ],
  };