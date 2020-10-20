import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitModel, ReponseApi } from 'src/app/models/produit.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  produits:ProduitModel[]=[];
  constructor(private produitservice:ProductService,private cartservice:CartService,private router:Router) { }

  ngOnInit(): void {
    this.produitservice.getAll().subscribe((prods:ReponseApi) => {
      this.produits = prods.produits;
      console.log(this.produits);
    });
  }


  detailProduit(id:number){
    this.router.navigate(['/produit',id]).then();
  }

  AddProduct(id:number){
    this.cartservice.AddProductToCart(id);
  }

}
