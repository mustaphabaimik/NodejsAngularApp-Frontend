import { Component, OnInit } from '@angular/core';
import { CartModel } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartData: CartModel;
  cartTotal: Number;
  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => {
      this.cartTotal = total;
    });
    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);
    
  }

}
