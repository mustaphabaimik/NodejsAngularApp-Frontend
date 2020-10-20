import { ProduitModel } from './produit.model';

export interface CartModel {
  total: Number;
  data: [{
    product: ProduitModel,
    nbrItemCart: Number
  }];
}

export interface CartModelPublic {
  total: Number;
  prodData: [{
    id: Number,
    itcart: Number
  }]
}