import { Injectable } from '@angular/core';
import { Order } from './models/order';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  uri = 'http://localhost:4000';

  orders: Order[];

  constructor(private userService: UserService, private http: HttpClient) {
    this.init();
  }

  init() {
    this.orders = null;
    this.orders = JSON.parse(localStorage.getItem('orders'));
    // if (this.orders == null) { }
  }

  getCachedOrders() {
    return this.orders;
  }

  getOrdersFromServer() {
    let username = this.userService.getUsername();

    return this.http.get(`${this.uri}/company/orders`, {
      params: {
        username: username
      }
    }).pipe(
      map((orders: Order[]) => {
        if (orders) {
          this.orders = orders;

          localStorage.setItem('orders', JSON.stringify(this.orders));
        } else {
          this.orders = null;
        }
        return this.orders;
      })
    );
  }

  clearCachedOrders() {
    this.orders = null;
    localStorage.removeItem('orders');
  }

  updateOrder(order: Order) {
    localStorage.setItem('orders', JSON.stringify(this.orders));

    let data = {
      id: order.id,
      deliveryStartDate: order.deliveryStartDate,
      deliveryDate: order.deliveryDate
    };

    this.http.post(`${this.uri}/company/update-order-dates`, data).subscribe();
  }

  updateStorageProducts(order: Order) {
    let data = {
      orderId: order.id,
      gardenId: order.gardenId,
      deliveryDate: order.deliveryDate
    };

    this.http.post(`${this.uri}/company/update-farmer-products`, data).subscribe();
  }

  deleteStorageProducts(order: Order) {
    let data = {
      orderId: order.id,
      gardenId: order.gardenId
    };

    this.http.post(`${this.uri}/company/delete-farmer-products`, data).subscribe();
  }

}
