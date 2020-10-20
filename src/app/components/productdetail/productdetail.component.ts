import { AfterViewInit,Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import {map} from "rxjs/operators";

declare let $: any;

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.scss']
})
export class ProductdetailComponent implements OnInit {

  id: Number;
  product;
  thumbimages: any[] = [];
  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService) { }

  ngOnInit(): void {

    this.route.paramMap.pipe(
      map((param: ParamMap) => {
        // @ts-ignore
        return param.params.id;
      })
    ).subscribe(prodId => {
      this.id = prodId;
      this.productService.getOneProduct(this.id).subscribe(prod => {
        this.product = prod;
        if (prod.images !== null) {
          this.thumbimages = prod.images.split(';');
        }
      });
    });
  }

  ngAfterViewInit(): void {

    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true,
        }
      },
      ]
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

}
