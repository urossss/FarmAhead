import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from '../models/order';
import { UserService } from '../user.service';

@Component({
  selector: 'app-company-orders',
  templateUrl: './company-orders.component.html',
  styleUrls: ['./company-orders.component.css']
})
export class CompanyOrdersComponent implements OnInit {

  orders: Order[];
  companyPlace: string;
  transporters: string[];

  indMap: Map<number, number>;
  dateSortDir: string = '';
  rotate: { [key: string]: string } = { 'asc': 'desc', 'desc': '', '': 'asc' };

  constructor(private orderService: OrderService, private userService: UserService) { }

  ngOnInit(): void {
    this.companyPlace = this.userService.getPlace();
    this.transporters = this.userService.getTransporters();
    this.indMap = new Map();

    this.orders = this.orderService.getCachedOrders();
    if (this.orders == null) {
      this.orderService.getOrdersFromServer().subscribe((res: Order[]) => {
        this.orders = res;
        this.fillInd();
      });
    } else {
      this.fillInd();
    }
  }


  // sorting

  fillInd() {
    this.orders.forEach((product, index) => {
      this.indMap.set(product.id, index);
    });
  }

  compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  sort(column: string, direction: string) {
    if (direction == '') {
      this.orders.sort((p1, p2) => {
        return this.compare(this.indMap.get(p1.id), this.indMap.get(p2.id));
      });
      return;
    } else {
      this.orders.sort((p1, p2) => {
        let res = this.compare(p1[column], p2[column]);
        return direction == 'asc' ? res : -res;
      });
    }
  }

  sortByDate() {
    this.dateSortDir = this.rotate[this.dateSortDir];
    this.sort('orderDate', this.dateSortDir);
  }


  // order management

  getStatus(order: Order) {
    if (order.deliveryDate == 'odbijeno') {
      return 'ODBIJENO';
    }
    if (order.deliveryDate == 'otkazano') {
      return 'OTKAZANO';
    }
    if (order.deliveryDate == null) {
      return 'NOVO';
    }
    let curTime = new Date().getTime();
    let deliveryStartTime = new Date(order.deliveryStartDate).getTime();
    let deliveryTime = new Date(order.deliveryDate).getTime();
    if (deliveryStartTime > curTime) {
      return 'NA ČEKANJU';
    }
    if (deliveryTime > curTime) {
      return 'NA DOSTAVI';
    }
    return 'ISPORUČENO';
  }

  acceptOrder(order: Order) {
    var origin = this.companyPlace;
    var destination = order.gardenPlace;

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }, (response, status) => {
        if (status != 'OK') {
          return;
        }
        let value = null;
        if (response.rows[0].elements[0].status == google.maps.DistanceMatrixElementStatus.OK) {
          value = response.rows[0].elements[0].duration.value;
          if (value == 0) { // same origin and destination place
            value = 2 * 60 * 60; // dafault 2 hours travel time for same origin and destination place
          }
        } else {
          value = 24 * 60 * 60; // default 1 day travel time for unknown location
        }
        value *= 1000; // convert to ms

        let minTime = new Date(this.transporters[0]).getTime();
        let minInd = 0;
        for (let i = 1; i < 5; i++) {
          let time = new Date(this.transporters[i]).getTime();
          if (time < minTime) {
            minTime = time;
            minInd = i;
          }
        }

        let curTime = new Date().getTime();
        let deliveryStartTime = Math.max(curTime, minTime);
        let deliveryEndTime = deliveryStartTime + value;
        let transporterFreeTime = deliveryEndTime + value;

        this.transporters[minInd] = new Date(transporterFreeTime).toISOString();
        order.deliveryStartDate = new Date(deliveryStartTime).toISOString();
        order.deliveryDate = new Date(deliveryEndTime).toISOString();

        this.userService.updateTransporterValues();
        this.orderService.updateOrder(order);
        this.orderService.updateStorageProducts(order);
      });
  }

  rejectOrder(order: Order) {
    order.deliveryDate = 'odbijeno';
    this.orderService.updateOrder(order);
    this.orderService.deleteStorageProducts(order);
  }

}
