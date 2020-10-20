import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProduitModel, ReponseApi } from '../models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url=environment.URL;
  constructor(private http:HttpClient) { }
 
  
  getAll(limitOfResults=10):Observable<ReponseApi> {// 10 valeur par defaut 
    return this.http.get<ReponseApi>(this.url + '/produits',{
      params: {
        limit: limitOfResults.toString()
      }
    });
  }


  getOneProduct(id: Number): Observable<ProduitModel> {
    return this.http.get<ProduitModel>(this.url + '/produits/' + id);
  }

  getProductsCategorie(Namecat: String): Observable<ProduitModel[]> {
    return this.http.get<ProduitModel[]>(this.url + '/produits/categorie/' + Namecat);
  }

 
  
  


  
}
