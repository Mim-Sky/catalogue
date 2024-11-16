const orderSchema = {
    name: "order",
    title: "Order",
    type: "document",
    fields: [
      { name: "name", title: "Name", type: "string" }, 
      { name: "latinName", title: "Latin", type: "string" },
      { name: "description", title: "Description", type: "text" },
      {
        name: "class",
        title: "Class",
        type: "reference",
        to: [{ type: "class" }], 
      },
    ],
  };
  
  export default orderSchema;
  