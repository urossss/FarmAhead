import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FarmerService } from './farmer.service';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from './shopping-cart.service';
import { OrderService } from './order.service';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  userType: string;
  myShowToast: boolean = false;
  toastSubscription: Subscription;

  constructor(
    private userService: UserService,
    private farmerService: FarmerService,
    private shoppingCartService: ShoppingCartService,
    private orderService: OrderService,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute) {
    this.toastSubscription = this.farmerService.showToast$.subscribe(showToast => {
      this.myShowToast = showToast;
    });
  }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => this.titleService.setTitle(event['title']));
	  
	  
	  /*
	  //za slucaj da importi za filter, map i mergeMap ne rade, promeniti kod u ovo
	  // a gore dodati import: import { filter, map, mergeMap } from 'rxjs/operators';
	  this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data))
      .subscribe((event) => this.titleService.setTitle(event['title']));
	  */
  }

  changeOfRoutes() {
    this.userType = this.userService.getUserType();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  logout() {
    if (this.userType == 'poljoprivrednik') {
      this.farmerService.logout();
      this.shoppingCartService.emptyCart(false);
    } else if (this.userType == 'preduzece') {
      this.orderService.clearCachedOrders();
    }
    this.userService.logout();
    this.router.navigate(['/']);
    this.changeOfRoutes();
  }
}
