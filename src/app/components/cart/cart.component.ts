import { Component, OnInit } from '@angular/core';
import { CartModel } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartData: CartModel;
  cartTotal: Number;
  subTotal: Number;


  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }


  ChangeQuantity(id: Number, increaseQuantity: Boolean) {
   
    this.cartService.UpdateCartData(id, increaseQuantity);
  }

}
