export interface ProduitModel {
    id: Number;
    name: String;
    category: String;
    description: String;
    image: String;
    price: Number;
    quantity: Number;
    images: String;
  }
  
  
  export interface ReponseApi  {
    nbr: number;
    produits: ProduitModel[]
  };
  