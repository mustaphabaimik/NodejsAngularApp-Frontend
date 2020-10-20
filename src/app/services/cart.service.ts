import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartModel, CartModelPublic } from '../models/cart.model';
import { ProduitModel } from '../models/produit.model';
import { CommandeService } from './commande.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  ServerURL = environment.URL;

  //stockage locale
  private cartDataClient: CartModelPublic = {prodData: [{itcart: 0, id: 0}], total: 0};  
  
  // serveur stockage 
  private cartDataServer: CartModel = {
    data: [{
      product: undefined,
      nbrItemCart: 0
    }],
    total: 0
  };

  cartTotal$ = new BehaviorSubject<Number>(0);

  cartDataObs$ = new BehaviorSubject<CartModel>(this.cartDataServer);



  constructor(private http:HttpClient,
    private produitService: ProductService,
    private orderService: CommandeService,
    private router: Router,
    private toastr:ToastrService) { 

      this.cartTotal$.next(this.cartDataServer.total);
      this.cartDataObs$.next(this.cartDataServer);
 
      let info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    if (info !== null && info !== undefined && info.prodData[0].itcart !== 0) {
      // assign the value to our data variable which corresponds to the LocalStorage data format
      this.cartDataClient = info;
      // Loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this.produitService.getOneProduct(p.id).subscribe((actualProdInfo: ProduitModel) => {
          if (this.cartDataServer.data[0].nbrItemCart === 0) {
            this.cartDataServer.data[0].nbrItemCart = p.itcart;
            this.cartDataServer.data[0].product = actualProdInfo;
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            this.cartDataServer.data.push({
              nbrItemCart: p.itcart,
              product: actualProdInfo
            });
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartDataObs$.next({...this.cartDataServer});
        });
      });
    }
  }

  

  AddProductToCart(id: Number, quantity?: number) {

    this.produitService.getOneProduct(id).subscribe(prod => {
      // If the cart is empty
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].nbrItemCart = quantity !== undefined ? quantity : 1;
        this.CalculateTotal();
        this.cartDataClient.prodData[0].itcart = this.cartDataServer.data[0].nbrItemCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({...this.cartDataServer});
        this.toastr.success(`${prod.name} added to the cart.`, "Product Added", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }  // END of IF
      // Cart is not empty
      else {
        let index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id);

        // 1. If chosen product is already in cart array
        if (index !== -1) {

          if (quantity !== undefined && quantity <= prod.quantity) {
            // @ts-ignore
            this.cartDataServer.data[index].nbrItemCart = this.cartDataServer.data[index].nbrItemCart < prod.quantity ? quantity : prod.quantity;
          } else {
            // @ts-ignore
            this.cartDataServer.data[index].nbrItemCart < prod.quantity ? this.cartDataServer.data[index].nbrItemCart++ : prod.quantity;
          }


          this.cartDataClient.prodData[index].itcart = this.cartDataServer.data[index].nbrItemCart;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.toastr.info(`${prod.name} quantity updated in the cart.`, "Product Updated", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-full-width'
          })
        }
        // 2. If chosen product is not in cart array
        else {
          this.cartDataServer.data.push({
            product: prod,
            nbrItemCart: 1
          });
          this.cartDataClient.prodData.push({
            itcart: 1,
            id: prod.id
          });
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.toastr.success(`${prod.name} added to the cart.`, "Product Added", {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({...this.cartDataServer});
      }  // END of ELSE


    });
  }


  UpdateCartData(index, increase: Boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      // @ts-ignore
      data.nbrItemCart < data.product.quantity ? data.nbrItemCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].itcart = data.nbrItemCart;
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      this.cartDataObs$.next({...this.cartDataServer});
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {
      // @ts-ignore
      data.nbrItemCart--;
      

      // @ts-ignore
      if (data.nbrItemCart < 1) {
        this.DeleteProductFromCart(index);
        this.cartDataObs$.next({...this.cartDataServer});
      } else {
        // @ts-ignore
        this.cartDataObs$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].itcart = data.nbrItemCart;
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

    }

  }


  DeleteProductFromCart(index) {
    /*    console.log(this.cartDataClient.prodData[index].prodId);
        console.log(this.cartDataServer.data[index].product.id);*/

    if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = {prodData: [{itcart: 0, id: 0}], total: 0};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          data: [{
            product: undefined,
            nbrItemCart: 0
          }],
          total: 0
        };
        this.cartDataObs$.next({...this.cartDataServer});
      } else {
        this.cartDataObs$.next({...this.cartDataServer});
      }
    }
    // If the user doesn't want to delete the product, hits the CANCEL button
    else{
     
      this.router.navigate(['/']);
      
    }
  }


  private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {nbrItemCart} = p;
      const {price} = p.product;
      
      // @ts-ignore
      Total += nbrItemCart * price;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }


  CalculateSubTotal(index): Number {
    let subTotal = 0;

    let p = this.cartDataServer.data[index];
    // @ts-ignore
    subTotal = p.product.price * p.nbrItemCart;

    return subTotal;
  }



  

  
}
