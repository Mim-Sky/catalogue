export interface Insect {
  _id: string; 
  title: string; 
  latinTitle: string; 
  description: string; 
  shortDescription: string; 
  orderScientificName: string;
  image: {
    asset: {
      _ref: string; 
    };
  };
  slug: {
    current: string;
  };
  imageCredits: string;
  imageLicens: string;

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