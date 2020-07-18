import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatVerticalStepper } from '@angular/material/stepper';
import { UserService } from '../user.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-company-add-product',
  templateUrl: './company-add-product.component.html',
  styleUrls: ['./company-add-product.component.css']
})
export class CompanyAddProductComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') stepper: MatVerticalStepper;

  isLinear = true;

  name: string = '';
  type: string = 'sadnica'
  amount: number = 1;
  time: number = 1;
  price: number = 1;

  nameCheck: number = 0;
  amountCheck: number = 0;
  timeCheck: number = 0;
  priceCheck: number = 0;

  successful: boolean = false;

  constructor(private userService: UserService, private productService: ProductService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  nameNext() {
    if (!this.isValidString(this.name)) {
      this.nameCheck = 2;
    } else {
      this.nameCheck = 1;
      this.stepper.next();
    }
  }

  amountNext() {
    if (!this.isValidNumber(this.amount)) {
      this.amountCheck = 2;
    } else {
      this.amountCheck = 1;
      this.stepper.next();
    }
  }

  timeNext() {
    if (!this.isValidNumber(this.time)) {
      this.timeCheck = 2;
    } else {
      this.timeCheck = 1;
      this.stepper.next();
    }
  }

  priceNext() {
    if (!this.isValidNumber(this.price)) {
      this.priceCheck = 2;
    } else {
      this.priceCheck = 1;
      this.stepper.next();
    }
  }

  isValidString(s): boolean {
    return s != null && s != '';
  }

  isValidNumber(n): boolean {
    if (n == null || n < 1) {
      return false;
    }
    return Number.isInteger(n);
  }

  addProduct() {
    let product = {
      name: this.name,
      type: this.type,
      companyName: this.userService.getFullName(),
      companyUsername: this.userService.getUsername(),
      amount: this.amount,
      time: this.time,
      ratingSum: 0,
      ratingCount: 0,
      price: this.price,
      buyers: [],
      comments: []
    };

    this.productService.addProduct(product).subscribe(res => {
      if (res['success'] == true) { // success
        this.resetAllFields();
        this.successful = true;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.stepper.reset();
      } else { // error
        this.successful = false;
      }
    });
  }

  resetAllFields() {
    this.name = '';
    this.type = 'sadnica'
    this.amount = 1;
    this.time = 1;
    this.price = 1;

    this.nameCheck = 0;
    this.amountCheck = 0;
    this.timeCheck = 0;
    this.priceCheck = 0;

    this.successful = false;
  }
}
