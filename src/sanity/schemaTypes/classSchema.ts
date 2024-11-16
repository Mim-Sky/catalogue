const classSchema = {
    name: "class",
    title: "Class",
    type: "document",
    fields: [
      { name: "name", title: "Name", type: "string" }, 
      { name: "latinName", title: "Latin", type: "string" },
      { name: "description", title: "Description", type: "text" }, 
    ],
  };
  
  export default classSchema;
  