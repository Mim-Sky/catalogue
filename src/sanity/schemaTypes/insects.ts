const insectsSchema = {
    name: "insect",
    title: "Insect",
    type: "document",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "latinTitle", title: "Latin Title", type: "string" },
      { name: "shortDescription", title: "Short description", type: "text" },
      { name: "description", title: "Description", type: "text" },
      { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
      { name: "image", title: "Image", type: "image", options: { hotspot: true } },
      { name: "imageCredits", title: "Credits", type: "string" },
      { name: "imageLicense", title: "License", type: "string" },
      {
        name: "class",
        title: "Class",
        type: "reference",
        to: [{ type:"class" }]
      },
      {
        name: "order",
        tytle: "Order",
        type: "reference",
        to: [{ type: "order" }]
      }
    ],
  };

  export default insectsSchema;