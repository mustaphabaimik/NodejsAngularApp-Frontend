import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { ProductdetailComponent } from './components/productdetail/productdetail.component';


const routes: Routes = [
  {
    path:'',component:HomeComponent
  },
  {
    path:'cart',component:CartComponent
  },
  {
    path:'produit/:id',component:ProductdetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
