import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../shopping-cart.service';
import { FarmerService } from '../farmer.service';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './shop-cart.component.html',
  styleUrls: ['./shop-cart.component.css']
})
export class ShopCartComponent implements OnInit {

  products: any;
  totalPrice: number;
  gardens: any;
  selectedGarden: any = null;

  gardenCheck: number = 0;

  constructor(private shoppingCartService: ShoppingCartService, private farmerSerice: FarmerService) { }

  ngOnInit(): void {
    this.products = this.shoppingCartService.getProducts();
    this.totalPrice = 0;
    this.products.forEach(p => {
      this.totalPrice += p.amount * p.price;
    });
    this.gardens = this.farmerSerice.getGardensForShoppingCart();
    this.selectedGarden = this.gardens == null || this.gardens.length == 0 ? null : this.gardens[0]
  }

  removeItem(product) {
    this.totalPrice -= product.amount * product.price;
    this.products = this.products.filter(p => p.id != product.id);
    this.shoppingCartService.removeItem(product);
  }

  placeOrder() {
    if (this.gardens == null || this.gardens.length == 0) {
      this.gardenCheck = 3;
      return;
    }
    if (this.selectedGarden == null) {
      this.gardenCheck = 2;
      return;
    }
    this.gardenCheck = 1;

    this.shoppingCartService.placeOrder(this.selectedGarden._id, this.selectedGarden.place);
    this.products = [];
  }

}
