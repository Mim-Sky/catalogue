export interface Insect {
  _id: string; // Unique identifier for each insect document
  title: string; // Common name of the insect
  latinTitle: string; // Scientific name
  description: string; // Description of the insect
  shortDescription: string; //short description
  image: {
    asset: {
      _ref: string; // Reference to the image asset in Sanity
    };
  };
  slug: {
    current: string;
  };
  order: string;  
  class: string;
}


  export interface InsectDetails {
    title: string;
    description: string;
    image: {
      asset: {
        _ref: string;
      };
    };
  }

  export interface FiltersProps {
    onFilterChange: (selectedOrders: string[], selectedClass: string | null) => void;
  }