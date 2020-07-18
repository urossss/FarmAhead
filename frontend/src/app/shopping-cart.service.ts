import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { FarmerService } from './farmer.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  uri = 'http://localhost:4000';

  products: any;

  constructor(private productService: ProductService, private farmerService: FarmerService, private userService: UserService, private http: HttpClient) {
    this.init();
  }

  init() {
    this.products = null;
    this.products = JSON.parse(localStorage.getItem('shopping-cart'));
    if (this.products == null) {
      this.products = [];
    }
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getNextOrderId() {
    return this.getRandomInt(Number.MAX_SAFE_INTEGER);
  }

  getProducts() {
    return this.products;
  }

  addItem(product, amount) {
    let orderId = -1;
    let done = false;
    this.products.forEach(p => {
      if (p.companyUsername == product.companyUsername) {
        orderId = p.orderId;
      }
      if (p.id == product.id) {
        p.amount += amount;
        done = true;
      }
    });
    if (orderId < 0) {
      orderId = this.getNextOrderId();
    }

    if (!done) {
      let p = {
        id: product.id,
        name: product.name,
        type: product.type,
        companyName: product.companyName,
        companyUsername: product.companyUsername,
        amount: amount,
        time: product.time,
        price: product.price,
        orderId: orderId,
        deliveryDate: null
      }
      this.products.push(p);
    }

    localStorage.setItem('shopping-cart', JSON.stringify(this.products));
  }

  removeItem(product) {
    this.products = this.products.filter(p => p.id != product.id);
    localStorage.setItem('shopping-cart', JSON.stringify(this.products));

    this.productService.returnAmount(product);
  }

  placeOrder(gardenId, gardenPlace) {
    console.log('place order');
    console.log(gardenId);
    console.log(gardenPlace);

    let curDate = new Date();
    let curDateStr = curDate.toISOString();

    let map = new Map<number, any>();

    this.products.forEach(p => {
      if (!map.get(p.orderId)) {
        map.set(p.orderId, {
          id: p.orderId,
          companyUsername: p.companyUsername,
          gardenId: gardenId,
          gardenPlace: gardenPlace,
          orderDate: curDateStr,
          deliveryStartDate: null,
          deliveryDate: null,
          products: []
        })
      }
      map.get(p.orderId).products.push({
        id: p.id,
        name: p.name,
        amount: p.amount,
        price: p.price
      });
    });

    let companyOrders = Array.from(map.values());
    let companyData = {
      orders: companyOrders
    };
    this.http.post(`${this.uri}/company/new-order`, companyData).subscribe();
    
    let farmerData = {
      _id: gardenId,
      products: this.products
    }
    this.farmerService.addProducts(gardenId, this.products);
    this.http.post(`${this.uri}/farmer/new-order`, farmerData).subscribe();

    let productIds = [];
    this.products.forEach(p => {
      productIds.push(p.id);
    });
    let productData = {
      farmer: this.userService.getUsername(),
      productIds: productIds
    }

    this.productService.addBuyer(productData);
    this.http.post(`${this.uri}/shop/product/new-buyer`, productData).subscribe();

    this.emptyCart(true);
  }

  emptyCart(orderComplete: boolean) {
    if (!orderComplete) {
      this.products.forEach(p => {
        this.productService.returnAmount(p);
      });
    }
    this.products = [];
    localStorage.setItem('shopping-cart', JSON.stringify(this.products));
  }
}
