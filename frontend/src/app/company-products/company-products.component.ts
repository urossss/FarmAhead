import { Component, OnInit } from '@angular/core';
import { ProductWithDetails } from '../models/product';
import { ProductService } from '../product.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-company-products',
  templateUrl: './company-products.component.html',
  styleUrls: ['./company-products.component.css']
})
export class CompanyProductsComponent implements OnInit {

  username: string;

  selectedProduct: ProductWithDetails = null;
  amount: number = 1;
  amountCheck: number = 0;

  products: ProductWithDetails[];
  indMap: Map<string, number>;

  nameSortDir: string = '';
  rotate: {[key: string]: string} = { 'asc': 'desc', 'desc': '', '': 'asc' };

  searchTerm: string = '';

  constructor(private userService: UserService, private productService: ProductService) {}

  ngOnInit(): void {
    this.username = this.userService.getUsername();

    this.indMap = new Map();

    let allProducts = this.productService.getCachedProducts();
    if (allProducts == null) {
      this.productService.getProductsFromServer().subscribe(res => {
        allProducts = res;
        this.products = allProducts.filter(p => p.companyUsername == this.username);
        this.fillInd();
      });
    } else {
      this.products = allProducts.filter(p => p.companyUsername == this.username);
      this.fillInd();
    }
  }


  // sorting

  fillInd() {
    this.products.forEach((product, index) => {
      this.indMap.set(product._id, index);
    });
  }

  compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  sort(column: string, direction: string) {
    if (direction == '') {
      this.products.sort((p1, p2) => {
        return this.compare(this.indMap.get(p1._id), this.indMap.get(p2._id));
      });
      return;
    } else {
      this.products.sort((p1, p2) => {
        let res = this.compare(p1[column], p2[column]);
        return direction == 'asc' ? res : -res;
      });
    }
  }

  sortByName() {
    this.nameSortDir = this.rotate[this.nameSortDir];
    this.sort('name', this.nameSortDir);
  }


  // products

  selectProduct(product, addAmount) {
    this.selectedProduct = product;
    if (addAmount) {
      this.amount = 1;
      this.amountCheck = 0;
    }
  }

  removeProduct() {
    this.products = this.products.filter(p => p.id != this.selectedProduct.id);
    this.productService.removeProduct(this.selectedProduct);
  }

  addAmount() {
    if (this.amount == null || this.amount < 1) {
      this.amountCheck = 2;
    } else {
      if (Number.isInteger(this.amount)) {
        this.amountCheck = 1;
      } else {
        this.amountCheck = 3;
      }
    }

    if (this.amountCheck == 1) {
      this.selectedProduct.amount += this.amount;
      this.productService.addAmount(this.selectedProduct);
    }
  }

}
