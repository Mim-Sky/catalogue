export default {
  name: "insect",
  title: "Insect",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "latinTitle", title: "Latin Title", type: "string" },
    { name: "shortDescription", title: "Short Description", type: "text" },
    { name: "description", title: "Description", type: "text" },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title", // Automatically generate from the title
        maxLength: 96,
      },
    },
    {
      name: "order",
      title: "Order",
      type: "reference",
      to: [{ type: "order" }],
    },
    {
      name: "class",
      title: "Class",
      type: "reference",
      to: [{ type: "class" }],
    },
    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
  ],
};
