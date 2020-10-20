import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  produits: ProduitInCommande[] = [];
  ServerURL = environment.URL;

  constructor(private http:HttpClient) { }

  getOneOrder(orderId: Number) {
    return this.http.get<ProduitInCommande[]>(this.ServerURL+"/commandes/"+orderId).toPromise();
  }

}



interface ProduitInCommande {
  id: Number;
  title: String;
  description: String;
  price: Number;
  quantityOrdered: Number;
  image: String;
}

