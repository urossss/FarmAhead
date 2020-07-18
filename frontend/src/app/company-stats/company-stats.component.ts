import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-company-stats',
  templateUrl: './company-stats.component.html',
  styleUrls: ['./company-stats.component.css']
})
export class CompanyStatsComponent implements OnInit {

  orders: Order[];

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  barChartLabels: any;

  barChartType = 'bar';

  barChartLegend = true;

  barChartData = [
    {
      data: [],
      label: 'Broj narudžbina'
    }
  ];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orders = this.orderService.getCachedOrders();
    if (this.orders == null) {
      this.orderService.getOrdersFromServer().subscribe((res: Order[]) => {
        this.orders = res;
        this.initChart();
      });
    } else {
      this.initChart();
    }
  }

  initChart() {
    let curDate = new Date();
    let dayTime = 24 * 60 * 60 * 1000;

    curDate = new Date(curDate.getTime() - 29 * dayTime);

    this.barChartLabels = [];
    for (let i = 0; i < 30; i++) {
      this.barChartLabels.push(i + 1);

      let cnt = 0;
      this.orders.forEach(order => {
        let orderDate = new Date(order.orderDate);
        if (orderDate.getUTCFullYear() == curDate.getUTCFullYear() &&
          orderDate.getUTCMonth() == curDate.getUTCMonth() &&
          orderDate.getUTCDate() == curDate.getUTCDate()) {
          cnt++;
        }
      });
      this.barChartData[0].data.push(cnt);
      curDate = new Date(curDate.getTime() + dayTime);
    }
  }



}
